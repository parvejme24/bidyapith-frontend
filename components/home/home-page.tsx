"use client";

import { NoticeTicker } from "@/components/home/notice-ticker";
import { PortalPreview } from "@/components/home/portal-preview";
import { HomeHero } from "@/components/home/home-hero";
import { HomeStatsStrip } from "@/components/home/home-stats-strip";
import { HomeCampusNumbers } from "@/components/home/home-campus-numbers";
import { HomeProgramsSection } from "@/components/home/home-programs-section";
import { HomeAdmissionsSteps } from "@/components/home/home-admissions-steps";
import { HomeNoticesEvents } from "@/components/home/home-notices-events";
import { HomeFacultySection } from "@/components/home/home-faculty-section";
import { HomeTestimonialsCta } from "@/components/home/home-testimonials-cta";
import {
  useAdmissionSteps,
  useEnrolment,
  useEvents,
  useFaculty,
  useIntake,
  useMeta,
  useNotices,
  usePrograms,
  useRegistrations,
  useSeats,
  useStats,
  useVoices,
} from "@/hooks/use-data";
import { sectionTightClass, shellClass } from "@/lib/styles";

export function HomePage() {
  const meta = useMeta();
  const stats = useStats();
  const seats = useSeats();
  const notices = useNotices();
  const intake = useIntake();
  const enrolment = useEnrolment();
  const registrations = useRegistrations();
  const programs = usePrograms();
  const steps = useAdmissionSteps();
  const events = useEvents();
  const faculty = useFaculty();
  const voices = useVoices();

  const semester = meta.data?.semester ?? "Fall 2026";
  const founded = meta.data?.founded ?? 1998;
  const students = stats.data?.[0]?.value ?? 9240;
  const employment = stats.data?.find((item) => item.label.startsWith("Graduate"))?.value ?? 94;

  return (
    <main id="main">
      {/* 1. Hero Section */}
      <HomeHero
        semester={semester}
        founded={founded}
        seatsData={seats.data}
        seatsLoading={seats.isLoading}
      />

      {/* 2. Notice Ticker */}
      <section className={`${sectionTightClass} pt-2`}>
        <div className={shellClass}>
          {notices.data ? (
            <NoticeTicker notices={notices.data} />
          ) : (
            <div className="animate-pulse rounded-2xl bg-white/5 h-14" />
          )}
        </div>
      </section>

      {/* 3. Stats Metric Strip */}
      <HomeStatsStrip stats={stats.data} />

      {/* 4. Campus In Numbers & Interactive Charts */}
      <HomeCampusNumbers
        students={students}
        employment={employment}
        intakeData={intake.data}
        enrolmentData={enrolment.data}
        registrationsData={registrations.data}
        seatsData={seats.data}
      />

      {/* 5. System Portals & Workspaces Preview Showcase */}
      <PortalPreview />

      {/* 6. Academic Degree Programs */}
      <HomeProgramsSection programs={programs.data} />

      {/* 7. Admissions 5-Step Workflow */}
      <HomeAdmissionsSteps steps={steps.data} />

      {/* 8. Latest Notices & Campus Events */}
      <HomeNoticesEvents notices={notices.data} events={events.data} />

      {/* 9. Faculty & Publishing Professors */}
      <HomeFacultySection faculty={faculty.data} />

      {/* 10. Student Voices & Final Application CTA */}
      <HomeTestimonialsCta
        voices={voices.data}
        admissionCloses={meta.data?.admissionCloses}
      />
    </main>
  );
}
