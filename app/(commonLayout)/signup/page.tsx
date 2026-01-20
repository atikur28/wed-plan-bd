import SignupForm from "./SignupForm";

export const metadata = {
  title: "Sign Up",
  description: "Create a new account",
};

export default function SignupPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background text-foreground px-4 font-inter">
      <div className="w-full max-w-md border p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-center mb-6">Sign Up</h1>
        {/* Client Component */}
        <SignupForm />
      </div>
    </div>
  );
}
