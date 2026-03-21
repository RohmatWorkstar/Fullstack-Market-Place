'use client';

import { useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Alert } from '@/components/ui/EmptyState';
import { useLanguageStore } from '@/stores/language-store';
import { dictionaries } from '@/lib/i18n/dictionaries';
import { useEffect } from 'react';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { language } = useLanguageStore();

  useEffect(() => setMounted(true), []);
  const tContact = mounted ? dictionaries[language].contact : dictionaries.en.contact;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    // Simulate network request
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="container-custom py-16 animate-fade-in">
      <div className="max-w-xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold text-surface-900 tracking-tight mb-4">{tContact.title}</h1>
        <p className="text-lg text-surface-600">
          {tContact.subtitle}
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-12 max-w-6xl mx-auto">
        {/* Contact Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass rounded-3xl p-8 space-y-8">
            <h3 className="text-xl font-bold text-surface-900">{tContact.contactInfo}</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-surface-900">{tContact.email}</p>
                  <p className="text-surface-500">support@marketplace.com</p>
                  <p className="text-surface-500">sellers@marketplace.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-surface-900">{tContact.phone}</p>
                  <p className="text-surface-500">+1 (555) 123-4567</p>
                  <p className="text-xs text-surface-400 mt-1">Mon-Fri from 8am to 5pm.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-surface-900">{tContact.headquarters}</p>
                  <p className="text-surface-500">123 Tech Boulevard<br/>Suite 400<br/>San Francisco, CA 94107</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-3">
          <div className="glass rounded-3xl p-8 sm:p-10">
            {success ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto mb-6">
                  <Send className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-surface-900 mb-2">{tContact.messageSent}</h3>
                <p className="text-surface-600 mb-8">
                  {tContact.messageDesc}
                </p>
                <Button onClick={() => setSuccess(false)} variant="outline">
                  {tContact.sendAnother}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input label={tContact.firstName} placeholder="Jane" required disabled={loading} />
                  <Input label={tContact.lastName} placeholder="Doe" required disabled={loading} />
                </div>
                
                <Input type="email" label={tContact.email} placeholder="jane@example.com" required disabled={loading} />
                
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-surface-700">{tContact.message}</label>
                  <textarea
                    className="input-base min-h-[150px] resize-y"
                    placeholder="How can we help you today?"
                    required
                    disabled={loading}
                  />
                </div>
                
                <Button type="submit" size="lg" className="w-full sm:w-auto" loading={loading}>
                  {tContact.sendMessage}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
