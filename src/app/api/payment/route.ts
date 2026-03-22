import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { snap } from '@/lib/midtrans';
import { generatePaymentId } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId } = await request.json();

    if (!orderId) {
       return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // Verify order exists and belongs to user
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.status === 'paid') {
      return NextResponse.json({ error: 'Order is already paid' }, { status: 400 });
    }

    /* 
     * =========================================
     * 1) VERSI MIDTRANS INTEGRATION
     * =========================================
     * Uncomment kode di bawah ini jika ingin menggunakan Midtrans.
     * Pastikan MIDTRANS_SERVER_KEY di .env.local sudah diisi.
     */
    /*
    if (process.env.MIDTRANS_SERVER_KEY && !process.env.MIDTRANS_SERVER_KEY.includes('YOUR_SERVER_KEY')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      // Map order items for Midtrans
      const itemDetails = (order.order_items || []).map((item: any) => ({
        id: item.product_id,
        price: item.product_price,
        quantity: item.quantity,
        name: item.product_name.substring(0, 50) // Midtrans limits name length
      }));

      // Midtrans parameter
      const parameter = {
        // Use unique order ID to avoid Midtrans duplicate error if user retries
        transaction_details: {
          order_id: `TRX-${order.id}-${Date.now()}`,
          gross_amount: order.total
        },
        item_details: itemDetails,
        customer_details: {
          first_name: profile?.full_name || 'Customer',
          email: user.email || ''
        }
      };

      // Create Snap transaction token
      const transaction = await snap.createTransaction(parameter);
      return NextResponse.json({ success: true, snapToken: transaction.token });
    }
    */


    
    
    /* 
     * =========================================
     * 2) VERSI LOCAL DEV SIMULATION
     * =========================================
     * Simulasi delay dan sukses payment secara lokal.
     */
    
    // Simulate payment processing delay (2 seconds)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate 90% success rate
    const isSuccess = Math.random() > 0.1;

    if (!isSuccess) {
       return NextResponse.json({ error: 'Payment simulation failed (10% chance). Try again.' }, { status: 400 });
    }

    // Update order status directly to DB
    const paymentId = generatePaymentId();
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'paid',
        payment_id: paymentId
      })
      .eq('id', orderId);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, isLocalSimulation: true, paymentId });

  } catch (error: any) {
    console.error('Payment error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
