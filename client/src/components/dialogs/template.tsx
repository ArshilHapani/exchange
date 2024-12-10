"use client";

import useModal from "@/hooks/useDialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

type Props = {};

const YourNameModal = (props: Props) => {
  const { closeModal, isOpen, type } = useModal();
  const modalOpen = isOpen && type == "swap-assets"; // your type

  return (
    <Dialog open={modalOpen} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>your title!</DialogTitle>
        </DialogHeader>
      </DialogContent>

      <DialogFooter></DialogFooter>
    </Dialog>
  );
};

export default YourNameModal;
