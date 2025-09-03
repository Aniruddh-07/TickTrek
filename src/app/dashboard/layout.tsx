
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useMemo, useEffect } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import {
  LayoutGrid,
  ListTodo,
  Menu,
  Users,
  FolderKanban,
  Ticket,
  Settings,
  LifeBuoy,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Logo from '@/components/logo';
import { TasksProvider, useTasks } from '@/context/tasks-context';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { UserProvider, useUser } from '@/context/user-context';
import { NotificationsProvider, useNotifications } from '@/context/notifications-context';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/lib/types';


const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const pathname = usePathname();
    const { clearNotifications } = useNotifications();
    const isActive = pathname === href;

    const handleClick = () => {
        const pageKey = href.split('/').pop() || 'dashboard';
        clearNotifications(pageKey as any);
    }

    return (
        <Link href={href} onClick={handleClick} className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary',
            isActive ? 'bg-muted text-primary' : 'text-muted-foreground'
        )}>
            {children}
        </Link>
    )
}

const MobileNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const pathname = usePathname();
    const { clearNotifications } = useNotifications();
    const isActive = pathname === href;

    const handleClick = () => {
        const pageKey = href.split('/').pop() || 'dashboard';
        clearNotifications(pageKey as any);
    }
    
    return (
        <Link href={href} onClick={handleClick} className={cn(
            'mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground',
            isActive ? 'bg-muted text-foreground' : 'text-muted-foreground'
        )}>
            {children}
        </Link>
    )
}


function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, users, setUser } = useUser();
  const { teams } = useTasks();
  const { notifications } = useNotifications();

  useEffect(() => {
    if (user && user.status === 'pending-approval') {
      router.push('/awaiting-approval');
    }
  }, [user, router]);

  const isTeamLead = useMemo(() => {
    if (!user) return false;
    return teams.some(team => team.leadId === user.id);
  }, [user, teams]);

  const navItemsByRole: Record<UserRole, { href: string; icon: React.ElementType; label: string, notificationKey: keyof typeof notifications }[]> = {
    admin: [
        { href: '/dashboard', icon: LayoutGrid, label: 'Dashboard', notificationKey: 'dashboard' },
        { href: '/dashboard/kanban', icon: ListTodo, label: 'Task Board', notificationKey: 'kanban' },
        { href: '/dashboard/projects', icon: FolderKanban, label: 'Projects', notificationKey: 'projects' },
        { href: '/dashboard/teams', icon: Users, label: 'Teams', notificationKey: 'teams' },
        { href: '/dashboard/tickets', icon: Ticket, label: 'Tickets', notificationKey: 'tickets' },
    ],
    member: [
        { href: '/dashboard', icon: LayoutGrid, label: 'Dashboard', notificationKey: 'dashboard' },
        { href: '/dashboard/kanban', icon: ListTodo, label: 'Task Board', notificationKey: 'kanban' },
        { href: '/dashboard/projects', icon: FolderKanban, label: 'Projects', notificationKey: 'projects' },
        { href: '/dashboard/tickets', icon: Ticket, label: 'Tickets', notificationKey: 'tickets' },
    ],
  };

  const navItems = user ? navItemsByRole[user.role] : [];
  const commonNavItems: { href: string; icon: React.ElementType; label: string, notificationKey: keyof typeof notifications }[] = [
    { href: '/dashboard/settings', icon: Settings, label: 'Settings', notificationKey: 'settings' },
    { href: '/dashboard/support', icon: LifeBuoy, label: 'Support', notificationKey: 'support' },
  ];
  
  if (!user || user.status === 'pending-approval') {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  const roleDisplay = user.role === 'admin' ? 'Admin' : (isTeamLead ? 'Team Lead' : 'Member');
  const activeUsers = users.filter(u => u.status === 'active');

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-card md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Logo />
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navItems.map((item) => (
                <NavLink key={item.href} href={item.href}>
                    <div className="relative">
                        <item.icon className="h-4 w-4" />
                        {notifications[item.notificationKey] && <div className="absolute top-[-2px] right-[-2px] h-2 w-2 rounded-full bg-red-500" />}
                    </div>
                    {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="mt-auto p-4">
             <nav className="grid items-start px-2 text-sm font-medium lg:px-4 border-t pt-4">
                {commonNavItems.map((item) => (
                  <NavLink key={item.href} href={item.href}>
                      <div className="relative">
                          <item.icon className="h-4 w-4" />
                          {notifications[item.notificationKey] && <div className="absolute top-[-2px] right-[-2px] h-2 w-2 rounded-full bg-red-500" />}
                      </div>
                      {item.label}
                  </NavLink>
                ))}
             </nav>
           </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold mb-4"
                >
                  <Logo />
                </Link>
                {navItems.map((item) => (
                  <MobileNavLink key={item.href} href={item.href}>
                     <div className="relative">
                        <item.icon className="h-5 w-5" />
                        {notifications[item.notificationKey] && <div className="absolute top-[-2px] right-[-2px] h-2 w-2 rounded-full bg-red-500" />}
                     </div>
                    {item.label}
                  </MobileNavLink>
                ))}
                 <div className="border-t mt-4 pt-4">
                    {commonNavItems.map((item) => (
                      <MobileNavLink key={item.href} href={item.href}>
                        <div className="relative">
                            <item.icon className="h-5 w-5" />
                            {notifications[item.notificationKey] && <div className="absolute top-[-2px] right-[-2px] h-2 w-2 rounded-full bg-red-500" />}
                        </div>
                        {item.label}
                      </MobileNavLink>
                    ))}
                 </div>
              </nav>
            </SheetContent>
          </Sheet>

          <div className="w-full flex-1">
            {/* Optional: Header Search Bar */}
          </div>

          <ThemeSwitcher />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="user avatar" />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account ({roleDisplay})</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Switch User</DropdownMenuLabel>
               <DropdownMenuRadioGroup value={user.id} onValueChange={(id) => setUser(users.find(u => u.id === id)!)}>
                {activeUsers.map(u => (
                  <DropdownMenuRadioItem key={u.id} value={u.id}>{u.name} ({u.role})</DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link href="/dashboard/settings">Settings</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/dashboard/support">Support</Link></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link href="/">Logout</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <TasksProvider>
        <NotificationsProvider>
          <DashboardLayoutContent>{children}</DashboardLayoutContent>
        </NotificationsProvider>
      </TasksProvider>
    </UserProvider>
  );
}
