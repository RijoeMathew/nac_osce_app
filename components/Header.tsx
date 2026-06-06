import Link from "next/link";
import { Activity, BarChart3, BookOpen, LayoutDashboard, Stethoscope, UserCircle } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/cases", label: "Cases", icon: BookOpen },
  { href: "/progress", label: "Progress", icon: BarChart3 },
  { href: "/auth", label: "Sign in", icon: UserCircle }
];

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-clinical-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold text-clinical-navy">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-clinical-blue text-white">
            <Stethoscope size={20} aria-hidden="true" />
          </span>
          <span>NAC OSCE Helper</span>
        </Link>
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-clinical-mist hover:text-clinical-navy"
              >
                <Icon size={16} aria-hidden="true" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
