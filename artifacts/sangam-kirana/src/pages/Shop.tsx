import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useListProducts, useListCategories } from "@workspace/api-client-react";
import { ProductCard } from "@/components/ProductCard";
import { Footer } from "@/components/Footer";

export default function Shop() {
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const initialCategory = params.get("category") || "";

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const queryParams: { category?: string; search?: string } = {};
  if (category) queryParams.category = category;
  if (debouncedSearch) queryParams.search = debouncedSearch;

  const { data: products = [], isLoading } = useListProducts(queryParams);
  const { data: categories = [] } = useListCategories();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-foreground text-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-background/50 uppercase tracking-widest mb-2">Sangam Kirana Store</p>
          <h1 className="text-3xl font-bold">Our Products</h1>
          <p className="text-background/60 mt-2 text-sm">
            {products.length} product{products.length !== 1 ? "s" : ""} available
            {category ? ` in "${category.replace(/-/g, " ")}"` : ""}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setCategory("")}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${!category ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:border-primary/40"}`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.slug}
                onClick={() => setCategory(category === cat.slug ? "" : cat.slug)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${category === cat.slug ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:border-primary/40"}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Active filter */}
        {(category || search) && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-xs text-muted-foreground"><SlidersHorizontal size={12} className="inline mr-1" />Filters:</span>
            {category && (
              <span className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                {category.replace(/-/g, " ")}
                <button onClick={() => setCategory("")}><X size={12} /></button>
              </span>
            )}
            {search && (
              <span className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                "{search}"
                <button onClick={() => setSearch("")}><X size={12} /></button>
              </span>
            )}
          </div>
        )}

        {/* Products grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-72 rounded-xl bg-muted animate-pulse" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground text-sm">Try different search terms or browse all categories</p>
            <button onClick={() => { setSearch(""); setCategory(""); }} className="mt-4 px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map(product => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
