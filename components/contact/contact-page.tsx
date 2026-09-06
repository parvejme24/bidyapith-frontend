"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { GlassCard } from "@/components/site/glass-card";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/motion";
import { SelectInput } from "@/components/site/select-input";
import { useFaqs } from "@/hooks/use-data";
import { BD_PHONE, normalizePhone, toastTone } from "@/lib/form";
import { SITE } from "@/lib/site";
import {
  buttonClass,
  controlClass,
  displayClass,
  fieldClass,
  fieldErrorClass,
  fieldInvalidControlClass,
  fieldLabelClass,
  sectionClass,
  sectionTightClass,
  shellClass,
  textareaClass,
} from "@/lib/styles";
import { cn } from "@/lib/utils";

const DESKS = [
  {
    title: "Admission office",
    blurb: "Applications, eligibility, admission test",
    email: "admission@bidyapith.edu.bd",
  },
  {
    title: "Registrar",
    blurb: "Registration, transcripts, certificates",
    email: "registrar@bidyapith.edu.bd",
  },
  {
    title: "Accounts",
    blurb: "Fees, instalments, payment problems",
    email: "accounts@bidyapith.edu.bd",
  },
  {
    title: "Student affairs",
    blurb: "Halls, clubs, counselling, welfare",
    email: "students@bidyapith.edu.bd",
  },
] as const;

const contactSchema = z.object({
  name: z.string().trim().min(3),
  email: z.string().trim().email(),
  phone: z
    .string()
    .trim()
    .refine((value) => BD_PHONE.test(normalizePhone(value))),
  topic: z.string().trim().min(1),
  message: z.string().trim().min(12),
});

type ContactValues = z.infer<typeof contactSchema>;

const phoneHref = `tel:${SITE.phone.replace(/\s/g, "")}`;

export function ContactPage() {
  const { data: faqs = [] } = useFaqs();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      topic: "",
      message: "",
    },
  });

  function onValid(values: ContactValues) {
    const first = values.name.trim().split(/\s+/)[0] ?? "there";
    toast.success(`Thanks ${first} — we reply within one working day.`, {
      style: toastTone.jade,
    });
    reset();
  }

  function onInvalid() {
    toast.error("Check the highlighted fields and try again.", {
      style: toastTone.rose,
    });
  }

  return (
    <main id="main">
      <section className="pt-12 pb-6 md:pt-16">
        <PageHero
          chip="Sunday to Thursday, 9 AM – 5 PM"
          title="Ask us anything before you apply"
          lead="Admission questions, fee clarifications, transcript requests — send them to the right desk and you will hear back within one working day."
        />
      </section>

      <section className={sectionTightClass}>
        <div className={cn(shellClass, "grid gap-4 sm:grid-cols-2 lg:grid-cols-4")}>
          {DESKS.map((desk, index) => (
            <Reveal key={desk.email} delay={index * 70}>
              <GlassCard lift className="p-6 h-full">
                <h2 className="font-display text-[1.05rem]">{desk.title}</h2>
                <p className="text-sm text-ink-muted mt-2">{desk.blurb}</p>
                <a
                  href={`mailto:${desk.email}`}
                  className="text-sm text-jade mt-3 inline-block break-all"
                >
                  {desk.email}
                </a>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section className={sectionClass}>
        <div className={cn(shellClass, "grid gap-4 lg:grid-cols-[1.15fr_0.85fr] items-start")}>
          <Reveal>
            <GlassCard className="p-7 md:p-9">
              <h2 className={cn(displayClass.d3, "mb-1")}>Send a message</h2>
              <p className="text-sm text-ink-muted mb-7">
                Everything marked required has to be filled in before this sends.
              </p>

              <form noValidate onSubmit={handleSubmit(onValid, onInvalid)}>
                <div className="grid sm:grid-cols-2 gap-x-4">
                  <label className={fieldClass}>
                    <span className={fieldLabelClass}>Full name</span>
                    <input
                      className={cn(controlClass, errors.name && fieldInvalidControlClass)}
                      placeholder="Md Parvej Hossain"
                      autoComplete="name"
                      {...register("name")}
                    />
                    <span className={cn(fieldErrorClass, errors.name && "block")}>
                      Enter your name as it appears on your certificates.
                    </span>
                  </label>

                  <label className={fieldClass}>
                    <span className={fieldLabelClass}>Email address</span>
                    <input
                      className={cn(controlClass, errors.email && fieldInvalidControlClass)}
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      {...register("email")}
                    />
                    <span className={cn(fieldErrorClass, errors.email && "block")}>
                      That email doesn&apos;t look right — check for a typo.
                    </span>
                  </label>

                  <label className={fieldClass}>
                    <span className={fieldLabelClass}>Mobile number</span>
                    <input
                      className={cn(controlClass, errors.phone && fieldInvalidControlClass)}
                      placeholder="01712345678"
                      autoComplete="tel"
                      {...register("phone")}
                    />
                    <span className={cn(fieldErrorClass, errors.phone && "block")}>
                      Use a Bangladeshi mobile number, like 01712345678.
                    </span>
                  </label>

                  <label className={fieldClass}>
                    <span className={fieldLabelClass}>What is this about?</span>
                    <SelectInput invalid={Boolean(errors.topic)} {...register("topic")}>
                      <option value="">Choose a desk</option>
                      <option>Admission enquiry</option>
                      <option>Fees and scholarships</option>
                      <option>Transcripts and certificates</option>
                      <option>Campus visit</option>
                      <option>Something else</option>
                    </SelectInput>
                    <span className={cn(fieldErrorClass, errors.topic && "block")}>
                      Pick the desk that fits best so it reaches the right person.
                    </span>
                  </label>
                </div>

                <label className={fieldClass}>
                  <span className={fieldLabelClass}>Your message</span>
                  <textarea
                    className={cn(textareaClass, errors.message && fieldInvalidControlClass)}
                    placeholder="Tell us your results, the programme you're interested in, and what you'd like to know."
                    {...register("message")}
                  />
                  <span className={cn(fieldErrorClass, errors.message && "block")}>
                    Write at least a sentence so we can answer properly.
                  </span>
                </label>

                <button type="submit" className={cn(buttonClass({ variant: "primary" }), "w-full sm:w-auto")}>
                  Send message
                </button>
              </form>
            </GlassCard>
          </Reveal>

          <div className="grid gap-4">
            <Reveal delay={80}>
              <GlassCard className="p-7">
                <h2 className={cn(displayClass.d3, "mb-5")}>Find the campus</h2>

                <svg
                  viewBox="0 0 400 240"
                  className="w-full rounded-2xl border border-white/10"
                  role="img"
                  aria-label="Illustrated campus location map"
                >
                  <rect width="400" height="240" fill="#0E1436" />
                  <path
                    d="M0 150 Q120 130 200 160 T400 140"
                    stroke="rgba(46,211,167,.25)"
                    strokeWidth="16"
                    fill="none"
                  />
                  <path
                    d="M60 0 L120 240"
                    stroke="rgba(255,255,255,.07)"
                    strokeWidth="14"
                    fill="none"
                  />
                  <path
                    d="M300 0 L250 240"
                    stroke="rgba(255,255,255,.07)"
                    strokeWidth="14"
                    fill="none"
                  />
                  <path
                    d="M0 70 L400 92"
                    stroke="rgba(255,255,255,.07)"
                    strokeWidth="10"
                    fill="none"
                  />
                  <rect
                    x="150"
                    y="86"
                    width="98"
                    height="62"
                    rx="10"
                    fill="rgba(46,211,167,.16)"
                    stroke="#2ED3A7"
                  />
                  <circle cx="199" cy="117" r="6" fill="#2ED3A7" />
                  <text
                    x="199"
                    y="167"
                    textAnchor="middle"
                    fill="#EEF1FB"
                    fontSize="12"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                    fontWeight="700"
                  >
                    Bidyapith Campus
                  </text>
                  <text
                    x="199"
                    y="184"
                    textAnchor="middle"
                    fill="#7C87AE"
                    fontSize="10.5"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    Purbachal Sector 9, Dhaka 1229
                  </text>
                  <text
                    x="330"
                    y="150"
                    fill="#7C87AE"
                    fontSize="10"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    300 ft road
                  </text>
                </svg>

                <ul className="space-y-3 mt-5 text-sm">
                  <li className="flex justify-between gap-4">
                    <span className="text-ink-faint">Main gate</span>
                    <span>Purbachal Sector 9</span>
                  </li>
                  <li className="flex justify-between gap-4">
                    <span className="text-ink-faint">From Kuril</span>
                    <span>25 minutes by car</span>
                  </li>
                  <li className="flex justify-between gap-4">
                    <span className="text-ink-faint">Shuttle</span>
                    <span>Uttara, Badda, Rampura</span>
                  </li>
                  <li className="flex justify-between gap-4">
                    <span className="text-ink-faint">Phone</span>
                    <a href={phoneHref} className="text-jade">
                      {SITE.phone}
                    </a>
                  </li>
                </ul>
              </GlassCard>
            </Reveal>

            <Reveal delay={140}>
              <GlassCard className="p-7">
                <h2 className={cn(displayClass.d3, "mb-3")}>Quick answers</h2>
                <FaqAccordion faqs={faqs.slice(0, 4)} />
              </GlassCard>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
