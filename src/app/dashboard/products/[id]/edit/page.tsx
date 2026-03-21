import { notFound } from 'next/navigation';
import ProductForm from '@/components/products/ProductForm';
import { createClient } from '@/lib/supabase/server';

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return notFound();

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!product || product.seller_id !== user.id) {
    return notFound();
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Edit Product</h1>
        <p className="text-surface-500">Update your product details.</p>
      </div>
      <ProductForm initialData={product} />
    </div>
  );
}
