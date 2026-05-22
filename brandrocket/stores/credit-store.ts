import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CreditState {
  creditsUsed: number
  creditsTotal: number
  plan: 'Starter' | 'Pro' | 'Enterprise'
  addUsage: (amount: number) => void
  setCredits: (used: number, total: number) => void
  setPlan: (plan: 'Starter' | 'Pro' | 'Enterprise') => void
  isNearLimit: () => boolean
  isExhausted: () => boolean
}

// Optimistic local store for AI credits
export const useCreditStore = create<CreditState>()(
  persist(
    (set, get) => ({
      creditsUsed: 120, // Mock initial state
      creditsTotal: 500,
      plan: 'Pro',
      addUsage: (amount) => set((state) => ({ 
        creditsUsed: Math.min(state.creditsUsed + amount, state.creditsTotal) 
      })),
      setCredits: (used, total) => set({ creditsUsed: used, creditsTotal: total }),
      setPlan: (plan) => set({ plan }),
      isNearLimit: () => {
        const { creditsUsed, creditsTotal, plan } = get()
        if (plan === 'Enterprise') return false // Unlimited
        return (creditsUsed / creditsTotal) > 0.8
      },
      isExhausted: () => {
        const { creditsUsed, creditsTotal, plan } = get()
        if (plan === 'Enterprise') return false
        return creditsUsed >= creditsTotal
      }
    }),
    {
      name: 'brandrocket-credits',
    }
  )
)
