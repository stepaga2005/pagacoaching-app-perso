import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const coachEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
  if (!coachEmail) return NextResponse.json({ error: 'NEXT_PUBLIC_ADMIN_EMAIL not set' }, { status: 500 })

  const { data: { users } } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 })
  const coach = users.find(u => u.email === coachEmail)
  if (!coach) return NextResponse.json({ error: 'Coach not found' }, { status: 404 })

  return NextResponse.json({ coach_id: coach.id })
}
