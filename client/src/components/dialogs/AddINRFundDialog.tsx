"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";

export default function AddINRFundDialog({ userId }: { userId: number }) {
  const { closeModal, isOpen, type } = useModal();
  const { toast } = useToast();
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const modalOpen = isOpen && type == "add-inr-funds";
  async function handleSubmit(data: FormData) {
    try {
      setPending(true);
      const amount = data.get("amount");
      if (!amount || Number(amount) === 0 || amount === "") {
        toast({
          variant: "destructive",
          title: "Invalid amount",
          description: "Please enter a valid amount",
        });
        return;
      }
      const res = await addBalance({
        userId,
        amount: Number(amount) ?? 10,
      });
      if (res) {
        toast({
          variant: "success",
          title: "Funds added",
          description: `Added INR ${amount} to your account`,
        });
        router.refresh();
        closeModal();
      } else {
        toast({
          variant: "destructive",
          title: "Failed to add funds",
          description: "Please try again later",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Failed to add funds",
        description: "Please try again later",
      });
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
        <form action={handleSubmit}>
          <div>
            <Label htmlFor="name">Amount (note these are mocks)</Label>
            <Input type="number" id="amount" name="amount" />
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
