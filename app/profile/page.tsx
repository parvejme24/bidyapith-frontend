"use client";

import React from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ProfileView } from "@/components/dashboard/profile/profile-view";

export default function ProfilePage() {
  return (
    <DashboardLayout
      title="User Profile"
      subtitle="Your account settings, contact details, and security credentials"
      crumb="Account"
    >
      <ProfileView />
    </DashboardLayout>
  );
}
