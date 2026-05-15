"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Loader2 } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayButtonProps {
  amount: number;
  planName: string;
  onSuccess?: () => void;
  className?: string;
}

export function RazorpayButton({ amount, planName, onSuccess, className }: RazorpayButtonProps) {
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const loadScript = (src: string) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);

    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      addToast({
        title: "Error",
        message: "Razorpay SDK failed to load. Are you online?",
        type: "error",
      });
      setLoading(false);
      return;
    }

    try {
      // Create Order
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const orderData = await orderRes.json();

      if (orderData.error) throw new Error(orderData.error);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "CAFlow AI",
        description: `Subscription for ${planName} Plan`,
        order_id: orderData.id,
        handler: async function (response: any) {
          // Verify Payment
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();

          if (verifyData.message) {
            addToast({
              title: "Success",
              message: "Payment successful! Your plan has been upgraded.",
              type: "success",
            });
            if (onSuccess) onSuccess();
          } else {
            addToast({
              title: "Error",
              message: "Payment verification failed.",
              type: "error",
            });
          }
        },
        prefill: {
          name: "CA User",
          email: "user@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#d97706", // Amber-600
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error: any) {
      addToast({
        title: "Error",
        message: error.message || "Something went wrong during payment.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={loading}
      className={`w-full ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          Processing...
        </>
      ) : (
        `Pay ${new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(amount)}`
      )}
    </Button>
  );
}
