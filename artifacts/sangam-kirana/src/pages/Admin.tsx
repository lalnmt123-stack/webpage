import { useState } from "react";
import { Shield, Plus, Edit, Trash2, Package, ShoppingBag, TrendingUp, Tag, Eye, EyeOff, X, Check } from "lucide-react";
import {
  useListProducts,
  useListOrders,
  useGetStoreSummary,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  getListProductsQueryKey,
  getGetStoreSummaryQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import type { ProductData } from "@/components/ProductCard";

const ADMIN_PASSWORD = "admin123";

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);

  const attempt = () => {
    if (pw === ADMIN_PASSWORD) { onLogin(); }
    else { setError(true); setTimeout(() => setError(false), 2000); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-card border border-card-border rounded-2xl shadow-lg p-8 max-w-sm w-full animate-fade-in-up">
        <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Shield size={28} className="text-primary" />
        </div>
        <h1 className="text-xl font-bold text-center mb-1">Admin Access</h1>
        <p className="text-sm text-muted-foreground text-center mb-6">Enter admin password to continue</p>
        <div className="relative mb-4">
          <input
            type={show ? "text" : "password"}
            value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === "Enter" && attempt()}
            placeholder="Enter password"
            className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 pr-10 ${error ? "border-destructive" : "border-border"}`}
          />
          <button onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {error && <p className="text-xs text-destructive mb-3 text-center">Incorrect password</p>}
        <button onClick={attempt} className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors text-sm">
          Login
        </button>
        <p className="text-xs text-muted-foreground text-center mt-4">Default: admin123</p>
      </div>
    </div>
  );
}

function ProductForm({ initial, onSave, onCancel }: {
  initial?: Partial<ProductData>;
  onSave: (data: any) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    price: initial?.price?.toString() ?? "",
    originalPrice: initial?.originalPrice?.toString() ?? "",
    category: initial?.category ?? "grains-pulses",
    imageUrl: initial?.imageUrl ?? "",
    stock: initial?.stock?.toString() ?? "10",
    unit: initial?.unit ?? "kg",
    featured: initial?.featured ?? false,
  });

  const categories = ["grains-pulses", "spices-masalas", "dairy-eggs", "snacks-beverages", "cooking-oils", "household"];
  const units = ["kg", "g", "L", "ml", "pcs", "pack", "100g", "250g", "500g"];

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.name || !form.price || !form.category || !form.imageUrl || !form.stock) {
      alert("Please fill all required fields.");
      return;
    }
    onSave({
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
      category: form.category,
      imageUrl: form.imageUrl,
      stock: parseInt(form.stock),
      unit: form.unit,
      featured: form.featured,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-card border-b border-border p-5 flex items-center justify-between">
          <h2 className="font-bold text-lg">{initial?.id ? "Edit Product" : "Add New Product"}</h2>
          <button onClick={onCancel} className="p-1.5 hover:bg-muted rounded-lg transition-colors"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Product Name *</label>
              <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Basmati Rice" className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
              <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={2} placeholder="Product description..." className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Price (₹) *</label>
              <input type="number" value={form.price} onChange={e => set("price", e.target.value)} placeholder="150" className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Original Price (₹)</label>
              <input type="number" value={form.originalPrice} onChange={e => set("originalPrice", e.target.value)} placeholder="200 (for discount)" className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Category *</label>
              <select value={form.category} onChange={e => set("category", e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                {categories.map(c => <option key={c} value={c}>{c.replace(/-/g, " ")}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Unit</label>
              <select value={form.unit} onChange={e => set("unit", e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                {units.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Stock *</label>
              <input type="number" value={form.stock} onChange={e => set("stock", e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Image URL *</label>
              <input value={form.imageUrl} onChange={e => set("imageUrl", e.target.value)} placeholder="https://images.unsplash.com/..." className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="sm:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <div className={`w-10 h-5 rounded-full transition-colors ${form.featured ? "bg-primary" : "bg-muted"} relative`} onClick={() => set("featured", !form.featured)}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${form.featured ? "left-5" : "left-0.5"}`} />
                </div>
                <span className="text-sm font-medium">Mark as Featured</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onCancel} className="flex-1 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
            <button onClick={submit} className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
              <Check size={16} /> {initial?.id ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [tab, setTab] = useState<"products" | "orders">("products");
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<ProductData | null>(null);

  const qc = useQueryClient();
  const { data: products = [], isLoading: loadingProducts } = useListProducts();
  const { data: orders = [], isLoading: loadingOrders } = useListOrders();
  const { data: summary } = useGetStoreSummary();

  const { mutate: createProduct } = useCreateProduct({
    mutation: {
      onSuccess: () => { qc.invalidateQueries({ queryKey: getListProductsQueryKey() }); qc.invalidateQueries({ queryKey: getGetStoreSummaryQueryKey() }); setShowForm(false); }
    }
  });

  const { mutate: updateProduct } = useUpdateProduct({
    mutation: {
      onSuccess: () => { qc.invalidateQueries({ queryKey: getListProductsQueryKey() }); setEditProduct(null); }
    }
  });

  const { mutate: deleteProduct } = useDeleteProduct({
    mutation: {
      onSuccess: () => { qc.invalidateQueries({ queryKey: getListProductsQueryKey() }); qc.invalidateQueries({ queryKey: getGetStoreSummaryQueryKey() }); }
    }
  });

  if (!authenticated) return <AdminLogin onLogin={() => setAuthenticated(true)} />;

  return (
    <div className="min-h-screen bg-muted">
      <div className="bg-foreground text-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Shield size={24} className="text-accent" />
            <div>
              <h1 className="text-2xl font-bold">Admin Panel</h1>
              <p className="text-background/60 text-sm">Sangam Kirana Store Management</p>
            </div>
            <button onClick={() => setAuthenticated(false)} className="ml-auto text-xs text-background/40 hover:text-background/70 border border-background/20 px-3 py-1.5 rounded-lg transition-colors">Logout</button>
          </div>
        </div>
      </div>

      {/* Stats */}
      {summary && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Total Products", value: summary.totalProducts, icon: Package, color: "text-primary" },
              { label: "Total Orders", value: summary.totalOrders, icon: ShoppingBag, color: "text-secondary" },
              { label: "Revenue", value: `₹${summary.totalRevenue.toFixed(0)}`, icon: TrendingUp, color: "text-accent" },
              { label: "Categories", value: summary.categories, icon: Tag, color: "text-primary" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-card border border-card-border rounded-xl p-4">
                <Icon size={18} className={`${color} mb-2`} />
                <div className="text-xl font-bold">{value}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex gap-2 mb-5">
          <button onClick={() => setTab("products")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "products" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:border-primary/40"}`}>
            Products ({products.length})
          </button>
          <button onClick={() => setTab("orders")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "orders" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:border-primary/40"}`}>
            Orders ({orders.length})
          </button>
          {tab === "products" && (
            <button onClick={() => setShowForm(true)} className="ml-auto flex items-center gap-1.5 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/90 transition-colors">
              <Plus size={16} /> Add Product
            </button>
          )}
        </div>

        {tab === "products" && (
          <div className="bg-card border border-card-border rounded-xl overflow-hidden">
            {loadingProducts ? (
              <div className="p-8 text-center text-muted-foreground text-sm">Loading products...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Product</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Category</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Price</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Stock</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Featured</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-muted/50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-muted" onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/40x40/f5ece0/a05c2c?text=P"; }} />
                            <span className="font-medium text-sm truncate max-w-[120px]">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs hidden sm:table-cell capitalize">{(p.category || "").replace(/-/g, " ")}</td>
                        <td className="px-4 py-3 font-semibold text-primary">₹{p.price}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs hidden md:table-cell">{p.stock} {p.unit}</td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${p.featured ? "bg-accent/20 text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                            {p.featured ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setEditProduct(p as any)}
                              className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => { if (window.confirm(`Delete "${p.name}"?`)) deleteProduct({ id: p.id }); }}
                              className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === "orders" && (
          <div className="bg-card border border-card-border rounded-xl overflow-hidden">
            {loadingOrders ? (
              <div className="p-8 text-center text-muted-foreground text-sm">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">No orders yet</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Order ID</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Customer</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Items</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Payment</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {orders.map(o => (
                      <tr key={o.id} className="hover:bg-muted/50">
                        <td className="px-4 py-3 font-mono text-xs">#{o.id}</td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-sm">{o.customerName}</p>
                            <p className="text-xs text-muted-foreground">{o.customerEmail}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">{(o.items as any[]).length} item(s)</td>
                        <td className="px-4 py-3 font-bold text-primary">₹{o.total.toFixed(2)}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground uppercase hidden md:table-cell">{o.paymentMethod}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-full font-medium capitalize">{o.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {showForm && (
        <ProductForm
          onSave={(data) => createProduct({ data })}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editProduct && (
        <ProductForm
          initial={editProduct}
          onSave={(data) => updateProduct({ id: editProduct.id, data })}
          onCancel={() => setEditProduct(null)}
        />
      )}
    </div>
  );
}
