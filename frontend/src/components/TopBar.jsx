import { Phone, Mail, Clock } from 'lucide-react';

export default function TopBar() {
  return (
    <div className="sticky top-0 z-40 bg-navy-800/80 backdrop-blur-md border-b border-white/10 text-sm py-2 px-6 flex flex-wrap items-center justify-between text-gray-300">
      <div className="flex items-center gap-6">
        <span className="flex items-center gap-2">
          <Phone size={14} className="text-neon-purple" />
          <a href="tel:+1234567890" className="hover:text-neon-blue transition">+1 (234) 567-890</a>
        </span>
        <span className="flex items-center gap-2">
          <Mail size={14} className="text-neon-purple" />
          <a href="mailto:info@vcintel.com" className="hover:text-neon-blue transition">info@vcintel.com</a>
        </span>
        <span className="hidden md:flex items-center gap-2">
          <Clock size={14} className="text-neon-purple" />
          <span>Mon–Fri 9am–6pm</span>
        </span>
      </div>
      <div className="flex gap-4">
        <a href="#" className="hover:text-neon-purple transition">LinkedIn</a>
        <a href="#" className="hover:text-neon-purple transition">Twitter</a>
      </div>
    </div>
  );
}