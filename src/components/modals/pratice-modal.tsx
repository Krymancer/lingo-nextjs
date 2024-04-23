"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePraticeModal } from "@/store/use-pratice-modal";

export default function PraticeModal() {
  const [isClient, setIsClient] = useState(false);
  const { isOpen, close } = usePraticeModal();

  useEffect(() => { setIsClient(true); }, []);

  if (!isClient) return null;

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center w-full justify-center mb-5">
            <Image
              src="/hearts.svg"
              alt="Heart"
              height={100}
              width={100}
            />
          </div>
        </DialogHeader>
        <DialogTitle className="text-center font-bold text-2xl">
          Pratice lesson
        </DialogTitle>
        <DialogDescription className="text-center text-base">
          Use pratice lesson to regain hearts and points. You cannot lose hearts or points in pratice lessons.
        </DialogDescription>
        <DialogFooter className="mb-4">
          <div className="flex flex-col gap-y-4 w-full">
            <Button variant="primary" className="w-full" size="lg" onClick={close}>
              I understand
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}