'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ChatApp from '@/components/ChatApp';
import { getSession, User } from '@/lib/auth';
import { bumpVisit } from '@/lib/stats';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const s = getSession();
    if (!s) { router.replace('/login'); return; }
    setUser(s);
    bumpVisit();
    setReady(true);
  }, [router]);

  if (!ready || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blur-bg">
        <div className="w-10 h-10 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return <ChatApp user={user} onLogout={() => { setUser(null); router.replace('/login'); }} />;
}
