
import { Certification, CertificationCategories } from './types';

export const CERTIFICATION_DATA: Certification[] = [
  // Cloud Computing
  { id: "aws-cda", name: "AWS Certified Developer - Associate", provider: "Amazon Web Services", icon: "☁️", category: "cloud", description: "Learn to develop and maintain applications on AWS. Focuses on core AWS services, uses, and basic architecture.", difficulty: "Intermediate", duration: "2-3 months", rating: 4.7, reviewCount: 12500 },
  { id: "aws-csa", name: "AWS Certified Solutions Architect - Associate", provider: "Amazon Web Services", icon: "☁️", category: "cloud", description: "Demonstrates knowledge of how to architect and deploy secure and robust applications on AWS technologies.", difficulty: "Intermediate", duration: "3-4 months", rating: 4.8, reviewCount: 25000 },
  { id: "gcp-ace", name: "Google Associate Cloud Engineer", provider: "Google Cloud", icon: "☁️", category: "cloud", description: "Deploy applications, monitor operations, and manage enterprise solutions on Google Cloud.", difficulty: "Beginner", duration: "1-2 months", rating: 4.6, reviewCount: 9800 },
  { id: "azure-az900", name: "Microsoft Certified: Azure Fundamentals", provider: "Microsoft Azure", icon: "☁️", category: "cloud", description: "Foundational knowledge of cloud concepts and how those concepts are implemented on Microsoft Azure.", difficulty: "Beginner", duration: "1 month", rating: 4.5, reviewCount: 18000 },

  // Data Science & ML
  { id: "gcp-dve", name: "Google Data Analytics Professional Certificate", provider: "Google", icon: "📊", category: "data", description: "Gain an immersive understanding of the practices and processes used by a junior or associate data analyst.", difficulty: "Beginner", duration: "6 months", rating: 4.8, reviewCount: 110000 },
  { id: "ibm-ds", name: "IBM Data Science Professional Certificate", provider: "IBM", icon: "📊", category: "data", description: "Build data science skills, learn Python and SQL, analyze and visualize data, build machine learning models.", difficulty: "Beginner", duration: "5 months", rating: 4.6, reviewCount: 65000 },
  { id: "tf-dev", name: "TensorFlow Developer Certificate", provider: "Google", icon: "🤖", category: "data", description: "Demonstrate your proficiency in using TensorFlow to solve deep learning and ML problems.", difficulty: "Intermediate", duration: "3-4 months", rating: 4.7, reviewCount: 4500 },
  
  // Cybersecurity
  { id: "comptia-sec+", name: "CompTIA Security+", provider: "CompTIA", icon: "🔒", category: "security", description: "A global certification that validates the baseline skills necessary to perform core security functions.", difficulty: "Intermediate", duration: "2-3 months", rating: 4.7, reviewCount: 35000 },
  { id: "isc2-cc", name: "Certified in Cybersecurity (CC)", provider: "(ISC)²", icon: "🔒", category: "security", description: "Ideal for IT professionals, career changers and students looking to prove their knowledge in cybersecurity.", difficulty: "Beginner", duration: "1-2 months", rating: 4.6, reviewCount: 8000 },
  { id: "g-cyber", name: "Google Cybersecurity Professional Certificate", provider: "Google", icon: "🔒", category: "security", description: "Learn job-ready skills that are in demand, like how to identify common risks, threats, and vulnerabilities.", difficulty: "Beginner", duration: "6 months", rating: 4.8, reviewCount: 55000 },

  // Project Management & UX
  { id: "g-pm", name: "Google Project Management Professional Certificate", provider: "Google", icon: "📈", category: "pm_ux", description: "Kickstart your career in project management. Build your skills in initiating, planning, and running projects.", difficulty: "Beginner", duration: "5 months", rating: 4.8, reviewCount: 95000 },
  { id: "g-ux", name: "Google UX Design Professional Certificate", provider: "Google", icon: "🎨", category: "pm_ux", description: "Learn the foundations of UX design, including empathizing with users, building wireframes and prototypes.", difficulty: "Beginner", duration: "6 months", rating: 4.8, reviewCount: 82000 },
  { id: "psm-i", name: "Professional Scrum Master I (PSM I)", provider: "Scrum.org", icon: "📈", category: "pm_ux", description: "Demonstrate a fundamental level of Scrum mastery, understanding of Scrum as described in the Scrum Guide.", difficulty: "Intermediate", duration: "1 month", rating: 4.7, reviewCount: 21000 },
];

export const CERTIFICATION_CATEGORIES: CertificationCategories = {
    cloud: { name: 'Cloud Computing', icon: '☁️' },
    data: { name: 'Data & Machine Learning', icon: '📊' },
    security: { name: 'Cybersecurity', icon: '🔒' },
    pm_ux: { name: 'Project Management & UX', icon: '🎨' },
};
