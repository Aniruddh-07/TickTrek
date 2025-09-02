import Link from 'next/link';
import Logo from '@/components/logo';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
