"use client";

import React, { Suspense } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { CheckoutView } from "@/components/dashboard/student/checkout/checkout-view";
import { RefreshCw } from "lucide-react";

export default function StudentCheckoutPage() {
  return (
    <DashboardLayout
      requiredRole="student"
      title="Tuition Checkout & Payment"
      subtitle="Secure Payment Gateway · SSLCommerz & Stripe"
      crumb="Student / Checkout"
    >
      <Suspense
        fallback={
          <div className="p-12 text-center text-ink-muted flex items-center justify-center gap-2">
            <RefreshCw className="size-5 animate-spin text-jade" />
            <span>Loading secure checkout session...</span>
          </div>
        }
      >
        <CheckoutView />
      </Suspense>
    </DashboardLayout>
  );
}
