import { sendGAEvent } from '@next/third-parties/google'

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-M3R01H2STR'

export const trackEvent = (action: string, category?: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && GA_MEASUREMENT_ID) {
    sendGAEvent('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}
