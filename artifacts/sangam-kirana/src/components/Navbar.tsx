import { Link, useLocation } from "wouter";
import { ShoppingCart, Menu, X, Shield } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";
import { useCart } from "@/context/CartContext";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { count } = useCart();
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
  ];

  const isActive = (href: string) => href === "/" ? location === "/" : location.startsWith(href);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <Logo size="md" />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {links.map(l => (
              <Link key={l.href} href={l.href}>
                <span className={`text-sm font-medium transition-colors hover:text-primary ${isActive(l.href) ? "text-primary" : "text-foreground/70"}`}>
                  {l.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/admin">
              <button className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-primary border border-border rounded-lg hover:border-primary/40 transition-colors">
                <Shield size={13} />
                Admin
              </button>
            </Link>
            <Link href="/cart">
              <button className="relative flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                <ShoppingCart size={18} />
                <span className="hidden sm:inline text-sm font-medium">Cart</span>
                {count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </button>
            </Link>

            <button
              className="md:hidden p-2 text-foreground/70 hover:text-primary"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 py-3 space-y-2 animate-fade-in">
          {links.map(l => (
            <Link key={l.href} href={l.href}>
              <div
                onClick={() => setMenuOpen(false)}
                className={`block py-2 text-sm font-medium ${isActive(l.href) ? "text-primary" : "text-foreground/70"}`}
              >
                {l.label}
              </div>
            </Link>
          ))}
          <Link href="/admin">
            <div onClick={() => setMenuOpen(false)} className="py-2 text-sm font-medium text-muted-foreground flex items-center gap-1.5">
              <Shield size={14} /> Admin Panel
            </div>
          </Link>
        </div>
      )}
    </header>
  );
}
