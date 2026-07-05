# DataUtil MVP Backlog (Phase 1)

## Goal
Deliver landing page, category pages, search, and first 30 core tools with responsive UX.

## Epic A: Platform Foundation
- [ ] Repository structure (`frontend`, `backend`, `docs`, `infra`)
- [ ] Environment configuration strategy
- [ ] Shared design tokens (colors, typography, spacing)
- [ ] Dark/light theme support

## Epic B: Information Architecture
- [ ] Category schema and seed data
- [ ] Tool metadata schema and seed data
- [ ] Slug routing strategy
- [ ] Related tool recommendation rule (same category + tags)

## Epic C: Public Web Experience
- [ ] Landing page sections (hero, featured, trending, recently added)
- [ ] Category listing page
- [ ] Tool detail page template
- [ ] Global navigation + footer
- [ ] Mobile-first responsive behavior

## Epic D: Search
- [ ] Search index design
- [ ] Instant search endpoint
- [ ] Auto-suggestion endpoint
- [ ] Category filter support
- [ ] Popular search tracking

## Epic E: Core Tools (Initial 30)
- [ ] PDF: merge, split, compress, rotate, JPG→PDF, PDF→JPG
- [ ] Image: resize, crop, compress, rotate, PNG↔JPG
- [ ] Text: word counter, character counter, remove spaces, case converter
- [ ] Developer: JSON formatter/validator, Base64, URL encode, UUID, hash
- [ ] Calculator: BMI, GST, percentage, age, EMI
- [ ] Converter: length, weight, temperature, currency

## Epic F: Feedback & Quality
- [ ] Feedback form on tool pages
- [ ] Report issue flow
- [ ] Error handling and empty states
- [ ] Basic analytics events

## Epic G: SEO + Performance
- [ ] Dynamic meta title/description
- [ ] Open Graph + Twitter cards
- [ ] JSON-LD templates
- [ ] XML sitemap + robots.txt
- [ ] Lighthouse performance pass (>90 target)

## Definition of Done (Phase 1)
- [ ] Core user journeys work on mobile and desktop
- [ ] Public pages indexable and SEO metadata present
- [ ] 30 tools available and functional
- [ ] Avg page load under 2 seconds for key pages
- [ ] Monitoring and error logs available in production
