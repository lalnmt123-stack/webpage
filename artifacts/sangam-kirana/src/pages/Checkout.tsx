import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreditCard, Lock, CheckCircle, Smartphone } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCreateOrder } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Footer } from "@/components/Footer";
import { Link } from "wouter";

const schema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerEmail: z.string().email("Valid email required"),
  customerPhone: z.string().min(10, "Phone number required"),
  address: z.string().min(10, "Full address required"),
  paymentMethod: z.enum(["card", "upi", "cod"]),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvv: z.string().optional(),
  cardName: z.string().optional(),
  upiId: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function Checkout() {
  const [, navigate] = useLocation();
  const { items, total, clearCart } = useCart();
  const queryClient = useQueryClient();
  const [submitting, setSubmitting] = useState(false);

  const { mutate: createOrder } = useCreateOrder({
    mutation: {
      onSuccess: (order) => {
        clearCart();
        queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
        navigate(`/order-success?id=${order.id}`);
      },
      onError: () => {
        setSubmitting(false);
        alert("Something went wrong. Please try again.");
      }
    }
  });

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { paymentMethod: "card" },
  });

  const paymentMethod = watch("paymentMethod");
  const deliveryFee = total > 500 ? 0 : 40;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold mb-2">Nothing to checkout</h2>
        <p className="text-muted-foreground mb-4">Your cart is empty.</p>
        <Link href="/shop"><button className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors">Shop Now</button></Link>
      </div>
    );
  }

  const onSubmit = (data: FormData) => {
    setSubmitting(true);
    createOrder({
      data: {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        address: data.address,
        items: items.map(i => ({ productId: i.productId, productName: i.name, quantity: i.quantity, price: i.price })),
        total: total + deliveryFee,
        paymentMethod: data.paymentMethod,
        cardNumber: data.cardNumber || null,
        cardExpiry: data.cardExpiry || null,
        cardCvv: data.cardCvv || null,
      },
    });
  };

  return (
    <div className="min-h-screen">
      <div className="bg-foreground text-background py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="text-background/60 mt-1 text-sm">Complete your order</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Info */}
              <div className="bg-card border border-card-border rounded-xl p-6">
                <h2 className="font-bold text-lg mb-4">Delivery Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">Full Name *</label>
                    <input {...register("customerName")} placeholder="Rajesh Kumar" className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    {errors.customerName && <p className="text-xs text-destructive mt-1">{errors.customerName.message}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">Email *</label>
                    <input {...register("customerEmail")} type="email" placeholder="rajesh@email.com" className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    {errors.customerEmail && <p className="text-xs text-destructive mt-1">{errors.customerEmail.message}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">Phone *</label>
                    <input {...register("customerPhone")} placeholder="+91 98765 43210" className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    {errors.customerPhone && <p className="text-xs text-destructive mt-1">{errors.customerPhone.message}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">Delivery Address *</label>
                    <textarea {...register("address")} rows={2} placeholder="House No, Street, Area, City, State - PIN" className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                    {errors.address && <p className="text-xs text-destructive mt-1">{errors.address.message}</p>}
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-card border border-card-border rounded-xl p-6">
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Lock size={18} className="text-primary" /> Payment Method
                </h2>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { value: "card", label: "Credit / Debit Card", icon: CreditCard },
                    { value: "upi", label: "UPI", icon: Smartphone },
                    { value: "cod", label: "Cash on Delivery", icon: CheckCircle },
                  ].map(({ value, label, icon: Icon }) => (
                    <label key={value} className={`flex flex-col items-center gap-2 p-3 border rounded-xl cursor-pointer transition-colors ${paymentMethod === value ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                      <input type="radio" {...register("paymentMethod")} value={value} className="sr-only" />
                      <Icon size={20} className={paymentMethod === value ? "text-primary" : "text-muted-foreground"} />
                      <span className="text-xs font-medium text-center leading-tight">{label}</span>
                    </label>
                  ))}
                </div>

                {paymentMethod === "card" && (
                  <div className="space-y-4 border-t border-border pt-5">
                    <div className="bg-gradient-to-br from-primary to-secondary text-white p-5 rounded-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                      <p className="text-xs opacity-70 mb-3 uppercase tracking-widest">Sample Payment Card</p>
                      <p className="font-mono text-lg tracking-widest mb-4">{watch("cardNumber") || "•••• •••• •••• ••••"}</p>
                      <div className="flex justify-between">
                        <div>
                          <p className="text-xs opacity-70">Card Holder</p>
                          <p className="text-sm font-medium">{watch("cardName") || "YOUR NAME"}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs opacity-70">Expires</p>
                          <p className="text-sm font-medium">{watch("cardExpiry") || "MM/YY"}</p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Card Number</label>
                        <input {...register("cardNumber")} placeholder="4242 4242 4242 4242" maxLength={19} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Cardholder Name</label>
                        <input {...register("cardName")} placeholder="Rajesh Kumar" className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Expiry Date</label>
                        <input {...register("cardExpiry")} placeholder="MM/YY" maxLength={5} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">CVV</label>
                        <input {...register("cardCvv")} placeholder="•••" maxLength={4} type="password" className="w-full px-3 py-2.5 border border-border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Lock size={11} /> This is a sample payment gateway. No real charges will be made.
                    </p>
                  </div>
                )}

                {paymentMethod === "upi" && (
                  <div className="border-t border-border pt-5">
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">UPI ID</label>
                    <input {...register("upiId")} placeholder="yourname@upi" className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    <p className="text-xs text-muted-foreground mt-2">Sample UPI payment simulation.</p>
                  </div>
                )}

                {paymentMethod === "cod" && (
                  <div className="border-t border-border pt-5">
                    <div className="flex items-start gap-3 bg-muted rounded-lg p-4">
                      <CheckCircle size={18} className="text-secondary mt-0.5 shrink-0" />
                      <p className="text-sm text-muted-foreground">Pay with cash when your order is delivered. Our delivery person will collect the payment.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-card border border-card-border rounded-xl p-5 sticky top-20">
                <h2 className="font-bold text-lg mb-4">Order Summary</h2>
                <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                  {items.map(item => (
                    <div key={item.productId} className="flex gap-3">
                      <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-muted shrink-0" onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/40x40/f5ece0/a05c2c?text=P"; }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">× {item.quantity}</p>
                      </div>
                      <span className="text-xs font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-3 space-y-1.5 mb-4">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>₹{total.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Delivery</span><span className={deliveryFee === 0 ? "text-secondary font-medium" : ""}>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span></div>
                </div>
                <div className="flex justify-between font-bold text-lg border-t border-border pt-3 mb-5">
                  <span>Total</span>
                  <span className="text-primary">₹{(total + deliveryFee).toFixed(2)}</span>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <><Lock size={16} /> Place Order</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
      <Footer />
    </div>
  );
}
