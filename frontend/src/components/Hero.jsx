export default function Hero() {
  return (
    <section className="text-center py-20 px-4">
      <span className="badge">CORE CAPABILITIES</span>
      <h1 className="text-4xl md:text-6xl font-bold mt-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
        Enterprise Technology Capabilities
      </h1>
      <div className="flex items-center justify-center gap-3 mt-6">
        <div className="w-16 h-px bg-neon-purple/50" />
        <div className="w-2 h-2 rounded-full bg-neon-blue" />
        <div className="w-16 h-px bg-neon-purple/50" />
      </div>
    </section>
  );
}