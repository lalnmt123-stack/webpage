import { useState } from "react";
import { ShoppingCart, Star, Tag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { ProductModal } from "./ProductModal";

export interface ProductData {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  category: string;
  imageUrl: string;
  stock: number;
  unit: string;
  featured: boolean;
  createdAt: string;
}

export function ProductCard({ product }: { product: ProductData }) {
  const [open, setOpen] = useState(false);
  const { addItem } = useCart();
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null;

  return (
    <>
      <div
        className="product-card bg-card rounded-xl overflow-hidden border border-card-border cursor-pointer group"
        onClick={() => setOpen(true)}
      >
        <div className="relative h-48 overflow-hidden bg-muted">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://placehold.co/400x300/f5ece0/a05c2c?text=Product";
            }}
          />
          {discount && (
            <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Tag size={10} /> {discount}% OFF
            </span>
          )}
          {product.featured && (
            <span className="absolute top-2 right-2 bg-accent text-accent-foreground text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Star size={10} fill="currentColor" /> Featured
            </span>
          )}
        </div>
        <div className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{product.category.replace(/-/g, " ")}</p>
          <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-1">{product.name}</h3>
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-primary text-base">₹{product.price}</span>
              <span className="text-xs text-muted-foreground ml-1">/ {product.unit}</span>
              {product.originalPrice && (
                <span className="text-xs text-muted-foreground line-through ml-2">₹{product.originalPrice}</span>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                addItem({ productId: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl, unit: product.unit });
              }}
              className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <ShoppingCart size={16} />
            </button>
          </div>
          {product.stock <= 5 && product.stock > 0 && (
            <p className="text-xs text-destructive mt-2">Only {product.stock} left!</p>
          )}
          {product.stock === 0 && (
            <p className="text-xs text-muted-foreground mt-2">Out of stock</p>
          )}
        </div>
      </div>
      <ProductModal product={product} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
