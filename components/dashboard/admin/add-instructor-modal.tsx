"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api-client/core";
import { InstructorCreatedSummaryView } from "./instructors/instructor-created-summary-view";
import { InstructorRegistrationForm } from "./instructors/instructor-registration-form";

interface AddInstructorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (instructorData: {
    id: string;
    name: string;
    email: string;
    dept: string;
    designation: string;
    phone: string;
    room: string;
    otp: string;
    tempPass: string;
  }) => void;
}

export function AddInstructorModal({
  isOpen,
  onClose,
  onCreated,
}: AddInstructorModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dept, setDept] = useState("CSE");
  const [designation, setDesignation] = useState("Assistant Professor");
  const [phone, setPhone] = useState("");
  const [room, setRoom] = useState("AB2-502");
  const [specialization, setSpecialization] = useState("");
  const [sendEmailNotification, setSendEmailNotification] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdSummary, setCreatedSummary] = useState<{
    name: string;
    email: string;
    empId: string;
    otp: string;
    tempPass: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !email.trim()) return;

    setIsSubmitting(true);

    const generatedOtp = String(Math.floor(100000 + Math.random() * 900000));
    const generatedPass = `Bidyapith@${Math.floor(1000 + Math.random() * 9000)}`;
    const empId = `EMP-${dept}-${Math.floor(100 + Math.random() * 900)}`;
    const fullName = `${designation.includes("Prof") ? "Prof. " : ""}${firstName.trim()} ${lastName.trim()}`.trim();

    try {
      try {
        await apiRequest("/instructors", {
          method: "POST",
          body: JSON.stringify({
            name: fullName,
            email: email.trim().toLowerCase(),
            department: dept,
            designation,
            phone: phone.trim(),
            room: room.trim(),
            specialization: specialization.trim(),
            initialPassword: generatedPass,
            securityOtp: generatedOtp,
            sendEmail: sendEmailNotification,
          }),
        });
      } catch {}

      onCreated({
        id: empId,
        name: fullName,
        email: email.trim().toLowerCase(),
        dept,
        designation,
        phone: phone.trim() || "+880 1712 000000",
        room: room.trim() || "AB2-101",
        otp: generatedOtp,
        tempPass: generatedPass,
      });

      if (sendEmailNotification) {
        toast.success(`Congratulatory email & login OTP sent to ${email.trim()}`);
      }

      setCreatedSummary({
        name: fullName,
        email: email.trim().toLowerCase(),
        empId,
        otp: generatedOtp,
        tempPass: generatedPass,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-xl rounded-md sm:rounded-lg border border-white/15 bg-night-900/98 shadow-2xl backdrop-blur-2xl text-ink overflow-hidden flex flex-col max-h-[92vh]">
        {createdSummary ? (
          <InstructorCreatedSummaryView
            summary={createdSummary}
            onClose={onClose}
          />
        ) : (
          <InstructorRegistrationForm
            firstName={firstName}
            onFirstNameChange={setFirstName}
            lastName={lastName}
            onLastNameChange={setLastName}
            email={email}
            onEmailChange={setEmail}
            phone={phone}
            onPhoneChange={setPhone}
            dept={dept}
            onDeptChange={setDept}
            designation={designation}
            onDesignationChange={setDesignation}
            room={room}
            onRoomChange={setRoom}
            specialization={specialization}
            onSpecializationChange={setSpecialization}
            sendEmailNotification={sendEmailNotification}
            onSendEmailNotificationChange={setSendEmailNotification}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
}
