import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const { nom, prenom, email, password, poste, niveau, club, acces_debut, acces_fin, groupe_id, coach_id } = await req.json()

  const profil = {
    nom,
    prenom,
    poste: poste || null,
    niveau: niveau || null,
    club: club || null,
    acces_debut: acces_debut || null,
    acces_fin: acces_fin || null,
    groupe_id: groupe_id || null,
    coach_id: coach_id || null,
    actif: true,
  }

  // Vérifie si un compte Auth existe déjà pour cet email
  const { data: { users } } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 })
  const existingAuthUser = users.find(u => u.email === email)

  if (existingAuthUser) {
    // Compte Auth existant : met à jour le mot de passe si fourni
    if (password) {
      await supabaseAdmin.auth.admin.updateUserById(existingAuthUser.id, { password })
    }

    // Upsert du profil joueur (réactive le compte + met à jour les infos)
    const { data: existing } = await supabaseAdmin.from('joueurs').select('id').eq('email', email).single()
    if (existing) {
      await supabaseAdmin.from('joueurs').update(profil).eq('id', existing.id)
    } else {
      await supabaseAdmin.from('joueurs').insert({ ...profil, email })
    }

    return NextResponse.json({ success: true, reactivated: true })
  }

  // Nouveau joueur : crée le compte Auth
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 })
  }

  // Crée le profil joueur
  const { error: dbError } = await supabaseAdmin.from('joueurs').insert({ ...profil, email, auth_id: authData.user.id })

  if (dbError) {
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
    return NextResponse.json({ error: dbError.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
