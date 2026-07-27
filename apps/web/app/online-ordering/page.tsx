import { Suspense } from "react";
import UnifiedOrderingExperience from "@/components/customer/ordering-experience";

export default function OnlineOrderingPage() {
  return (
    <Suspense fallback={null}>
      <UnifiedOrderingExperience />
    </Suspense>
  );
}

