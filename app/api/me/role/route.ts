import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-server'

export async function GET() {
  const auth = await requireAuth()
  if ('error' in auth) return auth.error
  const role = process.env.ADMIN_EMAIL && auth.user.email === process.env.ADMIN_EMAIL ? 'coach' : 'joueur'
  return NextResponse.json({ role })
}
