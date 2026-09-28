import type { DegreeProgram, SemesterCurriculum, CurriculumCourse } from "@/lib/app-types";
import type {
  SemesterAttendanceRecord,
  CourseSemesterAttendance,
  CourseMonthlyStats,
  MonthSummary,
  LectureDailyLog,
} from "./attendance-types";

const MONTH_NAMES_FALL = ["Sep 2026", "Oct 2026", "Nov 2026", "Dec 2026"];
const MONTH_NAMES_SPRING = ["Jan 2026", "Feb 2026", "Mar 2026", "Apr 2026"];

const SAMPLE_TOPICS: Record<string, string[]> = {
  "CSE-1101": [
    "Course Orientation & History of Computing",
    "Variables, Data Types, and Operators in C/C++",
    "Conditional Logic & Switch Statements",
    "Loops, Iterations & Nested Loops",
    "Functions, Scope & Recursion Fundamentals",
    "1D and 2D Arrays in Memory",
    "String Manipulation & Standard Libraries",
    "Pointers & Dynamic Memory Allocation",
    "Structures, Unions and Typedefs",
    "File Handling & I/O Streams",
    "Header Files & Modular Programming",
    "Final Project Review & Code Walkthrough",
  ],
  "CSE-1202": [
    "OOP Philosophy: Encapsulation & Abstraction",
    "Classes, Objects, and Constructors",
    "Inheritance Hierarchies & Super Keyword",
    "Polymorphism, Method Overriding & Overloading",
    "Abstract Classes and Interface Contracts",
    "Exception Handling & Custom Exceptions",
    "Java Collections Framework (List, Set, Map)",
    "Generics and Type Safety",
    "Multithreading & Concurrency Basics",
    "JavaFX / Swing GUI Event Handling",
    "Design Patterns: Singleton & Factory",
    "Final Architectural Review",
  ],
  "CSE-2101": [
    "Asymptotic Notation (Big O, Omega, Theta)",
    "Arrays, Linked Lists (Singly, Doubly, Circular)",
    "Stacks, Queues, and Deques with Applications",
    "Recursion Trees & Master Theorem",
    "Divide and Conquer: Merge Sort & Quick Sort",
    "Binary Trees, BST Operations & Traversals",
    "AVL Trees & Self-Balancing Rotations",
    "Heap Data Structures & Priority Queues",
    "Graph Representation (Adj Matrix & List)",
    "Graph Traversals: BFS, DFS & Topological Sort",
    "Shortest Path: Dijkstra & Bellman-Ford",
    "Minimum Spanning Trees: Kruskal & Prim",
  ],
  "CSE-2201": [
    "Relational Model & Relational Algebra",
    "Entity-Relationship (ER) & EER Modeling",
    "Advanced SQL: Joins, Subqueries & Aggregations",
    "Database Normalization (1NF, 2NF, 3NF, BCNF)",
    "Storage, File Structure & Indexing (B+ Trees)",
    "Query Processing & Cost Estimation",
    "Transaction Management & ACID Properties",
    "Concurrency Control & Two-Phase Locking",
    "Crash Recovery: WAL & Checkpointing",
    "NoSQL Databases & Document Stores",
    "Security, Access Control & SQL Injection Defense",
    "Distributed Databases & Replication",
  ],
  "CSE-3101": [
    "Operating System Structures & System Calls",
    "Process Concepts, PCB, and State Transitions",
    "CPU Scheduling Algorithms (FCFS, SJF, RR, Priority)",
    "Inter-Process Communication (Pipes, Shared Memory)",
    "Thread Synchronization: Mutex, Semaphores & Monitors",
    "Classic IPC Problems (Dining Philosophers, Readers-Writers)",
    "Deadlock Detection, Prevention & Banker's Algorithm",
    "Main Memory Management & Paging Systems",
    "Virtual Memory, Page Replacement (LRU, Optimal)",
    "File System Architecture & Directory Implementation",
    "I/O Hardware & Disk Scheduling (SCAN, C-LOOK)",
    "Virtualization, Containers & OS Security",
  ],
  "CSE-3102": [
    "Software Engineering Lifecycle Models (SDLC)",
    "Agile Frameworks: Scrum, Kanban & Sprint Cycles",
    "Requirements Engineering & User Story Mapping",
    "System Architecture: Monolith vs Microservices",
    "UML Modeling: Class, Sequence & State Diagrams",
    "Software Design Principles (SOLID, DRY, KISS)",
    "Test-Driven Development (TDD) & Unit Testing",
    "Continuous Integration & Continuous Delivery (CI/CD)",
    "Refactoring Techniques & Code Smells",
    "Software Quality Assurance & Code Reviews",
    "DevOps Automation & Cloud Deployments",
    "Final Sprint Review & Project Defense",
  ],
  "CSE-3103": [
    "Microprocessor Architecture (8086 / ARM)",
    "Bus Systems, Clock Generators & Control Units",
    "Assembly Language Programming & Addressing Modes",
    "Interrupts & Programmable Interrupt Controller (8259)",
    "Memory Interfacing & Address Decoding",
    "Programmable Peripheral Interface (8255)",
    "Serial Communication & UART Protocol",
    "Timers, Counters & PWM Generation",
    "Analog-to-Digital (ADC) & DAC Interfacing",
    "Embedded C Programming for Microcontrollers",
    "Sensor Interfacing: I2C, SPI & GPIO",
    "Real-Time Operating Systems (RTOS) Basics",
  ],
  "MAT-3101": [
    "Floating-Point Arithmetic & Error Analysis",
    "Solutions of Non-Linear Equations: Bisection & Newton-Raphson",
    "System of Linear Equations: Gauss Elimination & LU Factorization",
    "Iterative Methods: Jacobi & Gauss-Seidel",
    "Interpolation: Lagrange & Newton Divided Differences",
    "Spline Interpolation & Curve Fitting",
    "Numerical Differentiation: Forward, Backward, Central",
    "Numerical Integration: Trapezoidal & Simpson's Rules",
    "Numerical Solutions of ODEs: Euler & Runge-Kutta 4th Order",
    "Boundary Value Problems & Finite Difference Method",
    "Eigenvalue Problems: Power Method",
    "Practical Computational Labs in MATLAB / Python",
  ],
};

function getTopicsForCourse(code: string): string[] {
  if (SAMPLE_TOPICS[code]) return SAMPLE_TOPICS[code];
  return [
    "Course Overview, Learning Outcomes & Objectives",
    "Foundational Principles & Theoretical Background",
    "Core Mathematical Formulations & Analytical Methods",
    "System Architecture & Structural Analysis",
    "Practical Case Study & Implementation Frameworks",
    "Mid-Semester Knowledge Integration & Review",
    "Advanced Paradigms & Contemporary Methodologies",
    "Empirical Problem Solving & Laboratory Testing",
    "Optimization Techniques & Performance Metrics",
    "Security, Robustness & Standards Compliance",
    "Industrial Applications & Current Trends",
    "Comprehensive Term Review & Examination Prep",
  ];
}

export function generateSemesterAttendanceData(
  program: DegreeProgram,
  selectedSemesterNum: number
): SemesterAttendanceRecord {
  const semester = program.semesters.find((s) => s.semesterNumber === selectedSemesterNum) || program.semesters[0];
  const isCompleted = semester?.status === "completed";
  const isCurrent = semester?.status === "current";
  const isLocked = semester?.status === "locked";

  const termName = semester?.termName || `Semester ${selectedSemesterNum}`;
  const isSpring = termName.toLowerCase().includes("spring");
  const monthNames = isSpring ? MONTH_NAMES_SPRING : MONTH_NAMES_FALL;

  const coursesData: CourseSemesterAttendance[] = (semester?.courses || []).map((course, cIdx) => {
    const topics = getTopicsForCourse(course.code);
    const isLab = course.type === "Lab";
    const classesPerMonth = isLab ? [3, 3, 3, 3] : [4, 4, 4, 4];

    let totalHeld = 0;
    let totalPresent = 0;
    let totalLate = 0;
    let totalAbsent = 0;

    const monthlyBreakdown: CourseMonthlyStats[] = monthNames.map((mName, mIdx) => {
      let heldInMonth = classesPerMonth[mIdx];
      let presentInMonth = heldInMonth;
      let lateInMonth = 0;
      let absentInMonth = 0;

      if (isLocked) {
        heldInMonth = classesPerMonth[mIdx];
        presentInMonth = 0;
        lateInMonth = 0;
        absentInMonth = 0;
      } else if (isCurrent) {
        // In progress: Month 1 and Month 2 done/active, Month 3 and 4 in future
        if (mIdx === 0) {
          // Month 1 completed
          absentInMonth = (cIdx + mIdx) % 4 === 0 ? 1 : 0;
          lateInMonth = (cIdx + mIdx) % 3 === 0 ? 1 : 0;
          presentInMonth = heldInMonth - absentInMonth;
        } else if (mIdx === 1) {
          // Month 2 active
          heldInMonth = 4;
          absentInMonth = cIdx === 2 ? 1 : 0;
          lateInMonth = cIdx === 1 ? 1 : 0;
          presentInMonth = heldInMonth - absentInMonth;
        } else {
          // Future months in current semester (scheduled)
          heldInMonth = 0;
          presentInMonth = 0;
          lateInMonth = 0;
          absentInMonth = 0;
        }
      } else {
        // Completed semester
        if ((cIdx + mIdx) % 5 === 0) {
          absentInMonth = 1;
        }
        if ((cIdx + mIdx) % 4 === 1) {
          lateInMonth = 1;
        }
        presentInMonth = heldInMonth - absentInMonth;
      }

      totalHeld += heldInMonth;
      totalPresent += presentInMonth;
      totalLate += lateInMonth;
      totalAbsent += absentInMonth;

      const mPct = heldInMonth > 0 ? Math.round(((presentInMonth + lateInMonth * 0.5) / heldInMonth) * 100) : 0;

      return {
        monthIndex: mIdx + 1,
        monthName: mName,
        held: heldInMonth,
        present: presentInMonth,
        late: lateInMonth,
        absent: absentInMonth,
        pct: mPct,
      };
    });

    const coursePct = totalHeld > 0 ? Math.round(((totalPresent + totalLate * 0.5) / totalHeld) * 100) : (isLocked ? 0 : 92);

    // Build Lecture Daily Logs
    const lectureLogs: LectureDailyLog[] = [];
    let logCounter = 1;

    monthNames.forEach((mName, mIdx) => {
      const monthHeld = monthlyBreakdown[mIdx].held;
      if (monthHeld === 0 && !isLocked) return;

      const monthBase = isSpring ? [1, 2, 3, 4][mIdx] : [9, 10, 11, 12][mIdx];
      const days = [2, 9, 16, 23];

      for (let l = 0; l < monthHeld; l++) {
        const dayNum = days[l] || (l + 1) * 7;
        const formattedDay = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
        const formattedMonth = monthBase < 10 ? `0${monthBase}` : `${monthBase}`;
        const dateStr = `2026-${formattedMonth}-${formattedDay}`;

        let status: LectureDailyLog["status"] = "PRESENT";
        if (l === 0 && (cIdx + mIdx) % 5 === 0) {
          status = "ABSENT";
        } else if (l === 1 && (cIdx + mIdx) % 4 === 1) {
          status = "LATE";
        }

        const topicIndex = (logCounter - 1) % topics.length;

        lectureLogs.push({
          lectureNumber: logCounter++,
          date: dateStr,
          dayOfWeek: ["Sunday", "Tuesday", "Thursday", "Monday"][l % 4],
          time: course.schedule?.split(",")[0] || "10:30 AM - 12:00 PM",
          topic: topics[topicIndex] || `Lecture ${logCounter}: Advanced Topics`,
          status: status,
          room: course.room || "AB2-301",
          verifiedBy: course.instructor || "Faculty Head",
        });
      }
    });

    return {
      code: course.code,
      title: course.title,
      credits: course.credits,
      type: course.type,
      instructor: course.instructor || "Assigned Faculty",
      room: course.room || "AB2-401",
      schedule: course.schedule || "Sun 10:30, Tue 10:30",
      totalHeld,
      totalPresent,
      totalLate,
      totalAbsent,
      pct: coursePct,
      isEligible: coursePct >= 75,
      monthlyBreakdown,
      lectureLogs,
    };
  });

  // Calculate monthly summaries
  const months: MonthSummary[] = monthNames.map((mName, mIdx) => {
    let mHeld = 0;
    let mPresent = 0;
    let mLate = 0;
    let mAbsent = 0;

    coursesData.forEach((c) => {
      const stats = c.monthlyBreakdown[mIdx];
      if (stats) {
        mHeld += stats.held;
        mPresent += stats.present;
        mLate += stats.late;
        mAbsent += stats.absent;
      }
    });

    const mPct = mHeld > 0 ? Math.round(((mPresent + mLate * 0.5) / mHeld) * 100) : (isLocked ? 0 : 100);

    return {
      monthIndex: mIdx + 1,
      monthName: mName,
      totalHeld: mHeld,
      totalPresent: mPresent,
      totalLate: mLate,
      totalAbsent: mAbsent,
      pct: mPct,
    };
  });

  const totalHeld = coursesData.reduce((acc, c) => acc + c.totalHeld, 0);
  const totalPresent = coursesData.reduce((acc, c) => acc + c.totalPresent, 0);
  const totalLate = coursesData.reduce((acc, c) => acc + c.totalLate, 0);
  const totalAbsent = coursesData.reduce((acc, c) => acc + c.totalAbsent, 0);

  const overallPct = totalHeld > 0 ? Math.round(((totalPresent + totalLate * 0.5) / totalHeld) * 100) : (isLocked ? 0 : 92);
  const atRiskCount = coursesData.filter((c) => !c.isEligible).length;

  return {
    semesterNumber: selectedSemesterNum,
    semesterTitle: semester?.title || `Semester ${selectedSemesterNum}`,
    termName,
    status: (semester?.status || "completed") as "completed" | "current" | "locked",
    months,
    courses: coursesData,
    totalHeld,
    totalPresent,
    totalLate,
    totalAbsent,
    overallPct,
    isFullyEligible: atRiskCount === 0,
    atRiskCount,
  };
}
