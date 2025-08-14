const formulas = [
  // MECHANICS - KINEMATICS
  {
    name: "First Equation of Motion (v = u + at)",
    category: "Kinematics",
    variables: [
      { symbol: "v", name: "Final velocity", units: ["m/s", "km/h", "cm/s"], defaultUnit: "m/s" },
      { symbol: "u", name: "Initial velocity", units: ["m/s", "km/h", "cm/s"], defaultUnit: "m/s" },
      { symbol: "a", name: "Acceleration", units: ["m/s²", "cm/s²"], defaultUnit: "m/s²" },
      { symbol: "t", name: "Time", units: ["s", "min", "ms"], defaultUnit: "s" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "v": return vars.u + vars.a * vars.t;
        case "u": return vars.v - vars.a * vars.t;
        case "a": return (vars.v - vars.u) / vars.t;
        case "t": return (vars.v - vars.u) / vars.a;
      }
    }
  },
  {
    name: "Second Equation of Motion (s = ut + ½at²)",
    category: "Kinematics",
    variables: [
      { symbol: "s", name: "Displacement", units: ["m", "cm", "km"], defaultUnit: "m" },
      { symbol: "u", name: "Initial velocity", units: ["m/s", "km/h"], defaultUnit: "m/s" },
      { symbol: "t", name: "Time", units: ["s", "min"], defaultUnit: "s" },
      { symbol: "a", name: "Acceleration", units: ["m/s²"], defaultUnit: "m/s²" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "s": return vars.u * vars.t + 0.5 * vars.a * vars.t * vars.t;
        case "u": return (vars.s - 0.5 * vars.a * vars.t * vars.t) / vars.t;
        case "a": return 2 * (vars.s - vars.u * vars.t) / (vars.t * vars.t);
        case "t": 
          const discriminant = vars.u * vars.u + 2 * vars.a * vars.s;
          if (discriminant < 0) throw new Error("No real solution");
          return (-vars.u + Math.sqrt(discriminant)) / vars.a;
      }
    }
  },
  {
    name: "Third Equation of Motion (v² = u² + 2as)",
    category: "Kinematics",
    variables: [
      { symbol: "v", name: "Final velocity", units: ["m/s", "km/h"], defaultUnit: "m/s" },
      { symbol: "u", name: "Initial velocity", units: ["m/s", "km/h"], defaultUnit: "m/s" },
      { symbol: "a", name: "Acceleration", units: ["m/s²"], defaultUnit: "m/s²" },
      { symbol: "s", name: "Displacement", units: ["m", "cm"], defaultUnit: "m" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "v": 
          const v2 = vars.u * vars.u + 2 * vars.a * vars.s;
          if (v2 < 0) throw new Error("No real solution");
          return Math.sqrt(v2);
        case "u": 
          const u2 = vars.v * vars.v - 2 * vars.a * vars.s;
          if (u2 < 0) throw new Error("No real solution");
          return Math.sqrt(u2);
        case "a": return (vars.v * vars.v - vars.u * vars.u) / (2 * vars.s);
        case "s": return (vars.v * vars.v - vars.u * vars.u) / (2 * vars.a);
      }
    }
  },

  // PROJECTILE MOTION
  {
    name: "Projectile Range (R = u²sin2θ/g)",
    category: "Projectile Motion",
    variables: [
      { symbol: "R", name: "Range", units: ["m", "cm", "km"], defaultUnit: "m" },
      { symbol: "u", name: "Initial velocity", units: ["m/s"], defaultUnit: "m/s" },
      { symbol: "θ", name: "Angle", units: ["°", "rad"], defaultUnit: "°" },
      { symbol: "g", name: "Gravity", units: ["m/s²"], defaultUnit: "m/s²" }
    ],
    solve: (target, vars) => {
      // vars.θ is already in radians from convertToBase()
      switch(target) {
        case "R": 
          return vars.u * vars.u * Math.sin(2 * vars.θ) / vars.g;
        case "u": 
          const sinValue = Math.sin(2 * vars.θ);
          if (Math.abs(sinValue) < 1e-10) throw new Error("Invalid angle - too close to 0° or 90°");
          return Math.sqrt(vars.R * vars.g / sinValue);
        case "θ": 
          const argValue = vars.R * vars.g / (vars.u * vars.u);
          if (argValue > 1) throw new Error("Impossible range - reduce distance or increase velocity");
          if (argValue < 0) throw new Error("Invalid parameters");
          return Math.asin(argValue) / 2; // Returns radians
        case "g": 
          const sinVal = Math.sin(2 * vars.θ);
          if (Math.abs(sinVal) < 1e-10) throw new Error("Invalid angle");
          return vars.u * vars.u * sinVal / vars.R;
      }
    }
  },
  {
    name: "Maximum Height (H = u²(sin²θ))/2g)",
    category: "Projectile Motion",
    variables: [
      { symbol: "H", name: "Max height", units: ["m", "cm"], defaultUnit: "m" },
      { symbol: "u", name: "Initial velocity", units: ["m/s"], defaultUnit: "m/s" },
      { symbol: "θ", name: "Angle", units: ["°", "rad"], defaultUnit: "°" },
      { symbol: "g", name: "Gravity", units: ["m/s²"], defaultUnit: "m/s²" }
    ],
    solve: (target, vars) => {
      // vars.θ is already in radians
      const sinTheta = Math.sin(vars.θ);
      switch(target) {
        case "H": 
          return vars.u * vars.u * sinTheta * sinTheta / (2 * vars.g);
        case "u": 
          return Math.sqrt(2 * vars.g * vars.H / (sinTheta * sinTheta));
        case "θ": 
          const ratio = Math.sqrt(2 * vars.g * vars.H) / vars.u;
          if (ratio > 1) throw new Error("Impossible height - reduce height or increase velocity");
          return Math.asin(ratio); // Returns radians
        case "g": 
          return vars.u * vars.u * sinTheta * sinTheta / (2 * vars.H);
      }
    }
  },
  {
    name: "Time of Flight (T = 2u(sinθ))/g)",
    category: "Projectile Motion",
    variables: [
      { symbol: "T", name: "Time of flight", units: ["s"], defaultUnit: "s" },
      { symbol: "u", name: "Initial velocity", units: ["m/s"], defaultUnit: "m/s" },
      { symbol: "θ", name: "Angle", units: ["°", "rad"], defaultUnit: "°" },
      { symbol: "g", name: "Gravity", units: ["m/s²"], defaultUnit: "m/s²" }
    ],
    solve: (target, vars) => {
      // vars.θ is already in radians
      const sinTheta = Math.sin(vars.θ);
      switch(target) {
        case "T": 
          return 2 * vars.u * sinTheta / vars.g;
        case "u": 
          return vars.T * vars.g / (2 * sinTheta);
        case "θ": 
          const ratio = vars.T * vars.g / (2 * vars.u);
          if (ratio > 1) throw new Error("Impossible time - check parameters");
          return Math.asin(ratio); // Returns radians
        case "g": 
          return 2 * vars.u * sinTheta / vars.T;
      }
    }
  },


  // FORCES AND NEWTON'S LAWS
  {
    name: "Newton's Second Law (F = ma)",
    category: "Forces",
    variables: [
      { symbol: "F", name: "Force", units: ["N", "dyne", "kN"], defaultUnit: "N" },
      { symbol: "m", name: "Mass", units: ["kg", "g", "ton"], defaultUnit: "kg" },
      { symbol: "a", name: "Acceleration", units: ["m/s²", "cm/s²"], defaultUnit: "m/s²" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "F": return vars.m * vars.a;
        case "m": return vars.F / vars.a;
        case "a": return vars.F / vars.m;
      }
    }
  },
  {
    name: "Weight (W = mg)",
    category: "Forces",
    variables: [
      { symbol: "W", name: "Weight", units: ["N", "kN"], defaultUnit: "N" },
      { symbol: "m", name: "Mass", units: ["kg", "g"], defaultUnit: "kg" },
      { symbol: "g", name: "Gravity", units: ["m/s²"], defaultUnit: "m/s²" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "W": return vars.m * vars.g;
        case "m": return vars.W / vars.g;
        case "g": return vars.W / vars.m;
      }
    }
  },
  {
    name: "Friction Force (f = μN)",
    category: "Forces",
    variables: [
      { symbol: "f", name: "Friction force", units: ["N"], defaultUnit: "N" },
      { symbol: "μ", name: "Coefficient of friction", units: [""], defaultUnit: "" },
      { symbol: "N", name: "Normal force", units: ["N"], defaultUnit: "N" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "f": return vars.μ * vars.N;
        case "μ": return vars.f / vars.N;
        case "N": return vars.f / vars.μ;
      }
    }
  },

  // WORK, ENERGY AND POWER
  {
    name: "Work Done (W = F·s·cosθ)",
    category: "Work-Energy",
    variables: [
      { symbol: "W", name: "Work", units: ["J", "kJ", "MJ"], defaultUnit: "J" },
      { symbol: "F", name: "Force", units: ["N", "kN"], defaultUnit: "N" },
      { symbol: "s", name: "Displacement", units: ["m", "cm", "km"], defaultUnit: "m" },
      { symbol: "θ", name: "Angle", units: ["°", "rad"], defaultUnit: "°" }
    ],
    solve: (target, vars) => {
      const toRad = angle => angle ;
      const toDeg = rad => rad ;
      switch(target) {
        case "W": return vars.F * vars.s * Math.cos(vars.θ);
        case "F": return vars.W / (vars.s * Math.cos(vars.θ));
        case "s": return vars.W / (vars.F * Math.cos(vars.θ));
        case "θ": return (Math.acos(vars.W / (vars.F * vars.s)));
      }
    }
  },
  {
    name: "Kinetic Energy (KE = ½mv²)",
    category: "Work-Energy",
    variables: [
      { symbol: "KE", name: "Kinetic energy", units: ["J", "kJ", "eV"], defaultUnit: "J" },
      { symbol: "m", name: "Mass", units: ["kg", "g"], defaultUnit: "kg" },
      { symbol: "v", name: "Velocity", units: ["m/s", "km/h"], defaultUnit: "m/s" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "KE": return 0.5 * vars.m * vars.v * vars.v;
        case "m": return (2 * vars.KE) / (vars.v * vars.v);
        case "v": return Math.sqrt((2 * vars.KE) / vars.m);
      }
    }
  },
  {
    name: "Potential Energy (PE = mgh)",
    category: "Work-Energy",
    variables: [
      { symbol: "PE", name: "Potential energy", units: ["J", "kJ"], defaultUnit: "J" },
      { symbol: "m", name: "Mass", units: ["kg", "g"], defaultUnit: "kg" },
      { symbol: "g", name: "Gravity", units: ["m/s²"], defaultUnit: "m/s²" },
      { symbol: "h", name: "Height", units: ["m", "cm"], defaultUnit: "m" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "PE": return vars.m * vars.g * vars.h;
        case "m": return vars.PE / (vars.g * vars.h);
        case "g": return vars.PE / (vars.m * vars.h);
        case "h": return vars.PE / (vars.m * vars.g);
      }
    }
  },
  {
    name: "Power (P = W/t)",
    category: "Work-Energy",
    variables: [
      { symbol: "P", name: "Power", units: ["W", "kW", "MW"], defaultUnit: "W" },
      { symbol: "W", name: "Work", units: ["J", "kJ"], defaultUnit: "J" },
      { symbol: "t", name: "Time", units: ["s", "min", "h"], defaultUnit: "s" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "P": return vars.W / vars.t;
        case "W": return vars.P * vars.t;
        case "t": return vars.W / vars.P;
      }
    }
  },
  {
    name: "Power (P = F·v)",
    category: "Work-Energy",
    variables: [
      { symbol: "P", name: "Power", units: ["W", "kW", "MW"], defaultUnit: "W" },
      { symbol: "F", name: "Force", units: ["N", "kN"], defaultUnit: "N" },
      { symbol: "v", name: "Velocity", units: ["m/s"], defaultUnit: "m/s" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "P": return vars.F * vars.v;
        case "F": return vars.P / vars.v;
        case "v": return vars.P / vars.F;
      }
    }
  },

  // MOMENTUM AND COLLISIONS
  {
    name: "Linear Momentum (p = mv)",
    category: "Momentum",
    variables: [
      { symbol: "p", name: "Momentum", units: ["kg·m/s", "N·s"], defaultUnit: "kg·m/s" },
      { symbol: "m", name: "Mass", units: ["kg", "g"], defaultUnit: "kg" },
      { symbol: "v", name: "Velocity", units: ["m/s"], defaultUnit: "m/s" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "p": return vars.m * vars.v;
        case "m": return vars.p / vars.v;
        case "v": return vars.p / vars.m;
      }
    }
  },
  {
    name: "Impulse (J = FΔt)",
    category: "Momentum",
    variables: [
      { symbol: "J", name: "Impulse", units: ["N·s", "kg·m/s"], defaultUnit: "N·s" },
      { symbol: "F", name: "Force", units: ["N"], defaultUnit: "N" },
      { symbol: "Δt", name: "Time interval", units: ["s", "ms"], defaultUnit: "s" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "J": return vars.F * vars.Δt;
        case "F": return vars.J / vars.Δt;
        case "Δt": return vars.J / vars.F;
      }
    }
  },
  {
    name: "Impulse-Momentum (J = Δp)",
    category: "Momentum",
    variables: [
      { symbol: "J", name: "Impulse", units: ["N·s"], defaultUnit: "N·s" },
      { symbol: "Δp", name: "Change in momentum", units: ["kg·m/s"], defaultUnit: "kg·m/s" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "J": return vars.Δp;
        case "Δp": return vars.J;
      }
    }
  },

  // CIRCULAR MOTION
  {
    name: "Centripetal Force (Fc = mv²/r)",
    category: "Circular Motion",
    variables: [
      { symbol: "Fc", name: "Centripetal force", units: ["N"], defaultUnit: "N" },
      { symbol: "m", name: "Mass", units: ["kg", "g"], defaultUnit: "kg" },
      { symbol: "v", name: "Speed", units: ["m/s"], defaultUnit: "m/s" },
      { symbol: "r", name: "Radius", units: ["m", "cm"], defaultUnit: "m" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "Fc": return vars.m * vars.v * vars.v / vars.r;
        case "m": return vars.Fc * vars.r / (vars.v * vars.v);
        case "v": return Math.sqrt(vars.Fc * vars.r / vars.m);
        case "r": return vars.m * vars.v * vars.v / vars.Fc;
      }
    }
  },
  {
    name: "Centripetal Acceleration (ac = v²/r)",
    category: "Circular Motion",
    variables: [
      { symbol: "ac", name: "Centripetal acceleration", units: ["m/s²"], defaultUnit: "m/s²" },
      { symbol: "v", name: "Speed", units: ["m/s"], defaultUnit: "m/s" },
      { symbol: "r", name: "Radius", units: ["m", "cm"], defaultUnit: "m" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "ac": return vars.v * vars.v / vars.r;
        case "v": return Math.sqrt(vars.ac * vars.r);
        case "r": return vars.v * vars.v / vars.ac;
      }
    }
  },
  {
    name: "Angular Velocity (ω = v/r)",
    category: "Circular Motion",
    variables: [
      { symbol: "ω", name: "Angular velocity", units: ["rad/s", "rpm"], defaultUnit: "rad/s" },
      { symbol: "v", name: "Linear speed", units: ["m/s"], defaultUnit: "m/s" },
      { symbol: "r", name: "Radius", units: ["m", "cm"], defaultUnit: "m" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "ω": return vars.v / vars.r;
        case "v": return vars.ω * vars.r;
        case "r": return vars.v / vars.ω;
      }
    }
  },
  {
    name: "Angular Displacement (θ = ωt)",
    category: "Circular Motion",
    variables: [
      { symbol: "θ", name: "Angular displacement", units: ["rad", "°"], defaultUnit: "rad" },
      { symbol: "ω", name: "Angular velocity", units: ["rad/s"], defaultUnit: "rad/s" },
      { symbol: "t", name: "Time", units: ["s"], defaultUnit: "s" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "θ": return vars.ω * vars.t;
        case "ω": return vars.θ / vars.t;
        case "t": return vars.θ / vars.ω;
      }
    }
  },

  // GRAVITATION
  {
    name: "Universal Gravitation (F = Gm₁m₂/r²)",
    category: "Gravitation",
    variables: [
      { symbol: "F", name: "Gravitational force", units: ["N"], defaultUnit: "N" },
      { symbol: "m1", name: "Mass 1", units: ["kg"], defaultUnit: "kg" },
      { symbol: "m2", name: "Mass 2", units: ["kg"], defaultUnit: "kg" },
      { symbol: "r", name: "Distance", units: ["m", "km"], defaultUnit: "m" }
    ],
    solve: (target, vars) => {
      const G = 6.674e-11; // N·m²/kg²
      switch(target) {
        case "F": return G * vars.m1 * vars.m2 / (vars.r * vars.r);
        case "m1": return vars.F * vars.r * vars.r / (G * vars.m2);
        case "m2": return vars.F * vars.r * vars.r / (G * vars.m1);
        case "r": return Math.sqrt(G * vars.m1 * vars.m2 / vars.F);
      }
    }
  },
  {
    name: "Gravitational Field (g = GM/r²)",
    category: "Gravitation",
    variables: [
      { symbol: "g", name: "Gravitational field", units: ["m/s²"], defaultUnit: "m/s²" },
      { symbol: "M", name: "Mass", units: ["kg"], defaultUnit: "kg" },
      { symbol: "r", name: "Distance", units: ["m", "km"], defaultUnit: "m" }
    ],
    solve: (target, vars) => {
      const G = 6.674e-11;
      switch(target) {
        case "g": return G * vars.M / (vars.r * vars.r);
        case "M": return vars.g * vars.r * vars.r / G;
        case "r": return Math.sqrt(G * vars.M / vars.g);
      }
    }
  },
  {
    name: "Orbital Velocity (v = √(GM/r))",
    category: "Gravitation",
    variables: [
      { symbol: "v", name: "Orbital velocity", units: ["m/s", "km/s"], defaultUnit: "m/s" },
      { symbol: "M", name: "Central mass", units: ["kg"], defaultUnit: "kg" },
      { symbol: "r", name: "Orbital radius", units: ["m", "km"], defaultUnit: "m" }
    ],
    solve: (target, vars) => {
      const G = 6.674e-11;
      switch(target) {
        case "v": return Math.sqrt(G * vars.M / vars.r);
        case "M": return vars.v * vars.v * vars.r / G;
        case "r": return G * vars.M / (vars.v * vars.v);
      }
    }
  },
  {
    name: "Escape Velocity (ve = √(2GM/r))",
    category: "Gravitation",
    variables: [
      { symbol: "ve", name: "Escape velocity", units: ["m/s", "km/s"], defaultUnit: "m/s" },
      { symbol: "M", name: "Planet mass", units: ["kg"], defaultUnit: "kg" },
      { symbol: "r", name: "Planet radius", units: ["m", "km"], defaultUnit: "m" }
    ],
    solve: (target, vars) => {
      const G = 6.674e-11;
      switch(target) {
        case "ve": return Math.sqrt(2 * G * vars.M / vars.r);
        case "M": return vars.ve * vars.ve * vars.r / (2 * G);
        case "r": return 2 * G * vars.M / (vars.ve * vars.ve);
      }
    }
  },
  {
    name: "Kepler's Third Law (T² = 4π²r³/GM)",
    category: "Gravitation",
    variables: [
      { symbol: "T", name: "Orbital period", units: ["s", "years", "days"], defaultUnit: "s" },
      { symbol: "r", name: "Orbital radius", units: ["m", "km", "AU"], defaultUnit: "m" },
      { symbol: "M", name: "Central mass", units: ["kg"], defaultUnit: "kg" }
    ],
    solve: (target, vars) => {
      const G = 6.674e-11;
      switch(target) {
        case "T": return Math.sqrt(4 * Math.PI * Math.PI * vars.r * vars.r * vars.r / (G * vars.M));
        case "r": return Math.pow(G * vars.M * vars.T * vars.T / (4 * Math.PI * Math.PI), 1/3);
        case "M": return 4 * Math.PI * Math.PI * vars.r * vars.r * vars.r / (G * vars.T * vars.T);
      }
    }
  },

  // SIMPLE HARMONIC MOTION
  {
    name: "Simple Harmonic Motion (T = 2π√(m/k))",
    category: "SHM & Oscillations",
    variables: [
      { symbol: "T", name: "Time period", units: ["s"], defaultUnit: "s" },
      { symbol: "m", name: "Mass", units: ["kg", "g"], defaultUnit: "kg" },
      { symbol: "k", name: "Spring constant", units: ["N/m"], defaultUnit: "N/m" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "T": return 2 * Math.PI * Math.sqrt(vars.m / vars.k);
        case "m": return vars.k * (vars.T / (2 * Math.PI)) * (vars.T / (2 * Math.PI));
        case "k": return vars.m * (2 * Math.PI / vars.T) * (2 * Math.PI / vars.T);
      }
    }
  },
  {
    name: "Simple Pendulum (T = 2π√(L/g))",
    category: "SHM & Oscillations",
    variables: [
      { symbol: "T", name: "Time period", units: ["s"], defaultUnit: "s" },
      { symbol: "L", name: "Length", units: ["m", "cm"], defaultUnit: "m" },
      { symbol: "g", name: "Gravity", units: ["m/s²"], defaultUnit: "m/s²" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "T": return 2 * Math.PI * Math.sqrt(vars.L / vars.g);
        case "L": return vars.g * (vars.T / (2 * Math.PI)) * (vars.T / (2 * Math.PI));
        case "g": return vars.L * (2 * Math.PI / vars.T) * (2 * Math.PI / vars.T);
      }
    }
  },
  {
    name: "Hooke's Law (F = -kx)",
    category: "SHM & Oscillations",
    variables: [
      { symbol: "F", name: "Restoring force", units: ["N"], defaultUnit: "N" },
      { symbol: "k", name: "Spring constant", units: ["N/m"], defaultUnit: "N/m" },
      { symbol: "x", name: "Displacement", units: ["m", "cm"], defaultUnit: "m" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "F": return vars.k * vars.x;
        case "k": return vars.F / vars.x;
        case "x": return vars.F / vars.k;
      }
    }
  },
  {
    name: "SHM Displacement (x = A sin(ωt + φ))",
    category: "SHM & Oscillations",
    variables: [
      { symbol: "x", name: "Displacement", units: ["m", "cm"], defaultUnit: "m" },
      { symbol: "A", name: "Amplitude", units: ["m", "cm"], defaultUnit: "m" },
      { symbol: "ω", name: "Angular frequency", units: ["rad/s"], defaultUnit: "rad/s" },
      { symbol: "t", name: "Time", units: ["s"], defaultUnit: "s" },
      { symbol: "φ", name: "Phase constant", units: ["rad", "°"], defaultUnit: "rad" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "x": return vars.A * Math.sin(vars.ω * vars.t + vars.φ);
        case "A": return vars.x / Math.sin(vars.ω * vars.t + vars.φ);
        case "ω": return (Math.asin(vars.x / vars.A) - vars.φ) / vars.t;
        case "t": return (Math.asin(vars.x / vars.A) - vars.φ) / vars.ω;
        case "φ": return Math.asin(vars.x / vars.A) - vars.ω * vars.t;
      }
    }
  },
  {
    name: "Angular Frequency (ω = 2π/T)",
    category: "SHM & Oscillations",
    variables: [
      { symbol: "ω", name: "Angular frequency", units: ["rad/s"], defaultUnit: "rad/s" },
      { symbol: "T", name: "Time period", units: ["s"], defaultUnit: "s" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "ω": return 2 * Math.PI / vars.T;
        case "T": return 2 * Math.PI / vars.ω;
      }
    }
  },

  // WAVES
  {
    name: "Wave Equation (v = fλ)",
    category: "Waves",
    variables: [
      { symbol: "v", name: "Wave speed", units: ["m/s"], defaultUnit: "m/s" },
      { symbol: "f", name: "Frequency", units: ["Hz", "kHz", "MHz"], defaultUnit: "Hz" },
      { symbol: "λ", name: "Wavelength", units: ["m", "cm", "mm"], defaultUnit: "m" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "v": return vars.f * vars.λ;
        case "f": return vars.v / vars.λ;
        case "λ": return vars.v / vars.f;
      }
    }
  },
  {
    name: "Wave on String (v = √(T/μ))",
    category: "Waves",
    variables: [
      { symbol: "v", name: "Wave speed", units: ["m/s"], defaultUnit: "m/s" },
      { symbol: "T", name: "Tension", units: ["N"], defaultUnit: "N" },
      { symbol: "μ", name: "Linear mass density", units: ["kg/m"], defaultUnit: "kg/m" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "v": return Math.sqrt(vars.T / vars.μ);
        case "T": return vars.v * vars.v * vars.μ;
        case "μ": return vars.T / (vars.v * vars.v);
      }
    }
  },
  {
    name: "Doppler Effect (f' = f(v±vo)/(v±vs))",
    category: "Waves",
    variables: [
      { symbol: "f_prime", name: "Observed frequency", units: ["Hz"], defaultUnit: "Hz" },
      { symbol: "f", name: "Source frequency", units: ["Hz"], defaultUnit: "Hz" },
      { symbol: "v", name: "Wave speed", units: ["m/s"], defaultUnit: "m/s" },
      { symbol: "vo", name: "Observer velocity", units: ["m/s"], defaultUnit: "m/s" },
      { symbol: "vs", name: "Source velocity", units: ["m/s"], defaultUnit: "m/s" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "f_prime": return vars.f * (vars.v + vars.vo) / (vars.v - vars.vs);
        case "f": return vars.f_prime * (vars.v - vars.vs) / (vars.v + vars.vo);
        case "vo": return ((vars.f_prime / vars.f) * (vars.v - vars.vs)) - vars.v;
        case "vs": return vars.v - ((vars.f_prime / vars.f) * (vars.v + vars.vo));
      }
    }
  },

  // THERMODYNAMICS
  {
    name: "Ideal Gas Law (PV = nRT)",
    category: "Thermodynamics",
    variables: [
      { symbol: "P", name: "Pressure", units: ["Pa", "atm", "bar", "mmHg"], defaultUnit: "Pa" },
      { symbol: "V", name: "Volume", units: ["m³", "L"], defaultUnit: "m³" },
      { symbol: "n", name: "Amount of gas", units: ["mol"], defaultUnit: "mol" },
      { symbol: "T", name: "Temperature", units: ["K", "°C"], defaultUnit: "K" }
    ],
    solve: (target, vars) => {
      const R = 8.314; // J/mol⋅K
      switch(target) {
        case "P": return vars.n * R * vars.T / vars.V;
        case "V": return vars.n * R * vars.T / vars.P;
        case "n": return vars.P * vars.V / (R * vars.T);
        case "T": return vars.P * vars.V / (vars.n * R);
      }
    }
  },
  {
    name: "Heat Capacity (Q = mcΔT)",
    category: "Thermodynamics",
    variables: [
      { symbol: "Q", name: "Heat", units: ["J", "cal", "kJ"], defaultUnit: "J" },
      { symbol: "m", name: "Mass", units: ["kg", "g"], defaultUnit: "kg" },
      { symbol: "c", name: "Specific heat", units: ["J/kg⋅K"], defaultUnit: "J/kg⋅K" },
      { symbol: "ΔT", name: "Temperature change", units: ["K", "°C"], defaultUnit: "K" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "Q": return vars.m * vars.c * vars.ΔT;
        case "m": return vars.Q / (vars.c * vars.ΔT);
        case "c": return vars.Q / (vars.m * vars.ΔT);
        case "ΔT": return vars.Q / (vars.m * vars.c);
      }
    }
  },
  {
    name: "First Law of Thermodynamics (ΔU = Q - W)",
    category: "Thermodynamics",
    variables: [
      { symbol: "ΔU", name: "Change in internal energy", units: ["J"], defaultUnit: "J" },
      { symbol: "Q", name: "Heat added", units: ["J"], defaultUnit: "J" },
      { symbol: "W", name: "Work done by system", units: ["J"], defaultUnit: "J" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "ΔU": return vars.Q - vars.W;
        case "Q": return vars.ΔU + vars.W;
        case "W": return vars.Q - vars.ΔU;
      }
    }
  },
  {
    name: "Efficiency (η = W/Qh)",
    category: "Thermodynamics",
    variables: [
      { symbol: "η", name: "Efficiency", units: ["%", ""], defaultUnit: "%" },
      { symbol: "W", name: "Work output", units: ["J"], defaultUnit: "J" },
      { symbol: "Qh", name: "Heat input", units: ["J"], defaultUnit: "J" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "η": return (vars.W / vars.Qh) * 100;
        case "W": return vars.η * vars.Qh / 100;
        case "Qh": return vars.W * 100 / vars.η;
      }
    }
  },
  {
    name: "Carnot Efficiency (η = 1 - Tc/Th)",
    category: "Thermodynamics",
    variables: [
      { symbol: "η", name: "Carnot efficiency", units: ["%"], defaultUnit: "%" },
      { symbol: "Th", name: "Hot reservoir temp", units: ["K"], defaultUnit: "K" },
      { symbol: "Tc", name: "Cold reservoir temp", units: ["K"], defaultUnit: "K" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "η": return (1 - vars.Tc / vars.Th) * 100;
        case "Th": return vars.Tc / (1 - vars.η / 100);
        case "Tc": return vars.Th * (1 - vars.η / 100);
      }
    }
  },

  // ELECTRICITY AND MAGNETISM
  {
    name: "Ohm's Law (V = IR)",
    category: "Electricity",
    variables: [
      { symbol: "V", name: "Voltage", units: ["V", "mV", "kV"], defaultUnit: "V" },
      { symbol: "I", name: "Current", units: ["A", "mA", "μA"], defaultUnit: "A" },
      { symbol: "R", name: "Resistance", units: ["Ω", "kΩ", "MΩ"], defaultUnit: "Ω" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "V": return vars.I * vars.R;
        case "I": return vars.V / vars.R;
        case "R": return vars.V / vars.I;
      }
    }
  },
  {
    name: "Electric Power (P = VI)",
    category: "Electricity",
    variables: [
      { symbol: "P", name: "Power", units: ["W", "kW", "MW"], defaultUnit: "W" },
      { symbol: "V", name: "Voltage", units: ["V"], defaultUnit: "V" },
      { symbol: "I", name: "Current", units: ["A"], defaultUnit: "A" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "P": return vars.V * vars.I;
        case "V": return vars.P / vars.I;
        case "I": return vars.P / vars.V;
      }
    }
  },
  {
    name: "Electric Power (P = I²R)",
    category: "Electricity",
    variables: [
      { symbol: "P", name: "Power", units: ["W", "kW"], defaultUnit: "W" },
      { symbol: "I", name: "Current", units: ["A", "mA"], defaultUnit: "A" },
      { symbol: "R", name: "Resistance", units: ["Ω", "kΩ"], defaultUnit: "Ω" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "P": return vars.I * vars.I * vars.R;
        case "I": return Math.sqrt(vars.P / vars.R);
        case "R": return vars.P / (vars.I * vars.I);
      }
    }
  },
  {
    name: "Electric Power (P = V²/R)",
    category: "Electricity",
    variables: [
      { symbol: "P", name: "Power", units: ["W", "kW"], defaultUnit: "W" },
      { symbol: "V", name: "Voltage", units: ["V"], defaultUnit: "V" },
      { symbol: "R", name: "Resistance", units: ["Ω", "kΩ"], defaultUnit: "Ω" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "P": return vars.V * vars.V / vars.R;
        case "V": return Math.sqrt(vars.P * vars.R);
        case "R": return vars.V * vars.V / vars.P;
      }
    }
  },
  {
    name: "Resistivity (R = ρL/A)",
    category: "Electricity",
    variables: [
      { symbol: "R", name: "Resistance", units: ["Ω"], defaultUnit: "Ω" },
      { symbol: "ρ", name: "Resistivity", units: ["Ω⋅m"], defaultUnit: "Ω⋅m" },
      { symbol: "L", name: "Length", units: ["m", "cm"], defaultUnit: "m" },
      { symbol: "A", name: "Cross-sectional area", units: ["m²", "cm²"], defaultUnit: "m²" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "R": return vars.ρ * vars.L / vars.A;
        case "ρ": return vars.R * vars.A / vars.L;
        case "L": return vars.R * vars.A / vars.ρ;
        case "A": return vars.ρ * vars.L / vars.R;
      }
    }
  },
  {
    name: "Coulomb's Law (F = kq₁q₂/r²)",
    category: "Electricity",
    variables: [
      { symbol: "F", name: "Electric force", units: ["N"], defaultUnit: "N" },
      { symbol: "q1", name: "Charge 1", units: ["C", "μC", "nC"], defaultUnit: "C" },
      { symbol: "q2", name: "Charge 2", units: ["C", "μC", "nC"], defaultUnit: "C" },
      { symbol: "r", name: "Distance", units: ["m", "cm"], defaultUnit: "m" }
    ],
    solve: (target, vars) => {
      const k = 8.99e9; // N⋅m²/C²
      switch(target) {
        case "F": return k * vars.q1 * vars.q2 / (vars.r * vars.r);
        case "q1": return vars.F * vars.r * vars.r / (k * vars.q2);
        case "q2": return vars.F * vars.r * vars.r / (k * vars.q1);
        case "r": return Math.sqrt(k * vars.q1 * vars.q2 / vars.F);
      }
    }
  },
  {
    name: "Electric Field (E = F/q)",
    category: "Electricity",
    variables: [
      { symbol: "E", name: "Electric field", units: ["N/C", "V/m"], defaultUnit: "N/C" },
      { symbol: "F", name: "Force", units: ["N"], defaultUnit: "N" },
      { symbol: "q", name: "Test charge", units: ["C", "μC"], defaultUnit: "C" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "E": return vars.F / vars.q;
        case "F": return vars.E * vars.q;
        case "q": return vars.F / vars.E;
      }
    }
  },
  {
    name: "Electric Potential (V = W/q)",
    category: "Electricity",
    variables: [
      { symbol: "V", name: "Electric potential", units: ["V"], defaultUnit: "V" },
      { symbol: "W", name: "Work done", units: ["J"], defaultUnit: "J" },
      { symbol: "q", name: "Charge", units: ["C"], defaultUnit: "C" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "V": return vars.W / vars.q;
        case "W": return vars.V * vars.q;
        case "q": return vars.W / vars.V;
      }
    }
  },
  {
    name: "Capacitance (C = Q/V)",
    category: "Electricity",
    variables: [
      { symbol: "C", name: "Capacitance", units: ["F", "μF", "nF", "pF"], defaultUnit: "F" },
      { symbol: "Q", name: "Charge", units: ["C", "μC"], defaultUnit: "C" },
      { symbol: "V", name: "Voltage", units: ["V"], defaultUnit: "V" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "C": return vars.Q / vars.V;
        case "Q": return vars.C * vars.V;
        case "V": return vars.Q / vars.C;
      }
    }
  },
  {
    name: "Energy in Capacitor (U = ½CV²)",
    category: "Electricity",
    variables: [
      { symbol: "U", name: "Energy stored", units: ["J"], defaultUnit: "J" },
      { symbol: "C", name: "Capacitance", units: ["F", "μF"], defaultUnit: "F" },
      { symbol: "V", name: "Voltage", units: ["V"], defaultUnit: "V" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "U": return 0.5 * vars.C * vars.V * vars.V;
        case "C": return 2 * vars.U / (vars.V * vars.V);
        case "V": return Math.sqrt(2 * vars.U / vars.C);
      }
    }
  },
  {
    name: "Magnetic Force (F = BIL)",
    category: "Magnetism",
    variables: [
      { symbol: "F", name: "Magnetic force", units: ["N"], defaultUnit: "N" },
      { symbol: "B", name: "Magnetic field", units: ["T", "mT"], defaultUnit: "T" },
      { symbol: "I", name: "Current", units: ["A"], defaultUnit: "A" },
      { symbol: "L", name: "Length", units: ["m", "cm"], defaultUnit: "m" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "F": return vars.B * vars.I * vars.L;
        case "B": return vars.F / (vars.I * vars.L);
        case "I": return vars.F / (vars.B * vars.L);
        case "L": return vars.F / (vars.B * vars.I);
      }
    }
  },
  {
    name: "Lorentz Force (F = qvB)",
    category: "Magnetism",
    variables: [
      { symbol: "F", name: "Magnetic force", units: ["N"], defaultUnit: "N" },
      { symbol: "q", name: "Charge", units: ["C"], defaultUnit: "C" },
      { symbol: "v", name: "Velocity", units: ["m/s"], defaultUnit: "m/s" },
      { symbol: "B", name: "Magnetic field", units: ["T"], defaultUnit: "T" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "F": return vars.q * vars.v * vars.B;
        case "q": return vars.F / (vars.v * vars.B);
        case "v": return vars.F / (vars.q * vars.B);
        case "B": return vars.F / (vars.q * vars.v);
      }
    }
  },
  {
    name: "EMF (ε = BLv)",
    category: "Magnetism",
    variables: [
      { symbol: "ε", name: "EMF", units: ["V"], defaultUnit: "V" },
      { symbol: "B", name: "Magnetic field", units: ["T"], defaultUnit: "T" },
      { symbol: "L", name: "Length", units: ["m"], defaultUnit: "m" },
      { symbol: "v", name: "Velocity", units: ["m/s"], defaultUnit: "m/s" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "ε": return vars.B * vars.L * vars.v;
        case "B": return vars.ε / (vars.L * vars.v);
        case "L": return vars.ε / (vars.B * vars.v);
        case "v": return vars.ε / (vars.B * vars.L);
      }
    }
  },
  {
    name: "Self Inductance (ε = -L(dI/dt))",
    category: "Magnetism",
    variables: [
      { symbol: "ε", name: "Back EMF", units: ["V"], defaultUnit: "V" },
      { symbol: "L", name: "Inductance", units: ["H", "mH"], defaultUnit: "H" },
      { symbol: "dI_dt", name: "Rate of current change", units: ["A/s"], defaultUnit: "A/s" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "ε": return vars.L * vars.dI_dt;
        case "L": return vars.ε / vars.dI_dt;
        case "dI_dt": return vars.ε / vars.L;
      }
    }
  },

  // OPTICS
  {
    name: "Lens Formula (1/f = 1/u + 1/v)",
    category: "Optics",
    variables: [
      { symbol: "f", name: "Focal length", units: ["m", "cm"], defaultUnit: "cm" },
      { symbol: "u", name: "Object distance", units: ["m", "cm"], defaultUnit: "cm" },
      { symbol: "v", name: "Image distance", units: ["m", "cm"], defaultUnit: "cm" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "f": return 1 / (1/vars.u + 1/vars.v);
        case "u": return 1 / (1/vars.f - 1/vars.v);
        case "v": return 1 / (1/vars.f - 1/vars.u);
      }
    }
  },
  {
    name: "Mirror Formula (1/f = 1/u + 1/v)",
    category: "Optics",
    variables: [
      { symbol: "f", name: "Focal length", units: ["m", "cm"], defaultUnit: "cm" },
      { symbol: "u", name: "Object distance", units: ["m", "cm"], defaultUnit: "cm" },
      { symbol: "v", name: "Image distance", units: ["m", "cm"], defaultUnit: "cm" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "f": return 1 / (1/vars.u + 1/vars.v);
        case "u": return 1 / (1/vars.f - 1/vars.v);
        case "v": return 1 / (1/vars.f - 1/vars.u);
      }
    }
  },
  {
    name: "Magnification (m = v/u)",
    category: "Optics",
    variables: [
      { symbol: "m", name: "Magnification", units: [""], defaultUnit: "" },
      { symbol: "v", name: "Image distance", units: ["cm"], defaultUnit: "cm" },
      { symbol: "u", name: "Object distance", units: ["cm"], defaultUnit: "cm" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "m": return vars.v / vars.u;
        case "v": return vars.m * vars.u;
        case "u": return vars.v / vars.m;
      }
    }
  },
  {
    name: "Refractive Index (n = c/v)",
    category: "Optics",
    variables: [
      { symbol: "n", name: "Refractive index", units: [""], defaultUnit: "" },
      { symbol: "c", name: "Speed of light", units: ["m/s"], defaultUnit: "m/s" },
      { symbol: "v", name: "Speed in medium", units: ["m/s"], defaultUnit: "m/s" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "n": return vars.c / vars.v;
        case "c": return vars.n * vars.v;
        case "v": return vars.c / vars.n;
      }
    }
  },
  {
    name: "Snell's Law (n₁sinθ₁ = n₂sinθ₂)",
    category: "Optics",
    variables: [
      { symbol: "n1", name: "Refractive index 1", units: [""], defaultUnit: "" },
      { symbol: "θ1", name: "Angle 1", units: ["°", "rad"], defaultUnit: "°" },
      { symbol: "n2", name: "Refractive index 2", units: [""], defaultUnit: "" },
      { symbol: "θ2", name: "Angle 2", units: ["°", "rad"], defaultUnit: "°" }
    ],
    solve: (target, vars) => {
      const toRad = (angle) => angle ;
      const toDeg = (rad) => rad ;
      switch(target) {
        case "n1": return vars.n2 * Math.sin(vars.θ2) / Math.sin(vars.θ1);
        case "θ1": return (Math.asin(vars.n2 * Math.sin(vars.θ2) / vars.n1));
        case "n2": return vars.n1 * Math.sin(vars.θ1) / Math.sin(vars.θ2);
        case "θ2": return (Math.asin(vars.n1 * Math.sin(vars.θ1) / vars.n2));
      }
    }
  },
  {
    name: "Critical Angle (sinθc = n₂/n₁)",
    category: "Optics",
    variables: [
      { symbol: "θc", name: "Critical angle", units: ["°", "rad"], defaultUnit: "°" },
      { symbol: "n1", name: "Denser medium index", units: [""], defaultUnit: "" },
      { symbol: "n2", name: "Rarer medium index", units: [""], defaultUnit: "" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "θc": return Math.asin(vars.n2 / vars.n1) * (180 / Math.PI);
        case "n1": return vars.n2 / Math.sin(vars.θc );
        case "n2": return vars.n1 * Math.sin(vars.θc );
      }
    }
  },
  {
    name: "Lens Maker's Formula (1/f = (n-1)(1/R₁ - 1/R₂))",
    category: "Optics",
    variables: [
      { symbol: "f", name: "Focal length", units: ["m", "cm"], defaultUnit: "cm" },
      { symbol: "n", name: "Refractive index", units: [""], defaultUnit: "" },
      { symbol: "R1", name: "Radius of curvature 1", units: ["m", "cm"], defaultUnit: "cm" },
      { symbol: "R2", name: "Radius of curvature 2", units: ["m", "cm"], defaultUnit: "cm" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "f": return 1 / ((vars.n - 1) * (1/vars.R1 - 1/vars.R2));
        case "n": return (1/vars.f) / (1/vars.R1 - 1/vars.R2) + 1;
        case "R1": return 1 / ((1/vars.f) / (vars.n - 1) + 1/vars.R2);
        case "R2": return 1 / (1/vars.R1 - (1/vars.f) / (vars.n - 1));
      }
    }
  },
  {
    name: "Power of Lens (P = 1/f)",
    category: "Optics",
    variables: [
      { symbol: "P", name: "Power", units: ["D"], defaultUnit: "D" },
      { symbol: "f", name: "Focal length", units: ["m", "cm"], defaultUnit: "m" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "P": return 1 / vars.f;
        case "f": return 1 / vars.P;
      }
    }
  },

  // MODERN PHYSICS
  {
    name: "Photoelectric Effect (KEmax = hf - φ)",
    category: "Modern Physics",
    variables: [
      { symbol: "KEmax", name: "Maximum kinetic energy", units: ["J", "eV"], defaultUnit: "eV" },
      { symbol: "f", name: "Frequency", units: ["Hz", "THz"], defaultUnit: "Hz" },
      { symbol: "φ", name: "Work function", units: ["J", "eV"], defaultUnit: "eV" }
    ],
    solve: (target, vars) => {
      const h = 6.626e-34; // J⋅s
      const hEv = 4.136e-15; // eV⋅s
      switch(target) {
        case "KEmax": return hEv * vars.f - vars.φ;
        case "f": return (vars.KEmax + vars.φ) / hEv;
        case "φ": return hEv * vars.f - vars.KEmax;
      }
    }
  },
  {
    name: "De Broglie Wavelength (λ = h/p)",
    category: "Modern Physics",
    variables: [
      { symbol: "λ", name: "Wavelength", units: ["m", "nm", "pm"], defaultUnit: "m" },
      { symbol: "m", name: "Mass", units: ["kg", "u"], defaultUnit: "kg" },
      { symbol: "v", name: "Velocity", units: ["m/s"], defaultUnit: "m/s" }
    ],
    solve: (target, vars) => {
      const h = 6.626e-34; // J⋅s
      switch(target) {
        case "λ": return h / (vars.m * vars.v);
        case "m": return h / (vars.λ * vars.v);
        case "v": return h / (vars.λ * vars.m);
      }
    }
  },
  {
    name: "Mass-Energy Equivalence (E = mc²)",
    category: "Modern Physics",
    variables: [
      { symbol: "E", name: "Energy", units: ["J", "MeV", "GeV"], defaultUnit: "J" },
      { symbol: "m", name: "Mass", units: ["kg", "u"], defaultUnit: "kg" }
    ],
    solve: (target, vars) => {
      const c = 3e8; // m/s
      switch(target) {
        case "E": return vars.m * c * c;
        case "m": return vars.E / (c * c);
      }
    }
  },
  {
    name: "Planck's Energy (E = hf)",
    category: "Modern Physics",
    variables: [
      { symbol: "E", name: "Energy", units: ["J", "eV"], defaultUnit: "J" },
      { symbol: "f", name: "Frequency", units: ["Hz", "THz"], defaultUnit: "Hz" }
    ],
    solve: (target, vars) => {
      const h = 6.626e-34; // J⋅s
      switch(target) {
        case "E": return h * vars.f;
        case "f": return vars.E / h;
      }
    }
  },
  {
    name: "Compton Scattering (Δλ = h/mec(1-cosθ))",
    category: "Modern Physics",
    variables: [
      { symbol: "Δλ", name: "Wavelength shift", units: ["m", "pm"], defaultUnit: "pm" },
      { symbol: "θ", name: "Scattering angle", units: ["°", "rad"], defaultUnit: "°" }
    ],
    solve: (target, vars) => {
      const h = 6.626e-34;
      const me = 9.109e-31; // electron mass
      const c = 3e8;
      const compton_wavelength = h / (me * c); // 2.43e-12 m
      switch(target) {
        case "Δλ": return compton_wavelength * (1 - Math.cos(vars.θ ));
        case "θ": return Math.acos(1 - vars.Δλ / compton_wavelength) ;
      }
    }
  },
  {
    name: "Rydberg Formula (1/λ = R(1/n₁² - 1/n₂²))",
    category: "Modern Physics",
    variables: [
      { symbol: "λ", name: "Wavelength", units: ["m", "nm"], defaultUnit: "nm" },
      { symbol: "n1", name: "Lower energy level", units: [""], defaultUnit: "" },
      { symbol: "n2", name: "Higher energy level", units: [""], defaultUnit: "" }
    ],
    solve: (target, vars) => {
      const R = 1.097e7; // Rydberg constant in m⁻¹
      switch(target) {
        case "λ": return 1 / (R * (1/(vars.n1 * vars.n1) - 1/(vars.n2 * vars.n2)));
        case "n1": return Math.sqrt(1 / ((1/(R * vars.λ)) + 1/(vars.n2 * vars.n2)));
        case "n2": return Math.sqrt(1 / (1/(vars.n1 * vars.n1) - (1/(R * vars.λ))));
      }
    }
  },

  // NUCLEAR PHYSICS
  {
    name: "Radioactive Decay (N = N₀e^(-λt))",
    category: "Nuclear Physics",
    variables: [
      { symbol: "N", name: "Final amount", units: [""], defaultUnit: "" },
      { symbol: "N0", name: "Initial amount", units: [""], defaultUnit: "" },
      { symbol: "λ", name: "Decay constant", units: ["s⁻¹"], defaultUnit: "s⁻¹" },
      { symbol: "t", name: "Time", units: ["s", "years"], defaultUnit: "s" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "N": return vars.N0 * Math.exp(-vars.λ * vars.t);
        case "N0": return vars.N / Math.exp(-vars.λ * vars.t);
        case "λ": return -Math.log(vars.N / vars.N0) / vars.t;
        case "t": return -Math.log(vars.N / vars.N0) / vars.λ;
      }
    }
  },
  {
    name: "Half-life (t₁/₂ = ln(2)/λ)",
    category: "Nuclear Physics",
    variables: [
      { symbol: "t_half", name: "Half-life", units: ["s", "years"], defaultUnit: "s" },
      { symbol: "λ", name: "Decay constant", units: ["s⁻¹"], defaultUnit: "s⁻¹" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "t_half": return Math.log(2) / vars.λ;
        case "λ": return Math.log(2) / vars.t_half;
      }
    }
  },
  {
    name: "Activity (A = λN)",
    category: "Nuclear Physics",
    variables: [
      { symbol: "A", name: "Activity", units: ["Bq", "Ci"], defaultUnit: "Bq" },
      { symbol: "λ", name: "Decay constant", units: ["s⁻¹"], defaultUnit: "s⁻¹" },
      { symbol: "N", name: "Number of nuclei", units: [""], defaultUnit: "" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "A": return vars.λ * vars.N;
        case "λ": return vars.A / vars.N;
        case "N": return vars.A / vars.λ;
      }
    }
  },
  {
    name: "Binding Energy (BE = Δmc²)",
    category: "Nuclear Physics",
    variables: [
      { symbol: "BE", name: "Binding energy", units: ["J", "MeV"], defaultUnit: "MeV" },
      { symbol: "Δm", name: "Mass defect", units: ["kg", "u"], defaultUnit: "u" }
    ],
    solve: (target, vars) => {
      const c = 3e8; // m/s
      const u_to_kg = 1.66054e-27;
      const MeV_per_u = 931.5; // MeV/u
      switch(target) {
        case "BE": return vars.Δm * MeV_per_u;
        case "Δm": return vars.BE / MeV_per_u;
      }
    }
  },
    // ELECTRIC CIRCUITS - COMBINATIONS
  {
    name: "Net Resistance in Series (R_total = R₁ + R₂ + ...)",
    category: "Electricity",
    variables: [
      { symbol: "R_total", name: "Total resistance", units: ["Ω"], defaultUnit: "Ω" },
      { symbol: "R1", name: "Resistance 1", units: ["Ω"], defaultUnit: "Ω" },
      { symbol: "R2", name: "Resistance 2", units: ["Ω"], defaultUnit: "Ω" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "R_total": return vars.R1 + vars.R2;
        case "R1": return vars.R_total - vars.R2;
        case "R2": return vars.R_total - vars.R1;
      }
    }
  },
  {
    name: "Net Resistance in Parallel (1/R_total = 1/R₁ + 1/R₂ + ...)",
    category: "Electricity",
    variables: [
      { symbol: "R_total", name: "Total resistance", units: ["Ω"], defaultUnit: "Ω" },
      { symbol: "R1", name: "Resistance 1", units: ["Ω"], defaultUnit: "Ω" },
      { symbol: "R2", name: "Resistance 2", units: ["Ω"], defaultUnit: "Ω" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "R_total": return 1 / (1/vars.R1 + 1/vars.R2);
        case "R1": return 1 / (1/vars.R_total - 1/vars.R2);
        case "R2": return 1 / (1/vars.R_total - 1/vars.R1);
      }
    }
  },
  {
    name: "Net Capacitance in Parallel (C_total = C₁ + C₂ + ...)",
    category: "Electricity",
    variables: [
      { symbol: "C_total", name: "Total capacitance", units: ["F"], defaultUnit: "F" },
      { symbol: "C1", name: "Capacitance 1", units: ["F"], defaultUnit: "F" },
      { symbol: "C2", name: "Capacitance 2", units: ["F"], defaultUnit: "F" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "C_total": return vars.C1 + vars.C2;
        case "C1": return vars.C_total - vars.C2;
        case "C2": return vars.C_total - vars.C1;
      }
    }
  },
  {
    name: "Net Capacitance in Series (1/C_total = 1/C₁ + 1/C₂ + ...)",
    category: "Electricity",
    variables: [
      { symbol: "C_total", name: "Total capacitance", units: ["F"], defaultUnit: "F" },
      { symbol: "C1", name: "Capacitance 1", units: ["F"], defaultUnit: "F" },
      { symbol: "C2", name: "Capacitance 2", units: ["F"], defaultUnit: "F" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "C_total": return 1 / (1/vars.C1 + 1/vars.C2);
        case "C1": return 1 / (1/vars.C_total - 1/vars.C2);
        case "C2": return 1 / (1/vars.C_total - 1/vars.C1);
      }
    }
  },
  {
    name: "Drift Velocity (vd = I / (nqA))",
    category: "Electricity",
    variables: [
      { symbol: "vd", name: "Drift velocity", units: ["m/s"], defaultUnit: "m/s" },
      { symbol: "I", name: "Current", units: ["A"], defaultUnit: "A" },
      { symbol: "n", name: "Number density", units: ["m⁻³"], defaultUnit: "m⁻³" },
      { symbol: "q", name: "Charge of electron", units: ["C"], defaultUnit: "C" },
      { symbol: "A", name: "Area", units: ["m²"], defaultUnit: "m²" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "vd": return vars.I / (vars.n * vars.q * vars.A);
        case "I": return vars.vd * vars.n * vars.q * vars.A;
        case "n": return vars.I / (vars.vd * vars.q * vars.A);
        case "q": return vars.I / (vars.vd * vars.n * vars.A);
        case "A": return vars.I / (vars.vd * vars.n * vars.q);
      }
    }
  },
  {
    name: "Wheatstone Bridge Condition (R₁/R₂ = R₃/R₄)",
    category: "Electricity",
    variables: [
      { symbol: "R1", name: "Resistance 1", units: ["Ω"], defaultUnit: "Ω" },
      { symbol: "R2", name: "Resistance 2", units: ["Ω"], defaultUnit: "Ω" },
      { symbol: "R3", name: "Resistance 3", units: ["Ω"], defaultUnit: "Ω" },
      { symbol: "R4", name: "Resistance 4", units: ["Ω"], defaultUnit: "Ω" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "R1": return (vars.R3 * vars.R2) / vars.R4;
        case "R2": return (vars.R4 * vars.R1) / vars.R3;
        case "R3": return (vars.R1 * vars.R4) / vars.R2;
        case "R4": return (vars.R2 * vars.R3) / vars.R1;
      }
    }
  },
  {
    name: "AC Circuit Impedance (Z = √(R² + (XL - XC)²))",
    category: "Electricity",
    variables: [
      { symbol: "Z", name: "Impedance", units: ["Ω"], defaultUnit: "Ω" },
      { symbol: "R", name: "Resistance", units: ["Ω"], defaultUnit: "Ω" },
      { symbol: "XL", name: "Inductive reactance", units: ["Ω"], defaultUnit: "Ω" },
      { symbol: "XC", name: "Capacitive reactance", units: ["Ω"], defaultUnit: "Ω" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "Z": return Math.sqrt(vars.R*vars.R + Math.pow(vars.XL - vars.XC, 2));
        case "R": return Math.sqrt(vars.Z*vars.Z - Math.pow(vars.XL - vars.XC, 2));
        case "XL": return vars.XC + Math.sqrt(vars.Z*vars.Z - vars.R*vars.R);
        case "XC": return vars.XL - Math.sqrt(vars.Z*vars.Z - vars.R*vars.R);
      }
    }
  },
  {
    name: "Transformer Equation (Vp/Vs = Np/Ns)",
    category: "Electricity",
    variables: [
      { symbol: "Vp", name: "Primary voltage", units: ["V"], defaultUnit: "V" },
      { symbol: "Vs", name: "Secondary voltage", units: ["V"], defaultUnit: "V" },
      { symbol: "Np", name: "Primary turns", units: [""], defaultUnit: "" },
      { symbol: "Ns", name: "Secondary turns", units: [""], defaultUnit: "" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "Vp": return vars.Vs * vars.Np / vars.Ns;
        case "Vs": return vars.Vp * vars.Ns / vars.Np;
        case "Np": return vars.Vp * vars.Ns / vars.Vs;
        case "Ns": return vars.Vs * vars.Np / vars.Vp;
      }
    }
  },
  {
    name: "Stefan–Boltzmann Law (P = σAeT⁴)",
    category: "Thermodynamics",
    variables: [
      { symbol: "P", name: "Radiated power", units: ["W"], defaultUnit: "W" },
      { symbol: "σ", name: "Stefan–Boltzmann constant", units: ["W/m²K⁴"], defaultUnit: "W/m²K⁴" },
      { symbol: "A", name: "Surface area", units: ["m²"], defaultUnit: "m²" },
      { symbol: "e", name: "Emissivity", units: [""], defaultUnit: "" },
      { symbol: "T", name: "Temperature", units: ["K"], defaultUnit: "K" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "P": return vars.σ * vars.A * vars.e * Math.pow(vars.T, 4);
        case "A": return vars.P / (vars.σ * vars.e * Math.pow(vars.T, 4));
        case "e": return vars.P / (vars.σ * vars.A * Math.pow(vars.T, 4));
        case "T": return Math.pow(vars.P / (vars.σ * vars.A * vars.e), 0.25);
      }
    }
  },
  {
    name: "Wien's Displacement Law (λ_max T = b)",
    category: "Thermodynamics",
    variables: [
      { symbol: "λ_max", name: "Peak wavelength", units: ["m"], defaultUnit: "m" },
      { symbol: "T", name: "Temperature", units: ["K"], defaultUnit: "K" }
    ],
    solve: (target, vars) => {
      const b = 2.898e-3;
      switch(target) {
        case "λ_max": return b / vars.T;
        case "T": return b / vars.λ_max;
      }
    }
  },
  {
    name: "Beats Frequency (f_beats = |f₁ - f₂|)",
    category: "Waves",
    variables: [
      { symbol: "f_beats", name: "Beats frequency", units: ["Hz"], defaultUnit: "Hz" },
      { symbol: "f1", name: "Frequency 1", units: ["Hz"], defaultUnit: "Hz" },
      { symbol: "f2", name: "Frequency 2", units: ["Hz"], defaultUnit: "Hz" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "f_beats": return Math.abs(vars.f1 - vars.f2);
        case "f1": return vars.f_beats + vars.f2;
        case "f2": return vars.f1 - vars.f_beats;
      }
    }
  },
  {
    name: "Young's Double Slit (y = λD/d)",
    category: "Optics",
    variables: [
      { symbol: "y", name: "Fringe width", units: ["m"], defaultUnit: "m" },
      { symbol: "λ", name: "Wavelength", units: ["m"], defaultUnit: "m" },
      { symbol: "D", name: "Screen distance", units: ["m"], defaultUnit: "m" },
      { symbol: "d", name: "Slit separation", units: ["m"], defaultUnit: "m" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "y": return vars.λ * vars.D / vars.d;
        case "λ": return vars.y * vars.d / vars.D;
        case "D": return vars.y * vars.d / vars.λ;
        case "d": return vars.λ * vars.D / vars.y;
      }
    }
  },
    {
    name: "AC Resonance Frequency (f₀ = 1 / (2π√(LC)))",
    category: "Electricity",
    variables: [
      { symbol: "f0", name: "Resonance frequency", units: ["Hz"], defaultUnit: "Hz" },
      { symbol: "L", name: "Inductance", units: ["H"], defaultUnit: "H" },
      { symbol: "C", name: "Capacitance", units: ["F"], defaultUnit: "F" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "f0": return 1 / (2 * Math.PI * Math.sqrt(vars.L * vars.C));
        case "L": return 1 / ((2 * Math.PI * vars.f0) ** 2 * vars.C);
        case "C": return 1 / ((2 * Math.PI * vars.f0) ** 2 * vars.L);
      }
    }
  },
  {
    name: "Inductive Reactance (XL = 2πfL)",
    category: "Electricity",
    variables: [
      { symbol: "XL", name: "Inductive reactance", units: ["Ω"], defaultUnit: "Ω" },
      { symbol: "f", name: "Frequency", units: ["Hz"], defaultUnit: "Hz" },
      { symbol: "L", name: "Inductance", units: ["H"], defaultUnit: "H" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "XL": return 2 * Math.PI * vars.f * vars.L;
        case "f": return vars.XL / (2 * Math.PI * vars.L);
        case "L": return vars.XL / (2 * Math.PI * vars.f);
      }
    }
  },
  {
    name: "Capacitive Reactance (XC = 1 / (2πfC))",
    category: "Electricity",
    variables: [
      { symbol: "XC", name: "Capacitive reactance", units: ["Ω"], defaultUnit: "Ω" },
      { symbol: "f", name: "Frequency", units: ["Hz"], defaultUnit: "Hz" },
      { symbol: "C", name: "Capacitance", units: ["F"], defaultUnit: "F" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "XC": return 1 / (2 * Math.PI * vars.f * vars.C);
        case "f": return 1 / (2 * Math.PI * vars.XC * vars.C);
        case "C": return 1 / (2 * Math.PI * vars.f * vars.XC);
      }
    }
  },
  {
    name: "Biot–Savart Law (B = μ₀I / (2πr))",
    category: "Magnetism",
    variables: [
      { symbol: "B", name: "Magnetic field", units: ["T"], defaultUnit: "T" },
      { symbol: "μ0", name: "Permeability of free space", units: ["T·m/A"], defaultUnit: "T·m/A" },
      { symbol: "I", name: "Current", units: ["A"], defaultUnit: "A" },
      { symbol: "r", name: "Distance", units: ["m"], defaultUnit: "m" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "B": return vars.μ0 * vars.I / (2 * Math.PI * vars.r);
        case "I": return vars.B * 2 * Math.PI * vars.r / vars.μ0;
        case "r": return vars.μ0 * vars.I / (2 * Math.PI * vars.B);
      }
    }
  },
  {
    name: "Ampere's Law (B = μ₀nI)",
    category: "Magnetism",
    variables: [
      { symbol: "B", name: "Magnetic field", units: ["T"], defaultUnit: "T" },
      { symbol: "μ0", name: "Permeability of free space", units: ["T·m/A"], defaultUnit: "T·m/A" },
      { symbol: "n", name: "Turns per unit length", units: ["m⁻¹"], defaultUnit: "m⁻¹" },
      { symbol: "I", name: "Current", units: ["A"], defaultUnit: "A" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "B": return vars.μ0 * vars.n * vars.I;
        case "n": return vars.B / (vars.μ0 * vars.I);
        case "I": return vars.B / (vars.μ0 * vars.n);
      }
    }
  },
  {
    name: "Faraday's Law (ε = -dΦ/dt)",
    category: "Magnetism",
    variables: [
      { symbol: "ε", name: "EMF", units: ["V"], defaultUnit: "V" },
      { symbol: "dΦ", name: "Change in magnetic flux", units: ["Wb"], defaultUnit: "Wb" },
      { symbol: "dt", name: "Change in time", units: ["s"], defaultUnit: "s" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "ε": return -vars.dΦ / vars.dt;
        case "dΦ": return -vars.ε * vars.dt;
        case "dt": return -vars.dΦ / vars.ε;
      }
    }
  },
  {
    name: "Bohr Radius (a₀ = 4πε₀ħ² / (me²))",
    category: "Modern Physics",
    variables: [
      { symbol: "a0", name: "Bohr radius", units: ["m"], defaultUnit: "m" }
    ],
    solve: () => {
      const ε0 = 8.854e-12;
      const hbar = 1.055e-34;
      const m = 9.109e-31;
      const e = 1.602e-19;
      return (4 * Math.PI * ε0 * hbar * hbar) / (m * e * e);
    }
  },
  {
    name: "Bohr Energy Levels (En = -13.6 eV / n²)",
    category: "Modern Physics",
    variables: [
      { symbol: "En", name: "Energy", units: ["eV"], defaultUnit: "eV" },
      { symbol: "n", name: "Principal quantum number", units: [""], defaultUnit: "" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "En": return -13.6 / (vars.n * vars.n);
        case "n": return Math.sqrt(-13.6 / vars.En);
      }
    }
  },
  {
    name: "Nuclear Radius (R = R₀A^(1/3))",
    category: "Nuclear Physics",
    variables: [
      { symbol: "R", name: "Nuclear radius", units: ["m"], defaultUnit: "m" },
      { symbol: "R0", name: "Constant (1.2e-15 m)", units: ["m"], defaultUnit: "m" },
      { symbol: "A", name: "Mass number", units: [""], defaultUnit: "" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "R": return vars.R0 * Math.cbrt(vars.A);
        case "R0": return vars.R / Math.cbrt(vars.A);
        case "A": return Math.pow(vars.R / vars.R0, 3);
      }
    }
  },
  {
    name: "Intensity Level (β = 10 log₁₀(I/I₀))",
    category: "Waves",
    variables: [
      { symbol: "β", name: "Intensity level", units: ["dB"], defaultUnit: "dB" },
      { symbol: "I", name: "Intensity", units: ["W/m²"], defaultUnit: "W/m²" },
      { symbol: "I0", name: "Reference intensity", units: ["W/m²"], defaultUnit: "W/m²" }
    ],
    solve: (target, vars) => {
      switch(target) {
        case "β": return 10 * Math.log10(vars.I / vars.I0);
        case "I": return vars.I0 * Math.pow(10, vars.β / 10);
        case "I0": return vars.I / Math.pow(10, vars.β / 10);
      }
    }
  },
  {
    name: "Diffraction Grating (d sinθ = mλ)",
    category: "Optics",
    variables: [
      { symbol: "d", name: "Grating spacing", units: ["m"], defaultUnit: "m" },
      { symbol: "θ", name: "Diffraction angle", units: ["°"], defaultUnit: "°" },
      { symbol: "m", name: "Order", units: [""], defaultUnit: "" },
      { symbol: "λ", name: "Wavelength", units: ["m"], defaultUnit: "m" }
    ],
    solve: (target, vars) => {
      const toRad = deg => deg ;
      const toDeg = rad => rad ;
      switch(target) {
        case "d": return (vars.m * vars.λ) / Math.sin(vars.θ);
        case "θ": return (Math.asin((vars.m * vars.λ) / vars.d));
        case "m": return (vars.d * Math.sin(vars.θ)) / vars.λ;
        case "λ": return (vars.d * Math.sin(vars.θ)) / vars.m;
      }
    }
  },
    function () {
  // Add these to your existing conversions object:
  const additionalConversions = {
    // Missing length units
    'μm': 1e-6, 'nm': 1e-9, 'pm': 1e-12,
    
    // Missing energy units  
    'MeV': 1.602e-13, 'GeV': 1.602e-10,
    
    // Missing frequency
    'THz': 1e12,
    
    // Missing capacitance
    'μF': 1e-6, 'nF': 1e-9, 'pF': 1e-12,
    
    // Missing inductance
    'mH': 0.001,
    
    // Missing time
    'years': 31557600, 'days': 86400,
    
    // Angular velocity
    'rpm': Math.PI/30, // Convert RPM to rad/s
    
    // Astronomy
    'AU': 1.496e11
  };
  
  return additionalConversions;
},

// Test function to verify angle calculations
function () {
  // Test projectile range at 45° (optimal angle)
  const testVars = {
    u: 20,      // 20 m/s
    θ: Math.PI/4,  // 45° in radians (already converted)
    g: 9.8      // 9.8 m/s²
  };
  
  const expectedRange = 20*20*Math.sin(2*Math.PI/4)/9.8; // Should be ~40.8m
  console.log("Expected range at 45°:", expectedRange);
  
  const calculatedRange = fixedProjectileFormulas.range.solve("R", testVars);
  console.log("Calculated range:", calculatedRange);
  console.log("Match:", Math.abs(expectedRange - calculatedRange) < 0.01);
},
  

];