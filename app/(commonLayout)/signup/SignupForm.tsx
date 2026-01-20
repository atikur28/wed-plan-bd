"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupForm() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`,
          email,
          password,
          phone: phone || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong!");
        setLoading(false);
        return;
      }

      router.push("/login");
    } catch (err) {
      setError("Network error, please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      {/* First Name */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          type="text"
          placeholder="Enter your first name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </div>

      {/* Last Name */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          type="text"
          placeholder="Enter your last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>

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

      {/* Phone (optional) */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input
          id="phone"
          type="text"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
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
        <Button
          type="button"
          variant="ghost"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-2 top-9 -translate-y-1/2 p-0 w-8 h-8 flex items-center justify-center"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </Button>
      </div>

      {/* Confirm Password */}
      <div className="flex flex-col gap-1 relative">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          onClick={() => setShowConfirmPassword((prev) => !prev)}
          className="absolute right-2 top-9 -translate-y-1/2 p-0 w-8 h-8 flex items-center justify-center"
        >
          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </Button>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="bg-[#C4C4C4] hover:bg-[#ADADAD] text-second-foreground w-full mt-2 cursor-pointer"
      >
        {loading ? "Signing up..." : "Sign Up"}
      </Button>

      {/* Login redirect */}
      <p className="text-sm text-center mt-4">
        Already have an account?{" "}
        <a href="/login" className="text-rose-800 hover:underline">
          Login
        </a>
      </p>
    </form>
  );
}
