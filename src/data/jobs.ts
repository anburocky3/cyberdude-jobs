export type JobType = "fulltime" | "internship";

export type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  type: JobType;
  workSchedule?: string;
  workMode: string;
  compensation?: string;
  description: string;
  overview: string;
  responsibilities?: string[];
  minQualifications?: string[];
  preferredQualifications?: string[];
  perks?: string[];
  team?: string;
  startingDate?: string;
  minDuration?: string;
  expectedStipend?: string;
  lastDate?: string; // ISO or human-readable (deprecated in favor of applicationDe10l03e)
  applicationDeadline?: string; // ISO or human-r10d03le
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
    id: 1,
    title: "Fullstack Engineer (5+ Years Experience)",
    company: "CyberDude Networks Pvt. Ltd.",
    location: "Chennai, India",
    type: "fulltime",
    workSchedule: "Full-time, Monday to Saturday",
    workMode: "OnSite",
    compensation:
      "Best in industry, based on experience and skill set. Includes benefits and performance bonuses.",
    description:
      "We are seeking a senior fullstack engineer to build robust, scalable products and mentor peers.",
    overview:
      "Own end-to-end feature delivery across backend and frontend while mentoring peers and collaborating with design and product.",
    responsibilities: [
      "Design and implement scalable REST/GraphQL APIs and services",
      "Architect, build, and optimize end-to-end features across frontend and backend",
      "Implement robust data models, migrations, and caching strategies",
      "Set up CI/CD pipelines and automate testing and deployments",
      "Review code and uphold engineering quality and security best practices",
      "Monitor production systems; triage incidents and drive root-cause analysis",
      "Mentor engineers through pairing, design reviews, and actionable feedback",
      "Collaborate with Product, Design, and QA to scope, plan, and ship features on time",
    ],
    minQualifications: [
      "5+ years building and operating production web applications",
      "Expertise in at least one modern stack (MERN/MEAN/LAMP)",
      "Strong proficiency with TypeScript/JavaScript or PHP and Node.js or Laravel",
      "Deep experience with relational and/or document databases (e.g., MySQL, PostgreSQL, MongoDB)",
      "Solid understanding of HTTP, web security, and performance optimization",
      "Hands-on experience with unit/integration testing and code reviews",
    ],
    preferredQualifications: [
      "Experience mentoring engineers and leading projects end-to-end",
      "Cloud-native architecture (Docker, Kubernetes, Helm)",
      "Experience with message queues/streaming (e.g., RabbitMQ, Kafka)",
      "Observability tooling (Grafana, Prometheus, OpenTelemetry)",
      "Experience with microservices and domain-driven design",
      "Familiarity with infrastructure as code (Terraform, Pulumi)",
    ],
    perks: [
      "Benefits and performance bonuses",
      "Annual learning/conference budget",
      "Modern hardware and productivity software",
      "Flexible leave policy",
      "Quarterly team offsites and hackdays",
      "Wellness initiatives (talks, workshops)",
      "Transparent career ladder and growth plan",
    ],
    team: "Platform",
    startingDate: "Immediate",
    status: "open",
    postedDate: "2025-09-25",
    whoCanApply: "Experienced fullstack engineers (5+ years)",
    openings: 1,
    applicationDeadline: "2025-10-03",
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
    id: 2,
    title: "Python AI Engineer (5+ Years Experience)",
    company: "CyberDude Networks Pvt. Ltd.",
    location: "Chennai, India",
    type: "fulltime",
    workSchedule: "Full-time, Monday to Friday",
    workMode: "OnSite",
    compensation:
      "Best in industry, based on experience and skill set. Includes benefits and performance bonuses.",
    description:
      "Own AI/ML model development, deployment, and iteration across production systems.",
    overview:
      "Drive AI initiatives from experimentation to production with a strong emphasis on model reliability and performance.",
    responsibilities: [
      "Clear understanding of Python & Web frameworks (Flask, Django, FastAPI, etc.)",
      "Design, train, evaluate, and iterate on ML models (classical and deep learning)",
      "Build data pipelines and feature stores for robust offline/online workflows",
      "Deploy models to production (batch/real-time) and monitor drift and performance",
      "Instrument experiments; maintain reproducibility and experiment tracking",
      "Collaborate with data engineering and product to translate requirements into solutions",
      "Implement model governance, testing, and rollback strategies",
    ],
    minQualifications: [
      "5+ years with Python and ML frameworks (TensorFlow/PyTorch, FastAPI, etc.)",
      "Strong understanding of statistics, probability, and algorithms",
      "Experience with data processing frameworks (Pandas, Spark, or Dask)",
      "Proficiency in building and optimizing training/evaluation pipelines",
      "Experience deploying models as services or batch jobs",
    ],
    preferredQualifications: [
      "Experience with TensorFlow Serving, TorchServe, or ONNX Runtime",
      "ML Ops tooling (Weights & Biases, MLflow, Kubeflow, Airflow)",
      "Vector databases and retrieval (FAISS, Milvus)",
      "LLM fine-tuning, RAG architectures, and prompt engineering",
      "GPU optimization and quantization techniques",
    ],
    perks: [
      "Benefits and performance bonuses",
      "Mentorship and dedicated learning budget",
      "Conference and publication support",
      "Access to compute resources (GPUs) and experimentation platforms",
      "Quarterly research/innovation days",
    ],
    team: "AI/ML",
    startingDate: "Immediate",
    status: "open",
    postedDate: "2025-09-25",
    whoCanApply: "Experienced AI/ML engineers (5+ years)",
    openings: 1,
    applicationDeadline: "2025-10-03",
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
    id: 3,
    title: "UI/UX Engineer (3+ Years Experience)",
    company: "CyberDude Networks Pvt. Ltd.",
    location: "Chennai, India",
    type: "fulltime",
    workSchedule: "Full-time, Monday to Friday",
    workMode: "OnSite",
    compensation:
      "Best in industry, based on experience and skill set. Includes benefits and performance bonuses.",
    description:
      "Design intuitive interfaces, craft prototypes, and collaborate closely with engineering.",
    overview:
      "Create delightful, accessible experiences across web apps by combining design systems with user research.",
    responsibilities: [
      "Translate requirements into user flows, wireframes, and interactive prototypes",
      "Maintain and extend accessible, scalable design systems",
      "Conduct usability testing and synthesize insights into actionable recommendations",
      "Collaborate closely with frontend engineers to ensure pixel-perfect implementation",
      "Track and improve key UX metrics (task success, time-on-task, NPS)",
    ],
    minQualifications: [
      "3+ years in UI/UX or product design roles",
      "Proficiency in Figma and prototyping tools (interactive components, variants)",
      "Strong grounding in accessibility (WCAG) and responsive design",
    ],
    preferredQualifications: [
      "Front-end framework exposure (React/Vue/Angular)",
      "Experience with usability testing and analytics tools",
      "Motion/interaction design skills",
    ],
    perks: [
      "Benefits and performance bonuses",
      "Design hardware and software stipend",
      "Learning budget and conference passes",
      "Monthly design critiques and workshops",
      "Flexible leave policy",
    ],
    team: "Design",
    startingDate: "Immediate",
    status: "open",
    postedDate: "2025-09-25",
    whoCanApply: "UI/UX engineers with 3+ years of experience",
    openings: 1,
    applicationDeadline: "2025-10-03",
    skills: [
      "Figma",
      "Adobe XD",
      "Front-end Frameworks",
      "Wireframing",
      "Prototyping",
    ],
    slug: "ui-ux-engineer",
  },

  // Internships
  {
    id: 4,
    title: "Fullstack Engineer Intern",
    company: "CyberDude Networks Pvt. Ltd.",
    location: "Chennai, India",
    type: "internship",
    openings: 2,
    workMode: "Hybrid",
    description:
      "6-month, hands-on internship working with senior engineers on live projects.",
    overview:
      "Kickstart your engineering career with real-world projects, code reviews, and mentorship.",
    responsibilities: [
      "Build features under guidance and ship incremental improvements",
      "Write clean, tested code and documentation",
      "Participate in code reviews, standups, and sprint ceremonies",
      "Pair program with senior engineers to learn best practices",
      "Fix bugs, improve tests, and harden reliability",
    ],
    minQualifications: [
      "Good understanding of JavaScript/TypeScript and web fundamentals (HTML/CSS)",
      "Familiarity with Git and basic command line",
      "Eagerness to learn and receive feedback",
    ],
    preferredQualifications: [
      "React/Angular/Vue basics",
      "Node.js/Express basics",
      "SQL/NoSQL fundamentals",
      "Testing basics (Jest/Playwright)",
    ],
    perks: [
      "Certificate and LoR",
      "1:1 mentorship by senior engineers",
      "Exposure to live projects and production workflows",
      "Structured learning plan with weekly tech talks",
      "Resume and portfolio reviews",
      "Opportunity to convert to full-time based on performance",
    ],
    team: "Platform",
    startingDate: "Immediate",
    minDuration: "6M",
    expectedStipend: "Unpaid (learning-focused)",
    applicationDeadline: "2025-10-03",
    status: "open",
    postedDate: "2025-09-25",
    whoCanApply: "Students, recent graduates, or self-taught developers",
    skills: ["JavaScript", "React or Angular or Vue", "Node.js", "Git"],
    slug: "fullstack-engineer-intern",
  },
  {
    id: 5,
    title: "UI/UX Engineer Intern",
    company: "CyberDude Networks Pvt. Ltd.",
    location: "Chennai, India",
    type: "internship",
    openings: 2,
    workMode: "Hybrid",
    description:
      "6-month internship focusing on wireframing, prototyping, and user research.",
    overview:
      "Learn how to design user-centric experiences and collaborate with engineering.",
    responsibilities: [
      "Create wireframes, prototypes, and component variants in Figma",
      "Run lightweight research and synthesize insights into design decisions",
      "Collaborate with engineers to ensure high-quality implementation",
    ],
    minQualifications: [
      "Figma proficiency",
      "Strong visual and interaction design fundamentals",
      "Basic understanding of accessibility and responsive design",
    ],
    preferredQualifications: [
      "Portfolio of academic or self-initiated projects",
      "Exposure to usability testing and design systems",
    ],
    perks: [
      "Certificate and LoR",
      "1:1 mentorship with senior designers",
      "Weekly design critiques and learning sessions",
      "Hands-on experience with a live design system",
      "Portfolio and case study guidance",
    ],
    team: "Design",
    startingDate: "Immediate",
    minDuration: "6M",
    expectedStipend: "Unpaid (learning-focused)",
    applicationDeadline: "2025-10-03",
    status: "open",
    postedDate: "2025-09-25",
    whoCanApply: "Students and fresh graduates with design portfolios",
    skills: ["Figma", "Adobe XD", "Prototyping"],
    slug: "ui-ux-engineer-intern",
  },
  {
    id: 6,
    title: "UAT Tester Intern",
    company: "CyberDude Networks Pvt. Ltd.",
    location: "Chennai, India",
    type: "internship",
    openings: 1,
    workMode: "Hybrid",
    description:
      "Validate features, write test cases, and collaborate with QA on live products.",
    overview:
      "Gain experience validating real features and documenting issues.",
    responsibilities: [
      "Write, execute, and maintain test cases across web and API layers",
      "Log issues with clear reproduction steps, evidence, and severity",
      "Collaborate with engineers and PMs to validate fixes",
      "Contribute to regression and smoke testing suites",
    ],
    minQualifications: [
      "Attention to detail",
      "Basic testing knowledge (manual/black-box)",
      "Familiarity with issue tracking tools (Jira/GitHub)",
    ],
    perks: [
      "Certificate and LoR",
      "1:1 mentorship with QA engineers",
      "Hands-on exposure to real-world release cycles",
      "Workshops on test design and automation basics",
      "Resume and interview prep support",
    ],
    team: "QA",
    startingDate: "Immediate",
    minDuration: "6M",
    expectedStipend: "Unpaid (learning-focused)",
    applicationDeadline: "2025-10-03",
    status: "open",
    postedDate: "2025-09-25",
    whoCanApply: "Students or freshers with strong attention to detail",
    skills: ["Test Cases", "Issue Tracking", "Attention to Detail"],
    slug: "uat-tester-intern",
  },
  {
    id: 7,
    title: "Content Creator Intern",
    company: "CyberDude Networks Pvt. Ltd.",
    location: "Chennai, India",
    type: "internship",
    openings: 2,
    workMode: "Hybrid",
    description:
      "Create educational and marketing content across social and product channels.",
    overview:
      "Work with marketing to create engaging content for our community.",
    responsibilities: [
      "Plan, script, and produce content across video, blog, and social",
      "Collaborate with designers to create on-brand visuals",
      "Analyze engagement metrics and iterate on content strategy",
      "Research topics and maintain content calendars",
    ],
    minQualifications: [
      "Strong writing or video production skills",
      "Comfort with social media platforms and analytics",
    ],
    perks: [
      "Certificate and LoR",
      "Mentorship from marketing team",
      "Editorial and storytelling workshops",
      "Hands-on experience with brand content and analytics",
      "Portfolio-building guidance",
    ],
    team: "Marketing",
    startingDate: "Immediate",
    minDuration: "6M",
    expectedStipend: "Unpaid (learning-focused)",
    applicationDeadline: "2025-10-03",
    status: "expired",
    postedDate: "2025-09-25",
    whoCanApply: "Aspiring content creators and social media enthusiasts",
    skills: ["Writing", "Video", "Social Media"],
    slug: "content-creator-intern",
  },
  {
    id: 8,
    title: "Business Analyst Intern",
    company: "CyberDude Networks Pvt. Ltd.",
    location: "Chennai, India",
    type: "internship",
    openings: 1,
    workMode: "Hybrid",
    description:
      "Analyze requirements, map processes, and support product decision-making.",
    overview:
      "Collaborate with stakeholders to capture requirements and improve processes.",
    responsibilities: [
      "Document requirements, user stories, and acceptance criteria",
      "Map AS-IS/TO-BE processes and identify gaps",
      "Support stakeholder workshops, demos, and UAT",
      "Assist in creating reports and product documentation",
    ],
    minQualifications: [
      "Strong communication and facilitation skills",
      "Analytical mindset and structured thinking",
      "Basic understanding of SDLC and requirements management",
    ],
    perks: [
      "Certificate and LoR",
      "Mentorship from product managers",
      "Process mapping and requirements workshops",
      "Exposure to real stakeholder interactions",
      "Career guidance and mock interviews",
    ],
    team: "Product",
    startingDate: "Immediate",
    minDuration: "6M",
    expectedStipend: "Unpaid (learning-focused)",
    applicationDeadline: "2025-10-03",
    status: "open",
    postedDate: "2025-09-25",
    whoCanApply: "Students and fresh graduates interested in business analysis",
    skills: ["Requirements", "Process Mapping", "Communication"],
    slug: "business-analyst-intern",
  },
  {
    id: 9,
    title: "HR Intern",
    company: "CyberDude Networks Pvt. Ltd.",
    location: "Chennai, India",
    type: "internship",
    openings: 1,
    workMode: "Hybrid",
    description:
      "Support HR operations: maintain employee records, assist recruitment and onboarding, and run people research initiatives.",
    overview:
      "Work closely with the HR team to manage day-to-day employee operations while conducting research on HR best practices, engagement programs, and process improvements.",
    responsibilities: [
      "Maintain and organize employee records (HRIS)",
      "Assist in recruitment: sourcing, screening, scheduling",
      "Coordinate onboarding and exit formalities",
      "Draft and update HR policies and documentation",
      "Run research on HR trends and engagement initiatives",
      "Support performance review cycles and feedback collection",
      "Prepare HR reports using Excel/Sheets",
      "Assist with compliance documentation as guided",
      "Plan and support employee engagement activities and surveys",
      "Collaborate with cross-functional teams for people ops projects",
    ],
    minQualifications: [
      "Strong communication and interpersonal skills",
      "Excellent organizational skills and attention to detail",
      "Proficiency in MS Excel/Google Sheets",
      "Basic understanding of HR concepts",
    ],
    preferredQualifications: [
      "Familiarity with Indian labor laws",
      "Experience with HR tools (HRIS/ATS)",
      "Prior internship or campus HR experience",
    ],
    perks: [
      "Certificate and LoR",
      "Mentorship with experienced HR professionals",
      "Hands-on exposure to recruitment and HR operations",
      "Workshops on HR analytics and policy drafting",
      "Career coaching and resume reviews",
    ],
    team: "Human Resources",
    startingDate: "Immediate",
    minDuration: "6M",
    expectedStipend: "Unpaid (learning-focused)",
    applicationDeadline: "2025-10-03",
    status: "open",
    postedDate: "2025-09-25",
    whoCanApply:
      "Students or fresh graduates interested in HR, people ops, and research",
    skills: [
      "HRIS",
      "Recruitment",
      "Onboarding",
      "People Operations",
      "Research",
      "Excel/Sheets",
      "Documentation",
      "Communication",
    ],
    slug: "hr-intern",
  },
];

export function getJobsByType(type: JobType): Job[] {
  return jobs.filter((j) => j.type === type);
}

export function getJobBySlug(slug: string): Job | undefined {
  return jobs.find((j) => j.slug === slug);
}
