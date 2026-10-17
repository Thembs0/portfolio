// ------------------------------------------------------------
// Core project type - unchanged from before
// ------------------------------------------------------------
export type Project = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  role: string;
  technologies: string[];
  category: string;
  github_url: string | null;
  live_url: string | null;
  cover_image: string | null;
  gallery: string[];
  featured: boolean;
  published: boolean;
  created_at?: string;
};

// ------------------------------------------------------------
// Service card - used by "Technology, made useful"
// The old type (title/description/items) is preserved so any
// existing import still type-checks. Optional fields are added
// for the DB-backed version.
// ------------------------------------------------------------
export type Service = {
  id?: string;
  title: string;
  description: string;
  items: string[];
  sort_order?: number;
  published?: boolean;
};

// ------------------------------------------------------------
// New: Skill (Toolkit section)
// ------------------------------------------------------------
export type Skill = {
  id: string;
  name: string;
  category: string;
  sort_order: number;
  published: boolean;
};

// ------------------------------------------------------------
// New: Credential (Education + Certifications)
// ------------------------------------------------------------
export type CredentialKind = "education" | "certification" | "award" | "course";

export type Credential = {
  id: string;
  kind: CredentialKind;
  title: string;
  institution: string;
  detail: string;
  sort_order: number;
  published: boolean;
};

// ------------------------------------------------------------
// New: Profile (single-row site settings)
// ------------------------------------------------------------
export type Profile = {
  id: number;
  full_name: string;
  short_name: string;
  role_line: string;
  availability: string;
  hero_kicker: string;
  hero_heading: string;
  hero_intro: string;
  about_lead: string;
  about_body: string;
  about_extra: string;
  photo_url: string | null;
  cv_url: string | null;
  email: string;
  location: string;
  footer_tagline: string;
  footer_note: string;
  updated_at?: string;
};

// ------------------------------------------------------------
// Fallback data - used if Supabase is not connected OR a query
// fails OR returns empty. This is the safety net: the homepage
// can never render blank because of a DB hiccup.
//
// starterProjects stays exactly as you had it.
// services stays exactly as you had it.
// skills, credentials, profile fallbacks are new and mirror the
// seed values in revamp.sql so the site looks identical even in
// fallback mode.
// ------------------------------------------------------------
export const starterProjects: Project[] = [
  {
    id: "sample-1", title: "MadeFrom", slug: "madefrom",
    summary: "A food and recipe concept built around making everyday ingredients more useful.",
    description: "A personal product concept exploring a clear, approachable food discovery experience. Replace this sample content with the actual project story, implementation details and screenshots before publishing.",
    role: "Product concept & development", technologies: ["SwiftUI", "Swift", "Firebase"],
    category: "Mobile application", github_url: null, live_url: null, cover_image: null,
    gallery: [], featured: true, published: false
  },
  {
    id: "sample-2", title: "Elucubrate LMS", slug: "elucubrate-lms",
    summary: "Learning technology and digital education experience for training and course delivery.",
    description: "A learning platform concept informed by practical education and facilitation experience. Add verified features, screenshots and links to reflect the work you have actually completed.",
    role: "Platform development", technologies: ["Web development", "Databases", "LMS"],
    category: "Web platform", github_url: null, live_url: null, cover_image: null,
    gallery: [], featured: true, published: false
  },
  {
    id: "sample-3", title: "Clkout.Store", slug: "clkout-store",
    summary: "A South African marketplace concept designed to connect customers with local sellers.",
    description: "A marketplace project with product discovery and seller-focused workflows. Add your own screenshots, confirmed features, source repository and public demo when ready.",
    role: "Founder & developer", technologies: ["Web development", "E-commerce", "Databases"],
    category: "Marketplace", github_url: null, live_url: null, cover_image: null,
    gallery: [], featured: true, published: false
  }
];

export const services: Service[] = [
  { title: "Web application development", description: "Purpose-built websites, portals and business systems designed around the way your organisation works.", items: ["Responsive websites", "Full-stack applications", "APIs & integrations", "Database-driven systems"] },
  { title: "Mobile application development", description: "Thoughtful mobile experiences with practical functionality, clear interfaces and maintainable code.", items: ["iOS development", "Swift & SwiftUI", "App prototyping", "Backend integration"] },
  { title: "IT consulting & technical planning", description: "Practical technical guidance to help you make informed decisions about systems, tools and delivery.", items: ["Technical assessments", "Solution planning", "System requirements", "Technology guidance"] },
  { title: "Hardware diagnostics & IT support", description: "Structured troubleshooting to identify likely causes of computer, software and connectivity issues.", items: ["Hardware diagnostics", "Software troubleshooting", "Network connectivity", "System setup & maintenance"] },
  { title: "Systems, databases & integrations", description: "Support for the data, services and integrations that keep digital products working together.", items: ["Relational database design", "SQL & data workflows", "REST API integration", "Deployment support"] },
  { title: "Technical training & mentoring", description: "Accessible technology training shaped by hands-on experience teaching educators and learners.", items: ["Programming foundations", "IT Essentials & networking", "Cybersecurity fundamentals", "Digital skills workshops"] }
];

export const fallbackSkills: Skill[] = [
  "PHP","Laravel","CodeIgniter","JavaScript","TypeScript","React","Node.js","Swift","SwiftUI",
  "MySQL","MongoDB","REST APIs","Git & GitHub","Docker","AWS / Azure / Google Cloud",
  "Supabase","Firebase","Cybersecurity","Networking"
].map((name, i) => ({
  id: `fallback-skill-${i}`,
  name,
  category: "General",
  sort_order: i + 1,
  published: true,
}));

export const fallbackCredentials: Credential[] = [
  { id: "fallback-edu-1", kind: "education", title: "Diploma in IT (Software Development)", institution: "IIE Rosebank College", detail: "", sort_order: 1, published: true },
  { id: "fallback-cert-1", kind: "certification", title: "Cisco CyberOps Associate", institution: "Cisco", detail: "IT Essentials Instructor · CCNA Instructor Training", sort_order: 2, published: true },
];

export const fallbackProfile: Profile = {
  id: 1,
  full_name: "Thembinkosi Ndlovu",
  short_name: "TN",
  role_line: "SOFTWARE & SYSTEMS",
  availability: "AVAILABLE FOR SELECT PROJECTS",
  hero_kicker: "FULL-STACK DEVELOPER · IT SPECIALIST · TECHNICAL CONSULTANT",
  hero_heading: "I build digital things that work.",
  hero_intro: "I’m Thembinkosi - a developer and IT professional who brings software, systems and people together to solve real problems.",
  about_lead: "Good technology is not just about making something work. It’s about understanding the problem, making thoughtful decisions, and building something people can rely on.",
  about_body: "My work spans full-stack web development, mobile software, databases, IT support, networking and technical education. I’m comfortable moving between code, infrastructure and the people who depend on it.",
  about_extra: "Alongside freelance development, I work in technology education and project delivery - translating complex ideas into practical systems and helping others build confidence with technology.",
  photo_url: null,
  cv_url: null,
  email: "ndlovuthembinkosi@live.com",
  location: "Johannesburg, Gauteng · South Africa",
  footer_tagline: "Built with intention. Based in Johannesburg, South Africa.",
  footer_note: "Independent thinking. Thoughtful engineering.",
};