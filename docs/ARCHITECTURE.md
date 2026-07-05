# DataUtil Architecture (v1)

## 1. High-Level Components

1. Frontend (Angular SPA)
   - Routing, category pages, tool pages, search, theme handling
2. Backend (ASP.NET Core Web API)
   - Tool metadata APIs, search APIs, feedback APIs, admin APIs
3. Database (PostgreSQL)
   - Categories, tools, FAQs, blogs, feedback, audit logs
4. Storage (Azure Blob)
   - Temporary uploads for processing tools
5. Processing Layer
   - Stateless workers/services for file-based transformations
6. Analytics
   - Google Analytics + Microsoft Clarity events

## 2. Suggested Service Boundaries

- `CatalogService`: categories, tools, related tools, featured/popular
- `SearchService`: autosuggest, ranked search, filters
- `ToolExecutionService`: tool-specific transformations and validations
- `FeedbackService`: save feedback and issue reports
- `ContentService`: blogs and FAQ retrieval
- `AdminService`: CRUD for categories, tools, blogs, FAQs

## 3. Security Controls

- Enforce HTTPS at edge and app
- Input validation for all request payloads
- Output encoding and sanitization for rendered HTML/content
- CSRF protection for authenticated admin actions
- JWT-based auth for admin and future user module
- Rate limiting on public APIs and upload endpoints
- Antivirus/file signature checks for uploads (where applicable)

## 4. File Processing Policy

- Max upload size per tool (tool-specific)
- MIME type allow-list per tool
- Temporary blob container with TTL
- Automatic deletion after processing window
- No long-term file retention for privacy-first posture

## 5. Performance Strategy

- CDN caching for static frontend assets
- API response caching for category/tool metadata
- Lazy loading for non-critical modules and tool bundles
- Image optimization (modern formats + responsive sizes)
- Database indexing:
  - `tools.slug` unique index
  - `tools.category_id` index
  - full-text / trigram index on `tools.name`, `tools.keywords`

## 6. Deployment Environments

- Dev
- Staging
- Production

Each environment should have:
- Separate PostgreSQL instance/schema
- Separate blob containers
- Separate app service deployment slots

## 7. CI/CD Baseline

- Frontend workflow:
  - install dependencies
  - lint + test
  - build production artifact
  - deploy to Cloudflare Pages
- Backend workflow:
  - restore + build
  - test
  - publish
  - deploy to Azure App Service

## 8. Observability

- Structured logs with correlation IDs
- Error tracking and alerting
- API latency and throughput dashboards
- Top tool usage analytics
- Search success vs no-result rate
