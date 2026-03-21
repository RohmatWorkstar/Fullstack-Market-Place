import { ShieldCheck, Truck, Users, Zap } from 'lucide-react';
import Translate from '@/components/Translate';

export default function AboutPage() {
  return (
    <div className="container-custom py-16 animate-fade-in space-y-24">
      {/* Hero */}
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-surface-900 dark:text-surface-50 tracking-tight">
          <Translate section="about" textKey="title" />
        </h1>
        <p className="text-lg text-surface-600 dark:text-surface-300 leading-relaxed">
          <Translate section="about" textKey="subtitle" />
        </p>
      </section>

      {/* Stats/Highlight */}
      <section className="glass rounded-3xl p-8 md:p-12 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-surface-200 dark:divide-surface-800">
          {[
            { label: 'Verified Sellers', value: '10k+' },
            { label: 'Happy Customers', value: '50k+' },
            { label: 'Products', value: '100k+' },
            { label: 'Countries', value: '25+' },
          ].map((stat) => (
            <div key={stat.label} className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-primary-600">{stat.value}</div>
              <div className="text-sm font-medium text-surface-500 dark:text-surface-300 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Values */}
      <section className="space-y-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-surface-900 dark:text-surface-50">Our Core Values</h2>
          <p className="mt-4 text-surface-500 dark:text-surface-300">The principles that guide everything we do.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
              title: <Translate section="about" textKey="security" />,
              description: <Translate section="about" textKey="securityDesc" />
            },
            {
              icon: <Zap className="w-6 h-6 text-amber-500" />,
              title: <Translate section="about" textKey="speed" />,
              description: <Translate section="about" textKey="speedDesc" />
            },
            {
              icon: <Users className="w-6 h-6 text-blue-500" />,
              title: <Translate section="about" textKey="vision" />,
              description: <Translate section="about" textKey="visionDesc" />
            },
            {
              icon: <Truck className="w-6 h-6 text-purple-500" />,
              title: <Translate section="about" textKey="community" />,
              description: <Translate section="about" textKey="communityDesc" />
            }
          ].map((value, i) => (
            <div key={i} className="bg-surface-50 dark:bg-surface-800/80 rounded-3xl p-6 border border-surface-100 dark:border-surface-700 hover-lift">
              <div className="w-12 h-12 rounded-2xl bg-surface-50 dark:bg-surface-900 shadow-sm flex items-center justify-center mb-6">
                {value.icon}
              </div>
              <h3 className="text-xl font-bold text-surface-900 dark:text-surface-50 mb-3">{value.title}</h3>
              <p className="text-surface-600 dark:text-surface-300 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
