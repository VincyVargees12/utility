import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolHeaderComponent } from '../../shared/tool-header/tool-header.component';
import { SeoService } from '../../../../services/seo.service';

type AppState = 'upload' | 'configure' | 'processing' | 'complete';
type OcrMode = 'none' | 'ocr';

@Component({
  selector: 'app-pdf-to-word',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolHeaderComponent],
  templateUrl: './pdf-to-word.component.html',
  styleUrl: './pdf-to-word.component.scss'
})
export class PdfToWordComponent implements OnInit {
  private seoService = inject(SeoService);

  state = signal<AppState>('upload');
  ocrMode = signal<OcrMode>('none');
  
  pdfFile = signal<File | null>(null);
  pdfFileName = signal<string>('');
  pdfThumbnail = signal<string | null>(null);
  errorMessage = signal<string>('');

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'PDF to WORD Converter - Free Online | DataUtil',
      description: 'Convert your PDF to WORD documents with incredible accuracy. Powered by Solid Documents.',
      keywords: 'pdf to word, convert pdf to text, pdf to docx',
      ogTitle: 'PDF to WORD Converter - Free Online',
      ogDescription: 'Convert your PDF to WORD documents with incredible accuracy.',
      canonicalUrl: 'https://datautility.com/categories/pdf/pdf-to-word'
    });
  }

  onFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.loadPdfFile(input.files[0]);
    }
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      this.loadPdfFile(event.dataTransfer.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  async loadPdfFile(file: File): Promise<void> {
    if (file.type !== 'application/pdf') {
      this.errorMessage.set('Please upload a valid PDF file.');
      return;
    }
    this.pdfFile.set(file);
    this.pdfFileName.set(file.name);
    this.errorMessage.set('');
    this.state.set('configure');

    try {
      const arrayBuffer = await file.arrayBuffer();
      await this.generateThumbnail(arrayBuffer);
    } catch (e) {
      console.error('Failed to generate thumbnail', e);
    }
  }

  async generateThumbnail(arrayBuffer: ArrayBuffer): Promise<void> {
    try {
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        return;
      }

      const pdfjs = await import('pdfjs-dist');
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url
      ).toString();

      const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
      const pdf = await loadingTask.promise;
      
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 0.5 });
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d', { alpha: false });

      if (!context) return;

      canvas.width = Math.max(1, Math.floor(viewport.width));
      canvas.height = Math.max(1, Math.floor(viewport.height));

      await page.render({ canvasContext: context, viewport, canvas }).promise;

      const thumbnail = canvas.toDataURL('image/jpeg', 0.82);
      this.pdfThumbnail.set(thumbnail);
      
      loadingTask.destroy();
    } catch (error) {
      console.error('Error generating thumbnail:', error);
    }
  }

  async processConversion(): Promise<void> {
    this.state.set('processing');
    this.errorMessage.set('');

    try {
      const file = this.pdfFile()!;
      const arrayBuffer = await file.arrayBuffer();

      const pdfjs = await import('pdfjs-dist');
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url
      ).toString();

      const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;

      const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ImageRun, PageBreak } = await import('docx');

      // Bullet character set — broad: includes common bullets, checkboxes, dashes, squares, arrows
      const isBulletChar = (str: string): boolean => {
        const s = str.trim();
        if (!s) return false;
        // Matches single bullet/marker characters
        if (/^[\u2022\u2023\u2043\u25a1\u25aa\u25cf\u25e6\u25ab\u25a0\u25ba\u2611\u2610\u2192\u2022•·◦○●■□▪▸►‣⁃\-\*]$/.test(s)) return true;
        // Also catch if text STARTS with a bullet char (inline bullet + content in one item)
        if (s.length > 1 && /^[\u2022\u2023\u2043\u25a1\u25aa\u25cf\u25e6\u25ab\u25a0\u2611\u2610•·◦○●■□▪▸►‣⁃]/.test(s)) return true;
        return false;
      };

      // Check if a group of multi-item lines is actually a bullet/checkbox list
      // (first column consistently contains only short marker text)
      const isBulletListGroup = (lines: Array<{ items: Array<{ str: string; x: number }> }>): boolean => {
        if (!lines.length) return false;
        const isMarker = (s: string): boolean => {
          const t = s.trim();
          if (!t) return true; // empty first col counts (continuation lines)
          if (isBulletChar(t)) return true;
          if (/^(\d+[\.\):]?|[a-zA-Z][\.\):]|\([a-z\d]+\))$/.test(t)) return true;
          return t.length <= 2; // very short strings are likely markers
        };
        const firstColTexts = lines.map(l => l.items[0]?.str ?? '');
        const markerCount = firstColTexts.filter(s => isMarker(s)).length;
        // Also check: if ALL second items start at a consistent x far from first item
        const colGap = lines.map(l => (l.items[1]?.x ?? 0) - (l.items[0]?.x ?? 0));
        const avgGap = colGap.reduce((a, b) => a + b, 0) / colGap.length;
        // Bullet lists usually have a small first-col + large gap. Tables have moderate consistent gap.
        const firstColWidths = lines.map(l => (l.items[0]?.str ?? '').trim().length);
        const avgFirstColWidth = firstColWidths.reduce((a, b) => a + b, 0) / firstColWidths.length;
        // If first column is very narrow (short text) AND markers match → bullet list
        return markerCount >= lines.length * 0.5 && avgFirstColWidth <= 4;
      };

      const docChildren: any[] = [];

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const SCALE = 1.5;
        const viewport = page.getViewport({ scale: SCALE });

        // Render full page canvas for image extraction
        const canvas = document.createElement('canvas');
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        const ctx = canvas.getContext('2d', { alpha: false })!;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;

        // Extract image positions via operator list CTM tracking
        const opList = await page.getOperatorList();
        let ctm = [1, 0, 0, 1, 0, 0];
        const gStack: number[][] = [];
        const imageRects: Array<{ x: number; y: number; w: number; h: number; yPdf: number }> = [];

        for (let j = 0; j < opList.fnArray.length; j++) {
          const fn = opList.fnArray[j];
          const args = opList.argsArray[j];
          if (fn === 3) { gStack.push([...ctm]); }
          else if (fn === 4) { const p = gStack.pop(); if (p) ctm = p; }
          else if (fn === 14) {
            const [a2, b2, c2, d2, e2, f2] = args;
            const [a1, b1, c1, d1, e1, f1] = ctm;
            ctm = [a1*a2+c1*b2, b1*a2+d1*b2, a1*c2+c1*d2, b1*c2+d1*d2, a1*e2+c1*f2+e1, b1*e2+d1*f2+f1];
          } else if (fn === 85 || fn === 87 || fn === 89) {
            const iW = Math.abs(ctm[0]), iH = Math.abs(ctm[3]);
            const vX = Math.max(0, Math.floor(ctm[4] * SCALE));
            const vY = Math.max(0, Math.floor(viewport.height - (ctm[5] + iH) * SCALE));
            const vW = Math.min(Math.floor(iW * SCALE), canvas.width - vX);
            const vH = Math.min(Math.floor(iH * SCALE), canvas.height - vY);
            if (vW > 20 && vH > 20) imageRects.push({ x: vX, y: vY, w: vW, h: vH, yPdf: ctm[5] + iH });
          }
        }

        // Parse text content into lines
        interface ParsedItem { str: string; x: number; fontSize: number; bold: boolean; italic: boolean }
        interface TextLine { items: ParsedItem[]; yPdf: number; maxFont: number }

        const lineMap = new Map<number, TextLine>();
        const textContent = await page.getTextContent();
        for (const item of textContent.items as any[]) {
          if (!('str' in item) || !item.str.trim()) continue;
          const yPdf = item.transform[5] as number;
          const xPdf = item.transform[4] as number;
          const fontSize = Math.abs(item.transform[3]) || item.height || 10;
          const bold = !!item.fontName?.match(/bold|heavy|black/i);
          const italic = !!item.fontName?.match(/italic|oblique/i);

          let matched: TextLine | undefined;
          for (const [, line] of lineMap) {
            if (Math.abs(line.yPdf - yPdf) < 3) { matched = line; break; }
          }
          if (!matched) { matched = { items: [], yPdf, maxFont: 0 }; lineMap.set(yPdf, matched); }
          matched.items.push({ str: item.str, x: xPdf, fontSize, bold, italic });
          matched.maxFont = Math.max(matched.maxFont, fontSize);
        }

        const sortedLines = Array.from(lineMap.values()).sort((a, b) => b.yPdf - a.yPdf);
        for (const l of sortedLines) l.items.sort((a, b) => a.x - b.x);

        const allFonts = sortedLines.map(l => l.maxFont).filter(f => f > 0);
        const avgFont = allFonts.length ? allFonts.reduce((a, b) => a + b, 0) / allFonts.length : 10;

        // Classify each line
        const getKind = (line: TextLine): 'bullet' | 'table-row' | 'text' => {
          const first = line.items[0]?.str ?? '';
          // Detect bullet lines: first item is a bullet char (alone or inline prefix)
          if (isBulletChar(first)) return 'bullet';
          if (line.items.length >= 2) return 'table-row';
          return 'text';
        };

        // Validate a REAL table: columns must align across lines AND it's not a bullet list
        const isRealTable = (lines: TextLine[]): boolean => {
          if (lines.length < 2) return false;
          // First: reject bullet list groups
          if (isBulletListGroup(lines)) return false;
          const TOL = 25;
          const refCols = lines[0].items.map(it => it.x);
          // Need at least 3 columns OR first column must have substantive content
          const firstColAvgLen = lines.map(l => l.items[0]?.str?.trim().length ?? 0).reduce((a, b) => a + b, 0) / lines.length;
          if (firstColAvgLen <= 3 && lines[0].items.length <= 2) return false; // bullet pattern
          let aligned = 0;
          for (let li = 1; li < lines.length; li++) {
            const xs = lines[li].items.map(it => it.x);
            if (refCols.some(rc => xs.some(lx => Math.abs(lx - rc) <= TOL))) aligned++;
          }
          return aligned >= Math.max(1, lines.length * 0.4);
        };

        type DocEl =
          | { type: 'text'; line: TextLine }
          | { type: 'bullet'; line: TextLine }
          | { type: 'table'; lines: TextLine[] }
          | { type: 'image'; rect: (typeof imageRects)[0] };

        const pageElements: DocEl[] = [];
        let i = 0;
        while (i < sortedLines.length) {
          const kind = getKind(sortedLines[i]);
          if (kind === 'table-row') {
            let end = i + 1;
            while (end < sortedLines.length && getKind(sortedLines[end]) === 'table-row') end++;
            const chunk = sortedLines.slice(i, end);
            // Check bullet list FIRST before considering it a table
            if (isBulletListGroup(chunk)) {
              for (const l of chunk) pageElements.push({ type: 'bullet', line: l });
            } else if (chunk.length >= 2 && isRealTable(chunk)) {
              pageElements.push({ type: 'table', lines: chunk });
            } else {
              for (const l of chunk) pageElements.push({ type: 'text', line: l });
            }
            i = end;
          } else {
            pageElements.push({ type: kind, line: sortedLines[i] } as DocEl);
            i++;
          }
        }

        for (const rect of imageRects) pageElements.push({ type: 'image', rect });

        // Sort all elements top-to-bottom by y position
        pageElements.sort((a, b) => {
          const yOf = (el: DocEl) => {
            if (el.type === 'text' || el.type === 'bullet') return el.line.yPdf;
            if (el.type === 'table') return el.lines[0].yPdf;
            return el.rect.yPdf;
          };
          return yOf(b) - yOf(a);
        });

        // Build docx elements
        for (const el of pageElements) {
          if (el.type === 'text') {
            const isHeading = el.line.maxFont > avgFont * 1.3;
            docChildren.push(new Paragraph({
              children: el.line.items.map(it => new TextRun({
                text: it.str + ' ',
                bold: it.bold || isHeading,
                italics: it.italic,
                size: Math.max(16, Math.round(el.line.maxFont * 2)),
              })),
              spacing: { after: isHeading ? 180 : 80 },
            }));
          }

          else if (el.type === 'bullet') {
            // First item may be a standalone bullet char, or bullet+content inline
            const firstStr = el.line.items[0]?.str ?? '';
            let contentItems = el.line.items;
            const firstTrimmed = firstStr.trim();
            
            if (isBulletChar(firstTrimmed) && firstTrimmed.length === firstStr.trim().length) {
              // Standalone bullet char — skip it, rest is content
              contentItems = el.line.items.slice(1);
            } else if (firstTrimmed.length > 1 && /^[\u2022\u2023\u2043\u25a1\u25aa\u25cf\u25e6\u25ab\u25a0\u2611\u2610•·◦○●■□▪▸►‣⁃]/.test(firstTrimmed)) {
              // Inline bullet+content in same item — strip the leading bullet char
              const stripped = firstTrimmed.slice(1).trim();
              contentItems = stripped
                ? [{ ...el.line.items[0], str: stripped }, ...el.line.items.slice(1)]
                : el.line.items.slice(1);
            }

            if (!contentItems.length) continue;
            docChildren.push(new Paragraph({
              bullet: { level: 0 },
              children: contentItems.map(it => new TextRun({
                text: it.str + ' ',
                bold: it.bold,
                italics: it.italic,
                size: Math.max(16, Math.round(el.line.maxFont * 2)),
              })),
              spacing: { after: 60 },
            }));
          }

          else if (el.type === 'table') {
            const TOL = 25;
            const allXs = el.lines.flatMap(l => l.items.map(it => it.x)).sort((a, b) => a - b);
            const buckets: number[] = [];
            for (const x of allXs) {
              if (!buckets.length || x - buckets[buckets.length - 1] > TOL) buckets.push(x);
            }
            const numCols = Math.max(2, buckets.length);

            docChildren.push(new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: el.lines.map(tl => new TableRow({
                children: (() => {
                  const cells: string[] = new Array(numCols).fill('');
                  for (const it of tl.items) {
                    let best = 0, bestDist = Infinity;
                    for (let ci = 0; ci < buckets.length; ci++) {
                      const d = Math.abs(it.x - buckets[ci]);
                      if (d < bestDist) { bestDist = d; best = ci; }
                    }
                    cells[best] = (cells[best] + ' ' + it.str).trim();
                  }
                  return cells.map(cellText => new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: cellText, size: 20 })] })],
                  }));
                })(),
              })),
            }));
            docChildren.push(new Paragraph({ text: '', spacing: { after: 80 } }));
          }

          else if (el.type === 'image') {
            const { rect } = el;
            const safeW = Math.min(rect.w, canvas.width - rect.x);
            const safeH = Math.min(rect.h, canvas.height - rect.y);
            if (safeW < 10 || safeH < 10) continue;
            const ic = document.createElement('canvas');
            ic.width = safeW; ic.height = safeH;
            ic.getContext('2d')!.drawImage(canvas, rect.x, rect.y, safeW, safeH, 0, 0, safeW, safeH);
            const bin = atob(ic.toDataURL('image/png').split(',')[1]);
            const bytes = new Uint8Array(bin.length);
            for (let b = 0; b < bin.length; b++) bytes[b] = bin.charCodeAt(b);
            const maxW = 550;
            let dW = Math.round(safeW / SCALE), dH = Math.round(safeH / SCALE);
            if (dW > maxW) { dH = Math.round(dH * maxW / dW); dW = maxW; }
            docChildren.push(new Paragraph({
              children: [new ImageRun({ data: bytes, transformation: { width: dW, height: dH }, type: 'png' } as any)],
              spacing: { after: 100 },
            }));
          }
        }

        if (pageNum < numPages) docChildren.push(new Paragraph({ children: [new PageBreak()] }));
      }

      loadingTask.destroy();

      const doc = new Document({ sections: [{ children: docChildren }] });
      const blob = await Packer.toBlob(doc);
      const filename = this.pdfFileName().replace(/\.pdf$/i, '.docx');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { document.body.removeChild(a); window.URL.revokeObjectURL(url); }, 100);

      this.state.set('complete');
    } catch (error: any) {
      console.error('Conversion error:', error);
      this.errorMessage.set('Failed to convert PDF to Word. Please try again.');
      this.state.set('configure');
    }
  }

  downloadResult(): void {
    this.processConversion();
  }

  reset(): void {
    this.pdfFile.set(null);
    this.pdfFileName.set('');
    this.pdfThumbnail.set(null);
    this.errorMessage.set('');
    this.ocrMode.set('none');
    this.state.set('upload');
  }
}
