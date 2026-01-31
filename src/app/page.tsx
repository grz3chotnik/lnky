import Link from "next/link";
import { Button } from "@/components/ui/button";

// Landing Page - The first page visitors see
// Goal: Explain the product and get users to sign up

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="border-b">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            lnky
          </Link>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign up free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-2xl text-center">
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            One link for all your links
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Create your personalized link-in-bio page in seconds. Share your
            content, social profiles, and more with a single link.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Get started for free
              </Button>
            </Link>
          </div>

          {/* Example URL preview */}
          <div className="mt-12 p-4 bg-muted rounded-lg inline-block">
            <p className="text-muted-foreground text-sm">Your link will look like:</p>
            <p className="text-lg font-mono mt-1">lnky.com/<span className="text-primary font-semibold">yourname</span></p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-5xl mx-auto px-4 text-center text-muted-foreground text-sm">
          Built with Next.js, Tailwind CSS, and Prisma
        </div>
      </footer>
    </div>
  );
}
