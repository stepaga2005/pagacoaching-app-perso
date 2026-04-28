// Demande la permission et abonne l'utilisateur aux push notifications
export async function subscribePush(): Promise<void> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return

  try {
    const reg = await navigator.serviceWorker.ready
    const existing = await reg.pushManager.getSubscription()
    const sub = existing ?? await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!).buffer as ArrayBuffer
    })
    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription: sub.toJSON() })
    })
  } catch { /* permission refusée ou non supporté */ }
}

// Envoie une notification push à un utilisateur
export async function sendPush(toUserId: string, title: string, body: string, url: string): Promise<void> {
  try {
    await fetch('/api/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to_user_id: toUserId, title, body, url })
    })
  } catch { /* silencieux */ }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)))
}
