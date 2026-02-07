/**
 * Quantum Portfolio - Interactive Script
 *
 * Features:
 * 1. Tensor Network Canvas Animation (background)
 * 2. Dynamic publication rendering from data.js
 * 3. Mobile navigation toggle
 * 4. Smooth scroll behavior
 */

// ============================================
// TENSOR NETWORK CANVAS ANIMATION
// ============================================

class TensorNetworkAnimation {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 150 };

    // Configuration
    this.config = {
      particleCount: 150,
      particleRadius: { min: 3, max: 4 },
      connectionDistance: 150,
      particleSpeed: 0.5,
      colors: {
        cyan: 'rgba(0, 242, 255, ',
        purple: 'rgba(189, 0, 255, ',
        line: 'rgba(0, 242, 255, '
      },
      physics: {
        screeningLength: 100,      // Debye length in pixels (longer range)
        coulombStrength: 200,       // Force magnitude constant
        damping: 1.0,            // Velocity damping per frame
        maxVelocity: 10.0,          // Prevent runaway speeds
        softening: 20,             // Prevent singularity at r→0
        brownianStrength: 0.1     // Random thermal noise (high temperature)
      }
    };

    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    this.particles = [];
    const { particleCount, particleRadius } = this.config;

    for (let i = 0; i < particleCount; i++) {
      const radius = Math.random() * (particleRadius.max - particleRadius.min) + particleRadius.min;
      const x = Math.random() * (this.canvas.width - radius * 2) + radius;
      const y = Math.random() * (this.canvas.height - radius * 2) + radius;
      const vx = (Math.random() - 0.5) * this.config.particleSpeed;
      const vy = (Math.random() - 0.5) * this.config.particleSpeed;
      const isCyan = Math.random() > 0.5;
      const charge = isCyan ? 1 : -1;  // Cyan = positive, Purple = negative

      this.particles.push({
        x, y, radius, vx, vy, isCyan, charge,
        ax: 0, ay: 0,  // Acceleration accumulators
        baseRadius: radius,
        pulseOffset: Math.random() * Math.PI * 2
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.createParticles();
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

  }

  drawParticle(particle, time) {
    const { ctx, config } = this;

    // Pulse effect
    const pulse = Math.sin(time * 0.002 + particle.pulseOffset) * 0.3 + 0.7;
    const radius = particle.baseRadius * pulse;

    // Color based on type
    const color = particle.isCyan ? config.colors.cyan : config.colors.purple;
    const opacity = 0.6 + pulse * 0.2;

    // Draw glow
    const gradient = ctx.createRadialGradient(
      particle.x, particle.y, 0,
      particle.x, particle.y, radius * 3
    );
    gradient.addColorStop(0, color + (opacity * 0.5) + ')');
    gradient.addColorStop(1, color + '0)');

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, radius * 3, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw core
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color + opacity + ')';
    ctx.fill();
  }

  calculateForces() {
    const { physics } = this.config;

    // Reset accelerations
    for (const p of this.particles) {
      p.ax = 0;
      p.ay = 0;
    }

    // O(n²) pairwise force calculation
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];

        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);

        // Skip if too far (beyond 2x screening length)
        if (dist > physics.screeningLength * 2) continue;

        // Softened distance to prevent singularity
        const r = dist + physics.softening;

        // Screened Coulomb (Yukawa) force: F = k*q1*q2/r² * exp(-r/λ)
        const screening = Math.exp(-dist / physics.screeningLength);
        const forceMag = physics.coulombStrength * p1.charge * p2.charge / (r * r) * screening;

        // Force direction (unit vector from p1 to p2)
        const fx = (dx / dist) * forceMag;
        const fy = (dy / dist) * forceMag;

        // Newton's third law: equal and opposite forces
        // Positive forceMag (same charge) → repulsion → p1 pushed away from p2
        p1.ax -= fx;
        p1.ay -= fy;
        p2.ax += fx;
        p2.ay += fy;
      }
    }
  }

  drawConnections() {
    const { ctx, particles, config } = this;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < config.connectionDistance) {
          const opacity = (1 - distance / config.connectionDistance) * 0.3;

          // Color by interaction type: cyan for attraction, purple for repulsion
          const chargeProduct = particles[i].charge * particles[j].charge;
          const lineColor = chargeProduct < 0 ? config.colors.cyan : config.colors.purple;

          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = lineColor + opacity + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  updateParticle(particle) {
    const { canvas, mouse } = this;
    const { physics } = this.config;

    // Mouse interaction - attraction
    if (mouse.x !== null && mouse.y !== null) {
      const dx = particle.x - mouse.x;
      const dy = particle.y - mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouse.radius && distance > 0) {
        const force = (mouse.radius - distance) / mouse.radius * 0.5;
        particle.ax -= (dx / distance) * force;
        particle.ay -= (dy / distance) * force;
      }
    }

    // Apply acceleration to velocity
    particle.vx += particle.ax;
    particle.vy += particle.ay;

    // Add Brownian noise (thermal motion)
    particle.vx += (Math.random() - 0.5) * physics.brownianStrength;
    particle.vy += (Math.random() - 0.5) * physics.brownianStrength;

    // Apply damping
    particle.vx *= physics.damping;
    particle.vy *= physics.damping;

    // Clamp to max velocity
    const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
    if (speed > physics.maxVelocity) {
      particle.vx = (particle.vx / speed) * physics.maxVelocity;
      particle.vy = (particle.vy / speed) * physics.maxVelocity;
    }

    // Move particle
    particle.x += particle.vx;
    particle.y += particle.vy;

    // Bounce off walls (reverse velocity)
    if (particle.x < particle.radius) {
      particle.x = particle.radius;
      particle.vx *= -0.9;
    } else if (particle.x > canvas.width - particle.radius) {
      particle.x = canvas.width - particle.radius;
      particle.vx *= -0.9;
    }

    if (particle.y < particle.radius) {
      particle.y = particle.radius;
      particle.vy *= -0.9;
    } else if (particle.y > canvas.height - particle.radius) {
      particle.y = canvas.height - particle.radius;
      particle.vy *= -0.9;
    }
  }

  animate() {
    const time = performance.now();

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw connections first (behind particles)
    this.drawConnections();

    // Calculate inter-particle forces (screened Coulomb)
    this.calculateForces();

    // Update and draw particles
    for (const particle of this.particles) {
      this.updateParticle(particle);
      this.drawParticle(particle, time);
    }

    requestAnimationFrame(() => this.animate());
  }
}


// ============================================
// RESEARCH CARDS RENDERING
// ============================================

function renderResearchCards() {
  const container = document.getElementById('research-grid');
  if (!container || typeof siteData === 'undefined') return;

  container.innerHTML = '';

  siteData.research.forEach(item => {
    const card = document.createElement('div');
    card.className = 'research-card';

    // Use special Bloch sphere icon for wave/simulation, otherwise use CSS icon
    if (item.icon === 'wave') {
      card.innerHTML = `
        <div class="card-icon bloch-sphere-container" id="bloch-icon-${item.id}"></div>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      `;
    } else {
      card.innerHTML = `
        <div class="card-icon icon-${item.icon}"></div>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      `;
    }

    container.appendChild(card);
  });

  // Initialize Bloch sphere animations after cards are rendered
  initBlochSphereIcons();
}


// ============================================
// BLOCH SPHERE ICON ANIMATION
// ============================================

function initBlochSphereIcons() {
  const containers = document.querySelectorAll('.bloch-sphere-container');
  containers.forEach(container => {
    new BlochSphereIcon(container);
  });
}

class BlochSphereIcon {
  constructor(container) {
    this.container = container;

    // Current state vector position (Cartesian on unit sphere)
    this.x = 0.707;
    this.y = 0;
    this.z = 0.707;

    // Target position (where mouse is pointing)
    this.targetX = this.x;
    this.targetY = this.y;
    this.targetZ = this.z;

    // Store reference to bound handler for cleanup
    this.boundMouseHandler = this.handleMouseMove.bind(this);

    this.createSVG();
    this.setupMouseTracking();
    this.animate();
  }

  setupMouseTracking() {
    // Track mouse position globally
    document.addEventListener('mousemove', this.boundMouseHandler);
  }

  handleMouseMove(e) {
    // Get the Bloch sphere container's position on screen
    const rect = this.container.getBoundingClientRect();

    // The SVG viewBox is '-18 -12 96 84', so the sphere center (30,30) maps to:
    // viewBox starts at x=-18, width=96, so x=30 is at (30-(-18))/96 = 48/96 = 0.5 of width
    // viewBox starts at y=-12, height=84, so y=30 is at (30-(-12))/84 = 42/84 = 0.5 of height
    const centerScreenX = rect.left + rect.width * 0.5;
    const centerScreenY = rect.top + rect.height * 0.5;

    // The sphere radius in SVG units is 22, viewBox width is 96, height is 84
    // So radius in screen pixels:
    const radiusScreenX = (22 / 96) * rect.width;
    const radiusScreenY = (22 / 84) * rect.height;
    const radiusScreen = Math.min(radiusScreenX, radiusScreenY);

    // Calculate mouse offset from sphere center in normalized units [-1, 1]
    // where 1 = sphere radius
    const dx = (e.clientX - centerScreenX) / radiusScreen;
    const dy = (e.clientY - centerScreenY) / radiusScreen;

    // The projection formula is:
    //   screenX = 30 + x*radius*0.9 + y*radius*0.3
    //   screenY = 30 - z*radius + y*radius*0.2
    // In normalized units (dividing by radius):
    //   dx = x*0.9 + y*0.3
    //   dy = -z + y*0.2
    // So:
    //   z = -dy + y*0.2
    //   x = (dx - y*0.3) / 0.9
    // And x² + y² + z² = 1

    // Substitute x and z in terms of y:
    //   x = (dx - 0.3*y) / 0.9
    //   z = -dy + 0.2*y
    //   ((dx - 0.3*y)/0.9)² + y² + (-dy + 0.2*y)² = 1

    // Let a = 0.3, b = 0.9, c = 0.2
    // x = (dx - a*y) / b
    // z = -dy + c*y
    // Expanding:
    //   (dx - a*y)²/b² + y² + (c*y - dy)² = 1
    //   (dx² - 2*a*dx*y + a²*y²)/b² + y² + c²*y² - 2*c*dy*y + dy² = 1

    const a = 0.3, b = 0.9, c = 0.2;

    // Coefficients for quadratic in y: A*y² + B*y + C = 0
    const A = (a*a)/(b*b) + 1 + c*c;
    const B = -2*a*dx/(b*b) - 2*c*dy;
    const C = (dx*dx)/(b*b) + dy*dy - 1;

    const discriminant = B*B - 4*A*C;

    if (discriminant >= 0) {
      // Two solutions - pick the one with positive y (front of sphere)
      const sqrtD = Math.sqrt(discriminant);
      const y1 = (-B + sqrtD) / (2*A);
      const y2 = (-B - sqrtD) / (2*A);

      // Choose positive y (front surface) if possible
      this.targetY = y1 >= 0 ? y1 : (y2 >= 0 ? y2 : Math.max(y1, y2));
      this.targetX = (dx - a*this.targetY) / b;
      this.targetZ = -dy + c*this.targetY;

      // Normalize to ensure we're on unit sphere
      const len = Math.sqrt(this.targetX*this.targetX + this.targetY*this.targetY + this.targetZ*this.targetZ);
      if (len > 0) {
        this.targetX /= len;
        this.targetY /= len;
        this.targetZ /= len;
      }
    } else {
      // Mouse is outside the projected sphere - find closest point
      // Use the direction from center and clamp to sphere edge
      const len2D = Math.sqrt(dx*dx + dy*dy);
      if (len2D > 0) {
        // Normalize to edge of sphere in 2D projection space
        const ndx = dx / len2D;
        const ndy = dy / len2D;

        // Find sphere point at edge in this direction
        // At edge, y = 0, so:
        //   x*0.9 = ndx (scaled)
        //   -z = ndy (scaled)
        this.targetX = ndx / 0.9;
        this.targetZ = -ndy;
        this.targetY = 0;

        // Normalize
        const len = Math.sqrt(this.targetX*this.targetX + this.targetZ*this.targetZ);
        if (len > 0) {
          this.targetX /= len;
          this.targetZ /= len;
        }
      }
    }
  }

  createSVG() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    // Extended viewBox to accommodate labels outside sphere
    svg.setAttribute('viewBox', '-18 -12 96 84');
    svg.setAttribute('class', 'bloch-sphere-svg');

    // Create gradient for the sphere
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'bloch-gradient-' + Math.random().toString(36).substr(2, 9));
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '100%');
    gradient.setAttribute('y2', '100%');

    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#00f2ff');

    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#bd00ff');

    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    svg.appendChild(defs);

    this.gradientId = gradient.getAttribute('id');

    // Sphere outline (circle)
    const sphere = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    sphere.setAttribute('cx', '30');
    sphere.setAttribute('cy', '30');
    sphere.setAttribute('r', '22');
    sphere.setAttribute('fill', 'none');
    sphere.setAttribute('stroke', `url(#${this.gradientId})`);
    sphere.setAttribute('stroke-width', '1.5');
    sphere.setAttribute('opacity', '0.6');
    svg.appendChild(sphere);

    // Equator (horizontal ellipse)
    const equator = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    equator.setAttribute('cx', '30');
    equator.setAttribute('cy', '30');
    equator.setAttribute('rx', '22');
    equator.setAttribute('ry', '6');
    equator.setAttribute('fill', 'none');
    equator.setAttribute('stroke', `url(#${this.gradientId})`);
    equator.setAttribute('stroke-width', '1');
    equator.setAttribute('stroke-dasharray', '3,2');
    equator.setAttribute('opacity', '0.4');
    svg.appendChild(equator);

    // Vertical meridian (vertical ellipse)
    const meridian = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    meridian.setAttribute('cx', '30');
    meridian.setAttribute('cy', '30');
    meridian.setAttribute('rx', '6');
    meridian.setAttribute('ry', '22');
    meridian.setAttribute('fill', 'none');
    meridian.setAttribute('stroke', `url(#${this.gradientId})`);
    meridian.setAttribute('stroke-width', '1');
    meridian.setAttribute('stroke-dasharray', '3,2');
    meridian.setAttribute('opacity', '0.4');
    svg.appendChild(meridian);

    // Z-axis (|0⟩ to |1⟩)
    const zAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    zAxis.setAttribute('x1', '30');
    zAxis.setAttribute('y1', '8');
    zAxis.setAttribute('x2', '30');
    zAxis.setAttribute('y2', '52');
    zAxis.setAttribute('stroke', `url(#${this.gradientId})`);
    zAxis.setAttribute('stroke-width', '0.8');
    zAxis.setAttribute('opacity', '0.3');
    svg.appendChild(zAxis);

    // State labels - positioned well outside the sphere perimeter
    // Using consistent character heights with mathematical notation
    const createLabel = (x, y, anchor, state) => {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', x);
      text.setAttribute('y', y);
      text.setAttribute('text-anchor', anchor);
      // Use a font that renders | and ⟩ at consistent heights
      text.setAttribute('font-family', '"Cambria Math", "STIX Two Math", Georgia, serif');
      text.setAttribute('font-size', '14px');
      text.setAttribute('fill', '#00f2ff');
      text.setAttribute('opacity', '0.9');
      text.setAttribute('dominant-baseline', 'middle');
      // Use proper ket notation with mathematical angle bracket
      text.textContent = `|${state}⟩`;
      return text;
    };

    // |0⟩ at north pole (top center) - outside perimeter
    svg.appendChild(createLabel('30', '-4', 'middle', '0'));

    // |1⟩ at south pole (bottom center) - outside perimeter
    svg.appendChild(createLabel('30', '64', 'middle', '1'));

    // |+⟩ on the left - outside perimeter
    svg.appendChild(createLabel('2', '30', 'end', '+'));

    // |−⟩ on the right - outside perimeter
    svg.appendChild(createLabel('58', '30', 'start', '−'));

    // State vector line
    this.vectorLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    this.vectorLine.setAttribute('x1', '30');
    this.vectorLine.setAttribute('y1', '30');
    this.vectorLine.setAttribute('stroke', `url(#${this.gradientId})`);
    this.vectorLine.setAttribute('stroke-width', '2');
    this.vectorLine.setAttribute('stroke-linecap', 'round');
    svg.appendChild(this.vectorLine);

    // State vector dot (tip)
    this.vectorDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    this.vectorDot.setAttribute('r', '3');
    this.vectorDot.setAttribute('fill', '#00f2ff');
    svg.appendChild(this.vectorDot);

    // Glow effect for the dot
    this.vectorGlow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    this.vectorGlow.setAttribute('r', '6');
    this.vectorGlow.setAttribute('fill', 'rgba(0, 242, 255, 0.3)');
    svg.insertBefore(this.vectorGlow, this.vectorDot);

    this.container.appendChild(svg);
  }

  cartesianToScreen(x, y, z, radius = 22) {
    // Convert unit sphere Cartesian to screen coordinates
    // x3d, y3d, z3d are scaled by radius
    const x3d = x * radius;
    const y3d = y * radius;
    const z3d = z * radius;

    // Simple isometric-ish projection
    // Y-axis comes toward viewer, X goes right, Z goes up
    const screenX = 30 + x3d * 0.9 + y3d * 0.3;
    const screenY = 30 - z3d + y3d * 0.2;

    return { x: screenX, y: screenY };
  }

  animate() {
    // Smoothly interpolate toward target position
    const lerp = 0.08;  // Interpolation factor (0-1, higher = faster)

    this.x += (this.targetX - this.x) * lerp;
    this.y += (this.targetY - this.y) * lerp;
    this.z += (this.targetZ - this.z) * lerp;

    // Project back onto unit sphere (normalize)
    const len = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    if (len > 0) {
      this.x /= len;
      this.y /= len;
      this.z /= len;
    }

    // Convert to screen coordinates and render
    const pos = this.cartesianToScreen(this.x, this.y, this.z);

    this.vectorLine.setAttribute('x2', pos.x);
    this.vectorLine.setAttribute('y2', pos.y);
    this.vectorDot.setAttribute('cx', pos.x);
    this.vectorDot.setAttribute('cy', pos.y);
    this.vectorGlow.setAttribute('cx', pos.x);
    this.vectorGlow.setAttribute('cy', pos.y);

    requestAnimationFrame(() => this.animate());
  }

  /* ========================================
   * PRESERVED: Random Walk Animation
   * ========================================
   * Uncomment this animate() method and comment out the mouse-following
   * version above to restore random walk behavior.
   *
   * Also update constructor to use:
   *   const initTheta = Math.acos(2 * Math.random() - 1);
   *   const initPhi = Math.random() * Math.PI * 2;
   *   this.x = Math.sin(initTheta) * Math.cos(initPhi);
   *   this.y = Math.sin(initTheta) * Math.sin(initPhi);
   *   this.z = Math.cos(initTheta);
   *   this.vx = 0;
   *   this.vy = 0;
   *   this.vz = 0;
   *
   * And remove setupMouseTracking() call and handleMouseMove method.
   *
  animateRandomWalk() {
    // Animation parameters
    const perturbScale = 0.01;  // How quickly direction changes
    const damping = 0.995;       // Smoothness of motion
    const minSpeed = 0.1;        // Ensures continuous movement
    const maxSpeed = 0.5;        // Prevents erratic motion

    // Add random perturbations in Cartesian space (isotropic - no pole bias)
    this.vx += (Math.random() - 0.5) * perturbScale;
    this.vy += (Math.random() - 0.5) * perturbScale;
    this.vz += (Math.random() - 0.5) * perturbScale;

    // Apply damping
    this.vx *= damping;
    this.vy *= damping;
    this.vz *= damping;

    // Calculate speed
    let speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy + this.vz * this.vz);

    // Ensure minimum velocity
    if (speed < minSpeed && speed > 0) {
      const scale = minSpeed / speed;
      this.vx *= scale;
      this.vy *= scale;
      this.vz *= scale;
      speed = minSpeed;
    }

    // Clamp maximum velocity
    if (speed > maxSpeed) {
      const scale = maxSpeed / speed;
      this.vx *= scale;
      this.vy *= scale;
      this.vz *= scale;
    }

    // Update position
    this.x += this.vx;
    this.y += this.vy;
    this.z += this.vz;

    // Project back onto unit sphere (normalize)
    const len = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    this.x /= len;
    this.y /= len;
    this.z /= len;

    // Convert to screen coordinates and render
    const pos = this.cartesianToScreen(this.x, this.y, this.z);

    this.vectorLine.setAttribute('x2', pos.x);
    this.vectorLine.setAttribute('y2', pos.y);
    this.vectorDot.setAttribute('cx', pos.x);
    this.vectorDot.setAttribute('cy', pos.y);
    this.vectorGlow.setAttribute('cx', pos.x);
    this.vectorGlow.setAttribute('cy', pos.y);

    requestAnimationFrame(() => this.animateRandomWalk());
  }
  */
}


// ============================================
// HERO CONTENT RENDERING
// ============================================

function renderHeroContent() {
  if (typeof siteData === 'undefined') return;

  const subtitle = document.querySelector('.hero-text .subtitle');
  if (subtitle && siteData.subtitle) {
    subtitle.textContent = siteData.subtitle;
  }

  const bio = document.querySelector('.bio');
  if (bio && siteData.bio) {
    bio.textContent = siteData.bio;
  }
}

// ============================================
// PUBLICATION RENDERING
// ============================================

function highlightAuthor(authorsString) {
  return authorsString
    .split(',')
    .map(author => {
      const trimmed = author.trim();
      if (trimmed.toLowerCase().includes('gibbs')) {
        return `<span class="author-self">${trimmed}</span>`;
      }
      return trimmed;
    })
    .join(', ');
}

function renderPublications() {
  const container = document.getElementById('publications-list');
  if (!container || typeof siteData === 'undefined') return;

  // Clear existing content (except noscript)
  const noscript = container.querySelector('noscript');
  container.innerHTML = '';
  if (noscript) container.appendChild(noscript);

  // Render publications from data.js
  siteData.publications.forEach(pub => {
    const item = document.createElement('div');
    item.className = 'publication-item';

    item.innerHTML = `
      <span class="publication-year">${pub.year}</span>
      <div class="publication-content">
        <h4><a href="${pub.link}" target="_blank" rel="noopener">${pub.title}</a></h4>
        <p class="publication-authors">${highlightAuthor(pub.authors)}</p>
        <p class="publication-journal">${pub.journal}</p>
      </div>
    `;

    container.appendChild(item);
  });
}

function renderTalks() {
  const container = document.getElementById('talks-list');
  if (!container || typeof siteData === 'undefined') return;

  container.innerHTML = '';

  siteData.talks.forEach(talk => {
    const item = document.createElement('div');
    item.className = 'talk-item';

    const invitedBadge = talk.invited ? '<span class="talk-invited">Invited</span>' : '';

    item.innerHTML = `
      <span class="talk-year">${talk.year}</span>
      <div class="talk-content">
        <h4>${talk.title}</h4>
        <p class="talk-event">${talk.event}${invitedBadge}</p>
        <p class="talk-location">${talk.location}</p>
      </div>
    `;

    container.appendChild(item);
  });
}


// ============================================
// MOBILE NAVIGATION
// ============================================

function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    toggle.classList.toggle('active');
  });

  // Close menu when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      toggle.classList.remove('active');
    });
  });
}


// ============================================
// SMOOTH SCROLL
// ============================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}


// ============================================
// SCROLL ANIMATIONS
// ============================================

function initScrollAnimations() {
  const sections = document.querySelectorAll('section');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  sections.forEach(section => {
    observer.observe(section);
  });
}


// ============================================
// INITIALIZE
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Start canvas animation
  new TensorNetworkAnimation('bg-canvas');

  // Render dynamic content
  renderHeroContent();
  renderResearchCards();
  renderPublications();
  renderTalks();

  // Initialize UI interactions
  initMobileNav();
  initSmoothScroll();
  initScrollAnimations();
});
