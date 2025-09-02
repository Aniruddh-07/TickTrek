import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-9xl font-bold font-headline text-primary">404</h1>
        <p className="text-2xl font-medium text-foreground md:text-3xl">
          Page Not Found
        </p>
        <p className="mt-4 mb-8 text-lg text-muted-foreground">
          Oops! The page you are looking for does not exist.
        </p>
        <Button asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
