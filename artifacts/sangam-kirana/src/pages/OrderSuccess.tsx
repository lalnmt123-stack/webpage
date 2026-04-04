import { useEffect, useState } from "react";
import { Link } from "wouter";
import { CheckCircle, ShoppingBag, Home, Package } from "lucide-react";
import { useGetOrder } from "@workspace/api-client-react";

export default function OrderSuccess() {
  const [orderId, setOrderId] = useState<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) setOrderId(parseInt(id));
  }, []);

  const { data: order } = useGetOrder(orderId ?? 0, {
    query: { enabled: !!orderId }
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="bg-card border border-card-border rounded-2xl shadow-lg p-10 max-w-lg w-full animate-fade-in-up">
        <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={40} className="text-secondary" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
          Thank you for shopping at Sangam Kirana Store. Your order has been placed successfully.
        </p>

        {order && (
          <div className="bg-muted rounded-xl p-4 mb-6 text-left">
            <div className="flex items-center gap-2 mb-3">
              <Package size={16} className="text-primary" />
              <span className="font-semibold text-sm">Order #{order.id}</span>
              <span className="ml-auto text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-full font-medium capitalize">{order.status}</span>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground"><span className="font-medium text-foreground">Name:</span> {order.customerName}</p>
              <p className="text-xs text-muted-foreground"><span className="font-medium text-foreground">Email:</span> {order.customerEmail}</p>
              <p className="text-xs text-muted-foreground"><span className="font-medium text-foreground">Payment:</span> {order.paymentMethod.toUpperCase()}</p>
            </div>
            <div className="border-t border-border mt-3 pt-3">
              <div className="space-y-1">
                {(order.items as any[]).map((item: any, i: number) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{item.productName} × {item.quantity}</span>
                    <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-bold text-sm mt-2 pt-2 border-t border-border">
                <span>Total Paid</span>
                <span className="text-primary">₹{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/" className="flex-1">
            <button className="w-full flex items-center justify-center gap-2 px-5 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-muted transition-colors">
              <Home size={16} /> Home
            </button>
          </Link>
          <Link href="/shop" className="flex-1">
            <button className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
              <ShoppingBag size={16} /> Shop More
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
