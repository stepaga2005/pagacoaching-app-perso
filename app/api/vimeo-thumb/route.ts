import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id || !/^\d+$/.test(id)) {
    return NextResponse.json({ url: '' }, { status: 400 })
  }

  try {
    const res = await fetch(`https://vimeo.com/api/v2/video/${id}.json`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 86400 }, // cache 24h
    })
    if (!res.ok) return NextResponse.json({ url: '' }, { status: 404 })

    const data = await res.json() as Array<{ thumbnail_large?: string; thumbnail_medium?: string }>
    const url = data[0]?.thumbnail_large || data[0]?.thumbnail_medium || ''
    return NextResponse.json({ url }, {
      headers: { 'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800' },
    })
  } catch {
    return NextResponse.json({ url: '' }, { status: 500 })
  }
}
