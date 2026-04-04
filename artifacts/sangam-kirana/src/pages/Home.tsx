import { useEffect, useRef } from "react";
import { Link } from "wouter";
import { ArrowRight, ShoppingBag, Truck, Shield, Star } from "lucide-react";
import { useListProducts, useListCategories } from "@workspace/api-client-react";
import { ProductCard } from "@/components/ProductCard";
import { Footer } from "@/components/Footer";

function useSectionReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add("visible"); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function RevealSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useSectionReveal();
  return <div ref={ref} className={`section-reveal ${className}`}>{children}</div>;
}

const categoryIcons: Record<string, string> = {
  "grains-pulses": "🌾",
  "spices-masalas": "🌶️",
  "dairy-eggs": "🥛",
  "snacks-beverages": "🍪",
  "cooking-oils": "🫙",
  "household": "🏠",
};

export default function Home() {
  const { data: featured = [] } = useListProducts({ featured: true });
  const { data: categories = [] } = useListCategories();

  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient text-white min-h-[85vh] flex items-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl animate-fade-in-up">
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-widest mb-4 bg-white/10 px-3 py-1 rounded-full">
              Trusted Since 1985
            </span>
            <h1 className="text-5xl sm:text-6xl font-bold leading-tight mb-6">
              Your Neighborhood<br />
              <span className="text-accent">Kirana Store</span><br />
              Online
            </h1>
            <p className="text-lg text-white/80 mb-8 leading-relaxed">
              Fresh groceries, daily essentials, and premium quality products — delivered with the warmth and trust of your local kirana store.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/shop">
                <button className="flex items-center gap-2 px-7 py-3.5 bg-white text-primary font-semibold rounded-xl hover:bg-white/90 transition-colors shadow-lg">
                  <ShoppingBag size={20} />
                  Shop Now
                  <ArrowRight size={18} />
                </button>
              </Link>
              <a href="#categories">
                <button className="flex items-center gap-2 px-7 py-3.5 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors">
                  Browse Categories
                </button>
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-background" style={{ borderRadius: "60% 60% 0 0 / 60px 60px 0 0" }} />
      </section>

      {/* Stats */}
      <RevealSection>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 mb-16">
          <div className="grid grid-cols-3 gap-4 sm:gap-8 bg-card rounded-2xl p-6 shadow-sm border border-card-border">
            {[
              { label: "Products", value: "200+", icon: ShoppingBag },
              { label: "Happy Customers", value: "5,000+", icon: Star },
              { label: "Years of Trust", value: "40+", icon: Shield },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="text-center">
                <Icon size={22} className="text-primary mx-auto mb-2" />
                <div className="text-xl sm:text-2xl font-bold text-foreground">{value}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* Features */}
      <RevealSection>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Truck, title: "Same Day Delivery", desc: "Order before 2pm for delivery today within 5km radius" },
              { icon: Shield, title: "Quality Guaranteed", desc: "All products sourced directly from trusted suppliers" },
              { icon: Star, title: "Best Prices", desc: "Competitive pricing with weekly offers and discounts" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-5 bg-card rounded-xl border border-card-border">
                <div className="p-2.5 bg-primary/10 rounded-lg h-fit">
                  <Icon size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-sm">{title}</h3>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* Categories */}
      <RevealSection>
        <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">Browse By</p>
              <h2 className="text-2xl font-bold">Product Categories</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.length === 0
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
                ))
              : categories.map(cat => (
                  <Link key={cat.id} href={`/shop?category=${cat.slug}`}>
                    <div className="flex flex-col items-center gap-3 p-4 bg-card rounded-xl border border-card-border hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group">
                      <span className="text-3xl">{categoryIcons[cat.slug] || "🛒"}</span>
                      <div className="text-center">
                        <p className="text-xs font-semibold group-hover:text-primary transition-colors text-center leading-tight">{cat.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{cat.productCount} items</p>
                      </div>
                    </div>
                  </Link>
                ))}
          </div>
        </section>
      </RevealSection>

      {/* Featured Products */}
      <RevealSection>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">Handpicked for You</p>
              <h2 className="text-2xl font-bold">Featured Products</h2>
            </div>
            <Link href="/shop">
              <button className="flex items-center gap-1 text-sm text-primary font-medium hover:underline">
                View All <ArrowRight size={16} />
              </button>
            </Link>
          </div>
          {featured.length === 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-72 rounded-xl bg-muted animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {featured.slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>
          )}
        </section>
      </RevealSection>

      {/* About / Story */}
      <RevealSection>
        <section className="bg-card border-y border-card-border py-16 mb-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-2">Our Story</p>
                <h2 className="text-3xl font-bold mb-4">Serving the Community<br />for 40 Years</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Sangam Kirana Store started as a small family-run shop in 1985. What began with a dream to serve our neighbors with quality groceries has grown into a trusted household name in Jaipur.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  We believe that good food starts with quality ingredients. Every product on our shelves is selected with care — sourced from trusted farmers and suppliers who share our commitment to quality.
                </p>
                <Link href="/shop">
                  <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors">
                    Explore Our Products <ArrowRight size={18} />
                  </button>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=400"
                  alt="Fresh produce"
                  className="rounded-xl h-48 object-cover w-full"
                />
                <img
                  src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=400"
                  alt="Spices"
                  className="rounded-xl h-48 object-cover w-full mt-8"
                />
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      <Footer />
    </div>
  );
}
