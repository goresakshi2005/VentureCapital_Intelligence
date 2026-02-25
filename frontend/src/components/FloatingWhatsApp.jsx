import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/1234567890"
      target="_blank"
      rel="noopener noreferrer"
      className="floating-btn"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={28} className="text-white" />
    </a>
  );
}