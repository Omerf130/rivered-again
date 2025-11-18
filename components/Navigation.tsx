"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", color: "red" },
    { href: "/transactions", label: "Transactions", color: "blue" },
    { href: "/credit", label: "Credits", color: "green" },
    { href: "/plus", label: "Plus", color: "purple" },
    { href: "/general", label: "General", color: "orange" },
  ];

  const getColorClasses = (color: string, isActive: boolean) => {
    const colors: Record<string, { base: string; hover: string; active: string }> = {
      blue: { base: "bg-blue-600", hover: "hover:bg-blue-700", active: "bg-blue-800" },
      green: { base: "bg-green-600", hover: "hover:bg-green-700", active: "bg-green-800" },
      purple: { base: "bg-purple-600", hover: "hover:bg-purple-700", active: "bg-purple-800" },
      orange: { base: "bg-orange-600", hover: "hover:bg-orange-700", active: "bg-orange-800" },
      red: { base: "bg-red-600", hover: "hover:bg-red-700", active: "bg-red-800" },
    };

    const colorClasses = colors[color] || colors.blue;
    return `${colorClasses.base} ${colorClasses.hover} ${isActive ? colorClasses.active : ""}`;
  };

  return (
    <nav className="flex justify-center gap-4 mb-8 flex-wrap">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-4 py-2 text-white rounded-lg transition-colors font-medium ${getColorClasses(item.color, isActive)} ${
              isActive ? "ring-2 ring-offset-2 ring-offset-zinc-50 dark:ring-offset-black" : ""
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}