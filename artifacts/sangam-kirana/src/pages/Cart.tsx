import { Link } from "wouter";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Footer } from "@/components/Footer";

export default function Cart() {
  const { items, removeItem, updateQty, total, count } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center px-4">
          <ShoppingBag size={64} className="text-muted-foreground/30 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Add some products to get started!</p>
          <Link href="/shop">
            <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors">
              <ShoppingBag size={18} /> Browse Products
            </button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="bg-foreground text-background py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Your Cart</h1>
          <p className="text-background/60 mt-1 text-sm">{count} item{count !== 1 ? "s" : ""} in your cart</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.productId} className="flex gap-4 bg-card rounded-xl p-4 border border-card-border">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg bg-muted"
                  onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/80x80/f5ece0/a05c2c?text=P"; }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{item.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">₹{item.price} / {item.unit}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-border rounded-lg overflow-hidden">
                      <button onClick={() => updateQty(item.productId, item.quantity - 1)} className="px-2.5 py-1 hover:bg-muted transition-colors text-sm">
                        <Minus size={13} />
                      </button>
                      <span className="px-3 py-1 text-sm font-semibold border-x border-border">{item.quantity}</span>
                      <button onClick={() => updateQty(item.productId, item.quantity + 1)} className="px-2.5 py-1 hover:bg-muted transition-colors text-sm">
                        <Plus size={13} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div>
            <div className="bg-card border border-card-border rounded-xl p-5 sticky top-20">
              <h2 className="font-bold text-lg mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                {items.map(item => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-muted-foreground truncate mr-2">{item.name} × {item.quantity}</span>
                    <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="text-secondary font-medium">{total > 500 ? "FREE" : "₹40.00"}</span>
                </div>
                {total <= 500 && <p className="text-xs text-muted-foreground mt-1">Add ₹{(500 - total).toFixed(2)} more for free delivery</p>}
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-border pt-3 mb-5">
                <span>Total</span>
                <span className="text-primary">₹{(total > 500 ? total : total + 40).toFixed(2)}</span>
              </div>
              <Link href="/checkout">
                <button className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors">
                  Proceed to Checkout <ArrowRight size={18} />
                </button>
              </Link>
              <Link href="/shop">
                <button className="w-full text-center text-sm text-muted-foreground mt-3 hover:text-primary transition-colors">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
