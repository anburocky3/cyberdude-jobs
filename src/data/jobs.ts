export type JobType = "fulltime" | "internship";

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: JobType;
  workSchedule?: string;
  workMode?: string;
  compensation?: string;
  description: string;
  overview?: string;
  responsibilities?: string[];
  minQualifications?: string[];
  preferredQualifications?: string[];
  perks?: string[];
  team?: string;
  startingDate?: string;
  minDuration?: string;
  expectedStipend?: string;
  lastDate?: string; // ISO or human-readable (deprecated in favor of applicationDeadline)
  applicationDeadline?: string; // ISO or human-readable
  status?: "open" | "expired";
  postedDate?: string; // ISO or human-readable
  whoCanApply?: string;
  skills?: string[];
  openings?: number;
  slug: string;
};

export const jobs: Job[] = [
  // Full-time roles
  {
    id: "ft-1",
    title: "Fullstack Engineer (5+ Years Experience)",
    company: "CyberDude Networks Pvt. Ltd.",
    location: "Chennai, India",
    type: "fulltime",
    workSchedule: "Full-time, Monday to Friday",
    workMode: "Hybrid",
    compensation:
      "Best in industry, based on experience and skill set. Includes benefits and performance bonuses.",
    description:
      "We are seeking a senior fullstack engineer to build robust, scalable products and mentor peers.",
    overview:
      "Own end-to-end feature delivery across backend and frontend while mentoring peers and collaborating with design and product.",
    responsibilities: [
      "Design and implement scalable APIs and services",
      "Build rich web experiences with modern frameworks",
      "Review code and uphold engineering quality",
      "Collaborate with cross-functional teams to ship features",
    ],
    minQualifications: [
      "5+ years building production systems",
      "Expertise in one of MERN/MEAN/LAMP stacks",
      "Proficiency with relational and/or document databases",
    ],
    preferredQualifications: [
      "Experience mentoring engineers",
      "Cloud-native architecture (Docker, Kubernetes)",
    ],
    perks: [
      "Benefits and performance bonuses",
      "Learning budget and mentorship",
    ],
    team: "Platform",
    startingDate: "Immediate",
    status: "open",
    postedDate: "2025-09-01",
    whoCanApply: "Experienced fullstack engineers (5+ years)",
    openings: 2,
    applicationDeadline: "2025-10-31",
    skills: [
      "MERN",
      "MEAN",
      "LAMP",
      "Node.js",
      "React/Angular/Vue",
      "PHP",
      "MySQL/MongoDB",
    ],
    slug: "fullstack-engineer-senior",
  },
  {
    id: "ft-2",
    title: "Python AI Engineer (5+ Years Experience)",
    company: "CyberDude Networks Pvt. Ltd.",
    location: "Chennai, India",
    type: "fulltime",
    workSchedule: "Full-time, Monday to Friday",
    workMode: "Hybrid",
    compensation:
      "Best in industry, based on experience and skill set. Includes benefits and performance bonuses.",
    description:
      "Own AI/ML model development, deployment, and iteration across production systems.",
    overview:
      "Drive AI initiatives from experimentation to production with a strong emphasis on model reliability and performance.",
    responsibilities: [
      "Build, train, and evaluate ML models",
      "Deploy models to production and monitor drift",
      "Partner with product to translate requirements into solutions",
    ],
    minQualifications: [
      "5+ years with Python and ML frameworks",
      "Strong data modeling and algorithms knowledge",
    ],
    preferredQualifications: [
      "Experience with TensorFlow Serving or TorchServe",
      "ML Ops tooling (Weights & Biases, MLflow)",
    ],
    perks: ["Benefits", "Mentorship", "Conference budget"],
    team: "AI/ML",
    startingDate: "Immediate",
    status: "open",
    postedDate: "2025-09-01",
    whoCanApply: "Experienced AI/ML engineers (5+ years)",
    openings: 2,
    applicationDeadline: "2025-10-31",
    skills: [
      "Python",
      "TensorFlow",
      "PyTorch",
      "Data Modeling",
      "Algorithm Development",
    ],
    slug: "python-ai-engineer-senior",
  },
  {
    id: "ft-3",
    title: "UI/UX Engineer (3+ Years Experience)",
    company: "CyberDude Networks Pvt. Ltd.",
    location: "Chennai, India",
    type: "fulltime",
    workSchedule: "Full-time, Monday to Friday",
    workMode: "Hybrid",
    compensation:
      "Best in industry, based on experience and skill set. Includes benefits and performance bonuses.",
    description:
      "Design intuitive interfaces, craft prototypes, and collaborate closely with engineering.",
    overview:
      "Create delightful, accessible experiences across web apps by combining design systems with user research.",
    responsibilities: [
      "Translate requirements into user flows and prototypes",
      "Maintain and extend design systems",
      "Partner with engineering for high-quality delivery",
    ],
    minQualifications: [
      "3+ years in UI/UX roles",
      "Proficiency in Figma and prototyping tools",
    ],
    preferredQualifications: [
      "Front-end framework experience",
      "Usability testing",
    ],
    perks: ["Benefits", "Design hardware stipend"],
    team: "Design",
    startingDate: "Immediate",
    status: "open",
    postedDate: "2025-09-01",
    whoCanApply: "UI/UX engineers with 3+ years of experience",
    openings: 2,
    applicationDeadline: "2025-10-31",
    skills: [
      "Figma",
      "Adobe XD",
      "Front-end Frameworks",
      "Wireframing",
      "Prototyping",
    ],
    slug: "ui-ux-engineer-mid",
  },

  // Internships
  {
    id: "int-1",
    title: "Fullstack Engineer Intern",
    company: "CyberDude Networks Pvt. Ltd.",
    location: "Chennai, India",
    type: "internship",
    openings: 2,
    description:
      "6-month, hands-on internship working with senior engineers on live projects.",
    overview:
      "Kickstart your engineering career with real-world projects, code reviews, and mentorship.",
    responsibilities: [
      "Build features under guidance",
      "Write clean, tested code",
      "Participate in reviews and standups",
    ],
    minQualifications: [
      "Good understanding of JavaScript and web fundamentals",
      "Familiarity with Git",
    ],
    preferredQualifications: ["React/Angular/Vue basics", "Node.js basics"],
    perks: [
      "Certificate and LoR",
      "Mentorship by senior engineers",
      "Exposure to live projects",
    ],
    team: "Platform",
    startingDate: "Immediate",
    minDuration: "6M",
    expectedStipend: "Unpaid (learning-focused)",
    applicationDeadline: "2025-12-31",
    status: "open",
    postedDate: "2025-09-15",
    whoCanApply: "Students, recent graduates, or self-taught developers",
    skills: ["JavaScript", "React or Angular or Vue", "Node.js", "Git"],
    slug: "fullstack-engineer-intern",
  },
  {
    id: "int-2",
    title: "UI/UX Engineer Intern",
    company: "CyberDude Networks Pvt. Ltd.",
    location: "Chennai, India",
    type: "internship",
    openings: 2,
    description:
      "6-month internship focusing on wireframing, prototyping, and user research.",
    overview:
      "Learn how to design user-centric experiences and collaborate with engineering.",
    responsibilities: [
      "Create wireframes and prototypes",
      "Run lightweight research and synthesize insights",
    ],
    minQualifications: ["Figma proficiency", "Strong design fundamentals"],
    preferredQualifications: ["Portfolio of projects"],
    perks: ["Certificate and LoR", "Mentorship"],
    team: "Design",
    startingDate: "Immediate",
    minDuration: "6M",
    expectedStipend: "Unpaid (learning-focused)",
    applicationDeadline: "2025-12-31",
    status: "open",
    postedDate: "2025-09-15",
    whoCanApply: "Students and fresh graduates with design portfolios",
    skills: ["Figma", "Adobe XD", "Prototyping"],
    slug: "ui-ux-engineer-intern",
  },
  {
    id: "int-3",
    title: "UAT Tester Intern",
    company: "CyberDude Networks Pvt. Ltd.",
    location: "Chennai, India",
    type: "internship",
    openings: 1,
    description:
      "Validate features, write test cases, and collaborate with QA on live products.",
    overview:
      "Gain experience validating real features and documenting issues.",
    responsibilities: [
      "Write and run test cases",
      "Log issues with clear reproduction steps",
    ],
    minQualifications: ["Attention to detail", "Basic testing knowledge"],
    perks: ["Certificate and LoR", "Mentorship"],
    team: "QA",
    startingDate: "Immediate",
    minDuration: "6M",
    expectedStipend: "Unpaid (learning-focused)",
    applicationDeadline: "2025-12-31",
    status: "open",
    postedDate: "2025-09-15",
    whoCanApply: "Students or freshers with strong attention to detail",
    skills: ["Test Cases", "Issue Tracking", "Attention to Detail"],
    slug: "uat-tester-intern",
  },
  {
    id: "int-4",
    title: "Content Creator Intern",
    company: "CyberDude Networks Pvt. Ltd.",
    location: "Chennai, India",
    type: "internship",
    openings: 2,
    description:
      "Create educational and marketing content across social and product channels.",
    overview:
      "Work with marketing to create engaging content for our community.",
    responsibilities: [
      "Plan and produce content",
      "Analyze engagement metrics",
    ],
    minQualifications: ["Strong writing or video skills"],
    perks: ["Certificate and LoR", "Mentorship"],
    team: "Marketing",
    startingDate: "Immediate",
    minDuration: "6M",
    expectedStipend: "Unpaid (learning-focused)",
    applicationDeadline: "2024-10-04",
    status: "expired",
    postedDate: "2024-06-01",
    whoCanApply: "Aspiring content creators and social media enthusiasts",
    skills: ["Writing", "Video", "Social Media"],
    slug: "content-creator-intern",
  },
  {
    id: "int-5",
    title: "Business Analyst Intern",
    company: "CyberDude Networks Pvt. Ltd.",
    location: "Chennai, India",
    type: "internship",
    openings: 1,
    description:
      "Analyze requirements, map processes, and support product decision-making.",
    overview:
      "Collaborate with stakeholders to capture requirements and improve processes.",
    responsibilities: [
      "Document requirements and user stories",
      "Support demos and UAT",
    ],
    minQualifications: ["Strong communication", "Analytical mindset"],
    perks: ["Certificate and LoR", "Mentorship"],
    team: "Product",
    startingDate: "Immediate",
    minDuration: "6M",
    expectedStipend: "Unpaid (learning-focused)",
    applicationDeadline: "2025-12-31",
    status: "open",
    postedDate: "2025-09-15",
    whoCanApply: "Students and fresh graduates interested in business analysis",
    skills: ["Requirements", "Process Mapping", "Communication"],
    slug: "business-analyst-intern",
  },
];

export function getJobsByType(type: JobType): Job[] {
  return jobs.filter((j) => j.type === type);
}

export function getJobBySlug(slug: string): Job | undefined {
  return jobs.find((j) => j.slug === slug);
}
