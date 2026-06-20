import { Suspense } from "react";
import UnifiedOrderingExperience from "@/components/customer/ordering-experience";

export default function QROrderPage() {
  return (
    <Suspense fallback={null}>
      <UnifiedOrderingExperience />
    </Suspense>
  );
}
