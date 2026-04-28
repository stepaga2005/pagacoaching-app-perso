import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const auth = await requireAuth()
  if ('error' in auth) return auth.error
  const { subscription } = await req.json()
  if (!subscription) return NextResponse.json({ error: 'missing params' }, { status: 400 })

  // Upsert : un seul abonnement par user (on remplace l'ancien)
  // user_id vient de la session serveur, jamais du body
  await supabaseAdmin.from('push_subscriptions')
    .upsert({ user_id: auth.user.id, subscription }, { onConflict: 'user_id' })

  return NextResponse.json({ ok: true })
}
