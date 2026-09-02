import JoinClassView from "@/components/lms/JoinClassView";
import { ToastProvider } from "@/components/lms/toast";

export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return (
    <ToastProvider>
      <div className="lms-app min-h-screen p-6">
        <div className="mx-auto max-w-3xl py-10">
          <JoinClassView initialCode={code} />
        </div>
      </div>
    </ToastProvider>
  );
}
