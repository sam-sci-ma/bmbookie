"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
// Import icons for visibility
import { Eye, EyeOff } from "lucide-react";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  
  // Separate visibility states for both fields
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 font-poppins", className)} {...props}>
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="p-0 mb-6 text-center">
          <CardTitle className="text-3xl font-black uppercase tracking-tighter">Sign up</CardTitle>
          <CardDescription className="font-medium text-muted-foreground">
            Create your university staff account
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-5">
              
              {/* Email Field */}
              <div className="grid gap-2">
                <Label htmlFor="email" className="font-bold text-[10px] uppercase tracking-widest opacity-70">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@um6p.ma"
                  required
                  className="rounded-xl border-2 focus-visible:ring-primary h-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password Field */}
              <div className="grid gap-2">
                <Label htmlFor="password" className="font-bold text-[10px] uppercase tracking-widest opacity-70">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="rounded-xl border-2 focus-visible:ring-primary h-11 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Repeat Password Field */}
              <div className="grid gap-2">
                <Label htmlFor="repeat-password" className="font-bold text-[10px] uppercase tracking-widest opacity-70">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="repeat-password"
                    type={showRepeatPassword ? "text" : "password"}
                    required
                    className="rounded-xl border-2 focus-visible:ring-primary h-11 pr-10"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showRepeatPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900 text-xs font-bold text-red-500">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full rounded-xl py-6 font-black uppercase tracking-widest shadow-lg shadow-primary/20 mt-2" 
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Sign up"}
              </Button>
            </div>

            {/* Link to Login */}
            <div className="mt-6 text-center text-sm font-medium">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-black text-primary underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}