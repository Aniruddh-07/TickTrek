
'use client'

import Link from 'next/link';
import Logo from '@/components/logo';
import { UserProvider } from '@/context/user-context';
import { usePathname } from 'next/navigation';
import { useUser } from '@/context/user-context';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';


function AuthLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && user && (pathname === '/signin' || pathname === '/signup')) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
            <p>Loading...</p>
        </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
       <div className="absolute top-4 left-4">
        <Link href="/">
          <Logo />
        </Link>
      </div>
      {children}
    </div>
  );
}

export default function AuthLayout({ children }: { children: React.ReactNode; }) {
    return (
        <UserProvider>
            <AuthLayoutContent>{children}</AuthLayoutContent>
        </UserProvider>
    )
}
