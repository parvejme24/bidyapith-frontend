import { DB } from "@/lib/data";
import type { PublicCourseDetails } from "./course-public-details-modal";

export const PUBLIC_COURSE_CATALOG: PublicCourseDetails[] = [
  {
    code: "CSE-2201",
    title: "Database Management Systems & SQL Studio",
    department: "Computer Science & Engineering",
    credits: 3,
    type: "Core",
    instructor: "Dr. Tanvir Ahmed",
    room: "AB2-305",
    schedule: "Sun 10:30, Tue 10:30",
    tuitionFee: 15000,
    prereq: "CSE-2101",
    seats: 45,
    taken: 38,
    description:
      "Comprehensive study of relational models, database normalization (1NF-BCNF), ACID transactions, query execution planning, indexing strategies with B+ trees, and high-performance SQL query optimization.",
    learningOutcomes: [
      "Master relational algebra and schema design for enterprise workloads.",
      "Implement multi-table joins, CTEs, subqueries, and window functions.",
      "Understand concurrency control, write-ahead logging (WAL), and ACID isolation levels.",
      "Design and build production-grade database-backed web applications.",
    ],
    modules: [
      { week: "Week 1–2", topic: "Relational Data Modeling & ER Diagrams", details: "Entity mapping, keys, referential integrity, and relational algebra primitives." },
      { week: "Week 3–5", topic: "Advanced SQL & Indexing Strategies", details: "Complex querying, aggregations, clustered/non-clustered indexes, and query explain plans." },
      { week: "Week 6–8", topic: "Schema Normalization & Functional Dependencies", details: "1NF, 2NF, 3NF, BCNF decomposition and dependency preservation algorithms." },
      { week: "Week 9–12", topic: "Transactions, Concurrency & NoSQL", details: "Two-phase locking, MVCC, write-ahead logging, crash recovery, and document stores." },
    ],
  },
  {
    code: "CSE-3101",
    title: "Operating Systems Principles & Concurrency",
    department: "Computer Science & Engineering",
    credits: 3,
    type: "Core",
    instructor: "Dr. Sabbir Rahman",
    room: "AB2-405",
    schedule: "Sun 10:30, Tue 10:30",
    tuitionFee: 15000,
    prereq: "CSE-2203",
    seats: 45,
    taken: 32,
    description:
      "Detailed study of OS architecture, process lifecycle management, CPU scheduling, thread synchronization with mutexes and semaphores, virtual memory paging, disk I/O, and container virtualization.",
    learningOutcomes: [
      "Understand POSIX system calls and kernel-user space transitions.",
      "Implement multi-threaded applications with mutexes, semaphores, and condition variables.",
      "Solve classic concurrency problems (Readers-Writers, Dining Philosophers).",
      "Analyze virtual memory page tables, TLBs, and LRU page replacement algorithms.",
    ],
    modules: [
      { week: "Week 1–3", topic: "Processes, Threads & System Calls", details: "Process state diagrams, context switching, fork/exec, and POSIX threads in C." },
      { week: "Week 4–6", topic: "CPU Scheduling & Concurrency Synchronization", details: "Round-robin, Multi-Level Feedback Queues, mutex locks, semaphores, and race condition prevention." },
      { week: "Week 7–9", topic: "Deadlocks & Memory Management", details: "Banker's algorithm, resource allocation graphs, paging, TLB caches, and page fault handling." },
      { week: "Week 10–12", topic: "File Systems & Virtualization", details: "Inodes, directory structures, disk scheduling algorithms, and Docker container namespaces." },
    ],
  },
  {
    code: "CSE-4108",
    title: "Artificial Intelligence & Machine Learning",
    department: "Computer Science & Engineering",
    credits: 3,
    type: "Core",
    instructor: "Dr. Nafisa Haque",
    room: "AB2-208",
    schedule: "Sun 14:00, Tue 14:00",
    tuitionFee: 18000,
    prereq: "MAT-2101",
    seats: 45,
    taken: 45,
    description:
      "Comprehensive exploration of intelligent agents, search algorithms (A*, Minimax), probabilistic reasoning with Bayesian networks, supervised & unsupervised machine learning, deep neural architectures, and reinforcement learning.",
    learningOutcomes: [
      "Formulate heuristic search algorithms for state space navigation.",
      "Implement supervised regressors, classifiers, and decision forest ensembles.",
      "Construct neural networks using PyTorch for classification and regression.",
      "Design reinforcement learning Q-agents in simulated gym environments.",
    ],
    modules: [
      { week: "Week 1–3", topic: "Intelligent Agents & Heuristic Search", details: "A* search, admissible heuristics, adversarial search with alpha-beta pruning." },
      { week: "Week 4–6", topic: "Probabilistic Reasoning & Bayesian Models", details: "Bayes nets, exact inference, variable elimination, and Markov Decision Processes." },
      { week: "Week 7–9", topic: "Supervised Learning & Support Vector Machines", details: "Linear models, logistic regression, SVM kernels, decision trees, and ensemble boosting." },
      { week: "Week 10–12", topic: "Deep Learning Foundations & Reinforcement Learning", details: "Backpropagation, CNNs for vision, policy gradient, and Deep Q-Networks." },
    ],
  },
  {
    code: "CSE-4210",
    title: "Distributed Systems & Cloud Architecture",
    department: "Computer Science & Engineering",
    credits: 3,
    type: "Elective",
    instructor: "Prof. Dr. Ayesha Rahman",
    room: "AB2-501",
    schedule: "Sun 16:00, Tue 16:00",
    tuitionFee: 18000,
    prereq: "CSE-3303",
    seats: 40,
    taken: 27,
    description:
      "In-depth analysis of distributed computing architectures, consensus protocols (Raft, Paxos), CAP theorem, distributed storage systems (Dynamo, Spanner), microservices, and Kubernetes orchestration.",
    learningOutcomes: [
      "Implement leader election and consensus mechanisms via Raft.",
      "Design fault-tolerant distributed RPC APIs with gRPC and Protocol Buffers.",
      "Evaluate consistency versus availability trade-offs under network partitions.",
      "Deploy scalable containerized applications across cloud clusters.",
    ],
    modules: [
      { week: "Week 1–3", topic: "Distributed Architectures & RPCs", details: "Message passing, RPC semantics, serialization, and clock synchronization." },
      { week: "Week 4–6", topic: "Consensus Algorithms & State Machine Replication", details: "Paxos foundations, Raft leader election, log replication, and safety proofs." },
      { week: "Week 7–9", topic: "Distributed Storage & Transactions", details: "Distributed hash tables, consistent hashing, 2PC, Spanner TrueTime, and Dynamo." },
      { week: "Week 10–12", topic: "Cloud Platforms & Microservice Orchestration", details: "Docker containers, Kubernetes clusters, service meshes, and observability." },
    ],
  },
  {
    code: "DSAI-5101",
    title: "Advanced Machine Learning Theory & Deep Networks",
    department: "Data Science & Artificial Intelligence",
    credits: 3,
    type: "Core",
    instructor: "Dr. Nafisa Haque",
    room: "AB2-501",
    schedule: "Sun 18:00, Tue 18:00",
    tuitionFee: 18000,
    prereq: "MAT-2201",
    seats: 40,
    taken: 28,
    description:
      "Rigorous foundations in statistical learning theory, optimization with SGD/Adam, deep neural networks, transformer architectures, loss surfaces, regularization, and unsupervised representation learning.",
    learningOutcomes: [
      "Derive gradient backpropagation through complex computational graphs.",
      "Train convolutional networks and self-attention transformer models in PyTorch.",
      "Apply regularization (Dropout, BatchNorm, LayerNorm, Weight Decay).",
      "Evaluate models with cross-validation, precision-recall, and ROC-AUC metrics.",
    ],
    modules: [
      { week: "Week 1–3", topic: "Mathematical Foundations & Convex Optimization", details: "Linear algebra, matrix calculus, maximum likelihood estimation, and gradient descent variants." },
      { week: "Week 4–6", topic: "Neural Networks & Backpropagation", details: "Multi-layer perceptrons, activation functions, loss surfaces, and automatic differentiation." },
      { week: "Week 7–9", topic: "Convolutional Architectures & Vision", details: "ResNets, spatial filters, pooling, transfer learning, and computer vision classification." },
      { week: "Week 10–12", topic: "Transformers & Self-Attention Mechanisms", details: "Multi-head attention, positional encodings, BERT/GPT architectures, and fine-tuning." },
    ],
  },
  {
    code: "CSE-3102",
    title: "Software Engineering & Enterprise Architecture",
    department: "Computer Science & Engineering",
    credits: 3,
    type: "Core",
    instructor: "Prof. Dr. Ayesha Rahman",
    room: "AB2-501",
    schedule: "Mon 09:00, Wed 09:00",
    tuitionFee: 15000,
    prereq: "CSE-2201",
    seats: 42,
    taken: 36,
    description:
      "Software architecture paradigms, agile development methodologies, microservices, REST/GraphQL APIs, continuous integration/continuous deployment (CI/CD), test-driven development (TDD), and cloud deployment.",
    learningOutcomes: [
      "Apply SOLID principles and GoF design patterns in production systems.",
      "Design scalable microservices with event-driven message queues.",
      "Write unit, integration, and end-to-end automated test suites.",
      "Set up automated CI/CD pipelines with Docker and GitHub Actions.",
    ],
    modules: [
      { week: "Week 1–3", topic: "Agile SDLC & Requirements Engineering", details: "User stories, sprint planning, backlog grooming, and acceptance criteria formulation." },
      { week: "Week 4–6", topic: "Architectural Patterns & Clean Code", details: "Layered architecture, Hexagonal/Ports & Adapters, SOLID principles, and refactoring." },
      { week: "Week 7–9", topic: "Microservices & Distributed Communication", details: "REST APIs, GraphQL, gRPC, RabbitMQ/Kafka event streaming, and API gateways." },
      { week: "Week 10–12", topic: "CI/CD, Testing & DevOps Automation", details: "TDD workflows, containerization with Docker, pipeline automation, and monitoring." },
    ],
  },
  {
    code: "SWE-5102",
    title: "Advanced Cybersecurity Principles & Network Defense",
    department: "Computer Science & Engineering",
    credits: 3,
    type: "Elective",
    instructor: "Dr. Tanvir Ahmed",
    room: "AB1-304",
    schedule: "Tue 16:00, Thu 16:00",
    tuitionFee: 16000,
    prereq: "CSE-3201",
    seats: 35,
    taken: 22,
    description:
      "Zero-trust security models, public-key cryptography (RSA, ECC), TLS handshake mechanisms, penetration testing methodologies, OWASP Top 10 web vulnerabilities, and enterprise intrusion detection systems.",
    learningOutcomes: [
      "Analyze network packets and cryptographic protocols for vulnerabilities.",
      "Perform web vulnerability assessments against SQL injection, XSS, and CSRF.",
      "Configure firewalls, intrusion prevention systems, and identity access management (IAM).",
      "Design zero-trust architectures for secure cloud environments.",
    ],
    modules: [
      { week: "Week 1–3", topic: "Applied Cryptography & PKI Infrastructure", details: "Symmetric/asymmetric encryption, digital signatures, certificates, and TLS 1.3." },
      { week: "Week 4–6", topic: "Network Security & Protocol Analysis", details: "IPSec VPNs, DNSSEC, packet sniffing with Wireshark, and DDoS defense tactics." },
      { week: "Week 7–9", topic: "Web Application Security & OWASP Defense", details: "SQL injection, cross-site scripting, authentication flaws, and secure headers." },
      { week: "Week 10–12", topic: "Zero Trust & Incident Response", details: "IAM policies, SIEM log analysis, threat hunting, and security governance frameworks." },
    ],
  },
  {
    code: "MAT-3101",
    title: "Numerical Analysis & Computational Methods",
    department: "Mathematics & Physical Sciences",
    credits: 3,
    type: "General",
    instructor: "Dr. Selim Reza",
    room: "AB1-118",
    schedule: "Sun 14:30, Tue 14:30",
    tuitionFee: 12000,
    prereq: "MAT-2201",
    seats: 50,
    taken: 41,
    description:
      "Numerical algorithms for roots of non-linear equations, systems of linear equations, interpolation, numerical calculus, ordinary differential equations, and computational simulations in Python/MATLAB.",
    learningOutcomes: [
      "Implement Newton-Raphson, Bisection, and Fixed-Point iteration solvers.",
      "Perform LU decomposition, Gauss-Seidel, and QR factorization.",
      "Calculate numerical derivatives and integrals using Simpson's rules.",
      "Solve ODEs with Runge-Kutta 4th Order methods.",
    ],
    modules: [
      { week: "Week 1–3", topic: "Root Finding & Non-Linear Equations", details: "Bisection, Newton-Raphson, Secant method, and convergence rate analysis." },
      { week: "Week 4–6", topic: "Linear Systems & Matrix Decompositions", details: "Gaussian elimination, LU decomposition, Jacobi and Gauss-Seidel iterations." },
      { week: "Week 7–9", topic: "Interpolation & Numerical Integration", details: "Lagrange polynomials, spline interpolation, Trapezoidal and Simpson's 1/3 & 3/8 rules." },
      { week: "Week 10–12", topic: "Numerical ODEs & Boundary Value Problems", details: "Euler's method, Runge-Kutta 4th order, finite difference methods, and simulations." },
    ],
  },
];

export function getCoursePublicDetails(code: string): PublicCourseDetails {
  const found = PUBLIC_COURSE_CATALOG.find((c) => c.code.toLowerCase() === code.toLowerCase());
  if (found) return found;

  const dbCourse = DB.courses.find((c) => c.code.toLowerCase() === code.toLowerCase());
  if (dbCourse) {
    const deptName =
      dbCourse.dept === "cse"
        ? "Computer Science & Engineering"
        : dbCourse.dept === "eee"
        ? "Electrical & Electronic Engineering"
        : dbCourse.dept === "bba"
        ? "Business Administration"
        : dbCourse.dept === "civ"
        ? "Civil Engineering"
        : dbCourse.dept === "mat"
        ? "Mathematics & Physical Sciences"
        : dbCourse.dept === "eco"
        ? "Economics & Social Sciences"
        : "Academic Faculty";

    return {
      code: dbCourse.code,
      title: dbCourse.title,
      department: deptName,
      credits: dbCourse.credits || 3,
      type: dbCourse.level >= 400 ? "Elective" : "Core",
      instructor: dbCourse.instructor,
      room: "Academic Block 2, Room 401",
      schedule: "Sun 10:00, Tue 10:00",
      tuitionFee: (dbCourse.credits || 3) * 5000,
      prereq: dbCourse.prereq === "—" ? undefined : dbCourse.prereq,
      seats: dbCourse.seats,
      taken: dbCourse.taken,
      description: `Comprehensive undergraduate course in ${dbCourse.title}, covering foundational theory, mathematical models, practical laboratory experiments, and industrial design methodologies.`,
      learningOutcomes: [
        `Understand core theoretical principles of ${dbCourse.title}.`,
        "Analyze problems and construct robust mathematical/algorithmic solutions.",
        "Implement practical laboratory assignments and team-based semester projects.",
        "Synthesize concepts for advanced specialization and research publication.",
      ],
      modules: [
        { week: "Week 1–3", topic: "Foundations & Theoretical Preliminaries", details: "Fundamental concepts, historical context, axioms, and introductory problem sets." },
        { week: "Week 4–6", topic: "Core Methodologies & Architecture", details: "In-depth analytical frameworks, design patterns, and laboratory implementation." },
        { week: "Week 7–9", topic: "Advanced Topics & Empirical Analysis", details: "Complex systems, optimization algorithms, and performance benchmarking." },
        { week: "Week 10–12", topic: "Case Studies & Capstone Project", details: "Real-world engineering applications, industry standards, and final project defense." },
      ],
    };
  }

  // Generic fallback
  return {
    code: code || "CSE-2201",
    title: "Advanced Academic Course Offering",
    department: "Computer Science & Engineering",
    credits: 3,
    type: "Core",
    instructor: "Faculty Member",
    room: "Academic Block 2, Room 301",
    schedule: "Sun 10:00, Tue 10:00",
    tuitionFee: 15000,
    seats: 45,
    taken: 30,
    description: "University standard course syllabus with comprehensive lecture modules and laboratory exercises.",
    learningOutcomes: [
      "Master foundational concepts and modern industry best practices.",
      "Complete hands-on assignments and research evaluations.",
    ],
    modules: [
      { week: "Week 1–6", topic: "Theoretical Foundations", details: "Core lectures and foundational analysis." },
      { week: "Week 7–12", topic: "Applied Laboratory & Final Project", details: "Practical implementation and final project evaluation." },
    ],
  };
}
