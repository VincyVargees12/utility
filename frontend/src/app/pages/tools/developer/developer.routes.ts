import { Routes } from '@angular/router';

export const DEVELOPER_TOOL_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../../category-dashboard/category-dashboard.component').then(m => m.CategoryDashboardComponent),
    title: 'Developer Tools - DataUtil'
  },
  {
    path: 'json-formatter',
    loadComponent: () => import('./json-formatter/json-formatter.component').then(m => m.JsonFormatterComponent),
    title: 'JSON Formatter - DataUtil'
  },
  {
    path: 'json-validator',
    redirectTo: 'json-formatter',
    pathMatch: 'full'
  },
  {
    path: 'xml-formatter',
    loadComponent: () => import('./xml-formatter/xml-formatter.component').then(m => m.XmlFormatterComponent),
    title: 'XML Formatter - DataUtil'
  },
  {
    path: 'html-formatter',
    loadComponent: () => import('./html-formatter/html-formatter.component').then(m => m.HtmlFormatterComponent),
    title: 'HTML Formatter - DataUtil'
  },
  {
    path: 'sql-formatter',
    loadComponent: () => import('./sql-formatter/sql-formatter.component').then(m => m.SqlFormatterComponent),
    title: 'SQL Formatter - DataUtil'
  },
  {
    path: 'sql-validator',
    redirectTo: 'sql-formatter',
    pathMatch: 'full'
  },
  {
    path: 'base64',
    loadComponent: () => import('./base64/base64.component').then(m => m.Base64Component),
    title: 'Base64 Encode/Decode - DataUtil'
  },
  {
    path: 'aes-encrypt',
    loadComponent: () => import('./aes-encrypt/aes-encrypt.component').then(m => m.AesEncryptComponent),
    title: 'AES Encrypt/Decrypt - DataUtil'
  },
  {
    path: 'des-encrypt',
    loadComponent: () => import('./des-encrypt/des-encrypt.component').then(m => m.DesEncryptComponent),
    title: 'DES Encrypt/Decrypt - DataUtil'
  },
  {
    path: 'url-encode',
    loadComponent: () => import('./url-encode/url-encode.component').then(m => m.UrlEncodeComponent),
    title: 'URL Encode/Decode - DataUtil'
  },
  {
    path: 'hash',
    loadComponent: () => import('./hash-generator/hash-generator.component').then(m => m.HashGeneratorComponent),
    title: 'Hash Generator - DataUtil'
  },
  {
    path: 'uuid',
    loadComponent: () => import('./uuid-generator/uuid-generator.component').then(m => m.UuidGeneratorComponent),
    title: 'UUID/GUID Generator - DataUtil'
  },
  {
    path: 'jwt',
    loadComponent: () => import('./jwt-decoder/jwt-decoder.component').then(m => m.JwtDecoderComponent),
    title: 'JWT Decoder - DataUtil'
  },
  {
    path: 'ascii-converter',
    loadComponent: () => import('./ascii-converter/ascii-converter.component').then(m => m.AsciiConverterComponent),
    title: 'ASCII Converter - DataUtil'
  }
];