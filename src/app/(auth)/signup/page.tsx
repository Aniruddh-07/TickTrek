
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

type SignUpMode = 'create' | 'join';

export default function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [mode, setMode] = useState<SignUpMode>('create');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would involve API calls.
    // For now, we just simulate the flow.
    if (mode === 'create') {
      toast({
        title: 'Organization Created!',
        description: "You're now an admin. Let's get you to the dashboard.",
      });
      // In a real app, you'd log the user in as an admin here.
      router.push('/dashboard');
    } else {
      toast({
        title: 'Request Sent!',
        description:
          "Your request to join has been sent to the organization's admin for approval.",
      });
      // Redirect to a page that informs the user to wait for approval.
      router.push('/awaiting-approval');
    }
  };

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Get Started</CardTitle>
        <CardDescription>
          Create a new organization or join an existing one.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-6">
          <RadioGroup
            defaultValue="create"
            className="grid grid-cols-2 gap-4"
            value={mode}
            onValueChange={(value: SignUpMode) => setMode(value)}
          >
            <div>
              <RadioGroupItem value="create" id="create" className="peer sr-only" />
              <Label
                htmlFor="create"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                Create Organization
              </Label>
            </div>
            <div>
              <RadioGroupItem value="join" id="join" className="peer sr-only" />
              <Label
                htmlFor="join"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                Join Organization
              </Label>
            </div>
          </RadioGroup>

          {mode === 'create' && (
            <div className="grid gap-2">
              <Label htmlFor="org-name">Organization Name</Label>
              <Input id="org-name" placeholder="Acme Inc." required />
            </div>
          )}

          {mode === 'join' && (
            <div className="grid gap-2">
              <Label htmlFor="org-id">Organization ID</Label>
              <Input id="org-id" placeholder="Enter the ID you received" required />
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="full-name">Your Name</Label>
            <Input id="full-name" placeholder="John Doe" required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="test@example.com"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="password" required />
          </div>

          <Button type="submit" className="w-full">
            {mode === 'create' ? 'Create and Sign Up' : 'Request to Join'}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link href="/signin" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
