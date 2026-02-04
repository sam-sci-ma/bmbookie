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
// Import icons for the toggle
import { Eye, EyeOff } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Toggle state
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Authenticate the user
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (authError) throw authError;

      if (authData.user) {
        // 2. Fetch the role from your 'profiles' table
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", authData.user.id)
          .single();

        if (profileError) {
          console.error("Profile fetch error:", profileError.message);
          router.push("/dashboard"); // Fallback
          return;
        }

        const role = profile?.role?.toLowerCase();

        // 3. Redirect based on the role found in the database
        if (role === "admin") {
          router.push("/protected/admin");
        } else {
          router.push("/dashboard");
        }
        
        // Ensure server-side state is updated
        router.refresh();
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 font-poppins", className)} {...props}>
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="p-0 mb-6">
          <CardTitle className="text-2xl font-black uppercase tracking-tighter">Login</CardTitle>
          <CardDescription className="font-medium">
            Enter your university email to access the portal
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email" className="font-bold text-xs uppercase tracking-widest opacity-70">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@um6p.ma"
                  required
                  className="rounded-xl border-2 focus-visible:ring-primary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="font-bold text-xs uppercase tracking-widest opacity-70">Password</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-xs font-bold text-primary hover:underline underline-offset-4"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="rounded-xl border-2 focus-visible:ring-primary pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              {error && <p className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-950/30 p-3 rounded-lg border border-red-200 dark:border-red-800">{error}</p>}
              <Button type="submit" className="w-full rounded-xl py-6 font-black uppercase tracking-widest shadow-lg shadow-primary/20" disabled={isLoading}>
                {isLoading ? "Authenticating..." : "Login"}
              </Button>
            </div>
            <div className="mt-6 text-center text-sm font-medium">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/sign-up"
                className="font-black text-primary underline underline-offset-4"
              >
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}