import type { ProfileId } from "@/lib/documentation-profiles";
import type {
  HeroVariant,
  ServicesPageVariant,
  CaseStudiesPageVariant,
  AboutPageVariant,
  ExpandableCardVariant,
} from "@/lib/homepage-profiles";

// ─── Hero variants ───────────────────────────────────────────────────────────

export const HERO_VARIANTS_EN: Record<ProfileId | "default", HeroVariant> = {
  default: {
    headline: "Your website, designed and delivered turnkey —",
    subHeadline: "you run your business, I handle the tech.",
    description:
      "For SMEs and social-economy organisations that want a fast, durable website without building a technical team in-house.",
    valueProposition:
      "Timeline and budget fixed from the start. And as a French TIH provider, 30% of the cost is deductible from your AGEFIPH contribution.",
    ctaPrimary: { label: "Let's talk about your project", href: "https://calendar.app.google/RwZqaabSR5aDMnk46" },
    ctaSecondary: { label: "See our work", href: "/etudes-de-cas" },
    auditTitle: "Not sure what you need yet?",
    auditSubtitle: "2-minute diagnostic",
    auditDescription:
      "Take 2 minutes and get a clear recommendation — no commitment, no technical jargon.",
  },
  decideur: {
    headline: "Your digital project,",
    subHeadline: "a growth engine",
    description:
      "From a brochure site to a custom business platform: an investment that pays back. Measurable ROI, transverse OETH deduction, controlled time-to-market.",
    valueProposition:
      "Performance, SEO, conversion and management autonomy: measurable results, whatever path you pick.",
    ctaPrimary: { label: "Free project diagnostic", href: "#audit" },
    ctaSecondary: { label: "Contact me", href: "/contact" },
    auditTitle: "Which path fits your project?",
    auditSubtitle: "Project diagnostic",
    auditDescription:
      "Identify in 2 minutes the right path for your project — classic WordPress site, Headless site, web app or mobile app — and estimate the gains you can expect.",
  },
  utilisateur: {
    headline: "Your site or your app,",
    subHeadline: "simple to use every day",
    description:
      "Whether you run a WordPress site, a custom web app or a mobile application, you stay in control of your content, your data and your users — without ongoing technical dependency.",
    valueProposition:
      "An admin interface built for your business logic: zero daily friction.",
    ctaPrimary: { label: "Free project diagnostic", href: "#audit" },
    ctaSecondary: { label: "Contact me", href: "/contact" },
    auditTitle: "Which path fits your project?",
    auditSubtitle: "Project diagnostic",
    auditDescription:
      "In 2 minutes, find the path tailored to your project — WordPress site, Headless, web app or mobile app — without ever losing control of your admin.",
  },
  developpeur: {
    headline: "Architecture",
    subHeadline: "Next.js sites & apps",
    description:
      "WordPress API + Next.js for websites, dedicated PostgreSQL database for custom web apps, installable PWA for mobile. SSG, SSR, ISR, TypeScript, Tailwind, Vercel deployment.",
    valueProposition:
      "WordPress sites (classic or Headless + Next.js) and custom applications: the right tool for each project, without technical over-engineering.",
    ctaPrimary: { label: "Free diagnostic", href: "#audit" },
    ctaSecondary: { label: "Contact me", href: "/contact" },
    auditTitle: "Which path fits your project?",
    auditSubtitle: "Technical diagnostic",
    auditDescription:
      "Technical diagnostic in 2 minutes: classic WordPress site, Headless Next.js (SSG/ISR/SSR), custom web app (Next.js + PostgreSQL) or mobile PWA — based on your traffic, integrations and business logic.",
  },
};

// ─── Services page variants ──────────────────────────────────────────────────

export const SERVICES_PAGE_VARIANTS_EN: Record<ProfileId | "default", ServicesPageVariant> = {
  default: {
    titre: "Custom websites and applications",
    sousTitre:
      "Three Website tiers (Classic, Headless, Web app) and a Web & Mobile App offer on quote. The right tool for the right project, with guaranteed management autonomy.",
    carouselLabel: "Why Next Impact?",
    budgetTitle: "What investment level fits your project?",
    budgetCards: {
      left: {
        title: "Showcase or institutional site",
        description:
          "An optimized monolithic WordPress is more than enough: modern design, clean code, solid performance and tight security, on a controlled budget.",
        price: "2,250",
      },
      right: {
        title: "High-stakes platform",
        description:
          "For high-traffic platforms, multisite setups or complex integrations: WordPress headless + Next.js architecture, ISR/SSR and full CI/CD.",
        highlight:
          "A scalable architecture, built to grow with your business.",
      },
    },
    ctaTitle: "Pick your stack",
    ctaDescription:
      "Answer a few questions to identify the right path for your project — classic WordPress site, Headless site, web app or mobile app.",
    ctaLabel: "Run the diagnostic",
    ctaHref: "/services/eligibilite",
    faqs: [
      {
        question: "Will I still be able to edit my own copy?",
        answer:
          "Yes, on all 3 stacks. You keep the WordPress interface you already know to manage all your content, images and pages. No technical skills required.",
      },
      {
        question: "Is headless more expensive to maintain?",
        answer:
          "Slightly, because there are two systems to maintain (WordPress + frontend). But the stronger security and higher performance often offset that with fewer emergency fixes and less lost traffic.",
      },
      {
        question: "How long does the build take?",
        answer:
          "Plan for 2-4 weeks for an optimized classic WordPress site, 4-6 weeks for a standard Headless + Next.js architecture, and 6-10 weeks for a complex Headless platform or a custom application, depending on project complexity.",
      },
      {
        question: "Will my WordPress plugins still work?",
        answer:
          "Front-end plugins (sliders, public-facing forms) are replaced with faster equivalents. Back-end plugins (SEO, analytics, security) keep working as usual.",
      },
    ],
  },
  decideur: {
    titre: "Modernize your WordPress, measure your results",
    sousTitre:
      "Three technical tiers serving your growth: measurable ROI, stronger security, optimized conversion. You keep the admin your team already knows.",
    carouselLabel: "Why invest in modernization?",
    budgetTitle: "What return on investment?",
    budgetCards: {
      left: {
        title: "Growing SMBs",
        description:
          "A WordPress site (optimized classic or Headless + Next.js) is enough to boost your SEO, lower bounce rate and increase conversions. Investment pays back within a few months.",
        price: "4,000",
      },
      right: {
        title: "High-revenue companies",
        description:
          "Full Next.js architecture: maximum security, mission-critical performance, ISR for traffic spikes. Your site becomes a lasting competitive edge.",
        highlight:
          "A scalable platform, ready to absorb your growth and integrations.",
      },
    },
    ctaTitle: "Pick your stack",
    ctaDescription:
      "In 2 minutes, identify the right level of modernization for your project and estimate the performance gains you can expect.",
    ctaLabel: "Pick my stack",
    ctaHref: "/services/eligibilite",
    faqs: [
      {
        question: "What's the concrete return on investment?",
        answer:
          "Modernizing WordPress (even just optimizing the monolith) improves Core Web Vitals, which directly impacts SEO (+30% organic traffic on average for headless migrations) and conversion rate. ROI is measurable within months.",
      },
      {
        question: "How is headless more secure?",
        answer:
          "The front end is decoupled from WordPress: your back office is no longer publicly accessible. Attacks (brute force, injections) become impossible. It's a strong argument for GDPR compliance.",
      },
      {
        question: "How long until I see results?",
        answer:
          "The site ships in 2 to 10 weeks depending on the stack. Performance gains are immediate at launch. SEO impact is measurable within 2-3 months.",
      },
      {
        question: "Why three technical tiers?",
        answer:
          "Not every project needs Next.js. A showcase site converts just as well with optimized monolithic WordPress as it would with a full headless stack. I steer you toward the tier that actually pays back your investment.",
      },
    ],
  },
  utilisateur: {
    titre: "Your WordPress, only better",
    sousTitre:
      "You keep the WordPress interface you already know, with a modern, fast, easy-to-manage site. Three levels of modernization, depending on your project.",
    carouselLabel: "Why is it simpler?",
    budgetTitle: "What changes for you?",
    budgetCards: {
      left: {
        title: "Day to day",
        description:
          "You keep creating pages, uploading images and publishing posts exactly as before — but your site is up to 10× faster for visitors.",
        price: "2,250",
      },
      right: {
        title: "What's included",
        description:
          "Personalized training on your new site, user documentation, and hands-on support to get autonomous quickly.",
        highlight:
          "Nothing new to learn: it's still WordPress.",
      },
    },
    ctaTitle: "Pick your stack",
    ctaDescription:
      "Answer a few simple questions to find the formula that best matches your project.",
    ctaLabel: "Pick my stack",
    ctaHref: "/services/eligibilite",
    faqs: [
      {
        question: "Will I have to learn a new tool?",
        answer:
          "No. You keep using WordPress exactly as before to create pages, posts and manage media. The only difference: your site is much faster and more modern on the visitor side.",
      },
      {
        question: "How do I preview my changes?",
        answer:
          "A 'Preview' button in WordPress shows you exactly the final rendering before publishing. The workflow is identical to what you already know.",
      },
      {
        question: "What if I need help after launch?",
        answer:
          "Personalized training is included on every stack. You also get user documentation tailored to your site. Ongoing support is available depending on the package.",
      },
      {
        question: "Will my current content be kept?",
        answer:
          "Yes, all your content (text, images, media) is migrated automatically. Nothing is lost. Migration is included on the Headless and Web app tiers.",
      },
    ],
  },
  developpeur: {
    titre: "WordPress sites and custom applications",
    sousTitre:
      "WordPress API + Next.js for sites, dedicated PostgreSQL database for web apps, installable PWA for mobile. SSG, SSR, ISR, TypeScript, Tailwind, Vercel deployment.",
    carouselLabel: "Why this stack?",
    budgetTitle: "What does each path include technically?",
    budgetCards: {
      left: {
        title: "Classic (WordPress)",
        description:
          "Custom WordPress theme, modern build (Vite), Core Web Vitals optimizations, hardened security. Ideal for a high-performance showcase site at controlled cost.",
        price: "2,250",
      },
      right: {
        title: "Web app (complex Headless or Next.js + PostgreSQL)",
        description:
          "WordPress headless + Next.js App Router, hybrid ISR/SSR, multisite, custom APIs, third-party integrations, full CI/CD. Architecture built for scalability.",
        highlight:
          "Git repo access, complete technical documentation, and 12-month priority support.",
      },
    },
    ctaTitle: "Explore the technical documentation",
    ctaDescription:
      "Detailed architecture, stack choices, implementation patterns and deployment guides.",
    ctaLabel: "View documentation",
    ctaHref: "/documentation",
    faqs: [
      {
        question: "What technical stack is used?",
        answer:
          "Four paths: (1) classic WordPress with a modern custom theme, (2) Headless WordPress + Next.js App Router (SSG/ISR/SSR, strict TypeScript, Tailwind, Vercel deployment), (3) custom web app (Next.js + serverless PostgreSQL database, autonomous admin built for the business logic), (4) mobile PWA (Next.js + service worker, geolocation and local persistence as needed).",
      },
      {
        question: "How does data fetching work in headless?",
        answer:
          "Data is fetched via the WordPress REST API or WPGraphQL. Next.js handles rendering (SSG/SSR/ISR) with configurable revalidation. Images go through next/image for automatic optimization.",
      },
      {
        question: "Is the code accessible and maintainable?",
        answer:
          "Yes. Full Git repository access, modular architecture, reusable components, and technical documentation included. The code follows ESLint/Prettier standards.",
      },
      {
        question: "How does deployment work?",
        answer:
          "Automatic deployment on Vercel via Git (push → build → deploy) for headless stacks. Preview deployments on every PR. Instant rollback. WordPress stays on a secured classic host.",
      },
    ],
  },
};

// ─── Case studies page variants ──────────────────────────────────────────────

export const CASE_STUDIES_PAGE_VARIANTS_EN: Record<ProfileId | "default", CaseStudiesPageVariant> = {
  default: {
    titre: "Case studies",
    sousTitre:
      "Discover the Next Impact projects: WordPress sites, Headless WordPress + Next.js sites, custom web apps and mobile PWAs — across various industries.",
    defaultTab: "webapp",
    tabsLabel: "Filter by family",
    ctaLabel: "Discuss your project",
    ctaHref: "https://calendar.app.google/RwZqaabSR5aDMnk46",
    ctaDescription:
      "Got a similar project in mind? Let's talk about your needs and goals.",
  },
  decideur: {
    titre: "Our client work",
    sousTitre:
      "Real projects with measurable results: performance, SEO and conversion at the service of growth.",
    defaultTab: "webapp",
    tabsLabel: "Filter by industry",
    ctaLabel: "Evaluate my project",
    ctaHref: "https://calendar.app.google/RwZqaabSR5aDMnk46",
    ctaDescription:
      "Want similar results for your organization? Let's talk about your potential ROI.",
    projectHighlightLabel: "Key results",
  },
  utilisateur: {
    titre: "Simple, high-performance sites",
    sousTitre:
      "Sites their owners run day to day with WordPress — simply, without any technical skills.",
    defaultTab: "webapp",
    tabsLabel: "Browse projects",
    ctaLabel: "See a demo",
    ctaHref: "/demo",
    ctaDescription:
      "Want to see what day-to-day content management looks like? Watch a live demo.",
  },
  developpeur: {
    titre: "Technical case studies",
    sousTitre:
      "Optimized classic WordPress sites, Headless WordPress + Next.js, custom web apps and mobile PWAs. REST API, WPGraphQL, PostgreSQL. Technical details for every project.",
    defaultTab: "webapp",
    tabsLabel: "Filter by architecture",
    ctaLabel: "Explore documentation",
    ctaHref: "/documentation",
    ctaDescription:
      "Dive into the technical architecture: implementation guides, patterns and detailed stack choices.",
  },
};

// ─── About page variants ─────────────────────────────────────────────────────

export const ABOUT_PAGE_VARIANTS_EN: Record<ProfileId | "default", AboutPageVariant> = {
  default: {
    titre: "About",
    sousTitre:
      "Two complementary skill sets: modernizing the WordPress sites that are worth it, and building custom web and mobile applications when WordPress is no longer the right tool.",
    manifesteIntro:
      "WordPress powers more than 40% of the web. For many projects, it's still the right foundation — when properly modernized. But when the stake is no longer editorial but applicative (marketplace, business platform, mobile tool, simulator), WordPress hits its limits. In that case, you have to build something else, with the same autonomy promise: a custom admin so you stay in control of your content, your data and your users.",
    manifesteAccroche:
      "Next Impact is two complementary skill sets: modernizing WordPress sites and building custom applications. The right tool for the right project.",
    piliers: [
      {
        icon: "/icons/brand-reach-icon.svg",
        title: "Guaranteed management autonomy",
        description:
          "On a WordPress site, you keep the admin you already know. On a custom application, a dedicated admin is built for your business logic — you stay in control of your content, your data and your users without ongoing technical dependency.",
        items: [
          "WordPress site: identical WordPress admin",
          "Web app: custom admin for your business",
          "Editorial workflow unchanged on the content side",
        ],
      },
      {
        icon: "/icons/globe-network-icon.svg",
        title: "Rebuild the front end",
        description:
          "Several technical paths to modernize: optimized classic WordPress theme, Headless WordPress + Next.js for scalable platforms, or custom application when WordPress is no longer the right tool.",
        items: [
          "Core Web Vitals all green",
          "Industrial-grade technical SEO",
          "Modern, maintainable, documented stack",
        ],
      },
      {
        icon: "/icons/eco-design-icon.svg",
        title: "Sustainable digital by design",
        description:
          "Technical performance also means environmental performance. Every line of code and every hosting choice is made to reduce digital carbon footprint.",
        items: ["Lean, optimized code", "Eco-conscious hosting"],
      },
    ],
    citation:
      "WordPress isn't the problem. What we do with it can be — and that's what I modernize. When it isn't the right answer, I build something else.",
    ctaLabel: "Discuss your project",
    ctaHref: "https://calendar.app.google/RwZqaabSR5aDMnk46",
    ctaDescription:
      "Want to know more about our approach? Let's talk about your needs.",
  },
  decideur: {
    titre: "Why Next Impact",
    sousTitre:
      "WordPress modernization as a growth lever: measurable ROI, stronger security, competitive edge.",
    manifesteIntro:
      "A slow site is expensive. Each extra second of load time costs 7% of conversions. A vulnerable site can destroy years of trust in a single incident. Modernizing your WordPress — from optimized theme to full headless — is one of today's web investments with the best cost/impact ratio.",
    manifesteAccroche:
      "Next Impact turns your WordPress into a lasting competitive edge, without breaking what already works on the editorial side.",
    piliers: [
      {
        icon: "/icons/brand-reach-icon.svg",
        title: "Performance and conversion",
        description:
          "A fast site converts better. PageSpeed score directly impacts SEO, bounce rate and conversion rate — measurable business metrics.",
        items: [
          "PageSpeed score 95+ targeted",
          "Direct SEO impact on your organic traffic",
          "Conversion rate optimized by speed",
        ],
      },
      {
        icon: "/icons/globe-network-icon.svg",
        title: "Security and longevity",
        description:
          "Headless architecture decouples your back office from the public site. Your WordPress is no longer exposed to attacks, your data is protected.",
        items: [
          "Reduced attack surface through decoupling",
          "Modern, long-term-maintainable infrastructure",
        ],
      },
      {
        icon: "/icons/eco-design-icon.svg",
        title: "Several paths, controlled investment",
        description:
          "Not every project needs the same solution. The right technical path is the one that pays back your investment — not the most sophisticated one.",
        items: [
          "Classic WordPress site for showcases",
          "Headless + Next.js for SEO-heavy sites or scalable platforms",
          "Custom web app or mobile app when WordPress is no longer the right tool",
        ],
      },
    ],
    citation:
      "Every project is a strategic investment. My role is to make sure it generates measurable results — at the right technical tier.",
    ctaLabel: "Evaluate my project",
    ctaHref: "https://calendar.app.google/RwZqaabSR5aDMnk46",
    ctaDescription:
      "Let's discuss your business goals and the ROI you can expect.",
  },
  utilisateur: {
    titre: "Who I am",
    sousTitre:
      "Sites that are simple to manage, fast for your visitors — with the WordPress you already know.",
    manifesteIntro:
      "You manage a website day to day and you deserve a tool that just works. No bugs, no slow pages, no headaches. With Next Impact, you keep WordPress to manage your content, and I take care of the technical side so your site is fast, secure and pleasant — for you and for your visitors.",
    manifesteAccroche:
      "Next Impact frees you from technical concerns so you can focus on your content.",
    piliers: [
      {
        icon: "/icons/brand-reach-icon.svg",
        title: "Your WordPress, only better",
        description:
          "You keep exactly the same WordPress interface to create pages, publish posts and manage media. Nothing new to learn.",
        items: [
          "Identical WordPress admin interface",
          "Publish in a few clicks, just like before",
          "Preview rendering before publishing",
        ],
      },
      {
        icon: "/icons/globe-network-icon.svg",
        title: "A fast site for your visitors",
        description:
          "Your visitors get your content instantly. No more pages that take seconds to load — your site responds at a glance.",
        items: [
          "Pages that load in under a second",
          "Smooth navigation on mobile and desktop",
        ],
      },
      {
        icon: "/icons/eco-design-icon.svg",
        title: "Training and support included",
        description:
          "You're never alone. Personalized training and user documentation help you become autonomous from day one.",
        items: [
          "Training tailored to your level",
          "User documentation made for your site",
        ],
      },
    ],
    citation:
      "My goal: that you can run your site with peace of mind, never needing technical skills.",
    ctaLabel: "See a demo",
    ctaHref: "/demo",
    ctaDescription:
      "Discover what day-to-day content management looks like with a Next Impact site.",
  },
  developpeur: {
    titre: "The Next Impact stack",
    sousTitre:
      "Optimized classic WordPress, Headless WordPress + Next.js, custom web apps (Next.js + PostgreSQL), mobile PWA. Decoupled architecture, SSG/SSR/ISR, TypeScript, Vercel deployment.",
    manifesteIntro:
      "Next Impact was born from the conviction that WordPress sites deserve a modern architecture — and that not everything deserves to be a WordPress site. For showcase and editorial platforms, WordPress stays a solid foundation when properly modernized. For marketplaces, business tools or mobile applications, we build something else: custom web app or PWA, with an autonomous admin tailored to the project's logic.",
    manifesteAccroche:
      "Two complementary skill sets, one core conviction: the right tool for the right project.",
    piliers: [
      {
        icon: "/icons/brand-reach-icon.svg",
        title: "WordPress as editorial backbone",
        description:
          "WordPress as backend, REST API or WPGraphQL for data fetching. Custom Post Types and ACF Pro for modeling. Native preview mode and draft handling.",
        items: [
          "WordPress REST API + WPGraphQL",
          "Custom Post Types and ACF Pro for modeling",
          "Preview mode and draft handling",
        ],
      },
      {
        icon: "/icons/globe-network-icon.svg",
        title: "Four technical paths",
        description:
          "Optimized classic WordPress theme, Headless + Next.js App Router (SSG/ISR/SSR) for scalable editorial platforms, custom web app (Next.js + serverless PostgreSQL, autonomous admin), or installable mobile PWA.",
        items: [
          "Classic: WordPress with modern custom theme",
          "Headless / Web app: Headless WordPress + Next.js (SSG/ISR/SSR)",
          "Web app: Next.js + PostgreSQL + custom autonomous admin",
          "Mobile app: Next.js PWA, geolocation and local persistence as needed",
        ],
      },
      {
        icon: "/icons/eco-design-icon.svg",
        title: "DevOps and deployment",
        description:
          "CI/CD via Vercel with preview deployments on every PR. Instant rollback, monitoring and centralized logs. For the monolithic stack, automated build and deployment to WordPress hosting.",
        items: [
          "Vercel deployment with per-branch previews",
          "Automated CI/CD pipeline (lint, type-check, build)",
        ],
      },
    ],
    citation:
      "The best architecture is one that's invisible to the end user and crystal-clear to the developer who maintains it.",
    ctaLabel: "Explore documentation",
    ctaHref: "/documentation",
    ctaDescription:
      "Architecture guides, implementation patterns and detailed technical choices.",
  },
};

// ─── Expandable cards variants ───────────────────────────────────────────────

export const EXPANDABLE_CARDS_VARIANTS_EN: Record<
  ProfileId | "default",
  ExpandableCardVariant[]
> = {
  default: [
    {
      title: "How headless works",
      description:
        "Understand the core principles of Headless and how this architecture is reshaping the way websites are built and run.",
      src: "/icons/desktop-headless-icon.svg",
      ctaText: "Learn more",
      ctaLink: "/documentation/headless-cms/comprendre-le-headless",
    },
    {
      title: "Why pick headless?",
      description:
        "Understand the concrete gains: load times cut in half, lower maintenance cost, and measurable ROI on your web investment.",
      src: "/icons/scan-icon.svg",
      ctaText: "Learn more",
      ctaLink: "/documentation/headless-cms/pourquoi-le-headless",
    },
    {
      title: "What goals does it fit?",
      description:
        "See if your project matches: traffic spikes to absorb, eco-design, multisite, customer portal or business application.",
      src: "/icons/analytics-icon.svg",
      ctaText: "Learn more",
      ctaLink: "/documentation/headless-cms/quand-utiliser-wordpress-headless",
    },
  ],
  decideur: [
    {
      title: "Headless as a strategic edge",
      description:
        "Understand how decoupling frontend and backend translates into a competitive advantage for your business.",
      src: "/icons/desktop-headless-icon.svg",
      ctaText: "Learn more",
      ctaLink: "/documentation/headless-cms/pourquoi-le-headless",
    },
    {
      title: "ROI and business performance",
      description:
        "Measurable indicators: load time, conversion rate, SEO ranking. Direct impact on your revenue.",
      src: "/icons/scan-icon.svg",
      ctaText: "See the numbers",
      ctaLink: "/documentation/headless-cms/performance-et-core-web-vitals",
    },
    {
      title: "Use cases: growth and investment",
      description:
        "Concrete examples of SMBs and organizations that transformed their online presence through targeted WordPress modernization.",
      src: "/icons/analytics-icon.svg",
      ctaText: "View case studies",
      ctaLink: "/etudes-de-cas",
    },
  ],
  utilisateur: [
    {
      title: "WordPress stays your tool",
      description:
        "No new tool to learn. You keep managing your content in WordPress, exactly as before — only better.",
      src: "/icons/desktop-headless-icon.svg",
      ctaText: "Learn more",
      ctaLink: "/documentation/headless-cms/gerer-le-contenu",
    },
    {
      title: "A faster site for your visitors",
      description:
        "Your pages load instantly. Your visitors stay longer, interact more and come back.",
      src: "/icons/scan-icon.svg",
      ctaText: "Understand the gains",
      ctaLink: "/documentation/headless-cms/performance-et-core-web-vitals",
    },
    {
      title: "Run your content day to day",
      description:
        "Preview, media library, editorial workflow: everything you need to publish with confidence.",
      src: "/icons/analytics-icon.svg",
      ctaText: "See the workflow",
      ctaLink: "/documentation/headless-cms/preview-et-workflow-editorial",
    },
  ],
  developpeur: [
    {
      title: "Decoupled architecture",
      description:
        "REST / GraphQL API on the backend, React on the frontend. Understand the separation of concerns and data fetching.",
      src: "/icons/desktop-headless-icon.svg",
      ctaText: "View architecture",
      ctaLink: "/documentation/headless-cms/comment-fonctionne-le-headless",
    },
    {
      title: "Stack and performance",
      description:
        "Next.js, SSG/SSR/ISR, Core Web Vitals, image optimization. The technical choices for a 100 Lighthouse.",
      src: "/icons/scan-icon.svg",
      ctaText: "Explore the stack",
      ctaLink: "/documentation/headless-cms/nextjs-pour-wordpress-headless",
    },
    {
      title: "End-to-end implementation",
      description:
        "From the headless WordPress setup to Vercel deployment: endpoints, JWT authentication, CI/CD and going live.",
      src: "/icons/analytics-icon.svg",
      ctaText: "View the guide",
      ctaLink: "/documentation/headless-cms/deploiement-vercel-nextjs",
    },
  ],
};
