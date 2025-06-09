import { UserSidebar } from "@/components/user/navbar";

export default function Page() {
  return (
    <div className="flex h-screen overflow-hidden">
      <UserSidebar />
      <div className="flex-1 overflow-auto">
        <main className="flex flex-col items-center justify-center w-full h-full p-4 md:p-6">
          <iframe
            className="min-w-[1200px] w-full h-[calc(100vh-2rem)] rounded-md border border-border shadow-sm"
            src="/chat"
            title="Chat Interface"
            allow="camera; microphone; fullscreen"
          />
        </main>
      </div>
    </div>
  );
}
