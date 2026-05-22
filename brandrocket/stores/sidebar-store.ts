import { create } from 'zustand'

interface SidebarState {
  isOpen: boolean
  isCollapsed: boolean
  toggle: () => void
  setOpen: (open: boolean) => void
  setCollapsed: (collapsed: boolean) => void
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: true,
  isCollapsed: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setOpen: (open) => set({ isOpen: open }),
  setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
}))
