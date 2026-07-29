import type { ProfileId } from "@/lib/documentation-profiles";
import type { CaseStudyProfileOverride } from "@/lib/case-studies-profiles";

type ProfileOverrides = Record<ProfileId, CaseStudyProfileOverride>;

/**
 * English variants of the headless case-study content per profile.
 * Mirrors CASE_STUDY_PROFILE_OVERRIDES (FR).
 */
export const CASE_STUDY_PROFILE_OVERRIDES_EN: Record<string, ProfileOverrides> = {
  "comme-des-fous-jeux": {
    decideur: {
      description:
        "An online games section to drive engagement and time on site for the Comme des Fous media outlet.",
      detailedDescription:
        "Comme des Fous, a participatory media outlet, wanted to launch an online games section to retain readers and grow time on site. The strategic stake: turn occasional readers into recurring visitors through a playful experience.\n\nGoing with a Headless WordPress + Next.js architecture made it possible to guarantee near-instant load times for the games — a key retention factor. Readers reach the games friction-free, straight from the outlet's articles.\n\nThe outcome: stronger reader engagement, higher average session time, and an experience that sets Comme des Fous apart in the participatory-media landscape.",
      objectives: [
        "Grow average time on site for readers",
        "Build a recurring engagement channel to retain the audience",
        "Guarantee top-tier performance for a friction-free experience",
      ],
      results: [
        "Games section successfully integrated into the existing outlet",
        "Stronger engagement: meaningfully higher session time",
        "Smooth user experience that strengthens the brand",
      ],
    },
    utilisateur: {
      description:
        "Online games published and managed straight from WordPress — no developer required.",
      detailedDescription:
        "The Comme des Fous editorial team wanted to ship interactive games for readers without depending on a developer for every release. The goal: manage the games as easily as the outlet's articles.\n\nThanks to the Headless WordPress architecture, games are configured straight in the WordPress UI the team already knows. Publishing a new game follows the same workflow as publishing an article: create, preview, publish.\n\nThe editorial team is fully autonomous — they manage existing games and ship new ones without any technical skill.",
      objectives: [
        "Publish and manage games from WordPress, with no technical skill required",
        "Keep the usual editorial workflow (create, preview, publish)",
        "Make the team autonomous for game management",
      ],
      results: [
        "Game management integrated into the existing WordPress UI",
        "Self-service publishing by the editorial team",
        "No additional training required",
      ],
    },
    developpeur: {
      description:
        "Interactive Next.js games on top of a Headless WordPress architecture, served via the REST API.",
      detailedDescription:
        "This technical project consisted of building an interactive games section integrated into Comme des Fous's existing Headless WordPress site. The architecture is Next.js for client-side game rendering, with WordPress as the CMS for game content configuration.\n\nThe games are standalone React components, rendered client-side for interactivity, while their configuration (rules, content, media) is managed via WordPress Custom Post Types exposed by the REST API. SSG is used for the listing pages, with client-side hydration for the game logic.\n\nStack: Next.js App Router, WordPress REST API, Custom Post Types, Tailwind CSS, deployed on Vercel with ISR for the listing pages.",
      objectives: [
        "Build interactive React components for the online games",
        "Leverage the WordPress REST API for dynamic game content",
        "Implement SSG + client hydration for performance and interactivity",
      ],
      results: [
        "Modular architecture: reusable game components",
        "WordPress REST API for game-content management",
        "Load times under 1s thanks to SSG and Vercel optimization",
      ],
    },
  },

  "comme-des-fous": {
    decideur: {
      description:
        "Headless migration of a participatory media outlet: PageSpeed score from 56 to 98, with zero editorial disruption.",
      detailedDescription:
        "Comme des Fous, a growing participatory media outlet, needed to modernize its site to improve performance and visibility. With a PageSpeed score of 56, the site was losing readers to slow load times — a direct hit to SEO traffic.\n\nThe migration to a Headless WordPress + Next.js architecture nearly doubled performance (PageSpeed: 98) without any disruption to the editorial workflow. Editors didn't have to change their habits.\n\nThe outcome: a faster, better-ranked outlet with a clearly improved reader experience. The investment translated into measurable growth in organic traffic and time on site.",
      objectives: [
        "Improve performance to gain SEO visibility",
        "Guarantee zero disruption for the editorial team",
        "Preserve all existing content with no loss",
      ],
      results: [
        "PageSpeed score: from 56 to 98 (+74%)",
        "Admin interface unchanged for editors",
        "Full migration with no content loss and no service interruption",
        "Measurable SEO gains within the first weeks",
      ],
    },
    utilisateur: {
      description:
        "A faster site for readers, with the exact same WordPress UI for editors.",
      detailedDescription:
        "The Comme des Fous editorial team publishes articles daily, manages media and organizes categories. During the modernization, the central concern was changing nothing about their habits.\n\nThe migration to Headless WordPress was transparent for editors: they got back exactly the same WordPress UI as before — same editor, same menus, same publishing workflow. The only visible difference: the site is now far faster for readers.\n\nAll existing content (articles, images, categories) was preserved automatically. No re-entry, no extra training was needed.",
      objectives: [
        "Keep the WordPress UI identical for editors",
        "Lose no existing content (articles, images, media)",
        "Deliver a faster, more pleasant site for readers",
      ],
      results: [
        "Admin UI 100% identical to before",
        "All existing content migrated automatically",
        "Notably faster, more pleasant site for visitors",
        "No training required for the editorial team",
      ],
    },
    developpeur: {
      description:
        "Migration WordPress → Headless WordPress + Next.js. SSG/ISR, REST API, image optimization via next/image.",
      detailedDescription:
        "This migration project consisted of decoupling the existing WordPress front end and replacing it with a Next.js application, while keeping WordPress as the backend CMS.\n\nThe architecture uses the WordPress REST API for data fetching, with an SSG (Static Site Generation) strategy for articles and pages, combined with ISR (Incremental Static Regeneration) for content freshness. Images are automatically optimized via the next/image component with a custom loader pointing at WordPress.\n\nThe migration was carried out without modifying the WordPress database: all content, taxonomies and media were retrieved via the API. Deployment is on Vercel with preview deployments on every branch.",
      objectives: [
        "Decouple the WordPress front end onto Next.js App Router",
        "Implement SSG + ISR for performance and content freshness",
        "Migrate without data loss via the WordPress REST API",
      ],
      results: [
        "PageSpeed score from 56 to 98 thanks to SSG and next/image optimization",
        "ISR configured for automatic content revalidation",
        "Zero changes to the WordPress database — non-destructive migration",
        "Vercel CI/CD pipeline with preview deployments",
      ],
    },
  },

  "next-event": {
    decideur: {
      description:
        "Headless event-ticketing demo: professional showcase, sign-up management and optimized conversion.",
      detailedDescription:
        "Next Event is a demo site that shows how a Headless WordPress architecture can transform event ticketing. The goal: prove that an event site can be fast, professional and easy to administer — all at once.\n\nThanks to the front-end / back-end decoupling, the site delivers near-instant load times — a decisive factor for converting visitors into registrants. Navigation is smooth, events are showcased and the sign-up journey is optimized.\n\nThis project demonstrates the upside of Headless for event organizations: a professional site that converts better, while keeping WordPress's simplicity of management.",
      objectives: [
        "Showcase events professionally and convincingly",
        "Optimize the sign-up journey to maximize conversions",
        "Demonstrate Headless performance gains for events",
      ],
      results: [
        "Working event-management agenda system",
        "Integrated ticketing with optimized conversion journey",
        "Fast, responsive navigation — Lighthouse 90+",
      ],
    },
    utilisateur: {
      description:
        "An event site where organizers manage events and tickets straight from WordPress.",
      detailedDescription:
        "Next Event shows how an event organizer can manage all of their online communications from WordPress, with no technical skill required.\n\nThe admin UI lets you create an event, set the date and venue, add photos and configure tickets — all from the familiar WordPress dashboard. The public site updates automatically.\n\nThe event calendar, the detailed event pages and the ticketing all work together smoothly, giving organizers a simple tool and visitors an optimal browsing experience.",
      objectives: [
        "Allow event creation from WordPress with no code",
        "Provide intuitive ticket and registration management",
        "Ship a visual event calendar that's easy to update",
      ],
      results: [
        "Create and manage events in just a few clicks",
        "Integrated ticketing manageable from WordPress",
        "Visual calendar updated automatically",
      ],
    },
    developpeur: {
      description:
        "Event architecture: WordPress Custom Post Types + Next.js SSG, REST API for agenda and ticketing.",
      detailedDescription:
        "Next Event is a demo project showcasing Headless WordPress applied to events. The implementation uses WordPress Custom Post Types (events, tickets) exposed via the REST API and consumed by a Next.js front end.\n\nEvent pages are statically generated (SSG) with `generateStaticParams`, while ticket-availability data uses Next.js API routes for real-time queries to WordPress. The calendar component is rendered client-side with hydration.\n\nTechnical stack: Next.js App Router, WordPress REST API (custom endpoints), Custom Post Types + ACF Pro, Tailwind CSS, Vercel deployment. The site uses ISR with 60-second revalidation for event pages.",
      objectives: [
        "Create WordPress Custom Post Types for events and tickets",
        "Implement SSG + ISR for event pages",
        "Build a real-time availability API via Route Handlers",
      ],
      results: [
        "Working CPT → REST API → Next.js SSG architecture",
        "Route Handlers for real-time ticket availability",
        "ISR with configurable revalidation for content freshness",
      ],
    },
  },

  "les-etats-generaux-communaux": {
    decideur: {
      description:
        "Brochure site shipped on a tight deadline for a citizen event, with online local-group sign-ups.",
      detailedDescription:
        "Les Etats Généraux Communaux had a hard constraint: the site had to ship before the event date to maximize citizen mobilization. Every day late meant local groups not formed.\n\nGoing with Headless WordPress + Next.js made for fast development (4 weeks) while guaranteeing top-tier performance on every device. The site highlights downloadable resources, the event calendar and an interactive map of local groups.\n\nOutcome: shipped on time, measurable growth in the number of local groups formed, and a site that serves as a professional showcase for the citizen initiative.",
      objectives: [
        "Ship the site before the event date (hard deadline)",
        "Maximize online local-group sign-ups",
        "Provide a professional showcase for the citizen initiative",
      ],
      results: [
        "Shipped on time — before the event",
        "Growth in the number of local groups formed",
        "Interactive map driving local engagement",
      ],
    },
    utilisateur: {
      description:
        "A simple brochure site to keep up to date: resources, events and a group map managed from WordPress.",
      detailedDescription:
        "The Les Etats Généraux Communaux site lets the organizing team manage content easily from WordPress: add downloadable resources, update the event calendar and track local groups.\n\nThe WordPress admin UI is set up so each content type has its own dedicated area. Resources publish in a few clicks, events are created with date and venue, and the group map updates automatically.\n\nThe team needs no technical skill to keep the site up to date and to communicate effectively about the initiative.",
      objectives: [
        "Manage downloadable resources from WordPress",
        "Update the event calendar effortlessly",
        "Track and display local groups on the interactive map",
      ],
      results: [
        "Self-service admin by the organizing team",
        "Resources and events published in a few clicks",
        "Interactive map updated with no technical intervention",
      ],
    },
    developpeur: {
      description:
        "Next.js SSG + Headless WordPress: Leaflet interactive map, event calendar, Vercel deployment.",
      detailedDescription:
        "This project combines Next.js SSG with Headless WordPress to build a high-performance citizen site. The architecture leverages WordPress Custom Post Types for resources, events and local groups, exposed via the REST API.\n\nThe interactive local-groups map is implemented with a Leaflet component rendered client-side (dynamic import via `next/dynamic` with `ssr: false`). Geographic data is stored in WordPress through ACF Pro and fetched at build time via the REST API.\n\nThe site is fully statically generated (SSG) for top performance, with ISR for content freshness. Deployment is on Vercel with preview deployments on every change.",
      objectives: [
        "Implement an interactive Leaflet map with WordPress data",
        "Use SSG + ISR for a static site that stays up to date",
        "Structure WordPress CPTs for resources, events and groups",
      ],
      results: [
        "Leaflet map with dynamic import — no SSR for the map component",
        "Full SSG + ISR with configurable revalidation",
        "Clean, extensible WordPress CPT architecture",
      ],
    },
  },

  doleances: {
    decideur: {
      description:
        "Wikipedia-inspired brochure site for a citizen non-profit, with an interactive map and an events agenda.",
      detailedDescription:
        "Les Doléances, a newly formed non-profit, needed a digital showcase to give visibility to its citizen initiative. The positioning was clear: convey a community-driven spirit and freedom of access to information, à la Wikipedia.\n\nGoing with Headless WordPress + Next.js made it possible to build a professional, fast site in just 2 months, with an interactive map of local groups and an agenda section. The clean, recognizable design strengthens the non-profit's identity.\n\nThe site serves as a central platform for the non-profit's communications: raising public awareness, recruiting new members and coordinating local action.",
      objectives: [
        "Give the citizen initiative a professional showcase",
        "Make it easier to set up and track local groups",
        "Build an effective communications platform for the non-profit",
      ],
      results: [
        "Site shipped in 2 months with an interactive map",
        "Agenda section for the non-profit's events",
        "Streamlined administration via Headless WordPress",
      ],
    },
    utilisateur: {
      description:
        "A Wikipedia-inspired site where the team publishes articles and news from WordPress, no technical skill required.",
      detailedDescription:
        "The Les Doléances site was designed so the non-profit team can publish content autonomously. The WordPress UI lets them create and organize articles by category, add images and manage events — exactly the way Wikipedia lets contributors publish content.\n\nThe workflow is simple: write in the WordPress editor, preview the result, then publish. Articles are automatically classified by category and shown on the site. The local-group map updates as new entries are created.\n\nThe team is fully autonomous to keep the site alive and up to date, with no technical intervention.",
      objectives: [
        "Publish and categorize articles from WordPress",
        "Manage the non-profit's events and agenda",
        "Update the local-groups map effortlessly",
      ],
      results: [
        "Self-service article publishing by the non-profit team",
        "Clear, intuitive category-based organization",
        "Familiar Wikipedia-inspired UI",
      ],
    },
    developpeur: {
      description:
        "Wikipedia-like architecture: Headless WordPress + Next.js, Leaflet map, advanced WordPress taxonomies.",
      detailedDescription:
        "This project takes its cue from Wikipedia's architecture to build an open, structured citizen site. The WordPress backend uses custom taxonomies (thematic categories, geographic zones) and Custom Post Types for articles, local groups and events.\n\nThe Next.js front end implements category-based navigation with SSG for every article and category page. The local-groups map uses Leaflet with a dynamic component (next/dynamic, ssr: false). Geo data is stored via ACF Pro.\n\nThe architecture is built for extensibility: adding new categories or content types in WordPress automatically reflects on the front end thanks to dynamic data fetching via the REST API.",
      objectives: [
        "Model content with advanced WordPress CPTs and taxonomies",
        "Implement category-based navigation in SSG",
        "Integrate a Leaflet map with WordPress/ACF data",
      ],
      results: [
        "Extensible, clean CPT + taxonomy architecture",
        "SSG for every article and category page",
        "Leaflet map component with Next.js dynamic import",
      ],
    },
  },

  // ──────────────────────────────────────────────────────────────────────────
  // Panorama Pub — Promotional-products suppliers directory
  // ──────────────────────────────────────────────────────────────────────────
  "panorama-pub": {
    decideur: {
      description:
        "Launching the first online directory of promotional-products suppliers: a first-mover position on an open B2B market.",
      detailedDescription:
        "The promotional-products market is one of the last B2B sectors without a reference platform: there's no centralised directory in France today. Panorama Pub is built to claim that gap and become the go-to source for promotional-products sourcing.\n\nThe stake isn't just to ship a website but to lay the foundation of a product built to grow: a first-mover edge on an open market, a clear B2B target (communication agencies, marketing departments, events teams), and a scalable revenue model (supplier visibility, lead routing, editorial content).\n\nShipped in 2 months from concept to launch, the platform is now ready to claim its market: a reference position, a solid technical foundation, and a clear roadmap to turn audience into business leverage.",
      objectives: [
        "Claim an open market and become the sector's reference",
        "Build a scalable digital asset able to monetise a qualified B2B audience",
        "Secure a fast time-to-market to stay ahead of any followers",
        "Lay a technical foundation that won't need a rewrite in 2 years",
      ],
      results: [
        "A platform unique in its segment, with no equivalent in France",
        "Live in 2 months, from concept to production",
        "Architecture built for SEO and growth, ready to scale",
        "Clear roadmap for the next building blocks: supplier accounts, lead routing, content",
      ],
    },
    utilisateur: {
      description:
        "A directory built to save buyers time and put suppliers in front of qualified demand: search, compare, clear profiles.",
      detailedDescription:
        "Today, finding the right promotional-products supplier is a slog: scattered Google searches, incomplete databases, suppliers that are hard to compare. Panorama Pub was designed as the tool that makes sourcing simple — for agencies, marcomms, marketing departments and events teams.\n\nThe experience is deliberately direct: search by product type, by supplier, by criteria; rich and readable supplier profiles; quick navigation between entries. Buyers find, compare, choose — without losing half a day.\n\nOn the supplier side, the platform offers qualified visibility in front of buyers who are already looking to purchase, with flattering profiles and a back-office to keep their information up to date autonomously.",
      objectives: [
        "Let buyers quickly find the right supplier without multiple searches",
        "Offer clear comparison between suppliers on relevant criteria",
        "Give suppliers a flattering, easy-to-maintain showcase",
        "Guarantee fast, friction-free navigation with no learning curve",
      ],
      results: [
        "Supplier sourcing centralised in one place",
        "Search, filtering and comparison available in a few clicks",
        "Rich, readable supplier profiles, updated self-service",
        "No training needed for buyers or suppliers",
      ],
    },
    developpeur: {
      description:
        "Full-stack B2B directory with Next.js + PostgreSQL: App Router architecture, high-performance search, relational schema ready to scale.",
      detailedDescription:
        "Panorama Pub is a full-stack application built with Next.js (App Router) and PostgreSQL. The project was designed from day one to absorb catalogue growth (potentially thousands of supplier entries) and to deliver strong organic search — two constraints that drove every technical decision.\n\nRendering relies on SSG/ISR for public pages (supplier profiles, listings, categories) to guarantee near-instant load times and an optimal SEO crawl. The PostgreSQL database models suppliers, categories, product types and filtering criteria with a normalised schema. Next.js Server Actions handle admin operations (catalogue back-office), with strict separation between public reads and authenticated writes.\n\nStack: Next.js App Router, TypeScript, PostgreSQL, Tailwind CSS, deployed on Vercel. The architecture is built to grow into authenticated supplier accounts, a lead-routing system and an editorial module without rewriting the foundation.",
      objectives: [
        "Design a full-stack Next.js + PostgreSQL architecture ready to scale",
        "Optimise SEO and performance with SSG/ISR on every public page",
        "Cleanly model business entities (suppliers, categories, criteria) in a relational schema",
        "Prepare the foundation for future extensions (supplier auth, lead routing, content)",
      ],
      results: [
        "Clean, maintainable App Router + PostgreSQL architecture",
        "SSG/ISR on public pages for near-instant load times",
        "Normalised relational schema, extensible without tech debt",
        "Secure Server-Actions back-office for catalogue enrichment",
      ],
    },
  },
};
