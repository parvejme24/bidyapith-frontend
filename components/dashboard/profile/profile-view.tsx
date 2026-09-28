"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/app-context";
import { DB } from "@/lib/data";
import { AvatarCard } from "./avatar-card";
import { ContactInfoForm } from "./contact-info-form";
import { SecuritySettingsCard } from "./security-settings-card";

export function ProfileView() {
  const { user, updateUser, role } = useApp();

  const [phone, setPhone] = useState(user.phone || "");
  const [altEmail, setAltEmail] = useState(user.altEmail || "");
  const [address, setAddress] = useState(user.address || DB.meta.address || "");

  const [savedBaseline, setSavedBaseline] = useState({
    phone: user.phone || "",
    altEmail: user.altEmail || "",
    address: user.address || DB.meta.address || "",
  });

  // Keep state in sync with user
  React.useEffect(() => {
    const nextBaseline = {
      phone: user.phone || "",
      altEmail: user.altEmail || "",
      address: user.address || DB.meta.address || "",
    };
    setPhone(nextBaseline.phone);
    setAltEmail(nextBaseline.altEmail);
    setAddress(nextBaseline.address);
    setSavedBaseline(nextBaseline);
  }, [user.id, user.phone, user.altEmail, user.address]);

  const isDirty =
    phone !== savedBaseline.phone ||
    altEmail !== savedBaseline.altEmail ||
    address !== savedBaseline.address;

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDirty) return;
    updateUser({ phone, altEmail, address });
    setSavedBaseline({ phone, altEmail, address });
  };

  const handleAvatarUpdated = (newAvatarUrl: string) => {
    updateUser({ avatar: newAvatarUrl });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px] items-start">
      {/* Left Column: Profile Card & Edit Contact */}
      <div className="space-y-6">
        <AvatarCard
          user={user}
          role={role}
          onAvatarUpdated={handleAvatarUpdated}
          phone={phone}
          altEmail={altEmail}
          address={address}
        />

        <ContactInfoForm
          phone={phone}
          setPhone={setPhone}
          altEmail={altEmail}
          setAltEmail={setAltEmail}
          address={address}
          setAddress={setAddress}
          isDirty={isDirty}
          onSave={handleSaveContact}
        />
      </div>

      {/* Right Column: Password & Active Sessions */}
      <SecuritySettingsCard />
    </div>
  );
}
