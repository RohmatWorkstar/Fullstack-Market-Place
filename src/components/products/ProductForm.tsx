'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Upload, X, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { CATEGORIES } from '@/lib/types';
import type { Product } from '@/lib/types';

interface ProductFormProps {
  initialData?: Product;
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [price, setPrice] = useState(initialData?.price?.toString() || '');
  const [category, setCategory] = useState(initialData?.category || CATEGORIES[0]);
  const [stock, setStock] = useState(initialData?.stock?.toString() || '1');
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || '');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (uploading || loading) return;
    try {
      setUploading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setImageUrl(data.publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image!');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || uploading) return;
    setLoading(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Not authenticated');

      const productData = {
        name,
        description,
        price: parseInt(price, 10),
        category,
        stock: parseInt(stock, 10),
        image_url: imageUrl,
        seller_id: user.id,
      };

      if (initialData) {
        // Update
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', initialData.id);
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('products')
          .insert(productData);
        if (error) throw error;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 glass p-6 sm:p-8 rounded-3xl animate-fade-in max-w-3xl">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-surface-900 mb-4">Product Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
              <Input
                label="Product Name"
                placeholder="e.g. Minimalist Desk Lamp"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <Input
                label="Price (IDR)"
                type="number"
                placeholder="e.g. 150000"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div>
              <Input
                label="Stock Quantity"
                type="number"
                placeholder="e.g. 10"
                min="0"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>

            <div className="col-span-1 md:col-span-2 space-y-1.5">
              <label className="block text-sm font-medium text-surface-700">Category</label>
              <select
                className="input-base cursor-pointer"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="col-span-1 md:col-span-2 space-y-1.5">
              <label className="block text-sm font-medium text-surface-700">Description</label>
              <textarea
                className="input-base min-h-[120px] resize-y"
                placeholder="Describe your product..."
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-surface-200">
          <h3 className="text-lg font-medium text-surface-900 mb-4">Product Image</h3>
          
          <div className="flex items-start gap-6">
            <div className="w-32 h-32 flex-shrink-0 bg-surface-100 rounded-2xl border-2 border-dashed border-surface-300 flex items-center justify-center relative overflow-hidden group">
              {imageUrl ? (
                <>
                  <Image src={imageUrl} alt="Preview" fill sizes="128px" className="object-cover" />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </>
              ) : uploading ? (
                <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
              ) : (
                <div className="text-center p-4">
                  <Upload className="w-6 h-6 text-surface-400 mx-auto mb-1" />
                  <span className="text-xs text-surface-500 font-medium whitespace-nowrap">Upload Image</span>
                </div>
              )}
            </div>

            <div className="flex-grow space-y-3 pt-2">
              <div className="inline-block">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  Choose File
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </div>
              <p className="text-sm text-surface-500">
                Recommended size: 800x600px. Max size: 5MB.<br/>
                Supported formats: JPG, PNG, WEBP.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-surface-200 flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" loading={loading || uploading}>
          {initialData ? 'Save Changes' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}
