import { createOpenRouter } from '@openrouter/ai-sdk-provider'

import { AI_MODELS } from '@/lib/constants'

// Centralized AI provider configuration
// This makes it easy to switch models or add fallbacks later
export const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || '',
})

// Export the default model configuration
export const defaultModel = openrouter(AI_MODELS.DEFAULT)

// Export alternatives if needed for specific tasks
export const getModel = (modelId: string) => openrouter(modelId)
