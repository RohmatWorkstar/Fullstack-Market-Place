import { ShieldCheck, Truck, Users, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container-custom py-16 animate-fade-in space-y-24">
      {/* Hero */}
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-surface-900 tracking-tight">
          Redefining the <span className="gradient-text">Marketplace</span> Experience
        </h1>
        <p className="text-lg text-surface-600 leading-relaxed">
          We believe in creating a seamless, secure, and beautiful platform that connects independent verified sellers with buyers across the globe. Our mission is to empower creators and provide a curated shopping experience.
        </p>
      </section>

      {/* Stats/Highlight */}
      <section className="glass rounded-3xl p-8 md:p-12 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-surface-200">
          {[
            { label: 'Verified Sellers', value: '10k+' },
            { label: 'Happy Customers', value: '50k+' },
            { label: 'Products', value: '100k+' },
            { label: 'Countries', value: '25+' },
          ].map((stat) => (
            <div key={stat.label} className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-primary-600">{stat.value}</div>
              <div className="text-sm font-medium text-surface-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Values */}
      <section className="space-y-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-surface-900">Our Core Values</h2>
          <p className="mt-4 text-surface-500">The principles that guide everything we do.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
              title: "Trust & Security",
              description: "Every seller is verified. Every transaction is protected."
            },
            {
              icon: <Zap className="w-6 h-6 text-amber-500" />,
              title: "Fast & Modern",
              description: "Built on the latest tech stack for lightning-fast performance."
            },
            {
              icon: <Users className="w-6 h-6 text-blue-500" />,
              title: "Community First",
              description: "We put our buyers and sellers at the center of our decisions."
            },
            {
              icon: <Truck className="w-6 h-6 text-purple-500" />,
              title: "Global Reach",
              description: "Connecting local creators with a worldwide audience."
            }
          ].map((value, i) => (
            <div key={i} className="bg-surface-50 rounded-3xl p-6 border border-surface-100 hover-lift">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6">
                {value.icon}
              </div>
              <h3 className="text-xl font-semibold text-surface-900 mb-3">{value.title}</h3>
              <p className="text-surface-600 leading-relaxed text-sm">{value.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
