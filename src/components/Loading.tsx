import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <Loader2 className="h-5 w-5 animate-spin text-primary mb-4" />
      <p className="text-lg font-medium">Loading, please wait...</p>
    </div>
  );
}
