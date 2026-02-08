// Site Data - Edit this file to update content without touching HTML
const siteData = {
  // Personal Information
  name: "Joe Gibbs",
  title: "Quantum Research Scientist",
  subtitle: "Enhancing quantum simulation with hybrid quantum-classical algorithms.",

  // Biography
  bio: `I am a physicist, with 6 years experience researching hybrid quantum-classical algorithms.
  My (soon to be completed) PhD focuses on maximally leveraging classical computation to support Hamiltonian simulation on quantum computers. My collaborators and I have primarily used a blend of tensor network algorithms, with inspiration from machine learning techniques, to aid the compilation of efficient circuits more amenable to the constraints of both NISQ and fault-tolerant quantum computers. I am driven by the challenge of scaling quantum simulations to solve real-world computational problems at the intersection of HPC and Quantum.`,

  // Research Interests
  research: [
    {
      id: "simulation",
      title: "Quantum Simulation",
      description: "Motivated by the killer application for quantum computers, the simulation of quantum many-body systems. I have worked on both static and dynamic simulation of spin lattices, lattice gauge theories, nuclear structure.",
      icon: "wave" // CSS-based icon identifier
    },
    {
      id: "compilation",
      title: "Circuit Compilation",
      description: "Quantum computers still struggle with high gate counts. I develop specialized algorithms to reduce gate overheads for quantum simulation. These methods have been tailored to benefit both NISQ and fault-tolerant quantum computers.",
      icon: "gate"
    },
    {
      id: "tensor",
      title: "Tensor Network Algorithms",
      description: "Tensor network methods are the de-facto competitor to quantum advantage claims, leveraging increasingly advanced GPU processors. We instead use these powerful algorithms in support of the quantum computation, using MPS and PEPS to optimize efficient quantum circuits, ready to run on real hardare.",
      icon: "network"
    }
  ],

  // Featured Software
  software: {
    name: "TenSynth.jl",
    tagline: "Tensor Network to Quantum Circuit Synthesis",
    description: "A Julia package that transforms quantum states and unitaries expressed as tensor networks into optimized quantum circuits ready for real hardware.",
    highlights: [
      "Compiles MPS, MPO, and infinite MPS to quantum circuits",
      "Hardware-aware optimization for NISQ and fault-tolerant devices",
      "Built-in spin models with Trotter decomposition (1st-4th order)",
      "OpenQASM export for quantum processor execution"
    ],
    stats: {
      tests: "476",
      notebooks: "8",
      language: "Julia"
    },
    links: {
      github: "https://github.com/GibbsJR/TenSynth"
    },
    tags: ["Julia", "Tensor Networks", "Quantum Computing", "Circuit Synthesis", "Open Source"]
  },

  // Technical Skills
  skills: {
    languages: [
      { name: "Python", level: "Expert" },
      { name: "Julia", level: "High Performance" },
      { name: "C++" }
    ],
    quantum: [
      { name: "Qiskit" },
      { name: "Cirq" },
      { name: "Pennylane" },
      { name: "Q#" }
    ],
    methods: [
      { name: "Tensor Networks", detail: "ITensor" },
      { name: "Machine Learning", detail: "PyTorch" },
      { name: "HPC" }
    ]
  },

  // Publications - Chronological, most recent first
  publications: [
    {
      year: 2025,
      title: "Resource-Efficient Simulations of Particle Scattering on a Digital Quantum Computer",
      authors: "Y Chai, J Gibbs, VR Pascuzzi, Z Holmes, S Kuhn, F Tacchino, I Tavernelli",
      journal: "arXiv preprint",
      link: "https://arxiv.org/abs/2507.17832"
    },
    {
      year: 2025,
      title: "Robust Chiral Edge Dynamics of a Kitaev Honeycomb on a Trapped Ion Processor",
      authors: "A Ali, J Gibbs, K Kumaran, V Muruganandam, B Xiao, P Kairys, G Halasz, A Banerjee, PC Lotshaw",
      journal: "arXiv preprint",
      link: "https://arxiv.org/abs/2507.08939"
    },
    {
      year: 2025,
      title: "Deep Circuit Compression for Quantum Dynamics via Tensor Networks",
      authors: "J Gibbs, L Cincio",
      journal: "Quantum",
      link: "https://quantum-journal.org/papers/q-2025-07-09-1789/"
    },
    {
      year: 2025,
      title: "Learning Circuits with Infinite Tensor Networks",
      authors: "J Gibbs, L Cincio",
      journal: "arXiv preprint",
      link: "https://arxiv.org/abs/2506.02105"
    },
    {
      year: 2025,
      title: "Quantum Simulation of Superdiffusion Breakdown in Heisenberg Chains via 2D Interactions",
      authors: "K Kumaran, M Sajjan, B Pokharel, K Wang, J Gibbs, J Cohn, B Jones, S Mostame, S Kais, A Banerjee",
      journal: "arXiv preprint",
      link: "https://arxiv.org/abs/2503.14371"
    },
    {
      year: 2025,
      title: "Exploiting Symmetries in Nuclear Hamiltonians for Ground State Preparation",
      authors: "J Gibbs, Z Holmes, P Stevenson",
      journal: "Quantum Machine Intelligence",
      link: "https://link.springer.com/article/10.1007/s42484-025-00242-y"
    },
    {
      year: 2025,
      title: "Quantum Simulation of Actinide Chemistry: Towards Scalable Algorithms on Trapped Ion Quantum Computers",
      authors: "K Sorathia, C Di Paola, G Greene-Diniz, CA Gaggioli, DZ Manrique, J Gibbs, et al.",
      journal: "arXiv preprint",
      link: "https://arxiv.org/abs/2510.25675"
    },
    {
      year: 2024,
      title: "Dynamical Simulation via Quantum Machine Learning with Provable Generalization",
      authors: "J Gibbs, Z Holmes, MC Caro, N Ezzell, HY Huang, L Cincio, AT Sornborger, PJ Coles",
      journal: "Physical Review Research",
      link: "https://doi.org/10.1103/PhysRevResearch.6.013241"
    },
    {
      year: 2024,
      title: "High-Fidelity Dimer Excitations Using Quantum Hardware",
      authors: "NM Eassa, J Gibbs, Z Holmes, A Sornborger, L Cincio, G Hester, P Kairys, M Motta, J Cohn, A Banerjee",
      journal: "Physical Review B",
      link: "https://doi.org/10.1103/PhysRevB.110.184414"
    },
    {
      year: 2023,
      title: "Out-of-Distribution Generalization for Learning Quantum Dynamics",
      authors: "MC Caro, HY Huang, N Ezzell, J Gibbs, AT Sornborger, L Cincio, PJ Coles, Z Holmes",
      journal: "Nature Communications",
      link: "https://www.nature.com/articles/s41467-023-39381-w"
    },
    {
      year: 2023,
      title: "The Power and Limitations of Learning Quantum Dynamics Incoherently",
      authors: "S Jerbi, J Gibbs, MS Rudolph, MC Caro, PJ Coles, HY Huang, Z Holmes",
      journal: "arXiv preprint",
      link: "https://arxiv.org/abs/2303.12834"
    },
    {
      year: 2022,
      title: "Long-Time Simulations for Fixed Input States on Quantum Hardware",
      authors: "J Gibbs, K Gili, Z Holmes, B Commeau, A Arrasmith, L Cincio, AT Sornborger, PJ Coles",
      journal: "npj Quantum Information",
      link: "https://www.nature.com/articles/s41534-022-00625-0"
    }
  ],

  // Selected Talks - Chronological, most recent first
  talks: [
    {
      year: 2025,
      title: "Enhancing Quantum Simulations with Tensor Networks",
      event: "Quantinuum internal seminar",
      location: "Cambridge, UK",
      invited: true
    },
    {
      year: 2025,
      title: "Progress towards Quantum Simulations of High-Energy Physics Scattering",
      event: "Advancing Quantum Computing, IBM Innovation Studio",
      location: "London, UK",
      invited: true
    },
    {
      year: 2025,
      title: "Fermionic Wave Packet Scattering",
      event: "QC4HEP working group",
      location: "CERN, Switzerland",
      invited: false
    },
    {
      year: 2024,
      title: "Accelerating the quantum simulation of Lattice Gauge Theories with Tensor Networks",
      event: "QC4HEP Theory Team Workshop",
      location: "Cyprus",
      invited: false
    },
    {
      year: 2023,
      title: "Long-time simulations for fixed input states on quantum hardware",
      event: "ORNL Quantum Computing User Forum",
      location: "ORNL, Tennessee, US",
      invited: false
    },
    {
      year: 2023,
      title: "Learning the (n,2n) Cross-Section",
      event: "DSTL AI Fest",
      location: "University of Exeter, UK",
      invited: false
    },
    {
      year: 2022,
      title: "NISQ Dynamical Simulations",
      event: "Quantum Science Center workshop",
      location: "IBM Almaden, US",
      invited: false
    }
  ],

  // Contact Links - Update with your actual URLs
  links: {
    scholar: "https://scholar.google.com/citations?user=FvrrWhAAAAAJ&hl=en",
    github: "https://github.com/GibbsJR",
    email: "j.r.gibbs@surrey.ac.uk"
  }
};
