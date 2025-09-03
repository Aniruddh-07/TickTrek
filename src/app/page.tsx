import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle,
  LayoutGrid,
  Rocket,
  Palette,
  Users,
  FolderKanban,
  Ticket,
  Star,
  Github,
  Twitter,
  Linkedin,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/logo';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
            </div>
          </div>
        </section>

        <section
          id="features"
          className="container space-y-8 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24"
        >
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-headline text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
              Features
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Everything you need to move work forward.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] lg:grid-cols-3">
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
                <FolderKanban className="mb-4 h-8 w-8 text-primary" />
                <CardTitle className="font-headline">Project Organization</CardTitle>
              </CardHeader>
              <CardContent>
                  Group tasks into projects and assign projects to specific teams for focused collaboration.
              </CardContent>
            </Card>
             <Card>
              <CardHeader>
                <Users className="mb-4 h-8 w-8 text-primary" />
                <CardTitle className="font-headline">Team Collaboration</CardTitle>
              </CardHeader>
              <CardContent>
                Create teams, assign members and leads, and manage permissions across the application.
              </CardContent>
            </Card>
             <Card>
              <CardHeader>
                <Ticket className="mb-4 h-8 w-8 text-primary" />
                <CardTitle className="font-headline">Internal Ticketing</CardTitle>
              </CardHeader>
              <CardContent>
                An integrated ticketing system for users to raise issues and get support from team leads or admins.
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

        <section id="testimonials" className="container py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-headline text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
              Loved by Teams Worldwide
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              See what our users are saying about their experience with TickTrek.
            </p>
          </div>
           <Carousel
            opts={{
              align: "start",
            }}
            className="w-full max-w-4xl mx-auto mt-12"
          >
            <CarouselContent>
              {Array.from({ length: 3 }).map((_, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="h-full flex flex-col">
                      <CardContent className="p-6 flex-grow flex flex-col justify-between">
                         <p className="text-muted-foreground italic mb-4">"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam."</p>
                         <div className="flex items-center gap-4">
                            <Avatar>
                                <AvatarImage src={`https://picsum.photos/seed/user${index}/50/50`} />
                                <AvatarFallback>{`U${index+1}`}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">Lorem Ipsum</p>
                                <p className="text-sm text-muted-foreground">CEO, Dolor Sit Inc.</p>
                            </div>
                         </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>
        
        <section id="github" className="bg-slate-50 dark:bg-transparent">
             <div className="container py-12 text-center">
                <h2 className="font-headline text-3xl font-bold">Like What You See?</h2>
                <p className="mt-2 text-muted-foreground">This project is open-source. Show your support by starring it on GitHub!</p>
                <Button asChild size="lg" className="mt-6">
                    <Link href="https://github.com/your-username/ticktrek" target="_blank" rel="noopener noreferrer">
                        <Star className="mr-2 h-5 w-5" /> Star on GitHub
                    </Link>
                </Button>
            </div>
        </section>
      </main>
      <footer className="py-8 md:px-8 border-t">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
                 <Logo />
            </div>
             <div className="flex items-center gap-4">
                <Link href="#" aria-label="GitHub"><Github className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" /></Link>
                <Link href="#" aria-label="Twitter"><Twitter className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" /></Link>
                <Link href="#" aria-label="LinkedIn"><Linkedin className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" /></Link>
                <Link href="mailto:upadhyayaniruddh482@gmail.com" aria-label="Gmail"><Mail className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" /></Link>
             </div>
             <p className="text-center text-sm text-muted-foreground">
                Made with <span className="text-red-500">❤️</span> by <a href="https://aniruddhu.vercel.app/" target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">@Aniruddh</a>
            </p>
        </div>
      </footer>
    </div>
  );
}
