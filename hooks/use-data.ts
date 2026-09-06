"use client";

import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api";
import type { Collection, Database } from "@/lib/types";

async function fetchCollection<K extends Collection>(collection: K) {
  const response = await get(collection);
  if (!response.success) {
    throw new Error(response.message);
  }
  return response.data as Database[K];
}

function useCollection<K extends Collection>(collection: K) {
  return useQuery({
    queryKey: [collection],
    queryFn: () => fetchCollection(collection),
  });
}

export function useMeta() {
  return useCollection("meta");
}

export function useStats() {
  return useCollection("stats");
}

export function usePrograms() {
  return useCollection("programs");
}

export function useCourses() {
  return useCollection("courses");
}

export function useFaculty() {
  return useCollection("faculty");
}

export function useNotices() {
  return useCollection("notices");
}

export function useEvents() {
  return useCollection("events");
}

export function useDepartments() {
  return useCollection("departments");
}

export function useFees() {
  return useCollection("fees");
}

export function useFaqs() {
  return useCollection("faqs");
}

export function useEnrolment() {
  return useCollection("enrolment");
}

export function useIntake() {
  return useCollection("intake");
}

export function useRegistrations() {
  return useCollection("registrations");
}

export function useSeats() {
  return useCollection("seats");
}

export function useAdmissionSteps() {
  return useCollection("admissionSteps");
}

export function useVoices() {
  return useCollection("voices");
}

export function useKeyDates() {
  return useCollection("keyDates");
}

export function useScholarships() {
  return useCollection("scholarships");
}

export function useMilestones() {
  return useCollection("milestones");
}

export function useLeadership() {
  return useCollection("leadership");
}
