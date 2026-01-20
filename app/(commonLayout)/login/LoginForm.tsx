"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong!");
        setLoading(false);
        return;
      }

      router.push("/");
    } catch (err) {
      setError("Network error, please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      {/* Email */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1 relative">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="pr-10"
        />
        {/* Eye toggle button */}
        <Button
          type="button"
          variant="ghost"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-2 top-9 -translate-y-1/2 p-0 w-8 h-8 flex items-center justify-center"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </Button>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="bg-[#C4C4C4] hover:bg-[#ADADAD] text-second-foreground w-full mt-2 cursor-pointer"
      >
        {loading ? "Logging in..." : "Login"}
      </Button>

      {/* Signup redirect */}
      <p className="text-sm text-center mt-4">
        Don’t have an account?{" "}
        <a href="/signup" className="text-rose-800 hover:underline">
          Sign Up
        </a>
      </p>
    </form>
  );
}
