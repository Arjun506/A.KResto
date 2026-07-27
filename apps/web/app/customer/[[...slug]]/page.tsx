import { Suspense } from "react";
import UnifiedOrderingExperience from "@/components/customer/ordering-experience";

export default function CustomerCatchAllPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500">Loading experience...</div>}>
      <UnifiedOrderingExperience />
    </Suspense>
  );
}
