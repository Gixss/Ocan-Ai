'use client';
import { useRouter } from 'next/navigation';
import LoginPage from '@/components/LoginPage';
import { User } from '@/lib/auth';

export default function Login() {
  const router = useRouter();
  const onLogin = (u: User) => { router.push('/'); };
  return <LoginPage onLogin={onLogin} />;
}
