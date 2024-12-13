"use client";

import { Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import useModal from "@/hooks/useDialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { addBalance } from "@/actions";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function AddINRFundDialog({ userId }: { userId: number }) {
  const { closeModal, isOpen, type } = useModal();
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const modalOpen = isOpen && type == "add-inr-funds";
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    try {
      setPending(true);
      const amount = data.get("amount");
      if (!amount || Number(amount) === 0 || amount === "") {
        toast.error("Please enter a valid amount");
        return;
      }
      const res = await addBalance({
        userId,
        amount: Number(amount) ?? 0,
      });
      if (res) {
        toast.success(`Balance of ${amount} added into your wallet`);
        router.refresh();
        closeModal();
      } else {
        toast.error("Failed to add fund");
      }
    } catch {
      toast.warning("Failed to add fund");
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={modalOpen} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add INR Funds</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="name">Amount (note these are mocks)</Label>
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
}
