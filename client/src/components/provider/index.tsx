"use client";

import { CheckCircle2, CircleX, TriangleAlert } from "lucide-react";
import { Toaster } from "sonner";

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster
        icons={{
          error: <CircleX className="w-4 h-4 text-red-500" />,
          success: <CheckCircle2 className="w-4 h-4 text-green-500" />,
          warning: <TriangleAlert className="w-4 h-4 text-yellow-600" />,
        }}
        pauseWhenPageIsHidden
        richColors
        position="top-right"
      />
      {children}
    </>
  );
}
