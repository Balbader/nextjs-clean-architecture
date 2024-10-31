'use client';

/**
 * Sign Up Page Component
 * 
 * This component represents a presentation layer element in the Clean Architecture pattern.
 * It serves as a UI component responsible for user registration, handling form inputs and
 * validation at the client side. Following Clean Architecture principles, this component:
 * 
 * - Acts as part of the Interface Adapters layer (presentation)
 * - Depends on the use cases (signUp action) but not on external frameworks
 * - Handles only UI concerns and basic form validation
 * - Delegates actual business logic to the use cases layer
 */

import Link from 'next/link';
import { useState } from 'react';

import { Button } from '../../_components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../_components/ui/card';
import { Input } from '../../_components/ui/input';
import { Label } from '../../_components/ui/label';
import { Separator } from '../../_components/ui/separator';
import { signUp } from '../actions';

export default function SignUp() {
  const [error, setError] = useState<string>();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const password = formData.get('password')!.toString();
    const confirmPassword = formData.get('confirm_password')!.toString();

    if (password !== confirmPassword) {
      setError('Passwords must match');
      return;
    }

    const res = await signUp(formData);
    if (res && res.error) {
      setError(res.error);
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Sign up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col p-6 gap-4">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            {error && <p className="text-destructive">{error}</p>}
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="nikolovlazar"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" name="password" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                name="confirm_password"
                type="password"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Create an account
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/sign-in" className="underline">
              Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
