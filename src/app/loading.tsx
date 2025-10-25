import React from "react";
import { Loader2 } from "lucide-react"; // optional, for nice spinner icon

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <p className="text-md font-medium">Loading, please wait...</p>
    </div>
  );
}
