"use client";

import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { StatusPill } from "@/components/dashboard/status-pill";
import { GlassCard } from "@/components/site/glass-card";
import { DataTable, type ColumnDef } from "@/components/dashboard/data-table";
import { useApp } from "@/lib/app-context";
import { computeGrade, getInitials } from "@/lib/app-data";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Download,
  Filter,
  GraduationCap,
  Layers,
  Printer,
  Search,
  Send,
  Sparkles,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface StudentGradeRecord {
  studentId: string;
  studentName: string;
  courseCode: string;
  courseTitle: string;
  section: string;
  instructorName: string;
  term: string;
  department: string;
  midterm: number;
  assignment: number;
  finalExam: number;
  total: number;
  letterGrade: string;
  gradePoint: number;
  status: "published" | "submitted" | "draft";
}

interface HistoricalTranscriptRecord {
  term: string;
  gpa: number;
  credits: number;
  courses: {
    code: string;
    title: string;
    credits: number;
    grade: string;
    point: number;
  }[];
}

// Sample Comprehensive University Grades Dataset
const UNIVERSITY_GRADES_DATASET: StudentGradeRecord[] = [
  {
    studentId: "2024-BSC-CSE-1001",
    studentName: "Rafiul Karim",
    courseCode: "CSE-2201",
    courseTitle: "Database Management Systems",
    section: "A",
    instructorName: "Dr. Tanvir Ahmed",
    term: "Fall 2026",
    department: "CSE",
    midterm: 24,
    assignment: 18,
    finalExam: 42,
    total: 84,
    letterGrade: "A+",
    gradePoint: 4.0,
    status: "submitted",
  },
  {
    studentId: "2024-BSC-CSE-1002",
    studentName: "Ayesha Ahmed",
    courseCode: "CSE-2201",
    courseTitle: "Database Management Systems",
    section: "A",
    instructorName: "Dr. Tanvir Ahmed",
    term: "Fall 2026",
    department: "CSE",
    midterm: 23,
    assignment: 19,
    finalExam: 36,
    total: 78,
    letterGrade: "A",
    gradePoint: 3.75,
    status: "submitted",
  },
  {
    studentId: "2024-BSC-CSE-1003",
    studentName: "Tanvir Hasan",
    courseCode: "CSE-2201",
    courseTitle: "Database Management Systems",
    section: "A",
    instructorName: "Dr. Tanvir Ahmed",
    term: "Fall 2026",
    department: "CSE",
    midterm: 24,
    assignment: 20,
    finalExam: 34,
    total: 78,
    letterGrade: "A",
    gradePoint: 3.75,
    status: "submitted",
  },
  {
    studentId: "2024-BSC-CSE-1004",
    studentName: "Sabina Hossain",
    courseCode: "CSE-2201",
    courseTitle: "Database Management Systems",
    section: "A",
    instructorName: "Dr. Tanvir Ahmed",
    term: "Fall 2026",
    department: "CSE",
    midterm: 25,
    assignment: 18,
    finalExam: 46,
    total: 89,
    letterGrade: "A+",
    gradePoint: 4.0,
    status: "submitted",
  },
  {
    studentId: "2024-BSC-CSE-1001",
    studentName: "Rafiul Karim",
    courseCode: "CSE-3101",
    courseTitle: "Operating Systems Principles",
    section: "A",
    instructorName: "Dr. Sabbir Rahman",
    term: "Fall 2026",
    department: "CSE",
    midterm: 22,
    assignment: 18,
    finalExam: 41,
    total: 81,
    letterGrade: "A+",
    gradePoint: 4.0,
    status: "published",
  },
  {
    studentId: "2024-BSC-CSE-1005",
    studentName: "Mahmud Kabir",
    courseCode: "CSE-3101",
    courseTitle: "Operating Systems Principles",
    section: "A",
    instructorName: "Dr. Sabbir Rahman",
    term: "Fall 2026",
    department: "CSE",
    midterm: 26,
    assignment: 19,
    finalExam: 45,
    total: 90,
    letterGrade: "A+",
    gradePoint: 4.0,
    status: "published",
  },
  {
    studentId: "2024-BSC-EEE-1011",
    studentName: "Rezaul Karim",
    courseCode: "EEE-1201",
    courseTitle: "Electrical Circuits & Analysis",
    section: "B",
    instructorName: "Prof. Dr. Kamal Hossain",
    term: "Fall 2026",
    department: "EEE",
    midterm: 21,
    assignment: 17,
    finalExam: 34,
    total: 72,
    letterGrade: "A-",
    gradePoint: 3.5,
    status: "submitted",
  },
  {
    studentId: "2024-BBA-GEN-1020",
    studentName: "Anisur Rahman",
    courseCode: "BBA-2101",
    courseTitle: "Principles of Marketing",
    section: "A",
    instructorName: "Dr. Rubel Mia",
    term: "Fall 2026",
    department: "BBA",
    midterm: 26,
    assignment: 19,
    finalExam: 43,
    total: 88,
    letterGrade: "A+",
    gradePoint: 4.0,
    status: "published",
  },
  {
    studentId: "2024-BSC-CSE-1006",
    studentName: "Nusrat Jahan",
    courseCode: "CSE-4108",
    courseTitle: "Artificial Intelligence & ML",
    section: "A",
    instructorName: "Dr. Nafisa Haque",
    term: "Fall 2026",
    department: "CSE",
    midterm: 27,
    assignment: 20,
    finalExam: 44,
    total: 91,
    letterGrade: "A+",
    gradePoint: 4.0,
    status: "published",
  },
  {
    studentId: "2024-BSC-CSE-1007",
    studentName: "Kamal Haque",
    courseCode: "CSE-4108",
    courseTitle: "Artificial Intelligence & ML",
    section: "A",
    instructorName: "Dr. Nafisa Haque",
    term: "Fall 2026",
    department: "CSE",
    midterm: 28,
    assignment: 18,
    finalExam: 45,
    total: 91,
    letterGrade: "A+",
    gradePoint: 4.0,
    status: "published",
  },
];

// Historical student transcripts database
const STUDENT_HISTORICAL_TRANSCRIPTS: Record<string, HistoricalTranscriptRecord[]> = {
  "2024-BSC-CSE-1001": [
    {
      term: "Fall 2024 (Semester 1)",
      gpa: 3.84,
      credits: 13.5,
      courses: [
        { code: "CSE-1101", title: "Introduction to Programming", credits: 3.0, grade: "A+", point: 4.0 },
        { code: "CSE-1102", title: "Programming Laboratory", credits: 1.5, grade: "A+", point: 4.0 },
        { code: "MAT-1101", title: "Differential Calculus", credits: 3.0, grade: "A", point: 3.75 },
        { code: "PHY-1101", title: "Engineering Physics I", credits: 3.0, grade: "A", point: 3.75 },
        { code: "ENG-1101", title: "English & Writing", credits: 3.0, grade: "A-", point: 3.5 },
      ],
    },
    {
      term: "Spring 2025 (Semester 2)",
      gpa: 3.88,
      credits: 13.5,
      courses: [
        { code: "CSE-1201", title: "Data Structures & Algorithms", credits: 3.0, grade: "A+", point: 4.0 },
        { code: "CSE-1202", title: "Data Structures Lab", credits: 1.5, grade: "A+", point: 4.0 },
        { code: "MAT-1201", title: "Linear Algebra & Matrices", credits: 3.0, grade: "A", point: 3.75 },
        { code: "EEE-1201", title: "Basic Electrical Engineering", credits: 3.0, grade: "A", point: 3.75 },
        { code: "SOC-1201", title: "Engineering Ethics & Society", credits: 3.0, grade: "A+", point: 4.0 },
      ],
    },
    {
      term: "Fall 2025 (Semester 3)",
      gpa: 3.76,
      credits: 15.0,
      courses: [
        { code: "CSE-2101", title: "Object Oriented Programming", credits: 3.0, grade: "A+", point: 4.0 },
        { code: "CSE-2102", title: "OOP Laboratory (Java)", credits: 1.5, grade: "A+", point: 4.0 },
        { code: "CSE-2103", title: "Discrete Mathematics", credits: 3.0, grade: "A-", point: 3.5 },
        { code: "MAT-2101", title: "Complex Variables & Fourier", credits: 3.0, grade: "B+", point: 3.25 },
        { code: "ECO-2101", title: "Engineering Economics", credits: 3.0, grade: "A+", point: 4.0 },
      ],
    },
    {
      term: "Spring 2026 (Semester 4)",
      gpa: 3.92,
      credits: 14.5,
      courses: [
        { code: "CSE-2201", title: "Database Systems", credits: 3.0, grade: "A+", point: 4.0 },
        { code: "CSE-2202", title: "Database Systems Lab", credits: 1.5, grade: "A+", point: 4.0 },
        { code: "CSE-2203", title: "Algorithms Design & Analysis", credits: 3.0, grade: "A+", point: 4.0 },
        { code: "STA-2201", title: "Probability & Statistics", credits: 3.0, grade: "A", point: 3.75 },
        { code: "HUM-2201", title: "Bangladesh Studies", credits: 3.0, grade: "A", point: 3.75 },
      ],
    },
  ],
};

export default function AdminResultsPage() {
  const { term } = useApp();
  const [activeTab, setActiveTab] = useState<"monitor" | "transcripts" | "analytics">("monitor");
  const [selectedDept, setSelectedDept] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedTerm, setSelectedTerm] = useState<string>("all");

  // Transcript inspection state
  const [inspectStudentModalOpen, setInspectStudentModalOpen] = useState(false);
  const [inspectedStudent, setInspectedStudent] = useState<{ id: string; name: string } | null>(null);

  // Filtered Grade Records
  const filteredRecords = useMemo(() => {
    return UNIVERSITY_GRADES_DATASET.filter((record) => {
      const matchDept = selectedDept === "all" || record.department.toLowerCase() === selectedDept.toLowerCase();
      const matchStatus = selectedStatus === "all" || record.status === selectedStatus;
      const matchTerm = selectedTerm === "all" || record.term === selectedTerm;
      return matchDept && matchStatus && matchTerm;
    });
  }, [selectedDept, selectedStatus, selectedTerm]);

  // Overall Statistics
  const totalSubmissions = UNIVERSITY_GRADES_DATASET.length;
  const publishedCount = UNIVERSITY_GRADES_DATASET.filter((r) => r.status === "published").length;
  const avgGpa = (
    UNIVERSITY_GRADES_DATASET.reduce((acc, r) => acc + r.gradePoint, 0) / totalSubmissions
  ).toFixed(2);
  const passRate = (
    (UNIVERSITY_GRADES_DATASET.filter((r) => r.gradePoint >= 2.0).length / totalSubmissions) *
    100
  ).toFixed(1);

  const handlePublishAll = () => {
    toast.success("All submitted grade sheets approved and published to student portals!");
  };

  const handleInspectTranscript = (studentId: string, studentName: string) => {
    setInspectedStudent({ id: studentId, name: studentName });
    setInspectStudentModalOpen(true);
  };

  // Columns for Live Grade Monitor Table
  const columns: ColumnDef<StudentGradeRecord>[] = [
    {
      key: "studentName",
      label: "Student Profile",
      sortable: true,
      render: (r) => (
        <div className="flex items-center gap-2.5">
          <span className="size-6 rounded-full flex items-center justify-center bg-gradient-to-br from-[#7CE9CB] to-[#2ED3A7] text-[#052620] font-display text-[0.65rem] font-bold shrink-0">
            {getInitials(r.studentName)}
          </span>
          <div>
            <p className="font-semibold text-ink leading-tight">{r.studentName}</p>
            <p className="text-[0.72rem] text-ink-faint font-mono">{r.studentId}</p>
          </div>
        </div>
      ),
    },
    {
      key: "courseCode",
      label: "Course & Section",
      sortable: true,
      render: (r) => (
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs font-bold text-jade">{r.courseCode}</span>
            <span className="text-[0.72rem] text-ink-faint">Sec {r.section}</span>
          </div>
          <p className="text-[0.72rem] text-ink-muted truncate max-w-[160px]">{r.courseTitle}</p>
        </div>
      ),
    },
    {
      key: "instructorName",
      label: "Instructor",
      sortable: true,
      render: (r) => (
        <span className="text-xs text-ink-muted">{r.instructorName}</span>
      ),
    },
    {
      key: "midterm",
      label: "Mid /30",
      className: "text-center",
      render: (r) => <span className="font-mono text-xs text-ink">{r.midterm}</span>,
    },
    {
      key: "assignment",
      label: "Assign /20",
      className: "text-center",
      render: (r) => <span className="font-mono text-xs text-ink">{r.assignment}</span>,
    },
    {
      key: "finalExam",
      label: "Final /50",
      className: "text-center",
      render: (r) => <span className="font-mono text-xs text-ink">{r.finalExam}</span>,
    },
    {
      key: "total",
      label: "Total /100",
      className: "text-center",
      sortable: true,
      render: (r) => <span className="font-mono text-xs font-bold text-ink">{r.total}</span>,
    },
    {
      key: "letterGrade",
      label: "Letter Grade",
      sortable: true,
      render: (r) => (
        <StatusPill tone={r.gradePoint >= 3.7 ? "ok" : r.gradePoint >= 3.0 ? "info" : "warn"}>
          {r.letterGrade} ({r.gradePoint.toFixed(2)})
        </StatusPill>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (r) => (
        <span
          className={cn(
            "text-[0.68rem] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider",
            r.status === "published"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
              : "bg-amber-500/10 text-amber-400 border-amber-500/30"
          )}
        >
          {r.status}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      className: "text-right",
      render: (r) => (
        <button
          type="button"
          onClick={() => handleInspectTranscript(r.studentId, r.studentName)}
          className={cn(
            buttonClass({ variant: "ghost", size: "sm" }),
            "h-7 px-2.5 text-xs text-jade hover:border-jade/40 cursor-pointer inline-flex items-center gap-1"
          )}
          title="Inspect full academic transcript"
        >
          <Award className="size-3.5" />
          <span className="hidden sm:inline">Transcript</span>
        </button>
      ),
    },
  ];

  return (
    <DashboardLayout
      requiredRole="admin"
      title="Results & Grade Monitoring Hub"
      subtitle="University-wide examination ledger, marks audit, and CGPA transcripts"
      crumb="Administrator / Academic Management"
      actions={
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handlePublishAll}
            className={cn(
              buttonClass({ variant: "primary", size: "sm" }),
              "text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            )}
          >
            <CheckCircle2 className="size-3.5" />
            <span>Approve & Publish Results</span>
          </button>
        </div>
      }
    >
      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <GlassCard className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-ink-faint font-medium">Submitted Sections</span>
            <Layers className="size-4 text-jade" />
          </div>
          <p className="font-display text-2xl font-bold text-ink">{totalSubmissions}</p>
          <p className="text-[0.72rem] text-jade mt-1">100% faculty submission rate</p>
        </GlassCard>

        <GlassCard className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-ink-faint font-medium">Published Grades</span>
            <CheckCircle2 className="size-4 text-emerald-400" />
          </div>
          <p className="font-display text-2xl font-bold text-ink">{publishedCount}</p>
          <p className="text-[0.72rem] text-ink-faint mt-1">{publishedCount} of {totalSubmissions} live</p>
        </GlassCard>

        <GlassCard className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-ink-faint font-medium">University Avg GPA</span>
            <TrendingUp className="size-4 text-sky-400" />
          </div>
          <p className="font-display text-2xl font-bold text-jade">{avgGpa}</p>
          <p className="text-[0.72rem] text-ink-faint mt-1">Across all departments</p>
        </GlassCard>

        <GlassCard className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-ink-faint font-medium">Pass Rate</span>
            <Award className="size-4 text-marigold" />
          </div>
          <p className="font-display text-2xl font-bold text-ink">{passRate}%</p>
          <p className="text-[0.72rem] text-emerald-400 mt-1">GPA &gt;= 2.00 threshold</p>
        </GlassCard>
      </div>

      {/* Main Tabbed Interface */}
      <GlassCard className="p-4 md:p-6 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-5">
          <div className="flex items-center p-0.5 rounded-xl border border-white/10 bg-white/[0.04]">
            <button
              type="button"
              onClick={() => setActiveTab("monitor")}
              className={cn(
                "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                activeTab === "monitor"
                  ? "bg-jade text-night-900 font-bold shadow-sm"
                  : "text-ink-muted hover:text-ink"
              )}
            >
              <BookOpen className="size-3.5" />
              <span>Section Marks Ledger</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("transcripts")}
              className={cn(
                "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                activeTab === "transcripts"
                  ? "bg-jade text-night-900 font-bold shadow-sm"
                  : "text-ink-muted hover:text-ink"
              )}
            >
              <GraduationCap className="size-3.5" />
              <span>Historical Transcripts</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("analytics")}
              className={cn(
                "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                activeTab === "analytics"
                  ? "bg-jade text-night-900 font-bold shadow-sm"
                  : "text-ink-muted hover:text-ink"
              )}
            >
              <Sparkles className="size-3.5" />
              <span>Grade Distributions</span>
            </button>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="rounded-lg border border-white/15 bg-white/[0.05] px-2.5 py-1.5 text-xs text-ink outline-none cursor-pointer focus:border-jade"
            >
              <option value="all" className="bg-night-900">All Departments</option>
              <option value="cse" className="bg-night-900">Computer Science (CSE)</option>
              <option value="eee" className="bg-night-900">Electrical Eng (EEE)</option>
              <option value="bba" className="bg-night-900">Business (BBA)</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-lg border border-white/15 bg-white/[0.05] px-2.5 py-1.5 text-xs text-ink outline-none cursor-pointer focus:border-jade"
            >
              <option value="all" className="bg-night-900">All Statuses</option>
              <option value="published" className="bg-night-900">Published</option>
              <option value="submitted" className="bg-night-900">Submitted</option>
            </select>
          </div>
        </div>

        {/* Tab 1: Live Marks Table */}
        {activeTab === "monitor" && (
          <DataTable
            columns={columns}
            data={filteredRecords}
            searchKeys={["studentName", "studentId", "courseCode", "instructorName"]}
            searchPlaceholder="Search by student, ID, course code, instructor..."
            pageSize={10}
          />
        )}

        {/* Tab 2: Historical Transcripts Explorer */}
        {activeTab === "transcripts" && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
              <p className="text-xs font-semibold text-ink-muted mb-3">
                Select a student below to inspect their full multi-term CGPA transcript & academic record:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { id: "2024-BSC-CSE-1001", name: "Rafiul Karim", dept: "CSE", cgpa: "3.82", earned: "96 Cr" },
                  { id: "2024-BSC-CSE-1002", name: "Ayesha Ahmed", dept: "CSE", cgpa: "3.75", earned: "96 Cr" },
                  { id: "2024-BSC-CSE-1004", name: "Sabina Hossain", dept: "CSE", cgpa: "3.90", earned: "96 Cr" },
                  { id: "2024-BSC-EEE-1011", name: "Rezaul Karim", dept: "EEE", cgpa: "3.65", earned: "92 Cr" },
                  { id: "2024-BBA-GEN-1020", name: "Anisur Rahman", dept: "BBA", cgpa: "3.88", earned: "90 Cr" },
                ].map((st) => (
                  <div
                    key={st.id}
                    onClick={() => handleInspectTranscript(st.id, st.name)}
                    className="p-3.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-jade/40 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-sm text-ink">{st.name}</p>
                      <p className="text-xs text-ink-faint font-mono">{st.id} · {st.dept}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-sm font-bold text-jade">{st.cgpa}</span>
                      <p className="text-[0.68rem] text-ink-muted">{st.earned}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: University Analytics & Grade Breakdown */}
        {activeTab === "analytics" && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02]">
              <h4 className="font-bold text-sm text-ink mb-4">Letter Grade Distribution (Current Cycle)</h4>
              <div className="space-y-3 font-mono text-xs">
                {[
                  { grade: "A+ (4.00)", count: 48, percent: "48%", color: "bg-emerald-400" },
                  { grade: "A (3.75)", count: 28, percent: "28%", color: "bg-teal-400" },
                  { grade: "A- (3.50)", count: 14, percent: "14%", color: "bg-cyan-400" },
                  { grade: "B+ (3.25)", count: 6, percent: "6%", color: "bg-amber-400" },
                  { grade: "B (3.00)", count: 3, percent: "3%", color: "bg-orange-400" },
                  { grade: "F (0.00)", count: 1, percent: "1%", color: "bg-rose-500" },
                ].map((bar) => (
                  <div key={bar.grade}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-ink-muted">{bar.grade}</span>
                      <span className="font-bold text-ink">{bar.count} students ({bar.percent})</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className={cn("h-full rounded-full", bar.color)} style={{ width: bar.percent }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02] flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm text-ink mb-2">Academic Audit Standards</h4>
                <p className="text-xs text-ink-muted leading-relaxed mb-4">
                  All course grades are mapped to the standard 4.00 UGC grading scale. When instructors submit mark sheets, historical semester records are materialized into immutable results ledgers.
                </p>
                <div className="p-3 rounded-lg border border-jade/20 bg-jade/5 text-xs text-jade space-y-1">
                  <p className="font-bold">✓ Grade Verification Protocol</p>
                  <p className="text-[0.72rem] text-ink-muted">
                    Automated prerequisite validation and retake replacement arithmetic are handled by the backend calculation engine.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => toast.success("Exported institutional grades summary as CSV")}
                  className={cn(buttonClass({ variant: "ghost", size: "sm" }), "text-xs flex items-center gap-1.5 cursor-pointer")}
                >
                  <Download className="size-3.5 text-jade" />
                  <span>Download Ledger CSV</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </GlassCard>

      {/* Transcript Inspection Dialog */}
      <Dialog open={inspectStudentModalOpen} onOpenChange={setInspectStudentModalOpen}>
        <DialogContent className="border border-white/20 bg-night-900/98 p-6 rounded-2xl shadow-2xl backdrop-blur-2xl max-w-3xl max-h-[85vh] overflow-y-auto text-ink">
          <DialogHeader>
            <div className="flex items-center justify-between gap-4">
              <div>
                <DialogTitle className="font-display text-lg font-bold text-ink flex items-center gap-2">
                  <Award className="size-5 text-jade" />
                  Official Academic Transcript
                </DialogTitle>
                <DialogDescription className="text-xs text-ink-muted mt-1">
                  Student: <span className="font-bold text-ink">{inspectedStudent?.name}</span> ({inspectedStudent?.id})
                </DialogDescription>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className={cn(buttonClass({ variant: "ghost", size: "sm" }), "text-xs flex items-center gap-1.5 cursor-pointer")}
              >
                <Printer className="size-3.5 text-jade" />
                <span>Print</span>
              </button>
            </div>
          </DialogHeader>

          {/* Transcript Semesters List */}
          <div className="space-y-5 mt-4">
            {(STUDENT_HISTORICAL_TRANSCRIPTS[inspectedStudent?.id || "2024-BSC-CSE-1001"] ||
              STUDENT_HISTORICAL_TRANSCRIPTS["2024-BSC-CSE-1001"]).map((termData, i) => (
              <div key={termData.term} className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/8">
                  <span className="font-bold text-sm text-jade">{termData.term}</span>
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="text-ink-faint">Credits: {termData.credits}</span>
                    <span className="font-bold text-ink">Term GPA: {termData.gpa.toFixed(2)}</span>
                  </div>
                </div>

                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr className="text-ink-faint text-[0.68rem] uppercase tracking-wider">
                      <th className="py-1">Course Code</th>
                      <th className="py-1">Course Title</th>
                      <th className="py-1 text-center">Credits</th>
                      <th className="py-1 text-center">Grade</th>
                      <th className="py-1 text-right">Point</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {termData.courses.map((c) => (
                      <tr key={c.code}>
                        <td className="py-2 text-jade font-bold">{c.code}</td>
                        <td className="py-2 font-sans text-ink">{c.title}</td>
                        <td className="py-2 text-center text-ink-faint">{c.credits.toFixed(1)}</td>
                        <td className="py-2 text-center font-bold text-ink">{c.grade}</td>
                        <td className="py-2 text-right text-ink-muted">{c.point.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-jade/10 border border-jade/30 mt-4">
            <div>
              <p className="text-xs text-ink-faint">Cumulative Standing</p>
              <p className="font-bold text-sm text-ink">Total Earned Credits: 56.5 / 140 Cr</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-ink-faint">Cumulative CGPA</p>
              <p className="font-display text-2xl font-bold text-jade">3.85 / 4.00</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
