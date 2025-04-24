import Image from "next/image";
import VncViewer from '@/components/VncViewer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <VncViewer />
    </main>
  );
}
