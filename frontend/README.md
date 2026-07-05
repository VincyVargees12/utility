# DataUtil Frontend

Angular frontend for DataUtil - a SaaS utility platform providing fast, privacy-first online tools.

## Tech Stack

- **Angular**: 22.0.0 (latest)
- **Node.js**: 26.4.0
- **TypeScript**: 6.0.2
- **SSR**: Enabled with @angular/ssr
- **Styling**: SCSS + Tailwind CSS (to be configured)
- **Testing**: Vitest

## Development Server

Start the development server:

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The app will automatically reload on file changes.

For SSR development with Express server:

```bash
ng serve
```

## Build

Build for production:

```bash
ng build
```

Build artifacts will be stored in `dist/` directory.

## Testing

Run unit tests:

```bash
ng test
```

## Code Scaffolding

Generate components:

```bash
ng generate component component-name
```

View all available schematics:

```bash
ng generate --help
```

## Project Structure

```
src/
├── app/              # Application components
├── public/           # Static assets
├── index.html        # Main HTML file
├── main.ts           # Application entry point
├── main.server.ts    # SSR entry point
├── server.ts         # Express server for SSR
└── styles.scss       # Global styles
```

## Next Steps

- [ ] Configure Tailwind CSS
- [ ] Configure Angular Material
- [ ] Set up routing structure
- [ ] Create layout components
- [ ] Implement landing page
- [ ] Add category pages
- [ ] Build tool components

## Additional Resources

- [Angular CLI Documentation](https://angular.dev/tools/cli)
- [Angular SSR Guide](https://angular.dev/guide/ssr)
- [Project SRS](../docs/SRS.md)
