
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCheck } from 'lucide-react';
import Logo from '@/components/logo';

export default function AwaitingAssignmentPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-4 left-4">
        <Link href="/">
          <Logo />
        </Link>
      </div>
      <Card className="mx-auto max-w-sm text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
            <UserCheck className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-headline mt-4">Welcome Aboard!</CardTitle>
          <CardDescription>
            You are now part of the organization. An administrator has been notified and will assign you to a team shortly. Once assigned, you will gain full access to the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/">Logout for now</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
