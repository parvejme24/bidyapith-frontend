"use client";

import React, { Suspense } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { CheckoutView } from "@/components/dashboard/student/checkout/checkout-view";
import { RefreshCw } from "lucide-react";

export default function StudentCheckoutPage() {
  const [isSuccess, setIsSuccess] = React.useState(false);

  return (
    <DashboardLayout
      requiredRole="student"
      title={isSuccess ? "Tuition Payment Receipt" : "Tuition Checkout & Payment"}
      subtitle={
        isSuccess
          ? "Official Verification & Course Unlock Confirmation"
          : "Secure Payment Gateway · SSLCommerz & Stripe"
      }
      crumb={isSuccess ? "Student / Payment Receipt" : "Student / Checkout"}
    >
      <Suspense
        fallback={
          <div className="p-12 text-center text-ink-muted flex items-center justify-center gap-2">
            <RefreshCw className="size-5 animate-spin text-jade" />
            <span>Loading secure checkout session...</span>
          </div>
        }
      >
        <CheckoutView onPaymentSuccess={() => setIsSuccess(true)} />
      </Suspense>
    </DashboardLayout>
  );
}

