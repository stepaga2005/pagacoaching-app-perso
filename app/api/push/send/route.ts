import { createClient } from '@supabase/supabase-js'
import webpush from 'web-push'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

webpush.setVapidDetails(
  process.env.VAPID_MAILTO!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export async function POST(req: Request) {
  const { to_user_id, title, body, url } = await req.json()
  if (!to_user_id) return NextResponse.json({ error: 'missing to_user_id' }, { status: 400 })

  const { data } = await supabaseAdmin.from('push_subscriptions')
    .select('subscription').eq('user_id', to_user_id).single()

  if (!data?.subscription) return NextResponse.json({ ok: false, reason: 'no subscription' })

  try {
    await webpush.sendNotification(data.subscription, JSON.stringify({ title, body, url }))
    return NextResponse.json({ ok: true })
  } catch {
    // Subscription expirée — on la supprime
    await supabaseAdmin.from('push_subscriptions').delete().eq('user_id', to_user_id)
    return NextResponse.json({ ok: false, reason: 'expired' })
  }
}
