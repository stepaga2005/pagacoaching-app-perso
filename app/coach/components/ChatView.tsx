'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { subscribePush, sendPush } from '@/lib/push'
import { MsgType } from '../lib/types'

export function ChatView({ myId, otherId, height = 'calc(100vh - 220px)' }: { myId: string; otherId: string; height?: string }) {
  const [msgs, setMsgs] = useState<MsgType[]>([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [uploading, setUploading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    load()
    markRead()
    subscribePush(myId)
    const interval = setInterval(() => { load(); markRead() }, 3000)
    return () => clearInterval(interval)
  }, [myId, otherId])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])

  async function load() {
    const { data } = await supabase.from('messages').select('*')
      .or(`expediteur_id.eq.${myId},destinataire_id.eq.${myId}`)
      .order('created_at')
    if (data) {
      setMsgs(data.filter(m =>
        (m.expediteur_id === myId && m.destinataire_id === otherId) ||
        (m.expediteur_id === otherId && m.destinataire_id === myId)
      ))
    }
  }

  async function markRead() {
    await supabase.from('messages').update({ lu: true })
      .eq('expediteur_id', otherId).eq('destinataire_id', myId).neq('lu', true)
  }

  async function send() {
    const t = text.trim()
    if (!t || sending) return
    setSending(true)
    setText('')
    const { data: newMsg } = await supabase.from('messages')
      .insert({ expediteur_id: myId, destinataire_id: otherId, contenu: t })
      .select().single()
    if (newMsg) {
      setMsgs(prev => prev.find(m => m.id === newMsg.id) ? prev : [...prev, newMsg])
      sendPush(otherId, 'Message de votre coach', t, '/joueur')
    }
    setSending(false)
  }

  async function uploadMedia(file: File) {
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${myId}/${Date.now()}.${ext}`
    const { data, error } = await supabase.storage.from('messages').upload(path, file)
    if (error) {
      setUploading(false)
      return
    }
    if (data) {
      const { data: { publicUrl } } = supabase.storage.from('messages').getPublicUrl(path)
      const type: 'image' | 'video' = file.type.startsWith('image/') ? 'image' : 'video'
      await supabase.from('messages').insert({ expediteur_id: myId, destinataire_id: otherId, media_url: publicUrl, media_type: type })
      await load()
    }
    setUploading(false)
  }

  const fmtTime = (d: string) => new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })

  let lastDate = ''

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height }}>
      <input ref={fileRef} type="file" accept="image/*,video/*" style={{ display: 'none' }}
        onChange={e => { if (e.target.files?.[0]) uploadMedia(e.target.files[0]); e.target.value = '' }} />

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {msgs.length === 0 && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6A6A8A', fontSize: '13px' }}>
            Aucun message — commencez la conversation
          </div>
        )}
        {msgs.map(m => {
          const isMe = m.expediteur_id === myId
          const d = m.created_at.split('T')[0]
          const showDate = d !== lastDate
          lastDate = d
          return (
            <div key={m.id}>
              {showDate && (
                <div style={{ textAlign: 'center', margin: '12px 0 8px', color: '#6A6A8A', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {fmtDate(m.created_at)}
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', marginBottom: '2px' }}>
                <div style={{
                  maxWidth: '72%',
                  background: isMe ? '#1A6FFF' : '#1E1E1E',
                  borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  padding: m.media_url ? '6px' : '10px 14px',
                  position: 'relative',
                }}>
                  {m.media_url && m.media_type === 'image' && (
                    <img src={m.media_url} alt="" style={{ maxWidth: '260px', maxHeight: '300px', borderRadius: '12px', display: 'block', objectFit: 'cover' }} />
                  )}
                  {m.media_url && m.media_type === 'video' && (
                    <video src={m.media_url} controls style={{ maxWidth: '260px', borderRadius: '12px', display: 'block' }} />
                  )}
                  {m.contenu && (
                    <div style={{ fontSize: '14px', color: '#FFF', lineHeight: 1.5, wordBreak: 'break-word' }}>{m.contenu}</div>
                  )}
                  <div style={{ fontSize: '10px', color: isMe ? '#FFFFFF80' : '#555', marginTop: m.media_url ? '4px' : '3px', textAlign: isMe ? 'right' : 'left', paddingTop: m.media_url ? '2px' : 0 }}>
                    {fmtTime(m.created_at)}{isMe && (m.lu ? ' ✓✓' : ' ✓')}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid #1E1E30', display: 'flex', gap: '8px', alignItems: 'flex-end', background: '#141420' }}>
        <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{
          flexShrink: 0, width: '40px', height: '40px', borderRadius: '12px',
          background: '#212135', border: '1px solid #2C2C44', color: uploading ? '#333' : '#888',
          cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {uploading ? '⏳' : '📎'}
        </button>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={e => { setText(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px' }}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
          placeholder="Message..."
          rows={1}
          style={{
            flex: 1, background: '#212135', border: '1px solid #2C2C44', borderRadius: '14px',
            padding: '10px 14px', color: '#FFF', fontSize: '14px', outline: 'none',
            resize: 'none', maxHeight: '120px', lineHeight: 1.5, fontFamily: 'inherit',
          }}
        />
        <button onClick={send} disabled={sending || !text.trim()} style={{
          flexShrink: 0, width: '40px', height: '40px', borderRadius: '12px',
          background: text.trim() ? '#1A6FFF' : '#18182A', border: 'none',
          color: text.trim() ? '#FFF' : '#333', cursor: text.trim() ? 'pointer' : 'default', fontSize: '18px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
        }}>
          ↑
        </button>
      </div>
    </div>
  )
}

