import CaseFile from '@/components/CaseFile';
import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  return (
    <main className="flex h-screen">
      {/* Case File Sidebar - hidden on mobile, shown on lg */}
      <div className="hidden lg:flex">
        <CaseFile />
      </div>

      {/* Chat Interface */}
      <ChatInterface />
    </main>
  );
}
