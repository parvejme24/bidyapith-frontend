"use client";

import { AdmissionsHero } from "@/components/admissions/admissions-hero";
import { AdmissionsStepsOverview } from "@/components/admissions/admissions-steps-overview";
import { AdmissionsDatesPayment } from "@/components/admissions/admissions-dates-payment";
import { AdmissionsFeesSection } from "@/components/admissions/admissions-fees-section";
import { AdmissionsScholarshipsFaq } from "@/components/admissions/admissions-scholarships-faq";
import {
  useAdmissionSteps,
  useEnrolment,
  useFaqs,
  useFees,
  useKeyDates,
  useMeta,
  useScholarships,
} from "@/hooks/use-data";

export function AdmissionsPage() {
  const meta = useMeta();
  const steps = useAdmissionSteps();
  const keyDates = useKeyDates();
  const fees = useFees();
  const scholarships = useScholarships();
  const faqs = useFaqs();
  const enrolment = useEnrolment();

  const closesAt = meta.data?.admissionCloses ?? "2026-10-15T23:59:00";

  return (
    <main id="main">
      {/* 1. Hero, Deadlines & Eligibility */}
      <AdmissionsHero closesAt={closesAt} />

      {/* 2. 5-Step Admission Process */}
      <AdmissionsStepsOverview steps={steps.data} isLoading={steps.isLoading} />

      {/* 3. Key Dates & Payment Gateways */}
      <AdmissionsDatesPayment keyDates={keyDates.data} isLoading={keyDates.isLoading} />

      {/* 4. Tuition Fees & Intake Capacity */}
      <AdmissionsFeesSection
        fees={fees.data}
        enrolmentData={enrolment.data}
        isLoading={fees.isLoading}
      />

      {/* 5. Scholarships, Waivers & Applicant FAQs */}
      <AdmissionsScholarshipsFaq
        scholarships={scholarships.data}
        faqs={faqs.data}
      />
    </main>
  );
}
