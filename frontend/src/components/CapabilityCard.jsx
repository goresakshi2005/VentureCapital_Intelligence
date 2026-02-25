import { motion } from 'framer-motion';

export default function CapabilityCard({ icon: Icon, title, description }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="glass-card rounded-2xl p-6 group cursor-pointer"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-xl bg-neon-purple/10 text-neon-purple group-hover:text-neon-blue transition-colors">
          <Icon size={24} />
        </div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
      </div>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
      <div className="mt-4 neon-line opacity-50 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}