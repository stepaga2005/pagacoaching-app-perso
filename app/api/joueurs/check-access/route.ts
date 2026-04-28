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
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7)
    const { data: { user } } = await supabaseAdmin.auth.getUser(token)
    if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  } else {
    const auth = await requireAuth()
    if ('error' in auth) return auth.error
  }

  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  if (!email) return NextResponse.json({ error: 'email requis' }, { status: 400 })

  const { data: joueur } = await supabaseAdmin
    .from('joueurs')
    .select('actif, acces_debut, acces_fin')
    .eq('email', email)
    .single()

  if (!joueur || !joueur.actif) {
    return NextResponse.json({ allowed: false, reason: 'suspended' })
  }

  const now = new Date()
  if (joueur.acces_fin && new Date(joueur.acces_fin) < now) {
    return NextResponse.json({ allowed: false, reason: 'expired' })
  }
  if (joueur.acces_debut && new Date(joueur.acces_debut) > now) {
    return NextResponse.json({ allowed: false, reason: 'not_yet' })
  }

  return NextResponse.json({ allowed: true })
}
