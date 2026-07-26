"use client";

import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  currentModal: string | null;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openModal: (modal: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen: true,
  currentModal: null,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  openModal: (modal) => set({ currentModal: modal }),
  closeModal: () => set({ currentModal: null }),
}));
