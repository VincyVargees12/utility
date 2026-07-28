import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RelatedToolsComponent } from '../../../../shared/components/related-tools/related-tools.component';
import { ToolResourceContentComponent } from '../../../../shared/components/tool-resource-content/tool-resource-content.component';
import { SeoService } from '../../../../services/seo.service';
import { JWT_DECODER_RESOURCE_CONTENT } from './jwt-decoder.resource-content';

interface DecodedJWT {
  header: any;
  payload: any;
  signature: string;
  headerRaw: string;
  payloadRaw: string;
}

@Component({
  selector: 'app-jwt-decoder',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, RelatedToolsComponent, ToolResourceContentComponent],
  templateUrl: './jwt-decoder.component.html',
  styleUrl: './jwt-decoder.component.scss'
})
export class JwtDecoderComponent implements OnInit {
  private seoService = inject(SeoService);

  jwtToken = signal<string>('');
  decodedJwt = signal<DecodedJWT | null>(null);
  errorMessage = signal<string>('');
  isValid = signal<boolean>(false);
  copied = signal<string>(''); // 'header', 'payload', 'signature', or ''

  resourceContent = JWT_DECODER_RESOURCE_CONTENT;

  ngOnInit(): void {
    this.seoService.setPageMeta({
      title: 'JWT Decoder - Decode JSON Web Tokens | DataUtil',
      description: 'Decode and inspect JSON Web Tokens (JWT) instantly. View header, payload, and signature. Free online JWT decoder and debugger.',
      keywords: 'jwt decoder, json web token decoder, jwt debugger, decode jwt, jwt inspector, jwt parser',
      ogTitle: 'JWT Decoder - Decode JSON Web Tokens',
      ogDescription: 'Decode JSON Web Tokens and inspect header, payload, and signature instantly.',
      canonicalUrl: 'https://www.data-util.com/categories/developer/jwt'
    });

    this.seoService.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'JWT Decoder',
      'applicationCategory': 'DeveloperApplication',
      'description': 'Decode and inspect JSON Web Tokens (JWT) to view header, payload, and signature.',
      'url': 'https://www.data-util.com/categories/developer/jwt',
      'operatingSystem': 'Any',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      }
    });
  }

  // ── JWT Decoding ──────────────────────────────────────────────

  decodeJwt(): void {
    const token = this.jwtToken().trim();
    
    if (!token) {
      this.decodedJwt.set(null);
      this.errorMessage.set('');
      this.isValid.set(false);
      return;
    }

    try {
      // JWT format: header.payload.signature
      const parts = token.split('.');
      
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format. Expected 3 parts separated by dots.');
      }

      const [headerB64, payloadB64, signature] = parts;

      // Decode header
      const headerJson = this.base64UrlDecode(headerB64);
      const header = JSON.parse(headerJson);

      // Decode payload
      const payloadJson = this.base64UrlDecode(payloadB64);
      const payload = JSON.parse(payloadJson);

      this.decodedJwt.set({
        header,
        payload,
        signature,
        headerRaw: headerJson,
        payloadRaw: payloadJson
      });

      this.isValid.set(true);
      this.errorMessage.set('');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to decode JWT';
      this.errorMessage.set(errorMsg);
      this.decodedJwt.set(null);
      this.isValid.set(false);
    }
  }

  private base64UrlDecode(str: string): string {
    // Convert base64url to base64
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    
    // Add padding if needed
    while (base64.length % 4 !== 0) {
      base64 += '=';
    }

    // Decode base64
    try {
      const decoded = atob(base64);
      // Try to decode as UTF-8
      const bytes = new Uint8Array(decoded.split('').map(c => c.charCodeAt(0)));
      return new TextDecoder('utf-8').decode(bytes);
    } catch {
      // Fallback to simple atob
      return atob(base64);
    }
  }

  // ── Actions ──────────────────────────────────────────────

  clear(): void {
    this.jwtToken.set('');
    this.decodedJwt.set(null);
    this.errorMessage.set('');
    this.isValid.set(false);
    this.copied.set('');
  }

  copyPart(part: 'header' | 'payload' | 'signature'): void {
    const decoded = this.decodedJwt();
    if (!decoded) return;

    let content = '';
    switch (part) {
      case 'header':
        content = JSON.stringify(decoded.header, null, 2);
        break;
      case 'payload':
        content = JSON.stringify(decoded.payload, null, 2);
        break;
      case 'signature':
        content = decoded.signature;
        break;
    }

    if (content) {
      navigator.clipboard.writeText(content).then(() => {
        this.copied.set(part);
        setTimeout(() => this.copied.set(''), 1500);
      });
    }
  }

  copyToken(): void {
    const token = this.jwtToken();
    if (!token) return;

    navigator.clipboard.writeText(token).then(() => {
      this.copied.set('token');
      setTimeout(() => this.copied.set(''), 1500);
    });
  }

  loadSample(): void {
    // Sample JWT token (header: HS256, payload: user data, exp in future)
    const sampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjIsImVtYWlsIjoiam9obi5kb2VAZXhhbXBsZS5jb20iLCJyb2xlIjoiYWRtaW4ifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    
    this.jwtToken.set(sampleToken);
    this.decodeJwt();
  }

  formatTimestamp(timestamp: number): string {
    try {
      const date = new Date(timestamp * 1000);
      return date.toLocaleString();
    } catch {
      return 'Invalid date';
    }
  }

  isExpired(exp?: number): boolean {
    if (!exp) return false;
    return exp * 1000 < Date.now();
  }

  downloadDecoded(): void {
    const decoded = this.decodedJwt();
    if (!decoded) return;

    const content = JSON.stringify({
      header: decoded.header,
      payload: decoded.payload,
      signature: decoded.signature
    }, null, 2);

    const blob = new Blob([content], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'jwt-decoded.json';
    anchor.click();
    window.URL.revokeObjectURL(url);
  }
}
