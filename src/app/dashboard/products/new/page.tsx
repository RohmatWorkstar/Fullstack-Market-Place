import ProductForm from '@/components/products/ProductForm';

export default function NewProductPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Add New Product</h1>
        <p className="text-surface-500">Fill in the details to list an item.</p>
      </div>
      <ProductForm />
    </div>
  );
}
