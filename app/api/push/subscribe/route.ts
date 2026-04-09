import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const { subscription, user_id } = await req.json()
  if (!subscription || !user_id) return NextResponse.json({ error: 'missing params' }, { status: 400 })

  // Upsert : un seul abonnement par user (on remplace l'ancien)
  await supabaseAdmin.from('push_subscriptions')
    .upsert({ user_id, subscription }, { onConflict: 'user_id' })

  return NextResponse.json({ ok: true })
}
