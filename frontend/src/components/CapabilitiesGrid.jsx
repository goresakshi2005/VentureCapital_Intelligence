import {
  Cpu,
  Brain,
  BarChart3,
  Globe,
  Users,
  HeartHandshake,
} from 'lucide-react';
import CapabilityCard from './CapabilityCard';

const capabilities = [
  {
    icon: Cpu,
    title: 'Enterprise Software Engineering',
    description:
      'Scalable, secure, and resilient systems built with modern architectures and best-in-class engineering practices.',
  },
  {
    icon: Brain,
    title: 'AI & Automation Systems',
    description:
      'Building predictive models, intelligent workflows, and data-driven automation engines for operational efficiency.',
  },
  {
    icon: BarChart3,
    title: 'Advanced Data Intelligence',
    description:
      'Transforming raw enterprise data into actionable insights through dashboards, analytics frameworks, and reporting systems.',
  },
  {
    icon: Globe,
    title: 'Digital Growth Infrastructure',
    description:
      'Structured SEO, content architecture, and performance analytics systems that support scalable digital expansion.',
  },
  {
    icon: Users,
    title: 'Technical Talent Development',
    description:
      'Building industry-ready professionals through practical engineering training and applied technology programs.',
  },
  {
    icon: HeartHandshake,
    title: 'Digital Inclusion & Rural Innovation',
    description:
      'Enabling technology adoption across emerging ecosystems through scalable digital platforms and innovation initiatives.',
  },
];

export default function CapabilitiesGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {capabilities.map((cap, idx) => (
          <CapabilityCard key={idx} {...cap} />
        ))}
      </div>
    </section>
  );
}