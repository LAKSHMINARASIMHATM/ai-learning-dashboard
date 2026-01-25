'use client';

import React, { useState, useEffect } from "react"
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Menu, ChevronDown } from 'lucide-react';
import api from '@/lib/api';
import { ModeToggle } from '@/components/mode-toggle';

const navItems = [
  { label: 'Dashboard', href: '/', icon: 'home' },
  { label: 'Learning Path', href: '/learning-path', icon: 'conversion_path' },
  { label: 'Quiz Center', href: '/quiz', icon: 'quiz' },
  { label: 'Skill Gap Analysis', href: '/skill-gap', icon: 'query_stats' },
  { label: 'Recommendations', href: '/recommendations', icon: 'auto_awesome' },
  { label: 'AI Learning Assistant', href: '/assistant', icon: 'forum' },
  { label: 'Progress Analytics', href: '/analytics', icon: 'insights' },
  { label: 'Learner Profile', href: '/profile', icon: 'person' },
  { label: 'Settings', href: '/settings', icon: 'settings' },
];

interface UserData {
  name: string;
  email: string;
  avatar?: string;
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Try to get from local storage first for immediate display
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        // Then fetch fresh data
        const res = await api.getMe();
        if (res.success && res.data) {
          setUser(res.data as UserData);
          // Update local storage
          localStorage.setItem('user', JSON.stringify(res.data));
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    api.logout();
    router.push('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex h-screen bg-background text-foreground transition-colors duration-300">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? 'w-64' : 'w-20'
          } bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col z-30`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          <div className={`flex items-center gap-3 ${!sidebarOpen && 'hidden'}`}>
            <div className="bg-primary p-1.5 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-white text-xl">auto_awesome</span>
            </div>
            <span className="font-bold text-lg tracking-tight">AI Learning</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-sidebar-accent rounded-xl transition-all duration-200 text-sidebar-foreground/70 hover:text-sidebar-foreground"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <ChevronDown size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 no-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                  }`}
                title={item.label}
              >
                <span className={`material-symbols-outlined text-2xl transition-transform group-hover:scale-110 ${isActive ? 'text-white' : ''}`}>
                  {item.icon}
                </span>
                {sidebarOpen && <span className="text-sm font-bold tracking-wide">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full text-sidebar-foreground/70 hover:bg-red-500/10 hover:text-red-500 group`}
            title="Logout"
          >
            <LogOut size={24} />
            {sidebarOpen && <span className="text-sm font-bold tracking-wide">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Bar */}
        <header className="h-16 sticky top-0 z-20 backdrop-blur-md bg-background/80 border-b border-border flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-xl transition-colors"
              aria-label="Toggle sidebar mobile"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-bold tracking-tight">
              {navItems.find(item => item.href === pathname)?.label || 'Dashboard'}
            </h1>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-4">
            <ModeToggle />
            <button className="relative p-2 hover:bg-muted rounded-xl transition-all duration-200 group">
              <span className="material-symbols-outlined text-2xl text-foreground/70 group-hover:text-primary transition-colors">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
            </button>

            {user ? (
              <Link href="/profile" className="flex items-center gap-3 p-1.5 pr-4 hover:bg-muted rounded-full transition-all duration-200 border border-transparent hover:border-border">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md">
                  {getInitials(user.name)}
                </div>
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-xs font-bold leading-none">{user.name}</span>
                  <span className="text-[10px] text-foreground/50 font-medium">Student</span>
                </div>
              </Link>
            ) : (
              <Link href="/login" className="text-sm font-medium text-primary hover:underline">
                Sign In
              </Link>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-background/50 relative">
          {/* Background Accents */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-[100px]"></div>
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px]"></div>
          </div>
          <div className="p-6 sm:p-8 max-w-screen-2xl mx-auto">{children}</div>
        </main>
      </div >
    </div >
  );
}
