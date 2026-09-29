"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { GlassCard } from "@/components/site/glass-card";
import { Reveal } from "@/components/site/motion";
import { SelectInput } from "@/components/site/select-input";
import { BD_PHONE, normalizePhone, toastTone } from "@/lib/form";
import {
  buttonClass,
  controlClass,
  displayClass,
  fieldClass,
  fieldErrorClass,
  fieldInvalidControlClass,
  fieldLabelClass,
  textareaClass,
} from "@/lib/styles";
import { cn } from "@/lib/utils";

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

export function ContactForm() {
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
  );
}
