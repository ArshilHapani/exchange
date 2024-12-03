"use client";

// timestamp - 1:59:17
// TODO mock add funds into user account
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

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

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Submitting...
        </>
      ) : (
        "Submit"
      )}
    </Button>
  );
}

export default function AddINRFundDialog({ userId }: { userId: number }) {
  const { closeModal, isOpen, type } = useModal();

  const modalOpen = isOpen && type == "add-inr-funds";
  async function handleSubmit(data: FormData) {
    console.log("Submitting");
    const amount = data.get("amount");
    await addBalance({
      userId,
      amount: Number(amount) ?? 10,
    });
  }

  return (
    <Dialog open={modalOpen} onOpenChange={closeModal}>
      <form action={handleSubmit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add INR Funds</DialogTitle>
          </DialogHeader>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input type="number" id="amount" name="amount" required />
          </div>
          <DialogFooter>
            <SubmitButton />
            {/* fck it */}
            <button type="submit">Submit</button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
