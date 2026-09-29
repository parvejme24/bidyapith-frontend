"use client";

import Link from "next/link";
import {
  ApplicationSparkline,
  EmploymentGauge,
  EnrolmentDonut,
  IntakeBarChart,
  RegistrationAreaChart,
} from "@/components/home/campus-charts";
import { PortalPreview } from "@/components/home/portal-preview";
import { NoticeTicker } from "@/components/home/notice-ticker";
import { AdmissionCountdown } from "@/components/site/admission-countdown";
import { Chip } from "@/components/site/chip";
import { CountUp } from "@/components/site/count-up";
import { FacultyCard } from "@/components/site/faculty-card";
import { GlassCard } from "@/components/site/glass-card";
import { Reveal, Rise } from "@/components/site/motion";
import { NoticeRow } from "@/components/site/notice-row";
import { ProgramCard } from "@/components/site/program-card";
import { SeatMeter } from "@/components/site/seat-meter";
import { AdmissionStepSkeleton } from "@/components/site/skeletons";
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
import { formatEventDay, formatEventMonth, initials } from "@/lib/format";
import {
  avatarClass,
  buttonClass,
  displayClass,
  gradJadeClass,
  leadClass,
  numClass,
  sectionClass,
  sectionTightClass,
  shellClass,
} from "@/lib/styles";
import { cn } from "@/lib/utils";

const SPARKLINE = [42, 51, 47, 63, 58, 74, 69, 88, 96, 91, 118, 132, 156, 187];

function ChartSkeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-2xl bg-white/5", className)} />;
}

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
      <section className="pt-10 pb-8 md:pt-16 md:pb-12">
        <div className={cn(shellClass, "grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 items-center")}>
          <div>
            <Rise delay={1}>
              <Chip tone="jade" live>
                Applications open for {semester}
              </Chip>
            </Rise>
            <Rise delay={2}>
              <h1 className={cn(displayClass.d1, "mt-6")}>
                Apply once.
                <br />
                <span className={gradJadeClass}>Then get on with learning.</span>
              </h1>
            </Rise>
            <Rise delay={3}>
              <p className={cn(leadClass, "mt-6")}>
                Bidyapith runs admission, course registration, attendance, results and fees on one
                system. Nine thousand students spend their time on coursework instead of queues
                outside the administration building.
              </p>
            </Rise>
            <Rise delay={4}>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link href="/register" className={buttonClass({ variant: "primary" })}>
                  Start your application
                </Link>
                <Link href="/programs" className={buttonClass({ variant: "ghost" })}>
                  Explore 34 programmes
                </Link>
              </div>
            </Rise>
            <Rise delay={5}>
              <dl className="grid grid-cols-3 gap-4 mt-10 max-w-lg">
                <div>
                  <dt className="text-xs text-ink-faint mb-1">Established</dt>
                  <dd className="font-display text-xl">{founded}</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-faint mb-1">Schools</dt>
                  <dd className="font-display text-xl">Six</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-faint mb-1">Campus</dt>
                  <dd className="font-display text-xl">Purbachal</dd>
                </div>
              </dl>
            </Rise>
          </div>

          <Rise delay={3}>
            <GlassCard strong className="p-5 sm:p-7" aria-label="Live campus figures">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <p className="text-xs text-ink-faint">Current term</p>
                  <p className="font-display text-xl">{semester}</p>
                </div>
                <Chip tone="jade" live>
                  Live
                </Chip>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <GlassCard quiet className="p-4">
                  <p className="text-xs text-ink-faint mb-1">Seats still open</p>
                  <CountUp value={412} className="font-display text-2xl" />
                </GlassCard>
                <GlassCard quiet className="p-4">
                  <p className="text-xs text-ink-faint mb-1">Applications today</p>
                  <CountUp value={187} className="font-display text-2xl" />
                </GlassCard>
              </div>

              <GlassCard quiet className="p-4 mt-3">
                <div className="flex items-end justify-between gap-4 mb-2">
                  <div>
                    <p className="text-xs text-ink-faint">Applications, last 14 days</p>
                    <p className="font-display text-lg">Up 34% on last cycle</p>
                  </div>
                  <ApplicationSparkline values={SPARKLINE} />
                </div>
              </GlassCard>

              <p className="text-xs text-ink-faint mt-5 mb-2.5">Seats filling fastest</p>
              <ul className="space-y-3">
                {seats.data?.slice(0, 3).map((seat) => (
                  <li key={seat.label}>
                    <SeatMeter filled={seat.filled} total={seat.total} label={seat.label} />
                  </li>
                ))}
                {seats.isLoading ? <ChartSkeleton className="h-24" /> : null}
              </ul>

              <Link href="/admissions" className={cn(buttonClass({ variant: "ghost", size: "sm" }), "w-full mt-5")}>
                See the admission timeline
              </Link>
            </GlassCard>
          </Rise>
        </div>
      </section>

      <section className={cn(sectionTightClass, "pt-2")}>
        <div className={shellClass}>
          {notices.data ? <NoticeTicker notices={notices.data} /> : <ChartSkeleton className="h-14" />}
        </div>
      </section>

      <section className={sectionTightClass}>
        <div className={shellClass}>
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {stats.data?.map((stat, index) => (
              <li key={stat.label}>
                <Reveal delay={index * 60}>
                  <GlassCard className="p-5">
                    <CountUp
                      value={stat.value}
                      suffix={stat.suffix}
                      className="font-display text-3xl"
                    />
                    <p className="text-xs text-ink-faint mt-1.5">{stat.label}</p>
                  </GlassCard>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={sectionClass} id="glance">
        <div className={shellClass}>
          <Reveal>
            <div className="max-w-2xl mb-10">
              <h2 className={displayClass.d2}>The campus, in numbers that update themselves</h2>
              <p className={cn(leadClass, "mt-4")}>
                Every figure below is read straight from the university database — enrolment,
                intake, registrations and placement. Nothing here is typed in by hand.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-4 lg:grid-cols-3">
            <Reveal className="lg:col-span-2">
              <GlassCard className="flex h-full flex-col p-6">
                <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h3 className={displayClass.d3}>New students admitted each year</h3>
                    <p className="mt-1 text-sm text-ink-muted">Across all six schools, 2019 to 2026</p>
                  </div>
                  <Chip tone="jade">+9.7% year on year</Chip>
                </header>
                <div className="mt-auto">
                  {intake.data ? <IntakeBarChart data={intake.data} /> : <ChartSkeleton className="h-[250px]" />}
                </div>
              </GlassCard>
            </Reveal>

            <Reveal delay={90}>
              <GlassCard className="p-6 h-full">
                <h3 className={cn(displayClass.d3, "mb-1")}>Where students study</h3>
                <p className="text-sm text-ink-muted mb-4">Enrolment by school, Fall 2026</p>
                {enrolment.data ? (
                  <>
                    <EnrolmentDonut
                      data={enrolment.data}
                      centerValue={students.toLocaleString()}
                      centerLabel="students"
                    />
                    <ul className="mt-5 divide-y divide-white/5">
                      {enrolment.data.map((slice) => (
                        <li key={slice.label} className="flex items-center justify-between gap-3 py-1.5">
                          <span className="flex items-center gap-2.5 min-w-0">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ background: slice.color }}
                            />
                            <span className="text-sm text-ink-muted truncate">{slice.label}</span>
                          </span>
                          <span className={cn(numClass, "text-sm font-semibold")}>{slice.value.toLocaleString()}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <ChartSkeleton className="h-64" />
                )}
              </GlassCard>
            </Reveal>

            <Reveal className="lg:col-span-2">
              <GlassCard className="flex h-full flex-col p-6">
                <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h3 className={displayClass.d3}>Course registrations per semester</h3>
                    <p className="mt-1 text-sm text-ink-muted">In thousands, processed through the portal</p>
                  </div>
                  <Chip tone="orchid">12.4k this term</Chip>
                </header>
                <div className="mt-auto flex min-h-[280px] w-full flex-1 flex-col justify-end sm:min-h-[300px]">
                  {registrations.data ? (
                    <RegistrationAreaChart
                      data={registrations.data}
                      className="h-full min-h-[280px] sm:min-h-[300px]"
                    />
                  ) : (
                    <ChartSkeleton className="h-full min-h-[280px] sm:min-h-[300px]" />
                  )}
                </div>
              </GlassCard>
            </Reveal>

            <div className="grid gap-4">
              <Reveal delay={90}>
                <GlassCard className="p-6">
                  <h3 className={cn(displayClass.d3, "mb-1")}>Graduates in work</h3>
                  <p className="text-sm text-ink-muted mb-2">Within six months, class of 2025</p>
                  <EmploymentGauge percent={employment} label="class of 2025" />
                </GlassCard>
              </Reveal>
              <Reveal delay={140}>
                <GlassCard className="p-6">
                  <h3 className={cn(displayClass.d3, "mb-4")}>Seats taken, Fall 2026</h3>
                  <ul className="space-y-4">
                    {seats.data?.map((seat) => (
                      <li key={seat.label}>
                        <SeatMeter filled={seat.filled} total={seat.total} label={seat.label} />
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <PortalPreview />

      <section className={sectionClass}>
        <div className={shellClass}>
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-5 mb-9">
              <div className="max-w-xl">
                <h2 className={displayClass.d2}>Programmes people actually finish</h2>
                <p className={cn(leadClass, "mt-4")}>
                  Thirty-four degrees across six schools, each with a required project, internship
                  or thesis before you graduate.
                </p>
              </div>
              <Link href="/programs" className={buttonClass({ variant: "ghost" })}>
                See all programmes
              </Link>
            </div>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {programs.data?.slice(0, 6).map((program) => (
              <ProgramCard key={program.code} program={program} />
            ))}
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <div className={shellClass}>
          <Reveal>
            <div className="max-w-2xl mb-9">
              <h2 className={displayClass.d2}>How admission works</h2>
              <p className={cn(leadClass, "mt-4")}>
                Five steps, all of them in the portal. You can see where your application stands at
                any point.
              </p>
            </div>
          </Reveal>
          <ol className="grid gap-4 md:grid-cols-3 lg:grid-cols-5 items-stretch">
            {steps.data ? (
              steps.data.map((step, index) => (
                <li key={step.title} className="flex flex-col h-full">
                  <Reveal delay={index * 70} className="h-full flex flex-col flex-1">
                    <GlassCard className="p-6 flex flex-col h-full min-h-[210px] justify-start flex-1">
                      <span className={cn("font-display text-jade text-sm", numClass)}>
                        Step {index + 1}
                      </span>
                      <h3 className="font-display text-[1.08rem] font-semibold mt-2 leading-snug text-ink">
                        {step.title}
                      </h3>
                      <p className="text-sm text-ink-muted mt-2 leading-relaxed flex-1">
                        {step.text}
                      </p>
                    </GlassCard>
                  </Reveal>
                </li>
              ))
            ) : (
              Array.from({ length: 5 }).map((_, i) => (
                <li key={i} className="flex flex-col h-full">
                  <AdmissionStepSkeleton />
                </li>
              ))
            )}
          </ol>
        </div>
      </section>

      <section className={sectionClass}>
        <div className={cn(shellClass, "grid gap-4 lg:grid-cols-[1.5fr_1fr]")}>
          <Reveal>
            <div className="flex items-end justify-between gap-4 mb-6">
              <h2 className={displayClass.d2}>Latest notices</h2>
              <Link href="/notices" className={buttonClass({ variant: "ghost", size: "sm" })}>
                All notices
              </Link>
            </div>
            <div className="space-y-3">
              {notices.data?.slice(0, 4).map((notice) => (
                <NoticeRow key={notice.id} notice={notice} />
              ))}
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h2 className={cn(displayClass.d2, "mb-6")}>What&apos;s coming up</h2>
            <GlassCard className="p-6">
              <ul className="space-y-5">
                {events.data?.map((event) => (
                  <li key={event.title} className="flex gap-4">
                    <GlassCard
                      quiet
                      className="grid place-items-center w-14 h-14 rounded-2xl shrink-0 leading-none"
                    >
                      <span className={cn("font-display text-xl", numClass)}>{formatEventDay(event.date)}</span>
                      <span className="text-[0.6rem] text-ink-faint mt-0.5">
                        {formatEventMonth(event.date)}
                      </span>
                    </GlassCard>
                    <span className="min-w-0">
                      <span className="block font-semibold text-sm">{event.title}</span>
                      <span className="block text-xs text-ink-faint mt-1">
                        {event.time} · {event.place}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </Reveal>
        </div>
      </section>

      <section className={sectionClass}>
        <div className={shellClass}>
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-5 mb-9">
              <div className="max-w-xl">
                <h2 className={displayClass.d2}>Taught by people who publish</h2>
                <p className={cn(leadClass, "mt-4")}>
                  Three hundred and twelve faculty members, most of them with office hours you can
                  book from the portal.
                </p>
              </div>
              <Link href="/faculty" className={buttonClass({ variant: "ghost" })}>
                Meet the faculty
              </Link>
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {faculty.data?.slice(0, 4).map((member, index) => (
              <FacultyCard key={member.email} faculty={member} index={index} compact />
            ))}
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <div className={shellClass}>
          <Reveal>
            <h2 className={cn(displayClass.d2, "mb-9")}>Students, a year or two out</h2>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {voices.data?.map((voice) => (
              <Reveal key={voice.name}>
                <figure className="m-0 h-full">
                  <GlassCard lift className="p-7 h-full">
                    <blockquote className="font-display text-[1.12rem] leading-relaxed">
                      “{voice.quote}”
                    </blockquote>
                    <figcaption className="flex items-center gap-3 mt-6 pt-5 border-t border-white/8">
                      <span
                        className={cn(avatarClass({ tone: voice.av }), "size-11 text-sm")}
                      >
                        {initials(voice.name)}
                      </span>
                      <span>
                        <span className="block text-sm font-semibold">{voice.name}</span>
                        <span className="block text-xs text-ink-faint mt-0.5">{voice.meta}</span>
                      </span>
                    </figcaption>
                  </GlassCard>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <div className={shellClass}>
          <Reveal>
            <GlassCard strong className="p-8 md:p-12 text-center">
              <Chip tone="gold" className="mb-5">
                Fall 2026 intake
              </Chip>
              <h2 className={cn(displayClass.d2, "max-w-2xl mx-auto")}>Applications close on 15 October</h2>
              <p className={cn(leadClass, "mx-auto mt-4 text-center")}>
                The application takes about twenty minutes. You can save it and come back — nothing
                is submitted until you pay the fee.
              </p>
              <AdmissionCountdown
                closesAt={meta.data?.admissionCloses}
                className="justify-center mt-8"
              />
              <div className="flex flex-wrap justify-center gap-3 mt-8">
                <Link href="/register" className={buttonClass({ variant: "primary" })}>
                  Create your applicant account
                </Link>
                <Link href="/admissions#fees" className={buttonClass({ variant: "ghost" })}>
                  Fees and scholarships
                </Link>
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
