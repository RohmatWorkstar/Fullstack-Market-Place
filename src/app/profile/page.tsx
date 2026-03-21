'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X, Loader2, Save, User } from 'lucide-react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Alert } from '@/components/ui/EmptyState';
import type { Profile } from '@/lib/types';
import { useLanguageStore } from '@/stores/language-store';
import { dictionaries } from '@/lib/i18n/dictionaries';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  const { language } = useLanguageStore();

  useEffect(() => {
    setMounted(true);
    async function loadProfile() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile(data);
        setFullName(data.full_name || '');
        setAvatarUrl(data.avatar_url || '');
      }
      setLoading(false);
    }

    loadProfile();
  }, [router]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (uploading || saving) return;
    
    try {
      setUploading(true);
      setMessage({ type: '', text: '' });
      const file = e.target.files?.[0];
      if (!file) return;

      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setAvatarUrl(data.publicUrl);
    } catch (error: any) {
      console.error('Error uploading image:', error);
      setMessage({ type: 'error', text: 'Failed to upload image' });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving || uploading) return;
    
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          avatar_url: avatarUrl,
        })
        .eq('id', user.id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      router.refresh(); // Refresh layout to update navbar
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const tProfile = mounted ? dictionaries[language].profile : dictionaries.en.profile;
  const tCommon = mounted ? dictionaries[language].common : dictionaries.en.common;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="container-custom max-w-3xl py-12 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-900 dark:text-surface-50">{tProfile.title}</h1>
        <p className="text-surface-500 dark:text-surface-300 mt-2">Manage your personal information and preferences.</p>
      </div>

      <div className="glass p-8 rounded-3xl">
        {message.text && (
          <Alert variant={message.type === 'error' ? 'error' : 'success'} className="mb-6">
            {message.text}
          </Alert>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row items-start gap-6 pb-8 border-b border-surface-200 dark:border-surface-800">
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-surface-100 dark:bg-surface-800 border-4 border-white dark:border-surface-700 shadow-lg flex-shrink-0 group">
              {avatarUrl ? (
                <>
                  <Image src={avatarUrl} alt="Avatar" fill sizes="128px" className="object-cover" />
                  <button
                    type="button"
                    onClick={() => setAvatarUrl('')}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </>
              ) : uploading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-surface-400 dark:text-surface-600">
                  <User className="w-12 h-12" />
                </div>
              )}
            </div>
            
            <div className="space-y-3 pt-2">
              <h3 className="text-lg font-medium text-surface-900 dark:text-surface-50">{tProfile.profilePic}</h3>
              <div className="inline-block">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || saving}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Change Picture
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading || saving}
                />
              </div>
              <p className="text-sm text-surface-500 dark:text-surface-300">
                JPG, PNG or WEBP. Max size of 5MB.
              </p>
            </div>
          </div>

          {/* User Info Section */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label={tProfile.fullName}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={saving}
              />
              
              <Input
                label={tProfile.role}
                value={profile?.role || ''}
                disabled
                className="capitalize bg-surface-50 dark:bg-surface-900/50 text-surface-500 dark:text-surface-300"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" loading={saving || uploading} size="lg">
              <Save className="w-4 h-4 mr-2" />
              {tCommon.save}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
