import { create } from "zustand";

type ModalType =
  | "add-inr-funds"
  | "withdraw-funds"
  | "swap-assets"
  | `show-qr-${string}`;

interface ModalState {
  type: ModalType | null;
  isOpen: boolean;
  openModal: (type: ModalType) => void;
  closeModal: () => void;
}

const useModal = create<ModalState>((set) => ({
  isOpen: false,
  openModal: (type: ModalType) => set({ isOpen: true, type }),
  closeModal: () => set({ isOpen: false, type: null }),
  type: null,
}));

export default useModal;
