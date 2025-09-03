

'use client';

import { useState, useEffect } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/context/user-context';
import { handleSignUp } from '@/lib/auth-actions';
import { useSearchParams } from 'next/navigation';

export default function SignUpPage() {
  const { login } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get('token');

  const [orgName, setOrgName] = useState('');
  
  useEffect(() => {
    if (inviteToken) {
      // In a real app, you might fetch org name from token
      // For now, we'll just indicate it's an invite
      setOrgName("Invited Organization");
    }
  }, [inviteToken]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData.entries());

    const result = await handleSignUp({
      mode: inviteToken ? 'join' : 'create',
      orgName: values['org-name'] as string | undefined,
      fullName: values['full-name'] as string,
      email: values.email as string,
      password: values.password as string,
      inviteToken: inviteToken || undefined,
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
        <CardTitle className="text-2xl font-headline">
          {inviteToken ? 'Join an Organization' : 'Get Started'}
        </CardTitle>
        <CardDescription>
          {inviteToken 
            ? 'You have been invited to join an organization. Create your account below.'
            : 'Create a new organization to start managing your tasks.'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-6">
          
          {!inviteToken && (
            <div className="grid gap-2">
              <Label htmlFor="org-name">Organization Name</Label>
              <Input id="org-name" name="org-name" placeholder="Acme Inc." required />
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
            {isSubmitting ? 'Submitting...' : (inviteToken ? 'Join and Sign Up' : 'Create and Sign Up')}
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
