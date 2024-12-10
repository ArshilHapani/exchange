"use client";

import ReactQR from "react-qr-code";

import useModal from "@/hooks/useDialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import Address from "../Address";

type Props = {
  address: string;
  token: string;
};

const ShowQRModal = ({ address, token }: Props) => {
  const { closeModal, isOpen, type } = useModal();
  const modalOpen = isOpen && type == `show-qr-${address + token}`;
  return (
    <Dialog open={modalOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Receive {token}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-6 py-4">
          <div className="bg-white p-2 rounded-lg">
            <ReactQR value={address} size={200} />
          </div>
          <div className="w-full space-y-2">
            <p className="text-sm font-medium text-muted-foreground text-center">
              Your {token} Address
            </p>
            <Address address={address} truncateLength={19} />
          </div>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShowQRModal;
