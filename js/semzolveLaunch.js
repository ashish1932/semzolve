/**
 * Semzolve Cinematic Company Launch Countdown & Official Brand Reveal
 * Features:
 * - Scene 1: The Introduction ("Something New Is Coming...") with ambient particles, dramatic lighting,
 *            and interactive "START COUNTDOWN ▶" button. Counter ONLY starts when button is clicked.
 * - Scene 2: Clean, dark ambient full-screen 3D countdown (10 to 1) with 3D numbers, logo pill, and telemetry.
 * - Scene 3: Official Brand Reveal with converging 4-product quad gallery, glowing Semzolve logo,
 *            "WE ARE OFFICIALLY LIVE", and corporate creed.
 * - Web Audio API procedural sound engine with sub-bass drone, countdown strikes, and climax boom.
 * - Skip Intro & Replay controls, responsive across desktop/tablet/mobile, reduced-motion accessible.
 */

(function (window, document) {
  'use strict';

  // Telemetry copy for each countdown strike (10 -> 1)
  const TELEMETRY_STEPS = {
    10: 'System Initialization',
    9: 'Calibrating Molecular Matrices',
    8: 'Direct Factory Network Link',
    7: 'Quality & GMP Protocols Armed',
    6: 'Global Logistics Grid Online',
    5: 'Catalytic Systems Primed',
    4: 'Synthesis Core Active',
    3: 'Final Verification Sequence',
    2: 'Preparing Brand Reveal',
    1: 'Launch Imminent'
  };

  /**
   * Procedural Audio Synthesizer (Web Audio API)
   * Generates cinematic sub-bass drone, countdown strikes, and climax impact.
   */
  class LaunchAudioSynthesizer {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
    }

    init() {
      if (this.ctx) return;
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      } catch (e) {
        console.warn('Web Audio not supported:', e);
      }
    }

    startDrone() {
      // Background hum/drone intentionally removed to eliminate background noise and audio distortion.
    }

    stopDrone() {
      // No-op
    }

    /**
     * Subtle, realistic acoustic clock ticking ("tick-tick") sound
     * Plays a crisp primary escapement tick followed by a soft mechanical rebound click.
     */
    playCountdownHit(val) {
      if (this.isMuted || !this.ctx) return;
      try {
        if (this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
        const now = this.ctx.currentTime;

        // 1. Primary clock tick ("tick")
        this.playSingleTick(now, 1820, 0.085, 0.026);

        // 2. Subtle rebound escapement click ("-tick") 65ms later
        this.playSingleTick(now + 0.065, 1260, 0.040, 0.018);
      } catch (e) {}
    }

    playSingleTick(time, freq, gainLevel, decayDuration) {
      if (!this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);
        osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq * 0.35), time + decayDuration);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(freq, time);
        filter.Q.setValueAtTime(4.2, time);

        gain.gain.setValueAtTime(gainLevel, time);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + decayDuration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(time);
        osc.stop(time + decayDuration + 0.01);
      } catch (e) {}
    }

    playClimaxBoom() {
      if (this.isMuted || !this.ctx) return;
      try {
        if (this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
        const now = this.ctx.currentTime;

        // Soft, gentle low support (warmth without distortion or harsh boom)
        const subOsc = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(96, now);
        subOsc.frequency.exponentialRampToValueAtTime(36, now + 0.8);

        subGain.gain.setValueAtTime(0.12, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

        subOsc.connect(subGain);
        subGain.connect(this.ctx.destination);
        subOsc.start(now);
        subOsc.stop(now + 0.95);

        // Elegant ascending shimmer chime chord
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const chimeOsc = this.ctx.createOscillator();
          const chimeGain = this.ctx.createGain();
          chimeOsc.type = 'sine';
          chimeOsc.frequency.setValueAtTime(freq, now + 0.04 * i);
          chimeGain.gain.setValueAtTime(0.001, now + 0.04 * i);
          chimeGain.gain.linearRampToValueAtTime(0.06, now + 0.04 * i + 0.03);
          chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2 + 0.1 * i);
          chimeOsc.connect(chimeGain);
          chimeGain.connect(this.ctx.destination);
          chimeOsc.start(now + 0.04 * i);
          chimeOsc.stop(now + 1.3 + 0.1 * i);
        });
      } catch (e) {}
    }

    toggleMute() {
      this.isMuted = !this.isMuted;
      return this.isMuted;
    }
  }

  class SemzolveLaunchController {
    constructor() {
      this.overlay = null;
      this.canvas = null;
      this.ctx = null;
      this.particles = [];
      this.shockwaves = [];
      this.warpStreaks = [];
      this.canvasMode = 'idle'; // Launch overlay is hidden by default
      this.animFrameId = null;
      this.timeline = null;
      this.hasSkipped = true; // Hidden by default, only shown when clicking "Launch"
      this.hasStarted = false;
      this.reducedMotion = false;
      this.isReplay = false;
      this.audio = new LaunchAudioSynthesizer();

      this.init();
    }

    init() {
      // Suppress legacy page intro so cinematic launch has full exclusive stage
      const oldIntro = document.getElementById('page-intro');
      if (oldIntro) {
        oldIntro.style.display = 'none';
        oldIntro.remove();
      }

      // Check reduced motion preference
      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Build DOM structure (hidden by default)
      this.buildDOM();

      // Setup Canvas
      this.setupCanvas();

      // Setup Keyboard & Event Listeners
      this.setupEvents();
    }

    buildDOM() {
      if (document.getElementById('semzolveLaunchOverlay')) {
        this.overlay = document.getElementById('semzolveLaunchOverlay');
        return;
      }

      const overlay = document.createElement('div');
      overlay.id = 'semzolveLaunchOverlay';
      overlay.className = 'semzolve-launch-overlay is-hidden';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-label', 'Semzolve Company Launch');
      overlay.style.display = 'none';
      overlay.style.opacity = '0';
      overlay.style.visibility = 'hidden';

      overlay.innerHTML = `
        <!-- Background Canvas for Cinematic Particles & Lighting -->
        <canvas class="launch-canvas" id="launchCanvas"></canvas>
        <div class="launch-vignette"></div>

        <!-- Cinematic Film Letterbox Bars -->
        <div class="launch-letterbox-top"></div>
        <div class="launch-letterbox-bottom"></div>

        <!-- Central Stage -->
        <div class="launch-stage" id="launchStage">
          <!-- Central Energy Core & Shockwave Elements -->
          <div class="launch-core-flash" id="launchCoreFlash"></div>
          <div class="launch-shockwave" id="launchShockwave"></div>

          <!-- ==============================================
               SCENE 1: THE INTRODUCTION
               "Something New Is Coming..." with Launch Button
               ============================================== -->
          <div class="launch-intro-stage" id="introStage">
            <div class="intro-kicker">✦ SEMZOLVE GLOBAL PREMIERE ✦</div>
            <div class="intro-logo-pill">
              <img src="images/semzolve-logo.png" alt="SEMZOLVE" class="intro-logo-img" />
            </div>
            <h1 class="intro-headline">
              Something New Is Coming<span class="intro-ellipsis">...</span>
            </h1>
            <p class="intro-subtext">
              The next era in specialty chemicals, precision molecular synthesis, and global manufacturing.
            </p>
            <div style="display: flex; align-items: center; justify-content: center; margin-top: 24px;">
              <button type="button" class="intro-launch-btn" id="introLaunchBtn" aria-label="Start Launch Countdown">
                <span class="btn-pulse-ring"></span>
                <span class="btn-icon">▶</span>
                <span class="btn-text">START COUNTDOWN</span>
              </button>
            </div>
          </div>

          <!-- ==============================================
               SCENE 2: CLEAN COUNTDOWN (10 TO 1)
               Only begins when user clicks the button
               ============================================== -->
          <div class="countdown-box" id="countdownBox" style="display: none; opacity: 0;">
            <div class="countdown-brand-header" id="countdownBrandHeader">
              <div class="countdown-logo-pill" id="countdownLogoPill">
                <img src="images/semzolve-logo.png" alt="SEMZOLVE" class="countdown-logo-img" />
              </div>
            </div>
            <div class="countdown-number" id="countdownNumber">10</div>
            <div class="countdown-telemetry" id="countdownTelemetry">
              <span id="telemetryText">System Initialization</span>
            </div>
          </div>

          <!-- ==============================================
               SCENE 3: FINAL REVEAL CLIMAX
               Converging Product Quad & Official Brand Reveal
               ============================================== -->
          <div class="launch-brand-stage" id="brandStage" style="visibility: hidden; opacity: 0;">
            <!-- Converging Product Quad Showcase -->
            <div class="converge-products-gallery" id="convergeGallery">
              <div class="converge-card card-flask">
                <img src="images/collage/collage-2-flask.jpg" alt="Synthesis Reagents" />
                <span>SYNTHESIS REAGENTS</span>
              </div>
              <div class="converge-card card-reactor">
                <img src="images/ind_intermediates.jpg" alt="High Purity Solvents" />
                <span>HIGH PURITY SOLVENTS</span>
              </div>
              <div class="converge-card card-tubes">
                <img src="images/collage/collage-3-tubes.jpg" alt="Pharma Intermediates" />
                <span>PHARMA INTERMEDIATES</span>
              </div>
              <div class="converge-card card-cosmetic">
                <img src="images/ind_personal_care.jpg" alt="Cosmeceuticals" />
                <span>COSMECEUTICALS</span>
              </div>
            </div>

            <!-- Official Semzolve Brand Climax Box -->
            <div class="brand-reveal-box" id="brandRevealBox">
              <div class="brand-kicker" id="brandKicker">✦ INTRODUCING SEMZOLVE ✦</div>
              <div class="brand-logo-glow-wrap" id="brandLogoGlowWrap">
                <div class="brand-logo-radial-aura" id="brandLogoAura"></div>
                <div class="brand-logo-ring" id="brandLogoRing"></div>
                <div class="brand-logo-pill" id="brandLogoPill">
                  <div class="brand-logo-sheen" id="brandLogoSheen"></div>
                  <img src="images/semzolve-logo.png" alt="SEMZOLVE Technologies" class="brand-logo-img" id="brandLogoImg" />
                </div>
              </div>
              <h1 class="brand-live-headline">WE ARE OFFICIALLY LIVE</h1>
              <h2 class="brand-live-creed">INNOVATION. TECHNOLOGY. POSSIBILITIES.</h2>
              <div class="brand-stats-row">
                <span>287+ Catalogue Chemicals</span>
                <span class="stat-sep">•</span>
                <span>2 Units + 25 Partner Plants</span>
                <span class="stat-sep">•</span>
                <span>15+ Export Nations</span>
                <span class="stat-sep">•</span>
                <span>9 Global Industries</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Progress Indicator -->
        <div class="launch-progress-wrap">
          <div class="launch-progress-bar" id="launchProgressBar"></div>
        </div>
      `;

      document.body.prepend(overlay);
      this.overlay = overlay;
    }

    setupCanvas() {
      this.canvas = document.getElementById('launchCanvas');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');

      const resize = () => {
        this.canvas.width = window.innerWidth * window.devicePixelRatio;
        this.canvas.height = window.innerHeight * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      };
      resize();
      window.addEventListener('resize', resize, { passive: true });

      // Initialize ambient particles
      const count = window.innerWidth < 768 ? 65 : 130;
      this.particles = [];
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          radius: Math.random() * 2 + 0.8,
          alpha: Math.random() * 0.6 + 0.2,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          color: Math.random() > 0.4 ? 'rgba(52, 211, 153, ' : 'rgba(5, 184, 251, '
        });
      }

      this.renderCanvas();
    }

    renderCanvas() {
      if (!this.ctx || !this.canvas) return;
      const w = window.innerWidth;
      const h = window.innerHeight;

      this.ctx.clearRect(0, 0, w, h);

      if (this.canvasMode === 'ambient') {
        // Draw floating glowing dust particles
        for (let p of this.particles) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = w;
          if (p.x > w) p.x = 0;
          if (p.y < 0) p.y = h;
          if (p.y > h) p.y = 0;

          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          this.ctx.fillStyle = p.color + p.alpha + ')';
          this.ctx.shadowBlur = 10;
          this.ctx.shadowColor = p.color + '0.8)';
          this.ctx.fill();
        }
      } else if (this.canvasMode === 'warp') {
        // Fast cinematic radial light streaks
        const cx = w / 2;
        const cy = h / 2;

        if (this.warpStreaks.length < 90) {
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * 60 + 20;
          this.warpStreaks.push({
            x: cx + Math.cos(angle) * dist,
            y: cy + Math.sin(angle) * dist,
            vx: Math.cos(angle) * (Math.random() * 16 + 12),
            vy: Math.sin(angle) * (Math.random() * 16 + 12),
            length: Math.random() * 60 + 30,
            alpha: 1
          });
        }

        for (let i = this.warpStreaks.length - 1; i >= 0; i--) {
          const s = this.warpStreaks[i];
          s.x += s.vx;
          s.y += s.vy;
          s.alpha -= 0.02;

          this.ctx.beginPath();
          this.ctx.moveTo(s.x, s.y);
          this.ctx.lineTo(s.x - s.vx * 2.2, s.y - s.vy * 2.2);
          this.ctx.strokeStyle = `rgba(52, 211, 153, ${Math.max(0, s.alpha)})`;
          this.ctx.lineWidth = 2.5;
          this.ctx.shadowBlur = 12;
          this.ctx.shadowColor = '#34D399';
          this.ctx.stroke();

          if (s.alpha <= 0) {
            this.warpStreaks.splice(i, 1);
          }
        }
      } else if (this.canvasMode === 'burst') {
        // Exploding starburst particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
          const p = this.particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.96;
          p.vy *= 0.96;
          p.alpha -= 0.012;

          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.radius * 1.5, 0, Math.PI * 2);
          this.ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, p.alpha)})`;
          this.ctx.shadowBlur = 16;
          this.ctx.shadowColor = '#38BDF8';
          this.ctx.fill();

          if (p.alpha <= 0) {
            this.particles.splice(i, 1);
          }
        }
      }

      this.animFrameId = requestAnimationFrame(() => this.renderCanvas());
    }

    setupEvents() {
      // Intro Launch button: start countdown
      const introLaunchBtn = document.getElementById('introLaunchBtn');
      if (introLaunchBtn) {
        introLaunchBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.startFromIntro();
        });
      }

      const skipBtn = document.getElementById('launchSkipBtn');
      if (skipBtn) {
        skipBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.skip();
        });
      }

      const directRevealBtn = document.getElementById('directRevealBtn');
      if (directRevealBtn) {
        directRevealBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.showDirectReveal();
        });
      }

      const audioBtn = document.getElementById('launchAudioBtn');
      if (audioBtn) {
        audioBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.audio.init();
          const isMuted = this.audio.toggleMute();
          const iconEl = document.getElementById('audioBtnIcon');
          const textEl = document.getElementById('audioBtnText');
          if (iconEl && textEl) {
            iconEl.textContent = isMuted ? '🔇' : '🔊';
            textEl.textContent = isMuted ? 'AUDIO OFF' : 'AUDIO ON';
          }
        });
      }

      // Keyboard Controls: Space or Enter starts the countdown
      window.addEventListener('keydown', (e) => {
        const isIntroActive = !this.hasStarted && !this.hasSkipped;
        const isSpaceOrEnter = e.code === 'Space' || e.key === ' ' || e.code === 'Enter' || e.key === 'Enter';

        if (isIntroActive && isSpaceOrEnter) {
          e.preventDefault();
          this.startFromIntro();
        } else if (e.key === 'Escape') {
          this.skip();
        }
      });

      // Hook up any replay triggers on the page (.btn-header-launch, .btn-replay-launch, .launch-replay-pill)
      document.querySelectorAll('.btn-header-launch, .btn-replay-launch, .launch-replay-pill, [data-launch-replay]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.replay();
        });
      });
    }

    /**
     * User clicks "START COUNTDOWN" button on Scene 1
     */
    startFromIntro() {
      if (this.hasStarted) return;
      this.hasStarted = true;

      // Start atmospheric sound
      this.audio.init();
      this.audio.startDrone();

      const introStage = document.getElementById('introStage');
      const countdownBox = document.getElementById('countdownBox');
      const gsapLib = window.gsap;

      this.triggerShockwave();

      if (gsapLib && !this.reducedMotion) {
        gsapLib.to(introStage, {
          scale: 1.06,
          opacity: 0,
          filter: 'blur(8px)',
          duration: 0.25,
          ease: 'power2.inOut',
          onComplete: () => {
            if (introStage) introStage.style.display = 'none';
            if (countdownBox) {
              countdownBox.style.display = 'flex';
              countdownBox.style.opacity = '1';
              countdownBox.style.visibility = 'visible';
            }
            this.startSequence();
          }
        });
      } else {
        if (introStage) introStage.style.display = 'none';
        if (countdownBox) {
          countdownBox.style.display = 'flex';
          countdownBox.style.opacity = '1';
          countdownBox.style.visibility = 'visible';
        }
        this.startSequence();
      }
    }

    triggerWarpMode() {
      this.canvasMode = 'warp';
      this.warpStreaks = [];
    }

    triggerBurstMode() {
      this.canvasMode = 'burst';
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      this.particles = [];
      for (let i = 0; i < 180; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 18 + 4;
        this.particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: Math.random() * 2.8 + 1,
          alpha: 1
        });
      }
    }

    triggerShockwave() {
      const shockwave = document.getElementById('launchShockwave');
      if (!shockwave || !window.gsap) return;

      window.gsap.fromTo(
        shockwave,
        { scale: 0.2, opacity: 0.9 },
        { scale: 2.8, opacity: 0, duration: 0.75, ease: 'power2.out' }
      );
    }

    /**
     * Build the Coordinated Countdown & Brand Reveal GSAP Timeline
     */

    showDirectReveal() {
      this.hasStarted = true;
      const introStage = document.getElementById('introStage');
      const countdownBox = document.getElementById('countdownBox');
      const brandStage = document.getElementById('brandStage');

      if (introStage) introStage.style.display = 'none';
      if (countdownBox) countdownBox.style.display = 'none';

      if (brandStage) {
        brandStage.style.visibility = 'visible';
        brandStage.style.opacity = '1';
        brandStage.style.display = 'flex';
      }

      const gsapLib = window.gsap;
      if (gsapLib && !this.reducedMotion) {
        gsapLib.fromTo(brandStage, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' });
      }
    }

    startSequence() {
      const gsapLib = window.gsap;
      const numEl = document.getElementById('countdownNumber');
      const telemEl = document.getElementById('telemetryText');
      const progressBar = document.getElementById('launchProgressBar');
      const countdownBox = document.getElementById('countdownBox');
      const brandStage = document.getElementById('brandStage');
      const coreFlash = document.getElementById('launchCoreFlash');
      const shockwaveEl = document.getElementById('launchShockwave');
      const convergeGallery = document.getElementById('convergeGallery');
      const brandRevealBox = document.getElementById('brandRevealBox');
      const brandKicker = document.getElementById('brandKicker');
      const brandLogoGlowWrap = document.getElementById('brandLogoGlowWrap');
      const brandLogoAura = document.getElementById('brandLogoAura');
      const brandLogoRing = document.getElementById('brandLogoRing');
      const brandLogoSheen = document.getElementById('brandLogoSheen');
      const brandLogoImg = document.getElementById('brandLogoImg');

      if (!gsapLib || this.reducedMotion) {
        this.runSimplifiedSequence();
        return;
      }

      this.timeline = gsapLib.timeline({
        onComplete: () => {
          this.revealWebsite();
        }
      });

      // Initial state
      this.timeline.set(brandStage, { visibility: 'hidden', opacity: 0 });

      // ==========================================
      // SCENE 2: COUNTDOWN FROM 10 TO 1
      // Clean background, 3D numbers, logo pill
      // Finishes in exactly 10.0 seconds
      // ==========================================
      const countDuration = 1.0; // exactly 1.0 second per number
      const numbers = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

      numbers.forEach((val, idx) => {
        const isLast = val === 1;
        const t = idx * countDuration;

        // Strike synchronization callback at exact time t (0s, 1s, 2s, ..., 9s)
        this.timeline.add(() => {
          if (this.hasSkipped) return;
          numEl.textContent = val;
          telemEl.textContent = TELEMETRY_STEPS[val] || '';
          this.triggerShockwave();
          this.audio.playCountdownHit(val);

          if (progressBar) {
            const pct = ((10 - val + 1) / 10) * 85;
            progressBar.style.width = pct + '%';
          }
        }, t);

        // 3D Number Entrance (scale down from depth with rotation)
        this.timeline.fromTo(
          numEl,
          {
            scale: 2.0,
            opacity: 0,
            rotationX: 18,
            z: -160,
            filter: 'blur(12px)'
          },
          {
            scale: 1,
            opacity: 1,
            rotationX: 0,
            z: 0,
            filter: 'blur(0px)',
            duration: 0.35,
            ease: 'power2.out'
          },
          t
        );

        // Hover dwell
        this.timeline.to(
          numEl,
          {
            scale: 0.95,
            duration: 0.4,
            ease: 'sine.inOut'
          },
          t + 0.35
        );

        // Number Exit (quick zoom forward into camera before next count)
        if (!isLast) {
          this.timeline.to(
            numEl,
            {
              scale: 0.72,
              opacity: 0,
              rotationX: -14,
              z: 80,
              filter: 'blur(6px)',
              duration: 0.22,
              ease: 'power2.in'
            },
            t + 0.75
          );
        }
      });

      // ==========================================
      // SCENE 3: BUILD-UP & CLIMAX AT EXACTLY 10.0 SECONDS
      // ==========================================
      const climaxTime = numbers.length * countDuration; // EXACTLY 10.0 seconds

      this.timeline.add(() => {
        if (this.hasSkipped) return;
        telemEl.textContent = 'IGNITION • BREACHING APEX';
        this.triggerWarpMode();
        this.audio.playClimaxBoom();
      }, climaxTime);

      // Quick zoom compression on "1" right at 10.0s
      this.timeline.to(
        numEl,
        {
          scale: 0.05,
          opacity: 0,
          filter: 'blur(20px)',
          duration: 0.3,
          ease: 'power4.in'
        },
        climaxTime
      );

      this.timeline.set(countdownBox, { display: 'none' }, climaxTime + 0.25);

      // Core light flash expansion and camera shake
      this.timeline.to(
        coreFlash,
        {
          opacity: 1,
          scale: 2.4,
          duration: 0.45,
          ease: 'power3.out'
        },
        climaxTime + 0.1
      );

      this.timeline.to(
        '#launchStage',
        {
          x: '+=7',
          y: '-=4',
          yoyo: true,
          repeat: 5,
          duration: 0.06,
          ease: 'rough'
        },
        climaxTime + 0.1
      );

      // Expanding Shockwave ring
      this.timeline.fromTo(
        shockwaveEl,
        { scale: 0.1, opacity: 1 },
        { scale: 3.8, opacity: 0, duration: 0.8, ease: 'expo.out' },
        climaxTime + 0.15
      );

      // Flash collapse into Logo Reveal
      this.timeline.to(
        coreFlash,
        {
          opacity: 0,
          scale: 4,
          duration: 0.4,
          ease: 'power2.in'
        },
        climaxTime + 0.45
      );

      // ==========================================
      // SCENE 4: FINAL REVEAL (PRODUCTS MONTAGE & BRAND CLIMAX)
      // ==========================================
      const revealTime = climaxTime + 0.4;

      this.timeline.add(() => {
        if (this.hasSkipped) return;
        this.triggerBurstMode();
        if (progressBar) progressBar.style.width = '100%';
      }, revealTime);

      this.timeline.set(brandStage, { visibility: 'visible', opacity: 1 }, revealTime);

      // 1. Converging Product Quad Showcase Gallery Entrance
      this.timeline.fromTo(
        convergeGallery,
        { scale: 0.72, opacity: 0, filter: 'blur(16px)' },
        { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.85, ease: 'power3.out' },
        revealTime
      );

      this.timeline.fromTo(
        '.converge-card',
        { scale: 0.82, y: 30, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
        revealTime + 0.1
      );

      // 2. Official Semzolve Brand Climax Box Reveal
      this.timeline.fromTo(
        brandRevealBox,
        { scale: 0.92, opacity: 0, y: 20, filter: 'blur(8px)' },
        { scale: 1, opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.75, ease: 'power3.out' },
        revealTime + 0.15
      );

      this.timeline.fromTo(
        brandKicker,
        { opacity: 0, y: 14, letterSpacing: '0.15em' },
        { opacity: 1, y: 0, letterSpacing: '0.38em', duration: 0.65, ease: 'power2.out' },
        revealTime + 0.2
      );

      // --- CINEMATIC 3D LOGO ANIMATION WITH TRANSITION ---
      // 1) Radial aura flare ignites behind logo
      this.timeline.fromTo(
        brandLogoAura,
        { scale: 0.15, opacity: 0 },
        { scale: 1.6, opacity: 0.95, duration: 0.7, ease: 'power3.out' },
        revealTime + 0.22
      );
      this.timeline.to(
        brandLogoAura,
        { scale: 1.05, opacity: 0.7, duration: 0.75, ease: 'power2.inOut' },
        revealTime + 0.92
      );

      // 2) Logo zooms forward from deep 3D perspective with rotation & optical blur resolving into focus
      this.timeline.fromTo(
        brandLogoGlowWrap,
        {
          scale: 0.15,
          opacity: 0,
          rotationY: -28,
          rotationX: 18,
          z: -320,
          filter: 'blur(18px) brightness(2.6)'
        },
        {
          scale: 1.12,
          opacity: 1,
          rotationY: 4,
          rotationX: -2,
          z: 40,
          filter: 'blur(0px) brightness(1.25)',
          duration: 0.8,
          ease: 'power3.out'
        },
        revealTime + 0.25
      );
      this.timeline.to(
        brandLogoGlowWrap,
        {
          scale: 1.0,
          rotationY: 0,
          rotationX: 0,
          z: 0,
          filter: 'brightness(1.0)',
          duration: 0.5,
          ease: 'power2.out'
        },
        revealTime + 1.05
      );

      // 3) Neon ring bursts outward as logo locks into position
      this.timeline.fromTo(
        brandLogoRing,
        { scale: 0.8, opacity: 1 },
        { scale: 2.4, opacity: 0, duration: 0.75, ease: 'expo.out' },
        revealTime + 0.45
      );

      // 4) High-gloss laser sheen sweeps across the logo glass capsule
      this.timeline.fromTo(
        brandLogoSheen,
        { transform: 'translateX(-150%) skewX(-20deg)' },
        { transform: 'translateX(250%) skewX(-20deg)', duration: 0.85, ease: 'power2.inOut' },
        revealTime + 0.55
      );

      // 5) Crisp micro-bounce on the logo emblem
      this.timeline.fromTo(
        brandLogoImg,
        { scale: 0.85 },
        { scale: 1.0, duration: 0.5, ease: 'back.out(2.2)' },
        revealTime + 0.58
      );

      this.timeline.fromTo(
        '.brand-live-headline',
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        revealTime + 0.5
      );

      this.timeline.fromTo(
        '.brand-live-creed',
        { opacity: 0, y: 15, letterSpacing: '0.15em' },
        { opacity: 1, y: 0, letterSpacing: '0.28em', duration: 0.7, ease: 'power2.out' },
        revealTime + 0.6
      );

      this.timeline.fromTo(
        '.brand-stats-row',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        revealTime + 0.7
      );

      // Hold Celebration (~3.2 seconds) before transitioning into website
      this.timeline.to({}, { duration: 3.2 }, revealTime + 0.8);
    }

    runSimplifiedSequence() {
      const numEl = document.getElementById('countdownNumber');
      const brandStage = document.getElementById('brandStage');
      const countdownBox = document.getElementById('countdownBox');

      let current = 10;
      const interval = setInterval(() => {
        if (this.hasSkipped) {
          clearInterval(interval);
          return;
        }
        current--;
        if (current >= 1) {
          if (numEl) numEl.textContent = current;
        } else {
          clearInterval(interval);
          if (countdownBox) countdownBox.style.display = 'none';
          if (brandStage) {
            brandStage.style.visibility = 'visible';
            brandStage.style.opacity = '1';
          }
          setTimeout(() => {
            this.revealWebsite();
          }, 3200);
        }
      }, 1000);
    }

    /**
     * Scene 5: Smoothly Transition into the Main Website
     */
    revealWebsite() {
      if (this.hasSkipped) return;
      this.hasSkipped = true;

      // Unlock document scrollbar when transitioning into website
      document.documentElement.classList.remove('launch-active');
      document.body.classList.remove('launch-active');

      this.audio.stopDrone();

      const overlay = this.overlay || document.getElementById('semzolveLaunchOverlay');
      if (!overlay) return;

      // Add curtain-open class to pull letterbox bars
      overlay.classList.add('curtain-open');

      const gsapLib = window.gsap;
      if (gsapLib && !this.reducedMotion) {
        gsapLib.to(overlay, {
          opacity: 0,
          duration: 0.9,
          ease: 'power2.inOut',
          onComplete: () => {
            overlay.classList.add('is-hidden');
            overlay.style.display = 'none';
            cancelAnimationFrame(this.animFrameId);
            this.canvasMode = 'idle';
          }
        });
      } else {
        overlay.classList.add('is-hidden');
        overlay.style.display = 'none';
        cancelAnimationFrame(this.animFrameId);
      }
    }

    /**
     * Instant Skip button trigger
     */
    skip() {
      this.hasSkipped = true;

      // Unlock document scrollbar
      document.documentElement.classList.remove('launch-active');
      document.body.classList.remove('launch-active');

      this.audio.stopDrone();
      if (this.timeline) {
        this.timeline.pause();
        this.timeline.kill();
      }

      const overlay = this.overlay || document.getElementById('semzolveLaunchOverlay');
      if (overlay) {
        overlay.classList.add('is-hidden');
        overlay.style.display = 'none';
      }
      cancelAnimationFrame(this.animFrameId);
      this.canvasMode = 'idle';
    }

    /**
     * Replay Launch Sequence (can be triggered by nav button or window.SemzolveLaunch.replay())
     */
    replay(autoStart = false) {
      this.hasSkipped = false;
      this.hasStarted = false;
      this.isReplay = true;

      // Reset scroll position to top
      window.scrollTo(0, 0);

      // Kill any active GSAP timelines or tweens
      if (this.timeline) {
        this.timeline.pause(0);
        this.timeline.kill();
        this.timeline = null;
      }
      if (window.gsap) {
        window.gsap.killTweensOf('#launchStage, #introStage, #countdownBox, #brandStage, #countdownNumber, #brandLogoGlowWrap');
        window.gsap.set('#introStage', { clearProps: 'all' });
      }

      // Re-lock document scrollbar
      document.documentElement.classList.add('launch-active');
      document.body.classList.add('launch-active');

      const overlay = this.overlay || document.getElementById('semzolveLaunchOverlay');
      if (!overlay) return;

      overlay.classList.remove('is-hidden');
      overlay.classList.remove('curtain-open');
      overlay.style.display = 'flex';
      overlay.style.opacity = '1';
      overlay.style.visibility = 'visible';

      const introStage = document.getElementById('introStage');
      const countdownBox = document.getElementById('countdownBox');
      const brandStage = document.getElementById('brandStage');

      if (introStage) {
        introStage.style.display = 'flex';
        introStage.style.opacity = '1';
        introStage.style.visibility = 'visible';
        introStage.style.filter = 'none';
        introStage.style.transform = 'none';
      }
      if (countdownBox) {
        countdownBox.style.display = 'none';
        countdownBox.style.opacity = '0';
      }
      if (brandStage) {
        brandStage.style.visibility = 'hidden';
        brandStage.style.opacity = '0';
      }

      const progressBar = document.getElementById('launchProgressBar');
      if (progressBar) progressBar.style.width = '0%';

      this.canvasMode = 'ambient';
      cancelAnimationFrame(this.animFrameId);
      this.renderCanvas();

      // Countdown will NOT start automatically; user chooses when to start or skip.
    }
  }

  function initLaunch() {
    window.SemzolveLaunch = {
      instance: new SemzolveLaunchController(),
      replay: function (autoStart = false) {
        if (this.instance) this.instance.replay(autoStart);
      },
      skip: function () {
        if (this.instance) this.instance.skip();
      }
    };

    window.triggerSemzolveLaunch = function() {
      if (window.SemzolveLaunch && typeof window.SemzolveLaunch.replay === 'function') {
        window.SemzolveLaunch.replay(false);
      } else {
        window.location.href = 'index.html?launch=preview';
      }
    };

    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('launch') === 'true' || urlParams.get('launch') === '1') {
        setTimeout(() => {
          if (window.SemzolveLaunch) window.SemzolveLaunch.replay(true);
        }, 400);
      }
    } catch (e) {}
  }

  // Pre-define trigger immediately
  if (typeof window.triggerSemzolveLaunch === 'undefined') {
    window.triggerSemzolveLaunch = function() {
      if (window.SemzolveLaunch && typeof window.SemzolveLaunch.replay === 'function') {
        window.SemzolveLaunch.replay(false);
      } else {
        window.location.href = 'index.html?launch=preview';
      }
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLaunch);
  } else {
    initLaunch();
  }
})(window, document);
