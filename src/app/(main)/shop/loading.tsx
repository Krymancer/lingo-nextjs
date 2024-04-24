import { Loader } from "lucide-react";

export default function Loading() {
  return(
    <div className="w-full h-full flex items-center justify-center">
      <Loader className="h-6 w-6 text-muted-foreground animate-spin" />
    </div>
  )
}