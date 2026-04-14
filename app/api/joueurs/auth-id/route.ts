import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { requireCoach } from '@/lib/auth-server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Retrouve et enregistre l'auth_id d'un joueur à partir de son email
export async function GET(req: Request) {
  const auth = await requireCoach()
  if ('error' in auth) return auth.error
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  if (!email) return NextResponse.json({ error: 'email requis' }, { status: 400 })

  const { data: { users } } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 })
  const authUser = users.find(u => u.email === email)
  if (!authUser) return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })

  // Met à jour auth_id dans la table joueurs
  await supabaseAdmin.from('joueurs').update({ auth_id: authUser.id }).eq('email', email).is('auth_id', null)

  return NextResponse.json({ auth_id: authUser.id })
}
