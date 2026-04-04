import { Logo } from "./Logo";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="mb-4">
              <Logo size="md" />
            </div>
            <p className="text-sm text-background/60 leading-relaxed mt-4">
              Your trusted neighborhood kirana store. Bringing you the finest quality groceries and daily essentials since 1985.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-background mb-4 text-sm uppercase tracking-wider">Contact Us</h3>
            <ul className="space-y-3 text-sm text-background/70">
              <li className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 shrink-0 text-accent" /><span>45, Gandhi Nagar, Main Bazaar, Jaipur, Rajasthan - 302001</span></li>
              <li className="flex items-center gap-2"><Phone size={14} className="text-accent" /><span>+91 98765 43210</span></li>
              <li className="flex items-center gap-2"><Mail size={14} className="text-accent" /><span>hello@sangamkirana.in</span></li>
              <li className="flex items-center gap-2"><Clock size={14} className="text-accent" /><span>Mon–Sat: 7am – 9pm, Sun: 8am – 7pm</span></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-background mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2 text-sm text-background/70">
              <li><a href="/" className="hover:text-accent transition-colors">Home</a></li>
              <li><a href="/shop" className="hover:text-accent transition-colors">Shop</a></li>
              <li><a href="/cart" className="hover:text-accent transition-colors">Cart</a></li>
              <li><a href="/admin" className="hover:text-accent transition-colors">Admin Login</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-background/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-background/40">© 2025 Sangam Kirana Store. All rights reserved.</p>
          <p className="text-xs text-background/40">Crafted with care for the community.</p>
        </div>
      </div>
    </footer>
  );
}
