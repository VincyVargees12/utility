import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolHeaderComponent } from '../../shared/tool-header/tool-header.component';
import { SeoService } from '../../../../services/seo.service';

type AppState = 'upload' | 'configure' | 'processing' | 'complete';
type PaperSize = 'a4' | 'letter';

interface ParsedRun {
  text: string;
  bold: boolean;
  italic: boolean;
  fontSize: number; // half-points (divide by 2 for pt)
}

interface ParsedParagraph {
  style: string;
  runs: ParsedRun[];
  isList: boolean;
  listLevel: number;
}

@Component({
  selector: 'app-word-to-pdf',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolHeaderComponent],
  templateUrl: './word-to-pdf.component.html',
  styleUrl: './word-to-pdf.component.scss'
})
export class WordToPdfComponent implements OnInit {
  private seoService = inject(SeoService);

  state = signal<AppState>('upload');
  paperSize = signal<PaperSize>('a4');

  wordFile = signal<File | null>(null);
  wordFileName = signal<string>('');
  errorMessage = signal<string>('');

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'Word to PDF Converter - Free Online | DataUtil',
      description: 'Convert Word documents (.docx) to PDF instantly in your browser. No uploads, no registration required.',
      keywords: 'word to pdf, docx to pdf, convert word to pdf, free pdf converter',
      ogTitle: 'Word to PDF Converter - Free Online',
      ogDescription: 'Convert Word documents to PDF instantly in your browser. Fast, free, and private.',
      canonicalUrl: 'https://datautility.com/categories/pdf/word-to-pdf'
    });
  }

  onFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.loadWordFile(input.files[0]);
    }
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      this.loadWordFile(event.dataTransfer.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  loadWordFile(file: File): void {
    const ext = file.name.toLowerCase();
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'application/doc',
    ];
    if (!validTypes.includes(file.type) && !ext.endsWith('.docx') && !ext.endsWith('.doc')) {
      this.errorMessage.set('Please upload a valid Word document (.docx).');
      return;
    }
    this.wordFile.set(file);
    this.wordFileName.set(file.name);
    this.errorMessage.set('');
    this.state.set('configure');
  }

  async processConversion(): Promise<void> {
    this.state.set('processing');
    this.errorMessage.set('');

    try {
      const file = this.wordFile()!;
      const arrayBuffer = await file.arrayBuffer();

      // Unzip the DOCX archive
      const JSZip = (await import('jszip')).default;
      const zip = await JSZip.loadAsync(arrayBuffer);

      const documentXmlFile = zip.file('word/document.xml');
      if (!documentXmlFile) {
        throw new Error('Not a valid Word document (missing word/document.xml).');
      }
      const documentXml = await documentXmlFile.async('text');

      // Parse the Word XML
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(documentXml, 'application/xml');
      const paragraphs = this.extractParagraphs(xmlDoc);

      // Generate the PDF
      const pdfBytes = await this.generatePdf(paragraphs);

      // Trigger download
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const baseName = file.name.replace(/\.(docx?|odt)$/i, '');
      const a = document.createElement('a');
      a.href = url;
      a.download = `${baseName}.pdf`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);

      this.state.set('complete');
    } catch (error: any) {
      console.error('Word to PDF conversion error:', error);
      this.errorMessage.set('Failed to convert. Please ensure the file is a valid .docx Word document.');
      this.state.set('configure');
    }
  }

  downloadResult(): void {
    this.processConversion();
  }

  reset(): void {
    this.wordFile.set(null);
    this.wordFileName.set('');
    this.errorMessage.set('');
    this.paperSize.set('a4');
    this.state.set('upload');
  }

  // ─── DOCX parsing ──────────────────────────────────────────────────────────

  private extractParagraphs(xmlDoc: Document): ParsedParagraph[] {
    const WNS = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
    const paragraphs: ParsedParagraph[] = [];

    const pElements = xmlDoc.getElementsByTagNameNS(WNS, 'p');

    for (const p of Array.from(pElements)) {
      // Paragraph style
      const pPr = p.getElementsByTagNameNS(WNS, 'pPr')[0];
      const pStyleEl = pPr?.getElementsByTagNameNS(WNS, 'pStyle')[0];
      const style = pStyleEl?.getAttribute('w:val') ?? 'Normal';

      // List detection
      const numPr = pPr?.getElementsByTagNameNS(WNS, 'numPr')[0];
      const isList = !!numPr;
      const ilvlEl = numPr?.getElementsByTagNameNS(WNS, 'ilvl')[0];
      const listLevel = ilvlEl ? parseInt(ilvlEl.getAttribute('w:val') ?? '0', 10) : 0;

      // Paragraph-level default run properties
      const pRpr = pPr?.getElementsByTagNameNS(WNS, 'rPr')[0];
      const paraDefaultBold = !!pRpr?.getElementsByTagNameNS(WNS, 'b')[0];
      const paraDefaultItalic = !!pRpr?.getElementsByTagNameNS(WNS, 'i')[0];

      // Runs
      const runs: ParsedRun[] = [];
      const rElements = p.getElementsByTagNameNS(WNS, 'r');

      for (const r of Array.from(rElements)) {
        const rPr = r.getElementsByTagNameNS(WNS, 'rPr')[0];

        const bEl = rPr?.getElementsByTagNameNS(WNS, 'b')[0];
        const bVal = bEl?.getAttribute('w:val');
        const bold = bEl ? (bVal === null || bVal === '1' || bVal === 'true') : paraDefaultBold;

        const iEl = rPr?.getElementsByTagNameNS(WNS, 'i')[0];
        const iVal = iEl?.getAttribute('w:val');
        const italic = iEl ? (iVal === null || iVal === '1' || iVal === 'true') : paraDefaultItalic;

        const szEl = rPr?.getElementsByTagNameNS(WNS, 'sz')[0];
        const fontSize = szEl ? parseInt(szEl.getAttribute('w:val') ?? '0', 10) : 0;

        let text = '';
        for (const t of Array.from(r.getElementsByTagNameNS(WNS, 't'))) {
          text += t.textContent ?? '';
        }
        if (r.getElementsByTagNameNS(WNS, 'tab').length) text += '    ';

        if (text) {
          runs.push({ text, bold, italic, fontSize });
        }
      }

      paragraphs.push({ style, runs, isList, listLevel });
    }

    return paragraphs;
  }

  // ─── PDF generation ────────────────────────────────────────────────────────

  private async generatePdf(paragraphs: ParsedParagraph[]): Promise<Uint8Array> {
    const { PDFDocument, StandardFonts, PageSizes } = await import('pdf-lib');

    const pdfDoc = await PDFDocument.create();
    const fontR  = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontB  = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontI  = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
    const fontBI = await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique);

    const pageSize = this.paperSize() === 'a4' ? PageSizes.A4 : PageSizes.Letter;
    const [pageWidth, pageHeight] = pageSize;
    const margin = 72; // 1 inch

    let page = pdfDoc.addPage(pageSize);
    let y = pageHeight - margin;

    const getFont = (bold: boolean, italic: boolean) => {
      if (bold && italic) return fontBI;
      if (bold) return fontB;
      if (italic) return fontI;
      return fontR;
    };

    const styleConfig = (style: string): { fontSize: number; bold: boolean; spaceBefore: number; spaceAfter: number } => {
      const s = style.toLowerCase();
      if (s === 'title')                               return { fontSize: 26, bold: true,  spaceBefore: 0,  spaceAfter: 16 };
      if (s === 'subtitle')                            return { fontSize: 16, bold: false, spaceBefore: 4,  spaceAfter: 12 };
      if (s === 'heading1' || s === 'heading 1')       return { fontSize: 22, bold: true,  spaceBefore: 18, spaceAfter: 10 };
      if (s === 'heading2' || s === 'heading 2')       return { fontSize: 18, bold: true,  spaceBefore: 14, spaceAfter: 8  };
      if (s === 'heading3' || s === 'heading 3')       return { fontSize: 15, bold: true,  spaceBefore: 12, spaceAfter: 6  };
      if (s === 'heading4' || s === 'heading 4')       return { fontSize: 13, bold: true,  spaceBefore: 10, spaceAfter: 4  };
      if (s === 'heading5' || s === 'heading 5')       return { fontSize: 12, bold: true,  spaceBefore: 8,  spaceAfter: 4  };
      if (s === 'heading6' || s === 'heading 6')       return { fontSize: 12, bold: false, spaceBefore: 8,  spaceAfter: 4  };
      if (s.startsWith('intense') || s === 'quote')    return { fontSize: 11, bold: false, spaceBefore: 6,  spaceAfter: 6  };
      return                                                  { fontSize: 12, bold: false, spaceBefore: 0,  spaceAfter: 6  };
    };

    for (const para of paragraphs) {
      const cfg = styleConfig(para.style);
      const allText = para.runs.map(r => r.text).join('');

      // Empty paragraph → blank line
      if (!allText.trim()) {
        y -= cfg.fontSize * 0.8;
        if (y < margin) { page = pdfDoc.addPage(pageSize); y = pageHeight - margin; }
        continue;
      }

      y -= cfg.spaceBefore;

      // Build word tokens with per-word formatting
      interface Token { text: string; bold: boolean; italic: boolean; size: number }
      const tokens: Token[] = [];

      // Bullet marker
      if (para.isList) {
        tokens.push({ text: '•  ', bold: false, italic: false, size: cfg.fontSize });
      }

      for (const run of para.runs) {
        const runBold   = run.bold   || cfg.bold;
        const runItalic = run.italic;
        const runSize   = run.fontSize > 0 ? run.fontSize / 2 : cfg.fontSize;
        // Split run text on whitespace boundaries to allow wrapping
        const parts = run.text.split(/(\s+)/);
        for (const part of parts) {
          if (part) tokens.push({ text: part, bold: runBold, italic: runItalic, size: runSize });
        }
      }

      // Compute indent
      const bulletIndent = para.isList ? 16 + para.listLevel * 16 : 0;
      const startX = margin + bulletIndent;
      const maxLineWidth = (pageWidth - 2 * margin) - bulletIndent;

      // Word-wrap
      const lines: Token[][] = [];
      let curLine: Token[] = [];
      let curLineW = 0;

      for (const tok of tokens) {
        // Replace non-latin characters to avoid pdf-lib encoding issues
        const safeText = tok.text.replace(/[^\x00-\xFF]/g, '?');
        if (!safeText) continue;
        const font = getFont(tok.bold, tok.italic);
        const w = font.widthOfTextAtSize(safeText, tok.size);

        if (curLineW + w > maxLineWidth && curLine.length > 0) {
          lines.push(curLine);
          curLine = [];
          curLineW = 0;
          // skip leading whitespace token at line start
          if (!safeText.trim()) continue;
        }
        curLine.push({ ...tok, text: safeText });
        curLineW += w;
      }
      if (curLine.length > 0) lines.push(curLine);

      // Draw lines
      for (const line of lines) {
        const lineHeight = Math.max(...line.map(t => t.size), cfg.fontSize) * 1.45;
        if (y - lineHeight < margin) {
          page = pdfDoc.addPage(pageSize);
          y = pageHeight - margin;
        }
        let x = startX;
        for (const tok of line) {
          const font = getFont(tok.bold, tok.italic);
          page.drawText(tok.text, { x, y, size: tok.size, font });
          x += font.widthOfTextAtSize(tok.text, tok.size);
        }
        y -= lineHeight;
      }

      y -= cfg.spaceAfter;
    }

    return pdfDoc.save();
  }
}
