"use client";

import { useState } from "react";
import { Toaster } from "sonner";
import { CheckCircle2, CircleX, TriangleAlert } from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Provider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <>
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </>
  );
}
