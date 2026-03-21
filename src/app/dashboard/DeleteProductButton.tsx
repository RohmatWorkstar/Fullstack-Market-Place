'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { toast } from '@/stores/toast-store';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/Modal';

export default function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (loading) return;
    setLoading(true);
    const supabase = createClient();
    
    // Deleting the product will cascade delete cart_items and order_items connected to it based on our schema.
    await supabase.from('products').delete().eq('id', id);
    
    toast.success('Product deleted successfully');
    setLoading(false);
    setIsOpen(false);
    router.refresh();
  };

  return (
    <>
      <Button 
        variant="ghost" 
        size="sm" 
        className="w-8 h-8 p-0 rounded-lg hover:bg-red-50 hover:text-red-600"
        onClick={() => setIsOpen(true)}
      >
        <Trash2 className="w-4 h-4" />
      </Button>

      <ConfirmModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${name}"? This action cannot be undone.`}
        confirmText="Delete"
        loading={loading}
      />
    </>
  );
}
