##REST Countries API with Color Theme Switcher
An interactive, responsive multi-page web application that pulls data from the REST Countries API, featuring full text search, regional filtering, dynamic route parameter passing, border-country navigation, and a persistent dark/light theme toggle.

Overview
Building this application went far beyond standard DOM manipulation. Achieving a production-ready interface that matched the challenge specifications pixel-for-pixel required overcoming significant architectural, network, and data-integrity hurdles.

Key Engineering Challenges & Solutions
HTTP Failures & API Downtime: Intermittent network errors and API downtime were resolved by engineering an automated fallback layer. A local mock fixture (data.json) was integrated into the fetch service, enabling continuous testing of filtering, search pipelines, and UI layouts regardless of upstream endpoint availability.

Defensive Data Modeling: The REST Countries API returns irregular schemas across different territories (e.g., missing top-level domains, inconsistent currency structures, alternate naming keys like cca2, cca3, and alpha3Code). A TypeScript Country class with recursive extractors was built to normalize the data and prevent runtime errors.

Vite Multi-Page Architecture: Migrating from a single-page view to a multi-page app required low-level Rollup bundling configurations in vite.config.ts alongside custom dev server proxy rules.

State Synchronization: Country codes are passed between pages using URL search parameters (?code=XYZ), while a unified localStorage key ensures the user's dark/light mode preference persists seamlessly across navigation.

Features
Multi-Page Navigation: True multi-page setup using Vite, passing country codes via URL parameters for bookmarkable, shareable links.

Search & Filter: Real-time search query matching combined with region filtering that handles full-reset cases gracefully.

Border Country Traversal: Dynamic resolution of 3-letter alpha codes into full country name badges with direct routing.

Theme Persistence: Dark and light mode toggle that stores state across browser sessions and across distinct HTML pages.

Responsive Layout: Pixel-matched grid and detail layouts designed for mobile, tablet, and 4-column desktop viewports.
