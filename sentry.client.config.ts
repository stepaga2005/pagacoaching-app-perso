import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: process.env.NODE_ENV === 'production',

  // Capture 10% des transactions pour les performances (évite de saturer le quota gratuit)
  tracesSampleRate: 0.1,

  // Replay 1% des sessions normales, 100% si erreur
  replaysSessionSampleRate: 0.01,
  replaysOnErrorSampleRate: 1.0,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,   // masque les données sensibles
      blockAllMedia: true,
    }),
  ],
})
