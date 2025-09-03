
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
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/context/user-context';
import { handleSignUp } from '@/lib/auth-actions';

type SignUpMode = 'create' | 'join';

export default function SignUpPage() {
  const { login } = useUser();
  const { toast } = useToast();
  const [mode, setMode] = useState<SignUpMode>('create');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData.entries());

    const result = await handleSignUp({
      mode,
      orgName: values['org-name'] as string,
      orgId: values['org-id'] as string,
      fullName: values['full-name'] as string,
      email: values.email as string,
      password: values.password as string,
    });

    if (result.success && result.user) {
        toast({
            title: result.mode === 'create' ? 'Organization Created!' : 'Account Created!',
            description: result.message,
        });
        login(result.user);
    } else {
        toast({
            title: 'Sign Up Failed',
            description: result.error,
            variant: 'destructive',
        });
    }

    setIsSubmitting(false);
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
              <Input id="org-name" name="org-name" placeholder="Acme Inc." required />
            </div>
          )}

          {mode === 'join' && (
            <div className="grid gap-2">
              <Label htmlFor="org-id">Organization ID</Label>
              <Input id="org-id" name="org-id" placeholder="Enter the organization ID" required />
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="full-name">Your Name</Label>
            <Input id="full-name" name="full-name" placeholder="John Doe" required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="test@example.com"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : (mode === 'create' ? 'Create and Sign Up' : 'Join and Sign Up')}
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
