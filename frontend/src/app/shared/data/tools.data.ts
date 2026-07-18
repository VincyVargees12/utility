export interface ToolItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  category: string;
}

export interface ToolCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  tools: ToolItem[];
}

export const TOOLS_REGISTRY: Record<string, ToolCategory> = {
  pdf: {
    id: 'pdf',
    name: 'PDF Tools',
    description: 'Every tool you need to work with PDFs in one place. All are 100% FREE and easy to use! Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.',
    icon: '📄',
    color: '#EF4444',
    tools: [
      { id: 'merge-pdf', name: 'Merge PDF', description: 'Combine PDFs in the order you want with the easiest PDF merger available.', icon: '🔗', route: '/categories/pdf/merge-pdf', category: 'organize' },
      { id: 'split-pdf', name: 'Split PDF', description: 'Separate one page or a whole set for easy conversion into independent PDF files.', icon: '✂️', route: '/categories/pdf/split-pdf', category: 'organize' },
      { id: 'compress-pdf', name: 'Compress PDF', description: 'Reduce file size while optimizing for maximal PDF quality.', icon: '📦', route: '/categories/pdf/compress-pdf', category: 'optimize' },
      { id: 'rotate-pdf', name: 'Rotate PDF', description: 'Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!', icon: '🔄', route: '/categories/pdf/rotate-pdf', category: 'organize' },
      { id: 'jpg-to-pdf', name: 'JPG to PDF', description: 'Convert JPG images to PDF in seconds. Easily adjust orientation and margins.', icon: '🖼️', route: '/categories/pdf/jpg-to-pdf', category: 'convert' },
      { id: 'pdf-to-jpg', name: 'PDF to JPG', description: 'Convert each PDF page into a JPG or extract all images contained in a PDF.', icon: '🌄', route: '/categories/pdf/pdf-to-jpg', category: 'convert' },
      { id: 'unlock-pdf', name: 'Unlock PDF', description: 'Remove PDF password security, giving you the freedom to use your PDFs as you want.', icon: '🔓', route: '/categories/pdf/unlock-pdf', category: 'security' },
      { id: 'protect-pdf', name: 'Protect PDF', description: 'Protect PDF files with a password. Encrypt PDF documents to prevent unauthorized access.', icon: '🔒', route: '/categories/pdf/protect-pdf', category: 'security' }
    ]
  },
  images: {
    id: 'images',
    name: 'Image Tools',
    description: 'Professional image editing tools for resizing, compressing, converting, and optimizing images. Fast, secure, and easy to use.',
    icon: '🖼️',
    color: '#8B5CF6',
    tools: [
      { id: 'resize-image', name: 'Resize Image', description: 'Resize images to exact dimensions or percentage. Maintain aspect ratio or custom size.', icon: '📐', route: '/categories/images/resize-image', category: 'edit' },
      { id: 'compress-image', name: 'Compress Image', description: 'Reduce image file size while maintaining quality. Perfect for web optimization.', icon: '🗜️', route: '/categories/images/compress-image', category: 'optimize' },
      { id: 'crop-image', name: 'Crop Image', description: 'Crop images to remove unwanted areas. Free crop or fixed aspect ratios.', icon: '✂️', route: '/categories/images/crop-image', category: 'edit' },
      { id: 'rotate-image', name: 'Rotate Image', description: 'Rotate images by any angle. Quick 90° rotation or custom angles.', icon: '🔄', route: '/categories/images/rotate-image', category: 'edit' },
      { id: 'flip-image', name: 'Flip Image', description: 'Flip images horizontally or vertically. Mirror effect tool.', icon: '🔃', route: '/categories/images/flip-image', category: 'edit' },
      { id: 'convert-image', name: 'Convert Image', description: 'Convert between JPG, PNG, WebP, GIF, and other formats.', icon: '🔄', route: '/categories/images/convert-image', category: 'convert' },
      { id: 'png-to-jpg', name: 'PNG to JPG', description: 'Convert PNG images to JPG format with optional quality settings.', icon: '🖼️', route: '/categories/images/png-to-jpg', category: 'convert' },
      { id: 'jpg-to-png', name: 'JPG to PNG', description: 'Convert JPG images to PNG format for transparency support.', icon: '🌄', route: '/categories/images/jpg-to-png', category: 'convert' },
      { id: 'to-webp', name: 'Convert to WebP', description: 'Convert any image format to WebP for better compression and web performance.', icon: '⚡', route: '/categories/images/to-webp', category: 'convert' },
      { id: 'remove-bg', name: 'Remove Background', description: 'Automatically remove image backgrounds with AI precision.', icon: '🎭', route: '/categories/images/remove-bg', category: 'edit' },
      { id: 'watermark', name: 'Add Watermark', description: 'Add text or image watermarks to protect your images.', icon: '©️', route: '/categories/images/watermark', category: 'edit' },
      { id: 'image-filter', name: 'Image Filters', description: 'Apply filters and effects to enhance your images.', icon: '🎨', route: '/categories/images/filters', category: 'edit' }
    ]
  },
  text: {
    id: 'text',
    name: 'Text Tools',
    description: 'Powerful text manipulation tools for counting, formatting, converting, and analyzing text content.',
    icon: '📝',
    color: '#10B981',
    tools: [
      { id: 'word-counter', name: 'Word Counter', description: 'Count words, characters, sentences, and paragraphs in your text.', icon: '🔢', route: '/categories/text/word-counter', category: 'analyze' },
      { id: 'character-counter', name: 'Character Counter', description: 'Count characters with or without spaces. Real-time counting.', icon: '📊', route: '/categories/text/character-counter', category: 'analyze' },
      { id: 'case-converter', name: 'Case Converter', description: 'Convert text to uppercase, lowercase, title case, or sentence case.', icon: '🔤', route: '/categories/text/case-converter', category: 'format' },
      { id: 'remove-spaces', name: 'Remove Extra Spaces', description: 'Remove extra spaces, tabs, and line breaks from text.', icon: '🧹', route: '/categories/text/remove-extra-spaces', category: 'format' },
      { id: 'reverse-text', name: 'Reverse Text', description: 'Reverse text, words, or entire paragraphs instantly.', icon: '🔄', route: '/categories/text/reverse-text', category: 'transform' },
      { id: 'sort-lines', name: 'Sort Lines', description: 'Sort text lines alphabetically or numerically.', icon: '🔢', route: '/categories/text/sort-lines', category: 'format' },
      { id: 'duplicate-remover', name: 'Remove Duplicates', description: 'Remove duplicate lines from your text.', icon: '🗑️', route: '/categories/text/duplicate-remover', category: 'format' },
      { id: 'find-replace', name: 'Find and Replace', description: 'Search and replace text with support for regex.', icon: '🔍', route: '/categories/text/find-replace', category: 'transform' },
      { id: 'text-difference', name: 'Text Difference', description: 'Compare two text files or snippets and find differences.', icon: '⚖️', route: '/categories/text/text-difference', category: 'analyze' }
    ]
  },
  developer: {
    id: 'developer',
    name: 'Developer Tools',
    description: 'Essential utilities for developers including formatters, validators, generators, and converters.',
    icon: '👨‍💻',
    color: '#3B82F6',
    tools: [
      { id: 'json-formatter', name: 'JSON Formatter', description: 'Format and beautify JSON data. Validate and parse JSON strings.', icon: '{ }', route: '/categories/developer/json-formatter', category: 'format' },
      { id: 'json-validator', name: 'JSON Validator', description: 'Validate JSON and find syntax errors instantly.', icon: '✓', route: '/categories/developer/json-validator', category: 'validate' },
      { id: 'xml-formatter', name: 'XML Formatter', description: 'Format, beautify, and indent XML documents.', icon: '<>', route: '/categories/developer/xml-formatter', category: 'format' },
      { id: 'sql-formatter', name: 'SQL Formatter', description: 'Format SQL queries with proper indentation and syntax highlighting.', icon: '🗄️', route: '/categories/developer/sql-formatter', category: 'format' },
      { id: 'html-formatter', name: 'HTML Formatter', description: 'Format and beautify HTML code with proper indentation.', icon: '🌐', route: '/categories/developer/html-formatter', category: 'format' },
      { id: 'base64-encode', name: 'Base64 Encode/Decode', description: 'Encode string to Base64 or decode Base64 to text.', icon: '🔒', route: '/categories/developer/base64', category: 'encode' },
      { id: 'url-encode', name: 'URL Encode/Decode', description: 'Encode URL parameters or decode URL-encoded strings.', icon: '🔗', route: '/categories/developer/url-encode', category: 'encode' },
      { id: 'hash-generator', name: 'Hash Generator', description: 'Generate MD5, SHA-1, SHA-256, and other cryptographic hashes.', icon: '🔐', route: '/categories/developer/hash', category: 'security' },
      { id: 'uuid-generator', name: 'UUID/GUID Generator', description: 'Generate version 1, 3, 4, and 5 UUIDs instantly.', icon: '🆔', route: '/categories/developer/uuid', category: 'generate' },
      { id: 'jwt-decoder', name: 'JWT Decoder', description: 'Decode JSON Web Tokens and inspect their payload.', icon: '🎫', route: '/categories/developer/jwt', category: 'decode' }
    ]
  }
};
