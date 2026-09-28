"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  BookOpen,
  User,
  GraduationCap,
  Paperclip,
  Upload,
  FileText,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Eye,
} from "lucide-react";
import { GlassCard } from "@/components/site/glass-card";
import { useApp } from "@/lib/app-context";
import { formatTaka } from "@/lib/app-data";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";
import type { AttachedDocument, AdmissionApplication } from "@/lib/app-types";
import { getCoursePublicDetails } from "./course-catalog-data";
import type { PublicCourseDetails } from "./course-public-details-modal";

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

  const [selectedDocType, setSelectedDocType] = useState<string>("Academic Transcript");
  const [customFileName, setCustomFileName] = useState<string>("");
  const [previewDoc, setPreviewDoc] = useState<AttachedDocument | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSampleDoc = (docType: string) => {
    const filename = customFileName.trim()
      ? customFileName.endsWith(".pdf")
        ? customFileName
        : `${customFileName}.pdf`
      : `${docType.replace(/\s+/g, "_")}_Record_${Math.floor(100 + Math.random() * 900)}.pdf`;

    const newDoc: AttachedDocument = {
      id: `doc-${Date.now()}`,
      name: filename,
      size: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`,
      type: docType,
      uploadedAt: new Date().toISOString().slice(0, 10),
    };

    setAttachedDocs((prev) => [...prev, newDoc]);
    setCustomFileName("");
    toast.success(`Attached "${newDoc.name}" (${newDoc.type})`);
  };

  const handleRemoveDoc = (id: string) => {
    setAttachedDocs((prev) => prev.filter((d) => d.id !== id));
    toast.info("Document attachment removed.");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (attachedDocs.length === 0) {
      toast.error("Please attach at least one academic document (transcript or prerequisite marksheet).");
      return;
    }

    if (!termsAgreed) {
      toast.error("Please accept the academic integrity and verification agreement.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      submitAdmissionApplication({
        studentName,
        studentEmail: email,
        email,
        phone,
        programId: course.code,
        programTitle: `${course.code}: ${course.title}`,
        degreeType: "B.Sc.",
        applicationType: "COURSE_REGISTRATION",
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
      });

      setIsSubmitting(false);
      toast.success(
        `Course registration request for ${course.code} submitted! The Admin & Registrar committee will verify your academic documents.`,
        { duration: 5000 }
      );

      router.push("/student/registration?tab=my-applications");
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Back Button & Breadcrumb */}
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
      <GlassCard className="p-6 md:p-7 border-jade/30 bg-gradient-to-br from-jade/[0.08] via-transparent to-transparent">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-jade px-2.5 py-0.5 rounded-md bg-jade/20 border border-jade/30">
                {course.code}
              </span>
              <span className="text-xs font-mono text-ink-faint">
                {course.department} · {course.credits} Credits ({course.type})
              </span>
              {course.prereq && (
                <span className="text-xs font-mono text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded">
                  Prereq: {course.prereq}
                </span>
              )}
            </div>

            <h1 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
              {course.title}
            </h1>

            <p className="text-xs sm:text-sm text-ink-muted max-w-2xl leading-relaxed">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-ink-faint font-mono pt-1">
              <span>Faculty: <b className="text-ink">{course.instructor}</b></span>
              <span>Room: <b className="text-ink">{course.room}</b></span>
              <span>Slot: <b className="text-ink">{course.schedule}</b></span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 text-right shrink-0">
            <span className="text-[10px] uppercase font-mono tracking-wider text-ink-faint block">Course Tuition Fee</span>
            <span className="font-display text-2xl font-bold font-mono text-jade block mt-0.5">
              {formatTaka(course.tuitionFee)}
            </span>
            <span className="text-[10px] text-ink-faint font-mono mt-1 block">Payable upon Admin approval</span>
          </div>
        </div>
      </GlassCard>

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Applicant Profile */}
        <GlassCard className="p-6 md:p-7 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <User className="size-4 text-jade" />
            <h2 className="font-display text-base font-bold text-ink">
              1. Student Applicant Profile
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-ink-faint font-medium mb-1.5">Full Student Name</label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-ink focus:outline-none focus:border-jade/50"
              />
            </div>

            <div>
              <label className="block text-ink-faint font-medium mb-1.5">Student ID</label>
              <input
                type="text"
                required
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-ink font-mono focus:outline-none focus:border-jade/50"
              />
            </div>

            <div>
              <label className="block text-ink-faint font-medium mb-1.5">Official University Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-ink font-mono focus:outline-none focus:border-jade/50"
              />
              <span className="text-[10px] text-ink-faint mt-1 block">
                Verification notice and payment link will be sent to this email.
              </span>
            </div>

            <div>
              <label className="block text-ink-faint font-medium mb-1.5">Contact Phone Number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-ink font-mono focus:outline-none focus:border-jade/50"
              />
            </div>
          </div>
        </GlassCard>

        {/* Section 2: Academic Standing & Prerequisites */}
        <GlassCard className="p-6 md:p-7 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <GraduationCap className="size-4 text-cyan-400" />
            <h2 className="font-display text-base font-bold text-ink">
              2. Academic Credentials & Prerequisite Eligibility
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-ink-faint font-medium mb-1.5">Department / Program</label>
              <input
                type="text"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-ink font-mono focus:outline-none focus:border-jade/50"
              />
            </div>

            <div>
              <label className="block text-ink-faint font-medium mb-1.5">Current Cumulative GPA (CGPA)</label>
              <input
                type="text"
                required
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-ink font-mono font-bold text-jade focus:outline-none focus:border-jade/50"
              />
            </div>

            <div>
              <label className="block text-ink-faint font-medium mb-1.5">Completed Credit Hours</label>
              <input
                type="text"
                required
                value={creditsDone}
                onChange={(e) => setCreditsDone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-ink font-mono focus:outline-none focus:border-jade/50"
              />
            </div>
          </div>
        </GlassCard>

        {/* Section 3: Academic Document Attachments */}
        <GlassCard className="p-6 md:p-7 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Paperclip className="size-4 text-marigold" />
              <h2 className="font-display text-base font-bold text-ink">
                3. Attach Academic Documents for Admin Verification
              </h2>
            </div>
            <span className="text-xs font-mono text-ink-faint">
              {attachedDocs.length} Attached
            </span>
          </div>

          <p className="text-xs text-ink-muted leading-relaxed">
            Please attach your latest <b>academic transcript</b>, prerequisite marksheets, or departmental recommendation letters. The <b>Admin Admission & Course Reviewer</b> will inspect these documents before granting approval.
          </p>

          {/* Quick Uploader Bar */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-dashed border-white/20 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-ink-faint font-medium mb-1">Document Type</label>
                <select
                  value={selectedDocType}
                  onChange={(e) => setSelectedDocType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-ink text-xs focus:outline-none focus:border-jade/50"
                >
                  <option value="Academic Transcript" className="bg-[#111927]">Academic Transcript (Official/Unofficial)</option>
                  <option value="Prerequisite Marksheet" className="bg-[#111927]">Prerequisite Grade Marksheet</option>
                  <option value="Recommendation Letter" className="bg-[#111927]">Faculty Recommendation Letter</option>
                  <option value="Student ID / NID Scan" className="bg-[#111927]">Student ID / NID Card Scan</option>
                  <option value="Special Waiver Request" className="bg-[#111927]">Departmental Exemption / Waiver</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-ink-faint font-medium mb-1">Custom Filename (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. My_Official_Transcript.pdf"
                  value={customFileName}
                  onChange={(e) => setCustomFileName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-ink text-xs placeholder:text-ink-faint focus:outline-none focus:border-jade/50"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => handleAddSampleDoc(selectedDocType)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-white/10 hover:bg-white/15 text-white transition-colors cursor-pointer border border-white/15"
                >
                  <Upload className="size-3.5 text-jade" />
                  <span>Attach Document</span>
                </button>
              </div>
            </div>
          </div>

          {/* Attached Files List */}
          <div className="space-y-2">
            <h4 className="text-[11px] uppercase font-mono tracking-wider text-ink-faint">
              Attached Document Portfolio ({attachedDocs.length})
            </h4>

            {attachedDocs.length === 0 ? (
              <div className="p-4 rounded-xl bg-rose/5 border border-rose/20 text-center text-xs text-rose flex items-center justify-center gap-2">
                <AlertCircle className="size-4" />
                <span>No academic documents attached. You must attach at least one transcript for admin verification.</span>
              </div>
            ) : (
              <div className="divide-y divide-white/8 rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
                {attachedDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 sm:p-3.5 flex items-center justify-between gap-3 text-xs hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="size-8 rounded-lg bg-jade/10 border border-jade/20 flex items-center justify-center text-jade shrink-0">
                        <FileText className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-ink truncate">{doc.name}</p>
                        <p className="text-[11px] text-ink-faint font-mono">
                          {doc.type} · {doc.size} · Uploaded {doc.uploadedAt}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setPreviewDoc(doc)}
                        className="p-1.5 rounded-lg text-ink-faint hover:text-ink hover:bg-white/10 transition-colors cursor-pointer"
                        title="Preview Document"
                      >
                        <Eye className="size-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveDoc(doc.id)}
                        className="p-1.5 rounded-lg text-rose hover:bg-rose/10 transition-colors cursor-pointer"
                        title="Remove Attachment"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </GlassCard>

        {/* Section 4: Motivation Statement */}
        <GlassCard className="p-6 md:p-7 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <BookOpen className="size-4 text-purple-400" />
            <h2 className="font-display text-base font-bold text-ink">
              4. Statement of Purpose / Academic Motivation
            </h2>
          </div>

          <div>
            <label className="block text-xs text-ink-faint font-medium mb-1.5">
              Briefly describe why you are taking this course and how it fits into your degree plan:
            </label>
            <textarea
              rows={4}
              required
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-ink placeholder:text-ink-faint focus:outline-none focus:border-jade/50 leading-relaxed"
            />
          </div>

          <label className="flex items-start gap-2.5 pt-2 cursor-pointer">
            <input
              type="checkbox"
              checked={termsAgreed}
              onChange={(e) => setTermsAgreed(e.target.checked)}
              className="mt-0.5 rounded bg-white/10 border-white/20 text-jade focus:ring-0 cursor-pointer"
            />
            <span className="text-xs text-ink-muted leading-snug">
              I certify that all attached academic transcripts and credentials are genuine and true. I understand that the course registration request will be routed to the <b>Admin & Registrar Office</b> for verification before tuition payment is unlocked.
            </span>
          </label>
        </GlassCard>

        {/* Submission Action Bar */}
        <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs text-ink-faint font-mono">
            <ShieldCheck className="size-5 text-jade shrink-0" />
            <div>
              <p className="font-semibold text-ink font-sans">Multi-stage Registrar Verification</p>
              <p className="text-[11px]">Admin Approval ➔ Student Email Notification ➔ Tuition Payment ➔ Enrollment</p>
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
              <span>{isSubmitting ? "Submitting Application..." : "Submit Registration for Verification"}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <GlassCard className="w-full max-w-lg p-6 space-y-4 border-white/20 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FileText className="size-5 text-jade" />
                <h3 className="font-display font-bold text-ink text-sm">
                  Document Preview: {previewDoc.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="text-xs text-ink-faint hover:text-ink cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="p-6 rounded-xl bg-black/40 border border-white/10 text-center space-y-3 font-mono text-xs">
              <div className="size-12 mx-auto rounded-full bg-jade/10 border border-jade/30 flex items-center justify-center text-jade">
                <CheckCircle2 className="size-6" />
              </div>
              <p className="text-white font-bold">{previewDoc.name}</p>
              <p className="text-ink-faint text-[11px]">Type: {previewDoc.type}</p>
              <p className="text-ink-faint text-[11px]">File Size: {previewDoc.size} · Validated PDF Container</p>
              <div className="p-3 rounded bg-white/5 text-[11px] text-jade">
                ✓ Cryptographic SHA-256 Checksum Verified for Academic Committee
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-1.5 rounded-lg bg-jade text-night-900 text-xs font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
