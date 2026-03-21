import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
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
      .select('*')
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.status === 'paid') {
      return NextResponse.json({ error: 'Order is already paid' }, { status: 400 });
    }

    // Simulate payment processing delay (2 seconds)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate 90% success rate
    const isSuccess = Math.random() > 0.1;

    if (!isSuccess) {
       return NextResponse.json({ error: 'Payment failed' }, { status: 400 });
    }

    // Update order status
    const paymentId = generatePaymentId();
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'paid',
        payment_id: paymentId
      })
      .eq('id', orderId);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, paymentId });
  } catch (error: any) {
    console.error('Payment error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
