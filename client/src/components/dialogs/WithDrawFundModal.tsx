"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import useModal from "@/hooks/useDialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { withdrawBalance } from "@/actions";

type Props = {
  usrId: number;
  availableInrBalance: number;
};

const WithDrawFundModal = ({ availableInrBalance, usrId }: Props) => {
  const { closeModal, isOpen, type } = useModal();
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const modalOpen = isOpen && type == "withdraw-funds";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    try {
      setPending(true);

      const amount = data.get("amount");
      if (!amount || Number(amount) == 0 || amount == "") {
        toast.warning("Withdraw amount must be greater than 0");
        return;
      }
      if (Number(amount) > availableInrBalance) {
        toast.error(
          `Redeeming balance must be less than or equal to wallet balance (${availableInrBalance} ₹)`
        );
        return;
      }

      const res = await withdrawBalance({
        userId: usrId,
        amount: Number(amount) ?? 0,
      });
      if (res) {
        toast.success(`Balance of ${amount} ₹ withdrawn from your wallet`);
        closeModal();
      } else {
        toast.error("Failed to withdraw fund");
      }
      router.refresh();
    } catch {
      toast.warning("Failed to withdraw fund");
    } finally {
      setPending(false);
    }
  }
  return (
    <Dialog open={modalOpen} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Withdraw funds (available funds {availableInrBalance} ₹)
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="name">
              Amount to withdraw (note these are mocks)
            </Label>
            <Input type="number" id="amount" name="amount" disabled={pending} />
          </div>
          <DialogFooter>
            <Button className="mt-2" type="submit" disabled={pending}>
              {pending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WithDrawFundModal;
