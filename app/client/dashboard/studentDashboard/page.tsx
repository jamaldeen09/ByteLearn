import { Suspense } from "react";
import DashboardPageContent from "./DashboardPageContent";

const Page = () => {
  return (
    <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center"><div>Loading...</div></div>}>
      <DashboardPageContent />
    </Suspense>
  )
}

export default Page