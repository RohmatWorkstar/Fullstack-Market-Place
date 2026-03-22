import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';
import { snap } from '@/lib/midtrans';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Midtrans sends notification
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status
    } = body;

    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
    
    // Verify signature to ensure it's from Midtrans
    const hash = crypto.createHash('sha512').update(`${order_id}${status_code}${gross_amount}${serverKey}`).digest('hex');
    if (hash !== signature_key) {
      return NextResponse.json({ error: 'Invalid signature key' }, { status: 403 });
    }

    // Our order ID was prefixed with TRX- and appended with timestamp like TRX-realId-123456
    // We need to extract the real UUID if we used that format
    let realOrderId = order_id;
    if (order_id.startsWith('TRX-')) {
      const parts = order_id.split('-');
      // format: TRX - uuid_part1 - uuid_part2 - uuid_part3 - uuid_part4 - uuid_part5 - timestamp
      if (parts.length >= 7) {
         realOrderId = parts.slice(1, parts.length - 1).join('-');
      }
    }

    let orderStatus = 'pending';

    if (transaction_status == 'capture') {
        if (fraud_status == 'accept') {
            orderStatus = 'paid';
        }
    } else if (transaction_status == 'settlement') {
        orderStatus = 'paid';
    } else if (transaction_status == 'cancel' ||
      transaction_status == 'deny' ||
      transaction_status == 'expire') {
        orderStatus = 'cancelled';
    } else if (transaction_status == 'pending') {
        orderStatus = 'pending';
    }

    if (orderStatus !== 'pending') {
        const supabase = await createClient();
        
        // Update order status in Supabase
        // Note: this uses service role internally or we need to bypass RLS 
        // because webhooks have no user session.
        // Wait, createClient in Next.js App Router usually uses cookies.
        // Webhooks don't have cookies!
        // We MUST use the Supabase Admin client or a Service Role Key to bypass RLS!
        
        const supabaseAdmin = require('@supabase/supabase-js').createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY! // Oops! We might not have this in .env.local yet!
        );

        await supabaseAdmin
          .from('orders')
          .update({
            status: orderStatus,
            payment_id: order_id // save Midtrans order_id
          })
          .eq('id', realOrderId);
    }

    return NextResponse.json({ status: 'success' });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
