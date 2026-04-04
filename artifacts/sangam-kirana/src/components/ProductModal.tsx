import { useState } from "react";
import { X, ShoppingCart, Zap, Plus, Minus, Star, Package, Tag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLocation } from "wouter";
import type { ProductData } from "./ProductCard";

interface Props {
  product: ProductData;
  open: boolean;
  onClose: () => void;
}

export function ProductModal({ product, open, onClose }: Props) {
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const [, navigate] = useLocation();
  const [added, setAdded] = useState(false);

  if (!open) return null;

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null;

  const handleAddToCart = () => {
    addItem({ productId: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl, unit: product.unit }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem({ productId: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl, unit: product.unit }, qty);
    onClose();
    navigate("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-card rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 bg-background/80 rounded-full hover:bg-muted transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-2/5 h-64 sm:h-auto relative bg-muted">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://placehold.co/400x400/f5ece0/a05c2c?text=Product";
              }}
            />
            {discount && (
              <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                <Tag size={11} /> {discount}% OFF
              </span>
            )}
            {product.featured && (
              <span className="absolute bottom-3 left-3 bg-accent text-accent-foreground text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                <Star size={11} fill="currentColor" /> Featured
              </span>
            )}
          </div>

          <div className="sm:w-3/5 p-6 flex flex-col">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{product.category.replace(/-/g, " ")}</p>
            <h2 className="text-xl font-bold text-foreground mb-2">{product.name}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{product.description}</p>

            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-2xl font-bold text-primary">₹{product.price}</span>
              <span className="text-sm text-muted-foreground">/ {product.unit}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
              <Package size={13} />
              <span>{product.stock > 0 ? `${product.stock} units available` : "Out of stock"}</span>
            </div>

            <div className="flex items-center gap-3 mb-5">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="px-3 py-1.5 hover:bg-muted transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="px-4 py-1.5 font-semibold text-sm border-x border-border">{qty}</span>
                <button
                  onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                  className="px-3 py-1.5 hover:bg-muted transition-colors"
                  disabled={qty >= product.stock}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="flex gap-3 mt-auto">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                  added
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/30"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <ShoppingCart size={16} />
                {added ? "Added!" : "Add to Cart"}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap size={16} />
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
