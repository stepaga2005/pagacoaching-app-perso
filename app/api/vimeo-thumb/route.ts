import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id || !/^\d+$/.test(id)) {
    return NextResponse.json({ url: '' }, { status: 400 })
  }

  try {
    // oEmbed — official endpoint, works for public + unlisted
    const res = await fetch(
      `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${id}&width=640`,
      { headers: { Accept: 'application/json' } }
    )
    if (!res.ok) return NextResponse.json({ url: '' }, { status: 404 })

    const data = await res.json() as { thumbnail_url?: string }
    const url = data.thumbnail_url || ''
    return NextResponse.json({ url }, {
      headers: { 'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800' },
    })
  } catch {
    return NextResponse.json({ url: '' }, { status: 500 })
  }
}
