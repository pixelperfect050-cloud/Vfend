import { create } from 'zustand'

export interface Workspace {
  id: string
  name: string
  slug: string
  logoUrl?: string
  createdAt: string
}

interface WorkspaceState {
  currentWorkspace: Workspace | null
  workspaces: Workspace[]
  setWorkspace: (workspace: Workspace) => void
  addWorkspace: (workspace: Workspace) => void
  setWorkspaces: (workspaces: Workspace[]) => void
  removeWorkspace: (id: string) => void
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  currentWorkspace: null,
  workspaces: [],
  setWorkspace: (workspace) => set({ currentWorkspace: workspace }),
  addWorkspace: (workspace) =>
    set((state) => ({ workspaces: [...state.workspaces, workspace] })),
  setWorkspaces: (workspaces) => set({ workspaces }),
  removeWorkspace: (id) =>
    set((state) => ({
      workspaces: state.workspaces.filter((w) => w.id !== id),
      currentWorkspace:
        state.currentWorkspace?.id === id ? null : state.currentWorkspace,
    })),
}))
