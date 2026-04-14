import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function getSessionUser() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {}, // read-only in route handlers
      },
    }
  )
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Retourne l'utilisateur ou une Response 401
export async function requireAuth(): Promise<{ user: { id: string; email?: string } } | { error: NextResponse }> {
  const user = await getSessionUser()
  if (!user) {
    return { error: NextResponse.json({ error: 'Non authentifié' }, { status: 401 }) }
  }
  return { user }
}

// Vérifie que l'appelant est le coach (email = NEXT_PUBLIC_ADMIN_EMAIL)
export async function requireCoach(): Promise<{ user: { id: string; email?: string } } | { error: NextResponse }> {
  const user = await getSessionUser()
  if (!user) {
    return { error: NextResponse.json({ error: 'Non authentifié' }, { status: 401 }) }
  }
  const coachEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
  if (coachEmail && user.email !== coachEmail) {
    return { error: NextResponse.json({ error: 'Accès réservé au coach' }, { status: 403 }) }
  }
  return { user }
}
