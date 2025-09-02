import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle,
  LayoutGrid,
  Rocket,
  Palette,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/logo';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Logo />
            </Link>
          </div>
          <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
            {/* Future nav links can go here */}
          </nav>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">
                Sign Up <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="font-headline text-3xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
              Master Your Tasks with TickTrek
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              TickTrek is a modern, intuitive task manager that helps you and
              your team stay organized and productive. From simple to-do lists
              to complex project workflows.
            </p>
            <div className="space-x-4">
              <Button asChild size="lg">
                <Link href="/signup">Get Started For Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24"
        >
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-headline text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
              Features
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Everything you need to move work forward.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <Card>
              <CardHeader>
                <CheckCircle className="mb-4 h-8 w-8 text-primary" />
                <CardTitle className="font-headline">Task Management</CardTitle>
              </CardHeader>
              <CardContent>
                Create, update, and delete tasks with rich details like due
                dates, priorities, and statuses.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <LayoutGrid className="mb-4 h-8 w-8 text-primary" />
                <CardTitle className="font-headline">Kanban Board</CardTitle>
              </CardHeader>
              <CardContent>
                Visualize your workflow with a drag-and-drop Kanban board to
                easily track task progress.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Palette className="mb-4 h-8 w-8 text-primary" />
                <CardTitle className="font-headline">Clean UI</CardTitle>
              </CardHeader>
              <CardContent>
                A modern, responsive, and minimal user interface that's a joy to
                use on any device.
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <footer className="py-6 md:px-8 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by Firebase Studio.
          </p>
        </div>
      </footer>
    </div>
  );
}
