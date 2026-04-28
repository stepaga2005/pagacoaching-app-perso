import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  // Accepte Bearer token (login page) ou cookie (routes internes)
  const authHeader = req.headers.get('Authorization')
  let email: string | undefined

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7)
    const { data: { user } } = await supabaseAdmin.auth.getUser(token)
    if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    email = user.email
  } else {
    const auth = await requireAuth()
    if ('error' in auth) return auth.error
    email = auth.user.email
  }

  const role = process.env.ADMIN_EMAIL && email === process.env.ADMIN_EMAIL ? 'coach' : 'joueur'
  return NextResponse.json({ role })
}
