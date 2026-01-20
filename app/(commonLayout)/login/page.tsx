import LoginForm from "./LoginForm";

export const metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background text-foreground px-4 font-inter">
      <div className="w-full max-w-md border p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-center mb-6">Login</h1>
        {/* Client Component */}
        <LoginForm />
      </div>
    </div>
  );
}
