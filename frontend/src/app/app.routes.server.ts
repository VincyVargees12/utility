import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // These are concrete paths, but they also match the `:category` param pattern below.
  // Server routes are matched in array order, so they must be listed first to win.
  { path: 'categories/pdf', renderMode: RenderMode.Prerender },
  { path: 'categories/images', renderMode: RenderMode.Prerender },
  { path: 'categories/text', renderMode: RenderMode.Prerender },
  { path: 'categories/developer', renderMode: RenderMode.Prerender },
  // Any other single segment under categories/ is an unknown category that redirects home client-side.
  { path: 'categories/:category', renderMode: RenderMode.Client },
  { path: '**', renderMode: RenderMode.Prerender },
];
