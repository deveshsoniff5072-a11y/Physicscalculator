// Favorites management with localStorage
const FAVORITES_KEY = 'physics_calculator_favorites';
const MAX_FAVORITES = 5;

let favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
let selectedFormula = null;
let history = [];

// DOM Elements
const formulaSearch = document.getElementById("formulaSearch");
const formulaList = document.getElementById("formulaList");
const variableSelect = document.getElementById("variableSelect");
const inputsContainer = document.getElementById("inputsContainer");
const resultEl = document.getElementById("result");
const recentCalcs = document.getElementById("recentCalcs");
const searchFavBtn = document.getElementById("searchFavBtn");

// === FIXED Live Search & Keyboard Navigation ===

// Fixed live search function
formulaSearch.addEventListener("input", () => {
  const searchTerm = formulaSearch.value.trim().toLowerCase();
  renderFormulaList(searchTerm);
});

// Press Enter in search box → select first visible formula
formulaSearch.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const firstItem = formulaList.querySelector(".formula-item");
    if (firstItem) firstItem.click();
  }
});

// FIXED: Enhanced Enter key navigation for variable inputs
inputsContainer.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    
    const inputs = Array.from(inputsContainer.querySelectorAll("input"));
    const currentIndex = inputs.indexOf(document.activeElement);
    
    if (currentIndex !== -1 && currentIndex < inputs.length - 1) {
      // Move to next input
      inputs[currentIndex + 1].focus();
    } else {
      // Last input or no input focused - perform calculation
      performCalculation();
    }
  }
});

// Make Tab navigation work properly
inputsContainer.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    const inputs = Array.from(inputsContainer.querySelectorAll("input"));
    const currentIndex = inputs.indexOf(document.activeElement);
    if (currentIndex !== -1) {
      e.preventDefault();
      const nextIndex = (currentIndex + (e.shiftKey ? -1 : 1) + inputs.length) % inputs.length;
      inputs[nextIndex].focus();
    }
  }
});

// Blog posts data
const blogPosts = {
  kinematics: {
    title: "Understanding Kinematics: The Foundation of Motion",
    meta: "Published: July 15, 2025 | By: Physicscalculator Team",
    content: `
      <div class="blog-content">
        <h3>What is Kinematics?</h3>
        <p>Kinematics is the branch of mechanics that describes the motion of objects without considering the forces that cause the motion. It forms the foundation for understanding more complex physics concepts.</p>
        
        <h4>The Three Equations of Motion</h4>
        <p>The fundamental equations of kinematics relate displacement, velocity, acceleration, and time:</p>
        
        <div class="formula-box">v = u + at</div>
        <p>This first equation shows how final velocity depends on initial velocity, acceleration, and time.</p>
        
        <div class="formula-box">s = ut + ½at²</div>
        <p>The second equation relates displacement to initial velocity, time, and acceleration.</p>
        
        <div class="formula-box">v² = u² + 2as</div>
        <p>The third equation connects velocities, acceleration, and displacement without involving time.</p>
        
        <h4>Real-World Applications</h4>
        <ul>
          <li>Calculating stopping distances for vehicles</li>
          <li>Designing roller coasters and amusement rides</li>
          <li>Planning rocket trajectories</li>
          <li>Sports performance analysis</li>
        </ul>
        
        <h4>Problem-Solving Tips</h4>
        <p>When solving kinematics problems:</p>
        <ul>
          <li>Identify what information is given and what you need to find</li>
          <li>Choose the appropriate equation based on known and unknown variables</li>
          <li>Pay attention to signs (positive/negative directions)</li>
          <li>Always check if your answer makes physical sense</li>
        </ul>
      </div>
    `
  },
  projectile: {
    title: "Mastering Projectile Motion: From Theory to Practice",
    meta: "Published: July 10, 2025 | By: Physicscalculator Team",
    content: `
      <div class="blog-content">
        <h3>What is Projectile Motion?</h3>
        <p>Projectile motion occurs when an object is launched into the air and moves under the influence of gravity alone. This motion combines horizontal and vertical components.</p>
        
        <h4>Key Concepts</h4>
        <p>Understanding projectile motion requires grasping several important principles:</p>
        <ul>
          <li>Horizontal velocity remains constant (no air resistance)</li>
          <li>Vertical motion follows kinematic equations with g = 9.8 m/s²</li>
          <li>The path forms a parabola</li>
          <li>Maximum range occurs at 45° launch angle</li>
        </ul>
        
        <h4>Essential Formulas</h4>
        <div class="formula-box">Range: R = u²sin(2θ)/g</div>
        <div class="formula-box">Maximum Height: H = u²sin²(θ)/2g</div>
        <div class="formula-box">Time of Flight: T = 2u sin(θ)/g</div>
        
        <h4>Applications in Sports</h4>
        <p>Projectile motion principles are crucial in many sports:</p>
        <ul>
          <li>Basketball shooting angles and trajectories</li>
          <li>Soccer ball kicks and goal scoring</li>
          <li>Golf ball trajectories and course design</li>
          <li>Baseball pitching and batting strategies</li>
        </ul>
        
        <h4>Problem-Solving Strategy</h4>
        <p>To solve projectile motion problems effectively:</p>
        <ol>
          <li>Separate horizontal and vertical components</li>
          <li>Use appropriate kinematic equations for each direction</li>
          <li>Remember that horizontal and vertical motions are independent</li>
          <li>Consider the symmetry of projectile paths</li>
        </ol>
      </div>
    `
  },
  energy: {
    title: "Energy and Work: The Fundamental Concepts",
    meta: "Published: July 6, 2025 | By: Physicscalculator Team",
    content: `
      <div class="blog-content">
        <h3>Understanding Energy</h3>
        <p>Energy is the capacity to do work. It exists in many forms and can be transformed from one type to another, but it cannot be created or destroyed (conservation of energy).</p>
        
        <h4>Types of Mechanical Energy</h4>
        <p>In mechanics, we primarily deal with two types of energy:</p>
        
        <div class="formula-box">Kinetic Energy: KE = ½mv²</div>
        <p>Kinetic energy is the energy of motion. Any moving object possesses kinetic energy.</p>
        
        <div class="formula-box">Potential Energy: PE = mgh</div>
        <p>Gravitational potential energy is stored energy due to an object's position in a gravitational field.</p>
        
        <h4>Work-Energy Theorem</h4>
        <div class="formula-box">Work: W = F·s·cos(θ)</div>
        <p>Work is done when a force causes displacement. The work-energy theorem states that the work done equals the change in kinetic energy.</p>
        
        <h4>Conservation of Energy</h4>
        <p>In a closed system with no friction:</p>
        <div class="formula-box">Total Energy = KE + PE = constant</div>
        
        <h4>Power</h4>
        <p>Power is the rate of doing work or transferring energy:</p>
        <div class="formula-box">P = W/t = F·v</div>
        
        <h4>Real-World Examples</h4>
        <ul>
          <li>Hydroelectric power plants convert gravitational PE to electrical energy</li>
          <li>Car engines convert chemical energy to kinetic energy</li>
          <li>Solar panels convert light energy to electrical energy</li>
          <li>Springs store elastic potential energy</li>
        </ul>
        
        <h4>Energy Efficiency</h4>
        <p>In real systems, some energy is always lost to friction, heat, or sound. Efficiency is calculated as:</p>
        <div class="formula-box">Efficiency = (Useful Energy Output / Total Energy Input) × 100%</div>
      </div>
    `
  },
  waves: {
    title: "Waves and Oscillations: Understanding Periodic Motion",
    meta: "Published: June 28, 2025 | By: Physicscalculator Team",
    content: `
      <div class="blog-content">
        <h3>What are Waves?</h3>
        <p>Waves are disturbances that transfer energy through space and matter without transferring mass. They are fundamental to understanding light, sound, and many other phenomena.</p>
        
        <h4>Wave Properties</h4>
        <p>All waves share common characteristics:</p>
        <ul>
          <li><strong>Wavelength (λ):</strong> Distance between consecutive crests</li>
          <li><strong>Frequency (f):</strong> Number of oscillations per second</li>
          <li><strong>Amplitude (A):</strong> Maximum displacement from equilibrium</li>
          <li><strong>Speed (v):</strong> How fast the wave travels</li>
        </ul>
        
        <h4>The Wave Equation</h4>
        <div class="formula-box">v = fλ</div>
        <p>This fundamental relationship connects wave speed, frequency, and wavelength.</p>
        
        <h4>Simple Harmonic Motion</h4>
        <p>Many waves originate from simple harmonic oscillators:</p>
        <div class="formula-box">x = A sin(ωt + φ)</div>
        <div class="formula-box">Period: T = 2π√(m/k)</div>
        
        <h4>Types of Waves</h4>
        <p>Waves can be classified in several ways:</p>
        <ul>
          <li><strong>Mechanical waves:</strong> Require a medium (sound, water waves)</li>
          <li><strong>Electromagnetic waves:</strong> Can travel through vacuum (light, radio)</li>
          <li><strong>Longitudinal waves:</strong> Vibration parallel to propagation (sound)</li>
          <li><strong>Transverse waves:</strong> Vibration perpendicular to propagation (light)</li>
        </ul>
        
        <h4>Wave Phenomena</h4>
        <p>When waves interact with obstacles or other waves:</p>
        <ul>
          <li><strong>Reflection:</strong> Waves bounce back from surfaces</li>
          <li><strong>Refraction:</strong> Waves bend when entering new media</li>
          <li><strong>Interference:</strong> Waves combine constructively or destructively</li>
          <li><strong>Diffraction:</strong> Waves bend around obstacles</li>
        </ul>
        
        <h4>Applications</h4>
        <ul>
          <li>Medical ultrasound imaging</li>
          <li>Seismology and earthquake detection</li>
          <li>Radio and wireless communication</li>
          <li>Musical instrument design</li>
          <li>Optical technologies and lasers</li>
        </ul>
      </div>
    `
  },
  quantum: {
    title: "Introduction to Modern Physics: Quantum Mechanics Basics",
    meta: "Published: June 20, 2025 | By: Physicscalculator Team",
    content: `
      <div class="blog-content">
        <h3>The Quantum Revolution</h3>
        <p>Quantum mechanics fundamentally changed our understanding of nature at the atomic and subatomic level. It reveals that energy, matter, and light behave very differently at microscopic scales.</p>
        
        <h4>Key Quantum Concepts</h4>
        <p>Several revolutionary ideas form the foundation of quantum mechanics:</p>
        <ul>
          <li><strong>Quantization:</strong> Energy comes in discrete packets called quanta</li>
          <li><strong>Wave-particle duality:</strong> Matter and light exhibit both wave and particle properties</li>
          <li><strong>Uncertainty principle:</strong> Cannot precisely know both position and momentum</li>
          <li><strong>Probability:</strong> Quantum mechanics deals in probabilities, not certainties</li>
        </ul>
        
        <h4>Planck's Quantum Theory</h4>
        <div class="formula-box">E = hf</div>
        <p>Max Planck discovered that electromagnetic energy is quantized, with h being Planck's constant (6.626 × 10⁻³⁴ J·s).</p>
        
        <h4>The Photoelectric Effect</h4>
        <div class="formula-box">KEmax = hf - φ</div>
        <p>Einstein explained this phenomenon by treating light as particles (photons), earning him the Nobel Prize.</p>
        
        <h4>De Broglie's Matter Waves</h4>
        <div class="formula-box">λ = h/p = h/(mv)</div>
        <p>Louis de Broglie proposed that all matter has wave-like properties, with wavelength inversely related to momentum.</p>
        
        <h4>Mass-Energy Equivalence</h4>
        <div class="formula-box">E = mc²</div>
        <p>Einstein's famous equation shows that mass and energy are interchangeable, with profound implications for nuclear physics.</p>
        
        <h4>Applications of Quantum Physics</h4>
        <p>Quantum mechanics has led to numerous technological breakthroughs:</p>
        <ul>
          <li>Lasers and LED lights</li>
          <li>Computer processors and memory</li>
          <li>MRI machines in medicine</li>
          <li>Quantum computers (emerging technology)</li>
          <li>Solar cells and photovoltaic systems</li>
          <li>Electron microscopes</li>
        </ul>
        
        <h4>Quantum Phenomena</h4>
        <ul>
          <li><strong>Tunneling:</strong> Particles can pass through energy barriers</li>
          <li><strong>Superposition:</strong> Particles can exist in multiple states simultaneously</li>
          <li><strong>Entanglement:</strong> Particles can be mysteriously connected across distances</li>
          <li><strong>Interference:</strong> Particle waves can interfere like classical waves</li>
        </ul>
        
        <h4>The Future of Quantum Technology</h4>
        <p>Current research focuses on:</p>
        <ul>
          <li>Quantum computing and cryptography</li>
          <li>Quantum sensors for precision measurements</li>
          <li>Quantum communication networks</li>
          <li>Understanding dark matter and quantum gravity</li>
        </ul>
      </div>
    `
  }
};

// Utility Functions
function saveFavorites() {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function isFavorite(formula) {
  return favorites.some(fav => fav.name === formula.name);
}

function addToFavorites(formula) {
  if (favorites.length >= MAX_FAVORITES) {
    alert(`You can only have ${MAX_FAVORITES} favorites. Please remove one first.`);
    return false;
  }
  if (!isFavorite(formula)) {
    favorites.push({
      name: formula.name,
      category: formula.category,
      variables: formula.variables
    });
    saveFavorites();
    return true;
  }
  return false;
}

function removeFromFavorites(formula) {
  favorites = favorites.filter(fav => fav.name !== formula.name);
  saveFavorites();
}

function toggleFavorite(formula) {
  if (isFavorite(formula)) {
    removeFromFavorites(formula);
    return false;
  } else {
    return addToFavorites(formula);
  }
}

// Enhanced scientific notation formatter
function formatScientific(value, unit) {
  if (isNaN(value) || !isFinite(value)) return "Error";
  
  let formattedValue;
  const absValue = Math.abs(value);
  
  if (absValue === 0) {
    formattedValue = "0";
  } else if (absValue >= 1e6 || absValue < 1e-3) {
    const exp = Math.floor(Math.log10(absValue));
    const mantissa = value / Math.pow(10, exp);
    const mantissaStr = mantissa.toFixed(2);
    let expStr;
    if (exp < 0) {
      expStr = "⁻" + Math.abs(exp).toString().split('').map(d => "⁰¹²³⁴⁵⁶⁷⁸⁹"[parseInt(d)]).join('');
    } else {
      expStr = exp.toString().split('').map(d => "⁰¹²³⁴⁵⁶⁷⁸⁹"[parseInt(d)]).join('');
    }
    
    formattedValue = mantissaStr + " × 10" + expStr;
  } else if (absValue >= 1000) {
    formattedValue = value.toFixed(1);
  } else if (absValue >= 1) {
    formattedValue = value.toFixed(3);
  } else {
    formattedValue = value.toFixed(4);
  }
  
  return formattedValue + (unit ? " " + unit : "");
}

// Unit conversion functions
function convertToBase(value, unit) {
  if (isNaN(value) || !isFinite(value)) return NaN;
  
  const conversions = {
    // Length
    'cm': 0.01, 'mm': 0.001, 'km': 1000, 'μm': 1e-6, 'nm': 1e-9, 'pm': 1e-12,
    
    // Mass
    'g': 0.001, 'ton': 1000, 'u': 1.66054e-27,
    
    // Time
    'ms': 0.001, 'min': 60, 'h': 3600, 'years': 31557600, 'days': 86400,
    
    // Force/Energy
    'kN': 1000, 'dyne': 1e-5, 'kJ': 1000, 'MJ': 1e6, 'eV': 1.602e-19, 'MeV': 1.602e-13, 'GeV': 1.602e-10, 'cal': 4.184,
    
    // Power
    'kW': 1000, 'MW': 1e6,
    
    // Frequency
    'kHz': 1000, 'MHz': 1e6, 'THz': 1e12,
    
    // Voltage/Current/Resistance
    'mV': 0.001, 'kV': 1000, 'mA': 0.001, 'μA': 1e-6, 'kΩ': 1000, 'MΩ': 1e6,
    
    // Capacitance/Inductance
    'μF': 1e-6, 'nF': 1e-9, 'pF': 1e-12, 'mH': 0.001,
    
    // Area/Volume
    'cm²': 1e-4, 'L': 0.001,
    
    // Pressure
    'atm': 101325, 'bar': 1e5, 'mmHg': 133.322,
    
    // Activity
    'Ci': 3.7e10,
    
    // Angles - Convert to radians for calculations
    '°': Math.PI/180,
    'rad': 1,
    
    // Percentages
    '%': 0.01,
    
    // Angular velocity
    'rpm': Math.PI/30,
    
    // Astronomical units
    'AU': 1.496e11
  };
  
  // Special case for temperature conversion
  if (unit === '°C') return value + 273.15;
  
  return value * (conversions[unit] || 1);
}

function convertFromBase(value, unit) {
  if (isNaN(value) || !isFinite(value)) return NaN;
  
  const conversions = {
    // Length
    'cm': 100, 'mm': 1000, 'km': 0.001, 'μm': 1e6, 'nm': 1e9, 'pm': 1e12,
    
    // Mass
    'g': 1000, 'ton': 0.001, 'u': 1/1.66054e-27,
    
    // Time
    'ms': 1000, 'min': 1/60, 'h': 1/3600, 'years': 1/31557600, 'days': 1/86400,
    
    // Force/Energy
    'kN': 0.001, 'dyne': 1e5, 'kJ': 0.001, 'MJ': 1e-6, 'eV': 1/1.602e-19, 'MeV': 1/1.602e-13, 'GeV': 1/1.602e-10, 'cal': 1/4.184,
    
    // Power
    'kW': 0.001, 'MW': 1e-6,
    
    // Frequency
    'kHz': 0.001, 'MHz': 1e-6, 'THz': 1e-12,
    
    // Voltage/Current/Resistance
    'mV': 1000, 'kV': 0.001, 'mA': 1000, 'μA': 1e6, 'kΩ': 0.001, 'MΩ': 1e-6,
    
    // Capacitance/Inductance
    'μF': 1e6, 'nF': 1e9, 'pF': 1e12, 'mH': 1000,
    
    // Area/Volume
    'cm²': 1e4, 'L': 1000,
    
    // Pressure
    'atm': 1/101325, 'bar': 1e-5, 'mmHg': 1/133.322,
    
    // Activity
    'Ci': 1/3.7e10,
    
    // Angles - Convert from radians back to display unit
    '°': 180/Math.PI,
    'rad': 1,
    
    // Percentages
    '%': 100,
    
    // Angular velocity
    'rpm': 30/Math.PI,
    
    // Astronomical units
    'AU': 1/1.496e11
  };
  
  // Special case for temperature conversion
  if (unit === '°C') return value - 273.15;
  
  if (unit === '' || !unit) return value;
  return value * (conversions[unit] || 1);
}

// Fixed calculation function with proper error handling
function performCalculation() {
  if (!selectedFormula || !variableSelect.value) {
    alert("Please select a formula and variable to calculate.");
    return;
  }

  const targetSymbol = variableSelect.value;
  const targetVar = selectedFormula.variables.find(v => v.symbol === targetSymbol);
  const vars = {};

  let hasError = false;
  let errorMessage = "";

  // Collect all input values and convert to base units
  inputsContainer.querySelectorAll("div").forEach(div => {
    const input = div.querySelector("input");
    const unitSel = div.querySelector("select");
    
    if (!input || !unitSel) return;
    
    const value = parseFloat(input.value);
    const unit = unitSel.value;
    const symbol = input.dataset.symbol;
    
    if (isNaN(value)) {
      hasError = true;
      errorMessage = `Please enter a valid number for ${symbol}`;
      input.style.borderColor = "red";
      return;
    }
    
    // Reset border color
    input.style.borderColor = "";
    
    try {
      // Convert to base unit for calculation
      const baseValue = convertToBase(value, unit);
      
      if (isNaN(baseValue) || !isFinite(baseValue)) {
        hasError = true;
        errorMessage = `Invalid conversion for ${symbol} with unit ${unit}`;
        input.style.borderColor = "red";
        return;
      }
      
      vars[symbol] = baseValue;
    } catch (error) {
      hasError = true;
      errorMessage = `Error converting ${symbol}: ${error.message}`;
      input.style.borderColor = "red";
      return;
    }
  });

  if (hasError) {
    alert(errorMessage);
    return;
  }

  try {
    // Perform calculation
    const result = selectedFormula.solve(targetSymbol, vars);
    
    if (isNaN(result) || !isFinite(result)) {
      throw new Error("Calculation resulted in invalid value (NaN or Infinity)");
    }
    
    // Convert result back to display unit
    const displayValue = convertFromBase(result, targetVar.defaultUnit);
    
    if (isNaN(displayValue) || !isFinite(displayValue)) {
      throw new Error("Error converting result to display unit");
    }
    
    // Format and display result
    const formattedResult = formatScientific(displayValue, targetVar.defaultUnit);
    resultEl.innerHTML = formattedResult;

    // Add to history
    const historyItem = `${selectedFormula.name.split('(')[0].trim()}: ${targetSymbol} = ${formattedResult}`;
    history.unshift(historyItem);
    if (history.length > 10) history.pop();
    renderHistory();
    
  } catch (error) {
    console.error("Calculation error:", error);
    alert(`Calculation error: ${error.message}. Please check your inputs and try again.`);
  }
}

// FIXED: UI Functions with proper search functionality
function renderFormulaList(searchQuery = "") {
  formulaList.innerHTML = "";
  
  let formulasToShow = [];
  let showingResults = false;
  
  // If no search query, show favorites first, then all formulas
  if (!searchQuery || searchQuery.trim() === "") {
    // Show favorites first if they exist
    if (favorites.length > 0) {
      const favHeader = document.createElement("li");
      favHeader.className = "category-header";
      favHeader.textContent = "⭐ Favorites";
      formulaList.appendChild(favHeader);
      
      favorites.forEach(fav => {
        const li = document.createElement("li");
        li.className = "formula-item favorite-item";
        li.innerHTML = `
          <span class="formula-name">${fav.name}</span>
          <button class="fav-btn active" title="Remove from favorites">
            <span class="material-icons">star</span>
          </button>
        `;
        
        li.querySelector('.formula-name').onclick = () => selectFormula(fav);
        li.querySelector('.fav-btn').onclick = (e) => {
          e.stopPropagation();
          removeFromFavorites(fav);
          renderFormulaList(searchQuery);
        };
        
        formulaList.appendChild(li);
      });
      showingResults = true;
    }
    
    // Show all formulas grouped by category
    formulasToShow = formulas;
  } else {
    // Filter formulas based on search query
    formulasToShow = formulas.filter(f => 
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  // If search query exists but no results found
  if (searchQuery && searchQuery.trim() !== "" && formulasToShow.length === 0) {
    const noResults = document.createElement("li");
    noResults.className = "no-results";
    noResults.style.padding = "16px";
    noResults.style.textAlign = "center";
    noResults.style.color = "#666";
    noResults.textContent = `No formulas found for "${searchQuery}"`;
    formulaList.appendChild(noResults);
    formulaList.classList.remove("hidden");
    return;
  }
  
  // Group formulas by category
  const grouped = {};
  formulasToShow.forEach(f => {
    if (!grouped[f.category]) grouped[f.category] = [];
    grouped[f.category].push(f);
  });
  
  // Render categories and formulas
  Object.keys(grouped).forEach(category => {
    // Add some spacing if we already showed favorites
    if (showingResults && Object.keys(grouped).indexOf(category) === 0) {
      const spacer = document.createElement("li");
      spacer.style.height = "8px";
      formulaList.appendChild(spacer);
    }
    
    const categoryHeader = document.createElement("li");
    categoryHeader.className = "category-header";
    categoryHeader.textContent = category;
    formulaList.appendChild(categoryHeader);
    
    grouped[category].forEach(f => {
      const li = document.createElement("li");
      const isFav = isFavorite(f);
      li.className = "formula-item";
      
      li.innerHTML = `
        <span class="formula-name" style="cursor: pointer; flex: 1;">${f.name}</span>
        <button class="fav-btn ${isFav ? 'active' : ''}" title="${isFav ? 'Remove from favorites' : 'Add to favorites'}">
          <span class="material-icons">${isFav ? 'star' : 'star_border'}</span>
        </button>
      `;
      
      li.querySelector('.formula-name').onclick = () => selectFormula(f);
      li.querySelector('.fav-btn').onclick = (e) => {
        e.stopPropagation();
        const success = toggleFavorite(f);
        if (success !== undefined) {
          const btn = e.currentTarget;
          const icon = btn.querySelector('.material-icons');
          if (isFavorite(f)) {
            btn.classList.add('active');
            icon.textContent = 'star';
            btn.title = 'Remove from favorites';
          } else {
            btn.classList.remove('active');
            icon.textContent = 'star_border';
            btn.title = 'Add to favorites';
          }
        }
      };
      
      formulaList.appendChild(li);
      showingResults = true;
    });
  });
  
  // Always show the list if we have content
  if (showingResults) {
    formulaList.classList.remove("hidden");
  } else {
    formulaList.classList.add("hidden");
  }
}

function selectFormula(f) {
  selectedFormula = f;
  formulaSearch.value = f.name;
  formulaList.classList.add("hidden");
  populateVariableSelect();
}

function populateVariableSelect() {
  variableSelect.innerHTML = `<option value="">Select variable to find</option>`;
  selectedFormula.variables.forEach(v => {
    const opt = document.createElement("option");
    opt.value = v.symbol;
    opt.textContent = `${v.symbol} - ${v.name} (${v.units.join(", ")})`;
    variableSelect.appendChild(opt);
  });
}

function renderInputs() {
  inputsContainer.innerHTML = "";
  if (!selectedFormula) return;

  const target = variableSelect.value;
  if (!target) return;

  const vars = selectedFormula.variables.filter(v => v.symbol !== target);
  const numVars = vars.length;

  let gridClass = "";
  if (numVars === 1) {
    gridClass = "flex justify-center";
  } else if (numVars === 2) {
    gridClass = "grid grid-cols-2 gap-4";
  } else if (numVars === 3) {
    gridClass = "grid gap-4";
    inputsContainer.className = gridClass;
    
    const firstRow = document.createElement("div");
    firstRow.className = "grid grid-cols-2 gap-4";
    const secondRow = document.createElement("div");
    secondRow.className = "flex justify-center";
    
    vars.forEach((v, index) => {
      const wrapper = createInputWrapper(v);
      if (index < 2) {
        firstRow.appendChild(wrapper);
      } else {
        wrapper.style.width = "48%";
        secondRow.appendChild(wrapper);
      }
    });
    
    inputsContainer.appendChild(firstRow);
    inputsContainer.appendChild(secondRow);
    return;
  } else {
    gridClass = "grid grid-cols-2 gap-4";
  }

  inputsContainer.className = gridClass;
  vars.forEach(v => {
    const wrapper = createInputWrapper(v);
    inputsContainer.appendChild(wrapper);
  });
}

function createInputWrapper(v) {
  const wrapper = document.createElement("div");
  wrapper.className = "glass-bg rounded-xl overflow-hidden flex";

  const input = document.createElement("input");
  input.type = "number";
  input.step = "any";
  input.placeholder = `${v.name}`;
  input.className = "w-7/10 py-3 px-4 focus:outline-none bg-transparent border-none text-white placeholder-gray-200 text-sm";
  input.style.width = "70%";
  input.dataset.symbol = v.symbol;

  const unitSelect = document.createElement("select");
  unitSelect.className = "w-3/10 unit-select text-white py-3 px-2 text-xs border-l border-white border-opacity-30 focus:outline-none cursor-pointer";
  unitSelect.style.width = "30%";
  
  v.units.forEach(u => {
    const opt = document.createElement("option");
    opt.value = u;
    opt.textContent = u || "unitless";
    if (u === v.defaultUnit) opt.selected = true;
    unitSelect.appendChild(opt);
  });

  wrapper.appendChild(input);
  wrapper.appendChild(unitSelect);
  return wrapper;
}

function renderFavorites() {
  const content = document.getElementById('favoritesContent');
  
  if (favorites.length === 0) {
    content.innerHTML = `
      <div class="no-favorites">
        <span class="material-icons" style="font-size: 48px; color: #ccc; margin-bottom: 16px;">star_border</span>
        <p>No favorites yet!</p>
        <p style="margin-top: 8px; font-size: 0.9rem;">Click the star icon next to any formula to add it to your favorites.</p>
      </div>
    `;
    return;
  }

  let html = '';
  if (favorites.length >= MAX_FAVORITES) {
    html += `<div class="favorites-limit">You have reached the maximum of ${MAX_FAVORITES} favorites.</div>`;
  }

  favorites.forEach(fav => {
    html += `
      <div class="favorite-formula">
        <button class="remove-fav-btn" onclick="removeFromFavorites({name: '${fav.name}'});renderFavorites();" title="Remove from favorites">
          <span class="material-icons" style="font-size: 16px;">close</span>
        </button>
        <h3>${fav.name}</h3>
        <div class="category">${fav.category}</div>
      </div>
    `;
  });

  content.innerHTML = html;
}

function renderHistory() {
  recentCalcs.innerHTML = "";
  if (history.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No calculations yet";
    p.className = "text-gray-500 text-sm";
    recentCalcs.appendChild(p);
    return;
  }
  
  history.slice(0, 5).forEach(item => {
    const div = document.createElement("div");
    div.className = "history-item rounded-lg p-3 text-sm cursor-pointer";
    div.innerHTML = item;
    recentCalcs.appendChild(div);
  });
}

// Blog Functions
function showBlogPost(postId) {
  const post = blogPosts[postId];
  if (!post) return;
  
  const fullBlogContent = document.getElementById('fullBlogContent');
  fullBlogContent.innerHTML = `
    <button class="back-to-blog" onclick="closeBlogPost()">← Back to Blog</button>
    <h2>${post.title}</h2>
    <div class="blog-meta">${post.meta}</div>
    ${post.content}
  `;
  
  // Hide blog modal and show full blog modal
  document.getElementById('blogModal').classList.remove('show');
  document.getElementById('fullBlogModal').classList.add('show');
}

function closeBlogPost() {
  document.getElementById('fullBlogModal').classList.remove('show');
  document.getElementById('blogModal').classList.add('show');
}

// Event Listeners
document.addEventListener("DOMContentLoaded", function() {
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const navLinks = document.querySelectorAll(".nav-link");
  const homeSection = document.getElementById("homeSection");
  const favoritesModal = document.getElementById("favoritesModal");
  const blogModal = document.getElementById("blogModal");
  const aboutModal = document.getElementById("aboutModal");
  const fullBlogModal = document.getElementById("fullBlogModal");
  const favoritesModalClose = document.getElementById("favoritesModalClose");
  const blogModalClose = document.getElementById("blogModalClose");
  const aboutModalClose = document.getElementById("aboutModalClose");
  const fullBlogModalClose = document.getElementById("fullBlogModalClose");

  // Hamburger menu
  hamburger.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
  });

  overlay.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  });

  // Navigation
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const page = link.getAttribute("data-page");
      sidebar.classList.remove("active");
      overlay.classList.remove("active");

      // Remove active class from all links
      navLinks.forEach(l => l.classList.remove("active"));
      // Add active class to clicked link
      link.classList.add("active");

      if (page === "home") {
        // Already on home page
      } else if (page === "favorites") {
        favoritesModal.classList.add("show");
        renderFavorites();
      } else if (page === "blog") {
        blogModal.classList.add("show");
      } else if (page === "about") {
        aboutModal.classList.add("show");
      }
    });
  });

  // Modal close buttons
  favoritesModalClose.addEventListener("click", () => {
    favoritesModal.classList.remove("show");
  });

  blogModalClose.addEventListener("click", () => {
    blogModal.classList.remove("show");
  });

  aboutModalClose.addEventListener("click", () => {
    aboutModal.classList.remove("show");
  });

  fullBlogModalClose.addEventListener("click", () => {
    fullBlogModal.classList.remove("show");
  });

  // Close modals when clicking outside
  favoritesModal.addEventListener("click", (e) => {
    if (e.target === favoritesModal) {
      favoritesModal.classList.remove("show");
    }
  });

  blogModal.addEventListener("click", (e) => {
    if (e.target === blogModal) {
      blogModal.classList.remove("show");
    }
  });

  aboutModal.addEventListener("click", (e) => {
    if (e.target === aboutModal) {
      aboutModal.classList.remove("show");
    }
  });

  fullBlogModal.addEventListener("click", (e) => {
    if (e.target === fullBlogModal) {
      fullBlogModal.classList.remove("show");
    }
  });

  // FIXED: Formula search functionality
  formulaSearch.addEventListener("focus", () => {
    renderFormulaList();
  });

  searchFavBtn.addEventListener("click", () => {
    favoritesModal.classList.add('show');
    renderFavorites();
  });

  // Hide suggestions when clicking outside
  document.addEventListener("click", (e) => {
    if (!formulaSearch.contains(e.target) && !formulaList.contains(e.target)) {
      formulaList.classList.add("hidden");
    }
  });

  variableSelect.addEventListener("change", renderInputs);

  // Calculate button with improved error handling
  document.getElementById("calcBtn").addEventListener("click", performCalculation);

  // Initialize
  renderHistory();
});

// Make functions globally accessible for onclick handlers
window.showBlogPost = showBlogPost;
window.closeBlogPost = closeBlogPost;
window.removeFromFavorites = removeFromFavorites;
window.renderFavorites = renderFavorites;