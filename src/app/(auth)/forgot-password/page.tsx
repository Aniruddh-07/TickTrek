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

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Forgot Password?</CardTitle>
        <CardDescription>
          {isSubmitted
            ? "If an account with that email exists, we've sent you a link to reset your password."
            : "Enter your email and we'll send you a link to reset your password."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSubmitted ? (
          <Button asChild className="w-full">
            <Link href="/signin">Return to Sign In</Link>
          </Button>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="any@email.com"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Send Reset Link
              </Button>
            </div>
          </form>
        )}
        {!isSubmitted && (
            <div className="mt-4 text-center text-sm">
            Remember your password?{' '}
            <Link href="/signin" className="underline">
                Sign in
            </Link>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
