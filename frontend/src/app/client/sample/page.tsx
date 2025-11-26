import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, CheckCircle2 } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      
      {/* --- HEADER / NAVIGATION --- */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <span>Acme Inc.</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="#features">Features</Link>
            <Link href="#pricing">Pricing</Link>
            <Link href="#about">About</Link>
            <Button variant="outline" size="sm">Log in</Button>
            <Button size="sm">Get Started</Button>
          </nav>

          {/* Mobile Nav */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="#features" className="text-lg font-medium">Features</Link>
                <Link href="#pricing" className="text-lg font-medium">Pricing</Link>
                <Link href="#about" className="text-lg font-medium">About</Link>
                <Separator />
                <Button variant="outline" className="w-full">Log in</Button>
                <Button className="w-full">Get Started</Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1">
        
        {/* --- HERO SECTION --- */}
        <section className="container py-24 md:py-32 flex flex-col items-center text-center gap-8">
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              Build your next project with speed and precision.
            </h1>
            <p className="text-xl text-muted-foreground">
              A plain, unstyled landing page template using standard shadcn/ui components. Focus on the code, not the boilerplate.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg">Start Building</Button>
            <Button size="lg" variant="secondary">View Documentation</Button>
          </div>
        </section>

        <Separator />

        {/* --- FEATURES SECTION --- */}
        <section id="features" className="container py-24 space-y-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight">Key Features</h2>
            <p className="text-muted-foreground">
              Everything you need to launch your SaaS, completely unopinionated and ready for your custom branding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Card>
              <CardHeader>
                <CardTitle>Fast Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Optimized for speed with server-side rendering and static generation capabilities.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card>
              <CardHeader>
                <CardTitle>Secure by Default</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Built-in protection against common web vulnerabilities to keep your data safe.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card>
              <CardHeader>
                <CardTitle>Easy Scalability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Grow from one user to one million without rewriting your entire codebase.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* --- PRICING SECTION --- */}
        <section id="pricing" className="bg-slate-50 dark:bg-slate-900 py-24">
          <div className="container space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">Simple Pricing</h2>
              <p className="text-muted-foreground">Choose the plan that fits your needs.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              
              {/* Basic Plan */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic</CardTitle>
                  <CardDescription>For hobbyists and side projects.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-4xl font-bold">$0<span className="text-base font-normal text-muted-foreground">/mo</span></div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Up to 5 users</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Basic analytics</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Community support</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline">Get Started</Button>
                </CardFooter>
              </Card>

              {/* Pro Plan */}
              <Card className="border-primary">
                <CardHeader>
                  <CardTitle>Pro</CardTitle>
                  <CardDescription>For growing businesses.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-4xl font-bold">$29<span className="text-base font-normal text-muted-foreground">/mo</span></div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Unlimited users</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Advanced analytics</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Priority email support</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Upgrade Now</Button>
                </CardFooter>
              </Card>

            </div>
          </div>
        </section>

        {/* --- CTA / NEWSLETTER --- */}
        <section className="container py-24">
          <div className="flex flex-col items-center gap-6 text-center max-w-xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight">Ready to get started?</h2>
            <p className="text-muted-foreground">Join thousands of developers building the future.</p>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input type="email" placeholder="Enter your email" />
              <Button type="submit">Subscribe</Button>
            </div>
          </div>
        </section>

      </main>

      {/* --- FOOTER --- */}
      <footer className="border-t py-12 bg-background">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-lg">
            Acme Inc.
          </div>
          <p className="text-sm text-muted-foreground text-center md:text-left">
            &copy; 2024 Acme Inc. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="#" className="hover:underline">Terms</Link>
            <Link href="#" className="hover:underline">Privacy</Link>
            <Link href="#" className="hover:underline">Twitter</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}