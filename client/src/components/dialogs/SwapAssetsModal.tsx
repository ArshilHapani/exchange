"use client";

import useModal from "@/hooks/useDialog";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import TokenSwap from "../SwapTokenComponent";
import { BalanceMetaData } from "@/types";

type Props = {
  data: BalanceMetaData[];
  userAddress: string;
};
const SwapAssetsModal = (props: Props) => {
  const { closeModal, isOpen, type } = useModal();
  const modalOpen = isOpen && type == "swap-assets";

  return (
    <Dialog open={modalOpen} onOpenChange={closeModal}>
      <DialogContent>
        <DialogTitle>
          <TokenSwap {...props} />
        </DialogTitle>
      </DialogContent>
    </Dialog>
  );
};

export default SwapAssetsModal;
