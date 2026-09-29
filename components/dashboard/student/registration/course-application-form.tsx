"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Sparkles, ShieldCheck } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { useSubmitAdmissionMutation } from "@/lib/redux/api/admissionsApi";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";
import type { AttachedDocument } from "@/lib/app-types";
import { getCoursePublicDetails } from "./course-catalog-data";
import type { PublicCourseDetails } from "./course-public-details-modal";
import { CourseAppBanner } from "./application/course-app-banner";
import { ApplicantProfileSection } from "./application/applicant-profile-section";
import { DocumentAttachmentsSection } from "./application/document-attachments-section";
import { StatementPurposeSection } from "./application/statement-purpose-section";
import { DocumentPreviewModal } from "./application/document-preview-modal";

interface CourseApplicationFormProps {
  courseCode: string;
}

export function CourseApplicationForm({ courseCode }: CourseApplicationFormProps) {
  const router = useRouter();
  const { user, student, submitAdmissionApplication } = useApp();

  const course: PublicCourseDetails = getCoursePublicDetails(courseCode);

  // Form State
  const [studentName, setStudentName] = useState(user.name || "Student Name");
  const [studentId, setStudentId] = useState(user.id || "2024-BSC-CSE-1001");
  const [email, setEmail] = useState(user.email || "student@bidyapith.edu.bd");
  const [phone, setPhone] = useState(user.phone || "+880 1712 345678");
  const [department, setDepartment] = useState(user.dept?.toUpperCase() || "CSE");
  const [cgpa, setCgpa] = useState(student.cgpa.toString());
  const [creditsDone, setCreditsDone] = useState(student.creditsDone.toString());
  const [motivation, setMotivation] = useState(
    `I wish to enroll in ${course.code}: ${course.title} to advance my theoretical mastery and practical engineering competencies under the instruction of ${course.instructor}. I have reviewed the prerequisites and prepared the attached academic credentials.`
  );
  const [termsAgreed, setTermsAgreed] = useState(true);

  // Attached Documents State
  const [attachedDocs, setAttachedDocs] = useState<AttachedDocument[]>([
    {
      id: "doc-1",
      name: "Official_Academic_Transcript_Sem1-4.pdf",
      size: "1.4 MB",
      type: "Academic Transcript",
      uploadedAt: new Date().toISOString().slice(0, 10),
    },
    {
      id: "doc-2",
      name: `${course.prereq || "Prerequisite"}_Completion_Marksheet.pdf`,
      size: "820 KB",
      type: "Prerequisite Marksheet",
      uploadedAt: new Date().toISOString().slice(0, 10),
    },
  ]);

  const [previewDoc, setPreviewDoc] = useState<AttachedDocument | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submitAdmissionApi] = useSubmitAdmissionMutation();

  const handleAddDoc = (doc: AttachedDocument) => {
    setAttachedDocs((prev) => [...prev, doc]);
  };

  const handleRemoveDoc = (id: string) => {
    setAttachedDocs((prev) => prev.filter((d) => d.id !== id));
    toast.info("Document attachment removed.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (attachedDocs.length === 0) {
      toast.error(
        "Please attach at least one academic document (transcript or prerequisite marksheet)."
      );
      return;
    }

    if (!termsAgreed) {
      toast.error("Please accept the academic integrity and verification agreement.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      studentName,
      studentEmail: email,
      email,
      phone,
      programId: course.code,
      programTitle: `${course.code}: ${course.title}`,
      degreeType: "B.Sc." as const,
      applicationType: "COURSE_REGISTRATION" as const,
      courseCode: course.code,
      courseTitle: course.title,
      courseCredits: course.credits,
      previousCgpa: cgpa,
      previousDegree: `Completed ${creditsDone} credits at Bidyapith University`,
      previousInstitute: "Bidyapith University Campus",
      admissionFee: course.tuitionFee,
      attachedDocuments: attachedDocs,
      motivationStatement: motivation,
      notes: `Section ${course.room} · Instructor: ${course.instructor}`,
    };

    try {
      await submitAdmissionApi(payload).unwrap();
    } catch {
      // Sync context fallback
      submitAdmissionApplication(payload);
    }

    setIsSubmitting(false);
    toast.success(
      `Course registration request for ${course.code} submitted! The Admin & Registrar committee will verify your academic documents.`,
      { duration: 5000 }
    );

    router.push("/student/registration?tab=my-applications");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Back Button & Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/student/registration")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-ink-muted hover:text-ink transition-colors cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Course Catalog</span>
        </button>

        <span className="text-xs font-mono text-jade bg-jade/10 border border-jade/20 px-2.5 py-1 rounded-md">
          Academic Registration Window Active
        </span>
      </div>

      {/* Target Course Banner */}
      <CourseAppBanner course={course} />

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sections 1 & 2: Applicant Profile & Academic Credentials */}
        <ApplicantProfileSection
          studentName={studentName}
          onStudentNameChange={setStudentName}
          studentId={studentId}
          onStudentIdChange={setStudentId}
          email={email}
          onEmailChange={setEmail}
          phone={phone}
          onPhoneChange={setPhone}
          department={department}
          onDepartmentChange={setDepartment}
          cgpa={cgpa}
          onCgpaChange={setCgpa}
          creditsDone={creditsDone}
          onCreditsDoneChange={setCreditsDone}
        />

        {/* Section 3: Document Attachments */}
        <DocumentAttachmentsSection
          attachedDocs={attachedDocs}
          onAddDoc={handleAddDoc}
          onRemoveDoc={handleRemoveDoc}
          onPreviewDoc={setPreviewDoc}
        />

        {/* Section 4: Statement of Purpose */}
        <StatementPurposeSection
          motivation={motivation}
          onMotivationChange={setMotivation}
          termsAgreed={termsAgreed}
          onTermsAgreedChange={setTermsAgreed}
        />

        {/* Submission Action Bar */}
        <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs text-ink-faint font-mono">
            <ShieldCheck className="size-5 text-jade shrink-0" />
            <div>
              <p className="font-semibold text-ink font-sans">Multi-stage Registrar Verification</p>
              <p className="text-[11px]">
                Admin Approval ➔ Student Email Notification ➔ Tuition Payment ➔ Enrollment
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/student/registration")}
              className={cn(buttonClass({ variant: "ghost", size: "default" }), "cursor-pointer")}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                buttonClass({ variant: "primary", size: "default" }),
                "flex items-center gap-2 bg-jade text-night-900 font-bold hover:bg-jade/90 cursor-pointer shadow-md"
              )}
            >
              <Sparkles className="size-4" />
              <span>
                {isSubmitting
                  ? "Submitting Application..."
                  : "Submit Registration for Verification"}
              </span>
            </button>
          </div>
        </div>
      </form>

      {/* Document Preview Modal */}
      <DocumentPreviewModal previewDoc={previewDoc} onClose={() => setPreviewDoc(null)} />
    </div>
  );
}
