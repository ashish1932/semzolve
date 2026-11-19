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
      const isHidden = (function() {
        try { return localStorage.getItem('semzolve_launch_btn_hidden') === '1'; } catch (e) { return false; }
      })();

      document.querySelectorAll('.btn-header-launch, .btn-replay-launch, .launch-replay-pill, [data-launch-replay]').forEach((btn) => {
        if (isHidden) {
          const wrap = btn.closest('.header-launch-wrap') || btn.closest('.footer-launch-pill-wrap') || btn;
          wrap.classList.add('is-hidden');
          if (wrap !== btn) wrap.style.display = 'none';
          else btn.style.display = 'none';
        }

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


/**
 * Semzolve AI Assistant - Global Floating Widget
 * Enables interactive chemical inquiries, specification checks, and quote generation across all site pages.
 */
(function() {
  if (window.__SEMZOLVE_ASK_AI_INITIALIZED__) return;
  window.__SEMZOLVE_ASK_AI_INITIALIZED__ = true;

  // 1. Inject Styles if not already loaded
  if (!document.getElementById('semzolveAskAiStyles')) {
    const st = document.createElement('style');
    st.id = 'semzolveAskAiStyles';
    st.textContent = `
      .fab {
        position: fixed !important;
        right: clamp(16px, 2.5vw, 32px) !important;
        bottom: clamp(16px, 2.5vw, 32px) !important;
        z-index: 9999 !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 10px !important;
        padding: 12px 20px 12px 14px !important;
        border-radius: 999px !important;
        border: 1px solid rgba(228, 246, 254, 0.2) !important;
        cursor: pointer !important;
        background: #030A24 !important;
        color: #F4F8FB !important;
        font-family: 'Schibsted Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        font-size: 14px !important;
        font-weight: 600 !important;
        box-shadow: 0 14px 40px -12px rgba(5, 22, 15, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.1) inset !important;
        transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, opacity 0.3s ease !important;
        opacity: 1 !important;
        pointer-events: auto !important;
        visibility: visible !important;
        transform: translateY(0) scale(1) !important;
      }
      .fab:hover {
        transform: translateY(-2px) scale(1.02) !important;
        box-shadow: 0 18px 48px -10px rgba(5, 22, 15, 0.9), 0 0 0 1px #05B8FB inset !important;
      }
      .fab .dot {
        width: 28px !important;
        height: 28px !important;
        border-radius: 50% !important;
        background: conic-gradient(from 0deg, #34D6A3, #05B8FB, #34D6A3) !important;
        display: grid !important;
        place-items: center !important;
        color: #030A24 !important;
        font-size: 13px !important;
        font-weight: 800 !important;
        animation: rotateGlow 6s linear infinite !important;
      }
      @keyframes rotateGlow {
        100% { transform: rotate(360deg); }
      }
      .fab[hidden], .chat[hidden] {
        display: none !important;
      }
      .chat {
        position: fixed !important;
        right: clamp(16px, 2.5vw, 32px) !important;
        bottom: clamp(16px, 2.5vw, 32px) !important;
        z-index: 10001 !important;
        width: min(420px, calc(100vw - 32px)) !important;
        height: min(620px, calc(100vh - 100px)) !important;
        background: #FFFFFF !important;
        border: 1px solid #D7E3ED !important;
        border-radius: 22px !important;
        box-shadow: 0 30px 80px -20px rgba(5, 22, 15, 0.5), 0 0 0 1px rgba(0, 0, 0, 0.06) !important;
        display: flex !important;
        flex-direction: column !important;
        overflow: hidden !important;
        transform-origin: bottom right !important;
        animation: popChat 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
        font-family: 'Schibsted Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      }
      @keyframes popChat {
        from { opacity: 0; transform: scale(0.95) translateY(12px); }
        to { opacity: 1; transform: scale(1) translateY(0); }
      }
      .chat .ch {
        display: flex !important;
        align-items: center !important;
        gap: 12px !important;
        padding: 14px 18px !important;
        background: #030A24 !important;
        color: #F4F8FB !important;
        border-bottom: 1px solid rgba(228, 246, 254, 0.16) !important;
      }
      .chat .ch .dot {
        width: 32px !important;
        height: 32px !important;
        border-radius: 50% !important;
        background: conic-gradient(from 0deg, #34D6A3, #05B8FB, #34D6A3) !important;
        display: grid !important;
        place-items: center !important;
        color: #030A24 !important;
        font-weight: 800 !important;
        font-size: 14px !important;
        flex: none !important;
      }
      .chat .ch b {
        display: block !important;
        font-size: 15px !important;
        font-weight: 700 !important;
        color: #FFFFFF !important;
        letter-spacing: -0.01em !important;
      }
      .chat .ch small {
        display: flex !important;
        align-items: center !important;
        gap: 6px !important;
        font-size: 11.5px !important;
        color: #94A3B8 !important;
      }
      .chat .ch small i {
        width: 7px !important;
        height: 7px !important;
        border-radius: 50% !important;
        background: #34D6A3 !important;
        box-shadow: 0 0 6px #34D6A3 !important;
      }
      .chat .ch button {
        margin-left: auto !important;
        background: transparent !important;
        border: 0 !important;
        color: #F4F8FB !important;
        cursor: pointer !important;
        width: 32px !important;
        height: 32px !important;
        border-radius: 8px !important;
        font-size: 22px !important;
        line-height: 1 !important;
        display: grid !important;
        place-items: center !important;
        transition: background 0.15s ease !important;
      }
      .chat .ch button:hover {
        background: rgba(255, 255, 255, 0.1) !important;
      }
      .msgs {
        flex: 1 !important;
        overflow-y: auto !important;
        padding: 16px !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 12px !important;
        background: #F4F8FB !important;
      }
      .m {
        max-width: 90% !important;
        padding: 11px 15px !important;
        border-radius: 16px !important;
        font-size: 14px !important;
        line-height: 1.5 !important;
        overflow-wrap: anywhere !important;
      }
      .m.u {
        align-self: flex-end !important;
        background: #061649 !important;
        color: #F4F8FB !important;
        border-bottom-right-radius: 4px !important;
      }
      .m.a {
        align-self: flex-start !important;
        background: #FFFFFF !important;
        border: 1px solid #D7E3ED !important;
        color: #061649 !important;
        border-bottom-left-radius: 4px !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04) !important;
      }
      .m.a p { margin: 0 0 8px 0 !important; }
      .m.a p:last-child { margin: 0 !important; }
      .m.a ul { margin: 4px 0 6px 18px !important; padding: 0 !important; }
      .m.a li { margin-bottom: 3px !important; }
      .m.a b { color: #05B8FB !important; font-weight: 700 !important; }
      .pc { display: grid !important; gap: 8px !important; margin-top: 10px !important; }
      .pc > div {
        display: grid !important;
        grid-template-columns: 1fr auto !important;
        gap: 4px 10px !important;
        align-items: center !important;
        border: 1px solid #D7E3ED !important;
        border-radius: 12px !important;
        padding: 10px 12px !important;
        background: #F4F8FB !important;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03) !important;
      }
      .pc b { font-size: 13.5px !important; font-weight: 700 !important; color: #061649 !important; }
      .pc span { font-size: 12px !important; color: #55657F !important; grid-column: 1 !important; }
      .pc .add {
        grid-row: 1 / span 2 !important;
        grid-column: 2 !important;
        padding: 6px 12px !important;
        font-size: 12px !important;
        font-weight: 600 !important;
        border-radius: 99px !important;
        border: 1px solid #05B8FB !important;
        color: #05B8FB !important;
        background: transparent !important;
        cursor: pointer !important;
        transition: all 0.15s ease !important;
        white-space: nowrap !important;
      }
      .pc .add:hover, .pc .add.added {
        background: #05B8FB !important;
        color: #ffffff !important;
      }
      .qs {
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 6px !important;
        padding: 0 16px 12px !important;
        background: #F4F8FB !important;
      }
      .qs button {
        font-family: inherit !important;
        font-size: 12.5px !important;
        font-weight: 500 !important;
        border: 1px solid #D7E3ED !important;
        background: #FFFFFF !important;
        color: #061649 !important;
        border-radius: 99px !important;
        padding: 6px 12px !important;
        cursor: pointer !important;
        transition: all 0.15s ease !important;
      }
      .qs button:hover {
        border-color: #05B8FB !important;
        color: #0369A1 !important;
        background: #E4F6FE !important;
      }
      .cin {
        display: flex !important;
        gap: 8px !important;
        padding: 12px 14px !important;
        border-top: 1px solid #D7E3ED !important;
        background: #FFFFFF !important;
      }
      .cin input {
        flex: 1 !important;
        min-width: 0 !important;
        font-family: inherit !important;
        font-size: 14px !important;
        color: #061649 !important;
        background: #F4F8FB !important;
        border: 1px solid #D7E3ED !important;
        border-radius: 999px !important;
        padding: 10px 16px !important;
      }
      .cin input:focus {
        outline: none !important;
        border-color: #05B8FB !important;
      }
      .cin button {
        flex: none !important;
        width: 40px !important;
        height: 40px !important;
        border-radius: 50% !important;
        border: 0 !important;
        background: #05B8FB !important;
        color: #ffffff !important;
        display: grid !important;
        place-items: center !important;
        cursor: pointer !important;
        transition: background 0.15s ease, transform 0.15s ease !important;
      }
      .cin button:hover {
        background: #0369A1 !important;
        transform: scale(1.05) !important;
      }
      .cfoot {
        font-size: 11px !important;
        color: #55657F !important;
        text-align: center !important;
        padding: 0 12px 10px !important;
        background: #FFFFFF !important;
      }
      .toast-pill {
        position: fixed !important;
        left: 50% !important;
        bottom: calc(24px + env(safe-area-inset-bottom, 0px)) !important;
        transform: translateX(-50%) translateY(20px) !important;
        opacity: 0 !important;
        pointer-events: none !important;
        background: #030A24 !important;
        color: #ffffff !important;
        padding: 12px 22px !important;
        border-radius: 999px !important;
        font-family: inherit !important;
        font-weight: 600 !important;
        font-size: 14px !important;
        box-shadow: 0 16px 40px -8px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.12) !important;
        z-index: 10002 !important;
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
      }
      .toast-pill.show {
        transform: translateX(-50%) translateY(0) !important;
        opacity: 1 !important;
        pointer-events: auto !important;
      }
      .toast-pill a {
        color: #05B8FB !important;
        text-decoration: underline !important;
        font-weight: 700 !important;
      }
      body:has(#chatFab:not([hidden])) .floating-back-to-top,
      body:has(.fab:not([hidden])) .floating-back-to-top,
      body.has-chat-fab .floating-back-to-top {
        bottom: clamp(76px, calc(2.5vw + 58px), 94px) !important;
      }
      body:has(.chat:not([hidden])) .floating-back-to-top {
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(st);
  }

  // 2. Chemical Catalog Data
  const CATALOG = {"cats": ["Speciality Solvents & Glycol Esters", "Petrochemicals & Solvents", "Pharma & Agrochem Intermediates", "Industrial Chemicals, Plasticizers & Acids", "Cosmetic Ingredients & Perfumery Chemicals", "Emulsions, Construction Chemicals & Additives (BASF)"], "cos": [], "rows": [["Methanol", "67-56-1", 1, 0, "Feedstock for formaldehyde, acetic acid, biodiesel; industrial solvent", "CH4O", 32.04, "", "", "Methyl alcohol | Wood alcohol | Carbinol"], ["Methoxypropyl Acetate", "108-65-6", 0, 0, "Coating industry", "C6H12O3", 132.16, "", "", "PGMEA | Propylene glycol methyl ether acetate | 1-Methoxy-2-propyl acetate | PMA"], ["n-Butyl Acetate", "123-86-4", 0, 0, "Paint industry", "C6H12O2", 116.16, "", "", "n-Butyl acetate | Butyl acetate | Butyl ethanoate"], ["Ethyl Acetate", "141-78-6", 1, 0, "Solvent for glues, inks, paints, nail-polish remover; decaffeination", "C4H8O2", 88.11, "", "", "Ethyl acetate | Ethyl ethanoate | EtOAc"], ["1,3-Cyclohexanedione", "504-02-9", 2, 0, "Carvedilol, ondansetron, mesotrione, tembotrione, sulcotrione and other triketone herbicides, nitisinone", "C6H8O2", 112.13, "", "", "Cyclohexane-1,3-dione | Dihydroresorcinol | 1,3-CHD"], ["Acetic Acid", "64-19-7", 3, 0, "Feedstock for VAM, esters, PTA, acetic anhydride", "C2H4O2", 60.05, "", "", "Acetic acid | Glacial acetic acid | Ethanoic acid"], ["Normal Butanol", "71-36-3", 1, 0, "Feedstock for butyl acrylate, butyl acetate, glycol ethers; solvent", "C4H10O", 74.12, "", "", "n-Butanol | 1-Butanol | Butyl alcohol"], ["Propylene Glycol IP / FFG", "57-55-6", 1, 0, "Unsaturated polyester resins, antifreeze, food/pharma excipient (USP)", "C3H8O2", 76.09, "", "", "Propylene glycol | Propane-1,2-diol | MPG"], ["Cyclohexanone", "108-94-1", 1, 0, "Caprolactam/nylon 6 feedstock; solvent for PVC and coatings", "C6H10O", 98.14, "", "", "Anone"], ["(R)-(-)-5-(2-Aminopropyl)-2-Methoxybenzene Sulfonamide", "112101-81-2", 2, 0, "Tamsulosin", "C10H16N2O3S", 244.31, "", "", ""], ["(S)-1-Phenyl-1,2,3,4-Tetrahydroisoquinoline", "118864-75-8", 2, 0, "Solifenacin succinate", "C15H15N", 209.29, "", "", ""], ["1,2,3,9-Tetrahydro-4H-Carbazol-4-one", "15128-52-6", 2, 0, "Carvedilol", "C12H11NO", 185.23, "", "", ""], ["1,2,3,9-Tetrahydro-9-Methyl-4H-Carbazol-4-one", "27387-31-1", 2, 0, "Ondansetron", "C13H13NO", 199.25, "", "", ""], ["1,4-Cyclohexanedione", "637-88-7", 2, 0, "Frovatriptan, delamanid", "C6H8O2", 112.13, "", "", ""], ["1,4-Cyclohexanedione Monoethylene Acetal", "4746-97-8", 2, 0, "Liquid-crystal materials, insecticides", "C8H12O3", 156.18, "", "", ""], ["2,4-Thiazolidinedione", "2295-31-0", 2, 0, "Pioglitazone, rosiglitazone, troglitazone", "C3H3NO2S", 117.12, "", "", ""], ["4-(2,3-Epoxypropoxy)Carbazole", "51997-51-4", 2, 0, "Carvedilol", "C15H13NO2", 239.27, "", "", ""], ["4-(4-Methylpiperazinomethyl)Benzoic Acid Dihydrochloride", "106261-49-8", 2, 0, "Imatinib", "C13H20Cl2N2O2", 307.22, "", "", ""], ["4-(Methylamino)-3-Nitrobenzoic Acid Hydrochloride", "41263-74-5", 2, 0, "Dabigatran", "", 0, "", "", ""], ["4-Bromo-1-Chloro-2-(4-Ethoxybenzyl)Benzene", "461432-23-5", 2, 0, "Dapagliflozin", "C15H14BrClO", 325.63, "", "", ""], ["4-Hydroxycarbazole", "52602-39-8", 2, 0, "Carvedilol", "C12H9NO", 183.21, "", "", ""], ["4-Methylcyclohexanone", "589-92-4", 2, 0, "Glimepiride", "C7H12O", 112.17, "", "", ""], ["Benzalkonium Chloride 50%", "8001-54-5", 2, 0, "Preservative, disinfectant, antibacterial", "", 0, "", "", ""], ["Benzalkonium Chloride 80%", "8001-54-5", 2, 0, "Preservative, disinfectant, antibacterial", "", 0, "", "", ""], ["Benzalkonium Chloride Powder", "8001-54-5", 2, 0, "Antibacterial", "", 0, "", "", ""], ["Benzalkonium Chloride Solution 50% IP", "8001-54-5", 2, 0, "Preservative", "", 0, "", "", ""], ["Ethyl 3-(2-Pyridylamino)Propionate", "103041-38-9", 2, 0, "Dabigatran", "C10H14N2O2", 194.23, "", "", ""], ["Ethyl 3-[3-Amino-4-(Methylamino)-N-(2-Pyridyl)Benzamido]Propionate", "212322-56-0", 2, 0, "Dabigatran", "C18H22N4O3", 342.4, "", "", ""], ["Ethyl Isonipecotate", "1126-09-6", 2, 0, "Solifenacin, tamsulosin, avatrombopag, umeclidinium, fexofenadine, bilastine, efinaconazole, donepezil", "C8H15NO2", 157.21, "", "", ""], ["N-(5-Amino-2-Methylphenyl)-4-(3-Pyridyl)-2-Pyrimidineamine", "152460-10-1", 2, 0, "Imatinib", "C16H15N5", 277.33, "", "", ""], ["Trans-4-Methylcyclohexylamine Hydrochloride", "33483-65-7", 2, 0, "Glimepiride", "C7H16ClN", 149.66, "", "", ""], ["2-Ethylhexyl Acetate", "103-09-3", 0, 0, "Leather chemicals", "C10H20O2", 172.27, "", "", ""], ["Butyl Diglycol Acetate", "124-17-4", 0, 0, "Coil coating", "C10H20O4", 204.27, "", "", ""], ["Butyl Glycol Acetate", "112-07-2", 0, 0, "Automotive coatings", "C8H16O3", 160.21, "", "", ""], ["Dipropylene Glycol Monomethyl Ether Acetate", "88917-22-0", 0, 0, "Fragrance industry", "C9H18O4", 190.24, "", "", ""], ["Ethoxypropyl Acetate", "54839-24-6", 0, 0, "", "C7H14O3", 146.19, "", "", ""], ["Ethyl Diglycol Acetate", "112-15-2", 0, 0, "Paint industry", "C8H16O4", 176.21, "", "", ""], ["Ethyl Ethoxypropionate", "763-69-9", 0, 0, "Coating industry", "C7H14O3", 146.19, "", "", ""], ["Ethyl Glycol Acetate", "111-15-9", 0, 0, "Paint industry", "C6H12O3", 132.16, "", "", ""], ["Ethylene Glycol Diacetate", "111-55-7", 0, 0, "Foundry chemicals", "C6H10O4", 146.14, "", "", ""], ["Ethylene Glycol Dipropionate", "123-80-8", 0, 0, "", "C8H14O4", 174.2, "", "", ""], ["Isoamyl Acetate", "123-92-2", 0, 0, "Coating industry", "C7H14O2", 130.19, "", "", ""], ["Isobutyl Acetate", "110-19-0", 0, 0, "Paint industry", "C6H12O2", 116.16, "", "", ""], ["Isobutyl Propionate", "540-42-1", 0, 0, "Coating industry", "C7H14O2", 130.19, "", "", ""], ["Isopropyl Acetate", "108-21-4", 0, 0, "Pharma, paint industry", "C5H10O2", 102.13, "", "", ""], ["N Pentyl Acetate", "628-63-7", 0, 0, "Coating industry", "C7H14O2", 130.19, "", "", ""], ["n-Butyl Propionate", "590-01-2", 0, 0, "Coating industry", "C7H14O2", 130.19, "", "", ""], ["n-Pentyl Propionate", "624-54-4", 0, 0, "Coating industry", "C8H16O2", 144.21, "", "", ""], ["n-Propyl Propionate", "106-36-5", 0, 0, "Coating industry", "C6H12O2", 116.16, "", "", ""], ["Propylene Glycol Diacetate", "623-84-7", 0, 0, "Coating industry", "C7H12O4", 160.17, "", "", ""], ["Propylene Glycol Monomethyl Ether Propionate", "148462-57-1", 0, 0, "Coating industry", "C7H14O3", 146.19, "", "", ""], ["Triacetin", "102-76-1", 0, 0, "Foundry chemicals", "C9H14O6", 218.2, "", "", ""], ["Diacetone Alcohol", "123-42-2", 1, 0, "", "C6H12O2", 116.16, "", "", ""], ["Dibasic Ester (DBE)", "1119-40-0", 1, 0, "", "C7H12O4", 160.17, "", "", ""], ["Isobutyl Alcohol", "78-83-1", 1, 0, "", "C4H10O", 74.12, "", "", ""], ["Isophorone", "78-59-1", 1, 0, "", "C9H14O", 138.21, "", "", ""], ["Methyl Propyl Ketone (MPK)", "107-87-9", 1, 0, "", "C5H10O", 86.13, "", "", ""], ["Mixed Xylene", "1330-20-7", 1, 0, "", "C8H10", 106.17, "", "", ""], ["Ortho Xylene", "95-47-6", 1, 0, "", "C8H10", 106.17, "", "", ""], ["Phenol", "108-95-2", 1, 0, "", "C6H6O", 94.11, "", "", ""], ["2,4-Diaminopyrimidine-3-N-Oxide Monohydrate", "1189096-02-3", 4, 0, "Hair growth", "C4H8N4O2", 144.13, "", "", ""], ["2-Methylcyclohexanol", "583-59-5", 4, 0, "Perfumery", "C7H14O", 114.19, "", "", ""], ["4-Hexylresorcinol", "136-77-6", 4, 0, "Skin whitening", "C12H18O2", 194.27, "", "", ""], ["4-Methylcyclohexanol", "589-91-3", 4, 0, "Perfumery", "C7H14O", 114.19, "", "", ""], ["4-n-Butylresorcinol", "18979-61-8", 4, 0, "Skin whitening", "C10H14O2", 166.22, "", "", ""], ["Coleus Forskohlii Extract 10%", "66575-29-9", 4, 0, "Nutraceutical, weight management", "", 0, "", "", ""], ["Coleus Forskohlii Extract 20%", "66575-29-9", 4, 0, "Nutraceutical, weight management", "", 0, "", "", ""], ["Coleus Forskohlii Extract 40%", "66575-29-9", 4, 0, "Nutraceutical, weight management", "", 0, "", "", ""], ["Curcumin 98%", "458-37-7", 4, 0, "Nutraceutical, antioxidant", "C21H20O6", 368.38, "", "", ""], ["Curcuminoids 95%", "8024-37-1", 4, 0, "Nutraceutical, antioxidant", "", 0, "", "", ""], ["Ethylhexyl Triazone", "88122-99-0", 4, 0, "Sunscreen UV-B filter", "C48H66N6O6", 823.09, "", "", ""], ["Forskolin 98%", "66575-29-9", 4, 0, "Nutraceutical, weight management", "", 0, "", "", ""], ["Iscotrizinol", "154702-15-5", 4, 0, "UV filter, sun care", "", 0, "", "", ""], ["Piperine 95%", "94-62-2", 4, 0, "Bioavailability enhancer", "C17H19NO3", 285.34, "", "", ""], ["Piroctone Olamine", "68890-66-4", 4, 0, "Anti-dandruff", "C16H30N2O3", 298.43, "", "", ""], ["Tetrahydrocurcumin", "36062-04-1", 4, 0, "Antiseptic, skin care", "C21H24O6", 372.42, "", "", ""], ["Tetrahydropiperine", "23434-88-0", 4, 0, "Anti-acne", "C17H23NO3", 289.38, "", "", ""], ["Acrylamide", "79-06-1", 3, 0, "", "C3H5NO", 71.08, "", "", ""], ["Adipic Acid", "124-04-9", 3, 0, "", "C6H10O4", 146.14, "", "", ""], ["Alpha Olefin Sulphonate (AOS)", "93686-14-7", 3, 0, "", "", 0, "", "", ""], ["Alphox 100 & 200", "9016-45-9", 3, 0, "", "", 0, "", "R", ""], ["Alum", "7784-24-9", 3, 0, "", "AlH24KO20S2", 474.37, "", "", ""], ["Aluminium Stearate (HI Grade)", "637-12-7", 3, 0, "", "", 0, "", "", ""], ["Ammonium Benzoate", "1863-63-4", 3, 0, "", "C7H9NO2", 139.15, "", "", ""], ["Ammonium Bicarbonate", "1066-33-7", 3, 0, "", "CH5NO3", 79.06, "", "", ""], ["Ammonium Chloride", "12125-02-9", 3, 0, "", "ClH4N", 53.49, "", "", ""], ["Ammonium Persulphate", "7727-54-0", 3, 0, "", "H8N2O8S2", 228.19, "", "", ""], ["Amyl Acetate", "628-63-7", 3, 0, "", "C7H14O2", 130.19, "", "", ""], ["Bentec ED-11", "14808-60-7", 3, 0, "", "", 0, "", "", ""], ["Bentec P2", "14808-60-7", 3, 0, "", "", 0, "", "", ""], ["Bentec PLB", "14808-60-7", 3, 0, "", "", 0, "", "", ""], ["Bentec PLC", "14808-60-7", 3, 0, "", "", 0, "", "", ""], ["Bentonite", "1302-78-9", 3, 0, "", "", 0, "", "", ""], ["Benzoic Acid", "65-85-0", 3, 0, "", "C7H6O2", 122.12, "", "", ""], ["Benzotriazole", "95-14-7", 3, 0, "", "C6H5N3", 119.13, "", "", ""], ["Benzyl Alcohol", "100-51-6", 3, 0, "", "C7H8O", 108.14, "", "", ""], ["BHT & BHA", "128-37-0", 3, 0, "", "C15H24O", 220.36, "", "", ""], ["Borax", "1303-96-4", 3, 0, "", "B4H20Na2O17", 381.36, "", "", ""], ["Boric Acid", "10043-35-3", 3, 0, "", "BH3O3", 61.83, "", "", ""], ["Butyl Cellosolve", "111-76-2", 3, 0, "", "C6H14O2", 118.18, "", "", ""], ["Cabosil", "112945-52-5", 3, 0, "", "O2Si", 60.08, "", "", ""], ["Calcium Carbonate (All Grades)", "471-34-1", 3, 0, "", "CCaO3", 100.09, "", "", ""], ["Calcium Chloride (All Grades)", "10043-52-4", 3, 0, "", "CaCl2", 110.98, "", "", ""], ["Calcium Chloride Lye", "10043-52-4", 3, 0, "", "CaCl2", 110.98, "", "", ""], ["Calcium Stearate", "1592-23-0", 3, 0, "", "", 0, "", "", ""], ["Carboxymethyl Cellulose (CMC)", "9004-32-4", 3, 0, "", "", 0, "", "", ""], ["Castrox 200", "111-46-6", 3, 0, "", "", 0, "", "", ""], ["Caustic Potash", "1310-58-3", 3, 0, "", "HKO", 56.11, "", "", ""], ["Caustic Soda", "1310-73-2", 3, 0, "", "HNaO", 40, "", "", ""], ["Caustic Soda Lye", "1310-73-2", 3, 0, "", "HNaO", 40, "", "", ""], ["China Clay", "1332-58-7", 3, 0, "", "Al2H4O9Si2", 258.16, "", "", ""], ["Chloroform", "67-66-3", 3, 0, "", "CHCl3", 119.37, "", "R", ""], ["Citric Acid (Anhydrous & Monohydrate)", "77-92-9", 3, 0, "", "C6H8O7", 192.12, "", "", ""], ["Copper Carbonate", "1184-64-1", 3, 0, "", "CH2Cu2O5", 221.11, "", "", ""], ["Cyclohexane", "110-82-7", 3, 0, "", "C6H12", 84.16, "", "", ""], ["Dextrose Monohydrate", "5996-10-1", 3, 0, "", "C6H14O7", 198.17, "", "", ""], ["Diammonium Phosphate", "7783-28-0", 3, 0, "", "H9N2O4P", 132.06, "", "", ""], ["Dibutyl Phthalate", "84-74-2", 3, 0, "", "C16H22O4", 278.35, "", "R", ""], ["Diethyl Phthalate", "84-66-2", 3, 0, "", "C12H14O4", 222.24, "", "", ""], ["Diethylene Glycol", "111-46-6", 3, 0, "", "C4H10O3", 106.12, "", "", ""], ["Diisopropyl Ether", "108-20-3", 3, 0, "", "C6H14O", 102.18, "", "", ""], ["Dimethyl Sulphoxide", "67-68-5", 3, 0, "", "C2H6OS", 78.13, "", "", ""], ["Dimethylaminoethanol", "108-01-0", 3, 0, "", "C4H11NO", 89.14, "", "", ""], ["Dimethylformamide", "68-12-2", 3, 0, "", "C3H7NO", 73.09, "", "", ""], ["Dioctyl Phthalate (DOP)", "117-81-7", 3, 0, "", "C24H38O4", 390.56, "", "R", ""], ["Dipentene (Camphane, Heavy & Normal)", "138-86-3", 3, 0, "", "C10H16", 136.24, "", "", ""], ["Dipropylene Glycol", "25265-71-8", 3, 0, "", "C6H14O3", 134.18, "", "", ""], ["DMP", "87413-09-0", 3, 0, "", "", 0, "", "", ""], ["EDTA Disodium", "6381-92-6", 3, 0, "", "", 0, "", "", ""], ["EDTA Tetrasodium", "13235-36-4", 3, 0, "", "", 0, "", "", ""], ["Ethoxyquin", "91-53-2", 3, 0, "", "C14H19NO", 217.31, "", "", ""], ["Ethyl Carbitol (EDG)", "111-90-0", 3, 0, "", "C6H14O3", 134.18, "", "", ""], ["Ethyl Vanillin", "121-32-4", 3, 0, "", "C9H10O3", 166.18, "", "", ""], ["Ethylene Glycol Monostearate (EGMS)", "111-60-4", 3, 0, "", "C20H40O3", 328.54, "", "", ""], ["Formaldehyde", "50-00-0", 3, 0, "", "CH2O", 30.03, "", "", ""], ["Glycerine", "56-81-5", 3, 0, "", "C3H8O3", 92.09, "", "", ""], ["Gum Acacia", "9000-01-5", 3, 0, "", "", 0, "", "", ""], ["Hexamine", "100-97-0", 3, 0, "", "C6H12N4", 140.19, "", "", ""], ["Hexylene Glycol", "107-41-5", 3, 0, "", "C6H14O2", 118.18, "", "", ""], ["Hydrobromic Acid", "10035-10-6", 3, 0, "", "BrH", 80.91, "", "", ""], ["Hydrogen Peroxide", "7722-84-1", 3, 0, "", "H2O2", 34.01, "", "", ""], ["Hyflo Super-Cel", "68855-54-9", 3, 0, "", "", 0, "", "", ""], ["Lactic Acid", "79-33-4", 3, 0, "", "C3H6O3", 90.08, "", "", ""], ["Lauryl Alcohol Ethoxylate LA-7 & LA-9", "68439-50-9", 3, 0, "", "", 0, "", "", ""], ["Liquid Paraffin (Light & Heavy)", "8012-95-1", 3, 0, "", "", 0, "", "", ""], ["Liquor Ammonia", "1336-21-6", 3, 0, "", "H5NO", 35.05, "", "", ""], ["Magnesium Sulphate", "7487-88-9", 3, 0, "", "MgO4S", 120.36, "", "", ""], ["Maleic Acid DL", "6915-15-7", 3, 0, "", "C4H4O4", 116.07, "", "", ""], ["Maleic Anhydride", "108-31-6", 3, 0, "", "C4H2O3", 98.06, "", "", ""], ["Manganese Sulphate", "10034-96-5", 3, 0, "", "H2MnO5S", 169.01, "", "", ""], ["Methyl Cellosolve", "109-86-4", 3, 0, "", "C3H8O2", 76.09, "", "", ""], ["Methylene Chloride", "75-09-2", 3, 0, "", "CH2Cl2", 84.93, "", "", ""], ["Mocidate", "", 3, 0, "", "", 0, "", "", ""], ["Monoethanolamine", "141-43-5", 3, 0, "", "C2H7NO", 61.08, "", "", ""], ["Monoethylene Glycol", "107-21-1", 3, 0, "", "C2H6O2", 62.07, "", "", ""], ["Monosodium Phosphate", "10049-21-5", 3, 0, "", "H2NaO4P", 119.98, "", "", ""], ["Morpholine", "110-91-8", 3, 0, "", "C4H9NO", 87.12, "", "", ""], ["N,N-Dimethylaniline", "121-69-7", 3, 0, "", "C8H11N", 121.18, "", "", ""], ["n-Heptane", "142-82-5", 3, 0, "", "C7H16", 100.2, "", "", ""], ["n-Propanol", "71-23-8", 3, 0, "", "C3H8O", 60.1, "", "", ""], ["Neopentyl Glycol", "126-30-7", 3, 0, "", "C5H12O2", 104.15, "", "", ""], ["Nilofoam NDW", "64742-96-7", 3, 0, "", "", 0, "", "", ""], ["Nonyl Phenol", "84852-15-3", 3, 0, "", "", 0, "", "R", ""], ["Nonyl Phenol Ethoxylate N 9.5 & N 4.5", "9016-45-9", 3, 0, "", "", 0, "", "R", ""], ["Octanol", "111-87-5", 3, 0, "", "C8H18O", 130.23, "", "", ""], ["Oleic Acid", "112-80-1", 3, 0, "", "C18H34O2", 282.47, "", "", ""], ["Oxalic Acid", "144-62-7", 3, 0, "", "C2H2O4", 90.03, "", "", ""], ["para-Toluenesulphonic Acid", "6192-52-5", 3, 0, "", "C7H8O3S", 172.2, "", "", ""], ["Paraffin Wax", "8002-74-2", 3, 0, "", "", 0, "", "", ""], ["Paraformaldehyde", "30525-89-4", 3, 0, "", "", 0, "", "", ""], ["Perchloroethylene", "127-18-4", 3, 0, "", "C2Cl4", 165.82, "", "", ""], ["Phosphoric Acid", "7664-38-2", 3, 0, "", "H3O4P", 97.99, "", "", ""], ["Polyaluminium Chloride", "1327-41-9", 3, 0, "", "", 0, "", "", ""], ["Polyethylene Glycol 200, 400 & 600", "25322-68-3", 3, 0, "", "", 0, "", "", ""], ["Polyethylene Glycol 4000 & 6000", "25322-68-3", 3, 0, "", "", 0, "", "", ""], ["Polysorbate (80 & 20)", "9005-64-5", 3, 0, "", "", 0, "", "", ""], ["Polyvinyl Alcohol", "9002-89-5", 3, 0, "", "", 0, "", "", ""], ["Polyvinyl Alcohol Powder", "9002-89-5", 3, 0, "", "", 0, "", "", ""], ["Potassium Carbonate, Granular", "584-08-7", 3, 0, "", "CK2O3", 138.2, "", "", ""], ["Potassium Metabisulphite", "16731-55-8", 3, 0, "", "K2O5S2", 222.31, "", "", ""], ["Potassium Persulphate", "7727-21-1", 3, 0, "", "K2O8S2", 270.31, "", "", ""], ["PPG 2000", "25322-69-4", 3, 0, "", "", 0, "", "", ""], ["Precipitated Silica", "7631-86-9", 3, 0, "", "O2Si", 60.08, "", "", ""], ["Propyl Gallate", "121-79-9", 3, 0, "", "C10H12O5", 212.2, "", "", ""], ["Salicylic Acid (Brown & White)", "69-72-7", 3, 0, "", "C7H6O3", 138.12, "", "", ""], ["Slurry", "27176-87-0", 3, 0, "", "", 0, "", "", ""], ["Soapstone Powder (Talc)", "14807-96-6", 3, 0, "", "H2Mg3O12Si4", 379.26, "", "", ""], ["Soda Ash", "497-19-8", 3, 0, "", "CNa2O3", 105.99, "", "", ""], ["Sodium Acetate", "6131-90-4", 3, 0, "", "C2H9NaO5", 136.08, "", "", ""], ["Sodium Benzoate", "532-32-1", 3, 0, "", "C7H5NaO2", 144.1, "", "", ""], ["Sodium Bicarbonate", "144-55-8", 3, 0, "", "CHNaO3", 84.01, "", "", ""], ["Sodium Bisulphite", "7631-90-5", 3, 0, "", "HNaO3S", 104.06, "", "", ""], ["Sodium Chloride, Free Flow", "7647-14-5", 3, 0, "", "ClNa", 58.44, "", "", ""], ["Sodium Citrate", "68-04-2", 3, 0, "", "C6H5Na3O7", 258.07, "", "", ""], ["Sodium Gluconate", "527-07-1", 3, 0, "", "C6H11NaO7", 218.14, "", "", ""], ["Sodium Hexametaphosphate", "10124-56-8", 3, 0, "", "Na6O18P6", 611.77, "", "", ""], ["Sodium Laureth Sulphate", "9004-82-4", 3, 0, "", "", 0, "", "", ""], ["Sodium Lauryl Sulphate", "151-21-3", 3, 0, "", "C12H25NaO4S", 288.38, "", "", ""], ["Sodium Metabisulphite, Food Grade", "7681-57-4", 3, 0, "", "Na2O5S2", 190.09, "", "", ""], ["Sodium Percarbonate", "15630-89-4", 3, 0, "", "C2H6Na4O12", 314.02, "", "", ""], ["Sodium Silicate", "1344-09-8", 3, 0, "", "Na2O3Si", 122.06, "", "", ""], ["Sodium Stearate", "822-16-2", 3, 0, "", "C18H35NaO2", 306.47, "", "", ""], ["Sodium Sulphate Anhydrous", "7757-82-6", 3, 0, "", "Na2O4S", 142.04, "", "", ""], ["Sodium Sulphite", "7757-83-7", 3, 0, "", "Na2O3S", 126.04, "", "", ""], ["Sodium Thiosulphate", "7772-98-7", 3, 0, "", "H10Na2O8S2", 248.17, "", "", ""], ["Sodium Tripolyphosphate", "7758-29-4", 3, 0, "", "Na5O10P3", 367.86, "", "", ""], ["Sorbitol", "50-70-4", 3, 0, "", "C6H14O6", 182.17, "", "", ""], ["Soya Lecithin", "8002-43-5", 3, 0, "", "", 0, "", "", ""], ["Stearic Acid", "57-11-4", 3, 0, "", "C18H36O2", 284.48, "", "", ""], ["Styrene Monomer", "100-42-5", 3, 0, "", "C8H8", 104.15, "", "", ""], ["Succinic Acid", "110-15-6", 3, 0, "", "C4H6O4", 118.09, "", "", ""], ["Sulphamic Acid", "5329-14-6", 3, 0, "", "H3NO3S", 97.09, "", "", ""], ["Tartaric Acid DL", "133-37-9", 3, 0, "", "C4H6O6", 150.09, "", "", ""], ["TCC-90", "87-90-1", 3, 0, "", "C3Cl3N3O3", 232.4, "", "", ""], ["Tetrahydrofuran (THF)", "109-99-9", 3, 0, "", "C4H8O", 72.11, "", "", ""], ["Titanium Dioxide", "13463-67-7", 3, 0, "", "O2Ti", 79.86, "", "", ""], ["Trichloroethylene (TCE)", "79-01-6", 3, 0, "", "C2HCl3", 131.38, "", "R", ""], ["Triethylamine & Triethanolamine", "121-44-8", 3, 0, "", "C6H15N", 101.19, "", "R", ""], ["Trimethylolpropane", "77-99-6", 3, 0, "", "C6H14O3", 134.18, "", "", ""], ["Trisodium Phosphate", "7601-54-9", 3, 0, "", "H24Na3O16P", 380.12, "", "", ""], ["Turkey Red Oil", "8002-33-3", 3, 0, "", "", 0, "", "", ""], ["Zinc Chloride", "7646-85-7", 3, 0, "", "Cl2Zn", 136.28, "", "", ""], ["Zinc Oxide", "1314-13-2", 3, 0, "", "OZn", 81.38, "", "", ""], ["Zinc Stearate", "557-05-1", 3, 0, "", "", 0, "", "", ""], ["Zinc Sulphate", "7446-20-0", 3, 0, "", "H14O11SZn", 287.54, "", "", ""], ["Dispex AA 4040", "", 5, 0, "Dispersing inorganic pigments and fillers in water-based paints", "", 0, "", "B", ""], ["Dispex AA 4143", "", 5, 0, "", "", 0, "", "B", ""], ["Dispex CX 4320", "", 5, 0, "Pigments and fillers in gloss, semi-gloss and highly filled interior paints", "", 0, "", "B", ""], ["Dispex HIDE CX 4540", "", 5, 0, "Titanium dioxide with extenders, for more hiding", "", 0, "", "B", ""], ["Foamaster MO 2150", "", 5, 0, "Mid- to high-PVC emulsion paints, plasters, water-based adhesives", "", 0, "", "B", ""], ["Foamaster MO 2151", "", 5, 0, "", "", 0, "", "B", ""], ["Foamaster MO 2170", "", 5, 0, "", "", 0, "", "B", ""], ["FoamStar SI 2240", "", 5, 0, "Pigment concentrates and high-surfactant systems", "", 0, "", "B", ""], ["Loxanol CA 5330", "", 5, 0, "", "", 0, "", "B", ""], ["Loxanol PL 5060", "", 5, 0, "", "", 0, "", "B", ""], ["Rheovis AS 1125", "", 5, 0, "Low-shear acrylic thickener for emulsion paints", "", 0, "", "B", ""], ["Rheovis HS 1181", "", 5, 0, "Associative thickener for acrylic coatings", "", 0, "", "B", ""], ["Rheovis HS 1184", "", 5, 0, "", "", 0, "", "B", ""], ["Rheovis PE 1320", "", 5, 0, "", "", 0, "", "B", ""], ["Rheovis PE 1331", "", 5, 0, "", "", 0, "", "B", ""], ["Rheovis PU 1291", "", 5, 0, "Mid-shear polyurethane thickener for brush and roller application", "", 0, "", "B", ""], ["Rheovis UR 1120", "", 5, 0, "", "", 0, "", "B", ""], ["Acronal 7048", "", 5, 0, "", "", 0, "", "B", ""], ["Acronal 7051", "", 5, 0, "Texture and stone-finish paints", "", 0, "", "B", ""], ["Acronal 7079", "", 5, 0, "Elastomeric exterior wall coatings", "", 0, "", "B", ""], ["Acronal ECO 702", "", 5, 0, "Low-odour, stain-resistant premium interior paints", "", 0, "", "B", ""], ["Acronal EDGE 7005", "", 5, 0, "", "", 0, "", "B", ""], ["Acronal EDGE 7686", "", 5, 0, "Premium exterior finishes with low dirt pick-up", "", 0, "", "B", ""], ["Acronal IA 734", "", 5, 0, "", "", 0, "", "B", ""], ["Acronal IS 750", "", 5, 0, "", "", 0, "", "B", ""], ["Acronal PA 510", "", 5, 0, "Low-pigmented high-gloss interior paints", "", 0, "", "B", ""], ["Acronal PA 808", "", 5, 0, "", "", 0, "", "B", ""], ["Acronal PLUS 7023", "", 5, 0, "", "", 0, "", "B", ""], ["Acronal PLUS 7033", "", 5, 0, "Exterior coatings", "", 0, "", "B", ""], ["Acronal PLUS 7090", "", 5, 0, "Scrub-resistant paints with high pigment-binding power", "", 0, "", "B", ""], ["Acronal PLUS 7611", "", 5, 0, "", "", 0, "", "B", ""], ["Acronal PLUS 7648", "", 5, 0, "", "", 0, "", "B", ""], ["Acronal PLUS 7691", "", 5, 0, "", "", 0, "", "B", ""], ["COL.9 7671", "", 5, 0, "", "", 0, "", "B", ""], ["Acronal 295 D", "", 5, 0, "", "", 0, "", "B", ""], ["Acronal 7035", "", 5, 0, "High-PVC all-purpose paints with good wet-scrub resistance", "", 0, "", "B", ""], ["Acronal 7092", "", 5, 0, "", "", 0, "", "B", ""], ["Acronal 7225", "", 5, 0, "", "", 0, "", "B", ""], ["Acronal IN 296 D", "", 5, 0, "", "", 0, "", "B", ""], ["AQACell HIDE 6299", "", 5, 0, "Hollow-sphere polymer that improves hiding and reduces titanium dioxide", "", 0, "", "B", ""], ["Acronal 7598", "", 5, 0, "", "", 0, "", "B", ""], ["Acronal 7848", "", 5, 0, "", "", 0, "", "B", ""], ["Acronal 7855", "", 5, 0, "", "", 0, "", "B", ""], ["Acronal NX 3587", "", 5, 0, "", "", 0, "", "B", ""], ["Acronal PLUS 7810", "", 5, 0, "", "", 0, "", "B", ""], ["Acronal PS 715", "", 5, 0, "", "", 0, "", "B", ""], ["Acronal V 275", "", 5, 0, "", "", 0, "", "B", ""], ["Acronal Xpress 7540", "", 5, 0, "", "", 0, "", "B", ""], ["Styrofan 7809", "", 5, 0, "", "", 0, "", "B", ""], ["Styrofan NX 1492", "", 5, 0, "", "", 0, "", "B", ""], ["Acronal 5400", "", 5, 0, "Cement-based flexible waterproofing membranes under tiles", "", 0, "", "B", ""], ["Acronal 7846", "", 5, 0, "", "", 0, "", "B", ""], ["Acronal S 400", "", 5, 0, "", "", 0, "", "B", ""], ["Styrofan D 623", "", 5, 0, "Modifying hydraulic binders, mainly cement mixes", "", 0, "", "B", ""], ["Styrofan ID 604", "", 5, 0, "", "", 0, "", "B", ""]]};
  const CATS = CATALOG.cats;
  const P = CATALOG.rows.map((r, i) => ({
    i,
    name: r[0],
    cas: r[1],
    cat: r[2],
    co: r[3],
    app: r[4] || '',
    f: r[5] || '',
    mw: r[6] || 0,
    flag: r[7] || '',
    doc: r[8] || '',
    syn: r[9] || ''
  }));

  const HS_MAP = {
    '2915.21': ['Acetic Acid', 'Glacial acetic acid'],
    '2905.11': ['Methanol', 'Methyl alcohol'],
    '2915.39': ['Methoxypropyl Acetate', 'PGMEA'],
    '2915.31': ['Ethyl Acetate'],
    '2915.33': ['n-Butyl Acetate'],
    '2905.32': ['Propylene Glycol']
  };

  const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const esc = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const fml = f => f ? f.replace(/(\d+)/g, '<sub>$1</sub>') : '';

  const pickedItems = new Set();
  let toastTimeout;

  window.showToast = function(text, link = '') {
    let toast = document.getElementById('quoteToast');
    let msg = document.getElementById('toastMsg');
    let a = document.getElementById('toastLink');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-pill';
      toast.id = 'quoteToast';
      toast.innerHTML = '<span id="toastMsg"></span><a id="toastLink" href="#"></a>';
      document.body.appendChild(toast);
      msg = document.getElementById('toastMsg');
      a = document.getElementById('toastLink');
    }
    if (msg) msg.textContent = text;
    if (a) {
      if (link) {
        a.href = link;
        a.textContent = 'View Quote Form →';
        a.style.display = 'inline';
      } else {
        a.style.display = 'none';
      }
    }
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 3500);
  };

  window.addToQuote = function(prodIndex, btnElement) {
    const p = P[prodIndex];
    if (!p) return;
    pickedItems.add(prodIndex);
    if (btnElement) {
      btnElement.classList.add('added');
      btnElement.innerHTML = 'Added &#10003;';
    }

    const textarea = document.getElementById('enquiryProducts') || document.querySelector('textarea[name="message"]');
    if (textarea) {
      const line = `${p.name} (CAS ${p.cas || 'N/A'})`;
      if (!textarea.value.includes(p.name)) {
        textarea.value = textarea.value.trim() ? textarea.value.trim() + '\n• ' + line : '• ' + line;
      }
    }

    const isContactPage = window.location.pathname.endsWith('contact.html') || window.location.href.includes('contact.html');
    const quoteLink = isContactPage ? '#contactForm' : (window.location.pathname.includes('/products/') ? '../contact.html' : 'contact.html') + '?product=' + encodeURIComponent(p.name) + '&topic=Technical+data+sheet';

    window.showToast(`Added ${p.name} to quote enquiry`, quoteLink);
  };

  function searchCatalogue(query, limit = 6) {
    const q = query.trim();
    if (!q) return [];
    const n = norm(q);
    const isHs = q.toLowerCase().includes('hs') || /^\d{4}(\.\d+)?$/.test(q);

    let hsMatchedNames = [];
    if (isHs) {
      for (const [code, names] of Object.entries(HS_MAP)) {
        if (q.includes(code)) hsMatchedNames.push(...names);
      }
    }

    function score(p) {
      if (hsMatchedNames.some(name => p.name.toLowerCase().includes(name.toLowerCase()))) return 0;
      if (p.cas && norm(p.cas) === n) return 0;
      if (p.f && p.f.toLowerCase() === q.toLowerCase()) return 0;
      const nm = norm(p.name);
      const sy = norm(p.syn);
      if (nm === n) return 1;
      if (p.syn.split(' | ').some(x => norm(x) === n)) return 1;
      if (nm.startsWith(n)) return 2;
      if (nm.includes(n)) return 3;
      if (sy.includes(n)) return 4;
      if (n.length >= 3 && norm(p.app).includes(n)) return 5;
      return 9;
    }

    return P
      .map(p => ({ p, s: score(p) }))
      .filter(x => x.s < 9)
      .sort((a, b) => a.s - b.s)
      .slice(0, limit)
      .map(x => x.p);
  }

  const QS = [
    "Do you have PGMEA?",
    "Which certificates do you have?",
    "Tell me about the new silica plant",
    "Can you do contract manufacturing?",
    "What documents come with a quote?"
  ];

  const CERTS_LIST = [
    "**Quality Management (ISO 9001:2015 framework)**: Audited partner facility procedures and batch traceability",
    "**Environmental Standards (ISO 14001:2015 framework)**: Responsible solvent recovery and verified ETP compliance",
    "**Process Safety (ISO 45001:2018 framework)**: Hazchem safety across partner synthesis units",
    "**cGMP / WHO-GMP Alignment**: Pharma-grade synthesis controls with HPLC/GC analytical validation",
    "**EU REACH Dossiers**: Registration support and documentation for European exports (available upon request)"
  ];

  function md(text) {
    const lines = esc(text).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').split(/\n/);
    let h = '', inList = false;
    for (const l of lines) {
      const m = l.match(/^\s*[-•*]\s+(.*)/);
      if (m) {
        if (!inList) { h += '<ul>'; inList = true; }
        h += `<li>${m[1]}</li>`;
      } else {
        if (inList) { h += '</ul>'; inList = false; }
        if (l.trim()) h += `<p>${l}</p>`;
      }
    }
    if (inList) h += '</ul>';
    return h;
  }

  function renderProductCards(list) {
    if (!list || !list.length) return '';
    return `<div class="pc">` + list.slice(0, 3).map(p => {
      const isAdded = pickedItems.has(p.i);
      return `
        <div>
          <b>${esc(p.name)}</b>
          <span>${p.f ? fml(p.f) + ' &bull; ' : ''}${p.cas ? 'CAS ' + esc(p.cas) : esc(CATS[p.cat] || '')}</span>
          <button type="button" class="add ${isAdded ? 'added' : ''}" onclick="addToQuote(${p.i}, this)">
            ${isAdded ? 'Added &#10003;' : '+ Add to quote'}
          </button>
        </div>
      `;
    }).join('') + `</div>`;
  }

  function generateAIResponse(q) {
    const t = q.toLowerCase();

    if (/\b(sarin|soman|tabun|vx|novichok|mustard gas|ricin|tnt|rdx|hmx|petn|nitroglycerin|tatp|fentanyl|heroin|cocaine|methamphetamine|mdma|lsd|ephedrine)\b/i.test(t)) {
      return { text: "We adhere strictly to international safety conventions. We do not manufacture or supply chemical-weapon precursors, explosives, or restricted narcotics. Ask me about our specialty solvents, pharma intermediates, or industrial chemicals." };
    }

    if (/silica|silicate|new plant|expansion|upcoming/.test(t)) {
      return {
        text: "We are establishing a dedicated **silica-based chemicals plant** to expand our specialized synthesis portfolio. We specialize in high-purity silica gels, precipitated silica, and colloidal formulations.\n- Target cleanroom standards: ISO 7 / 8\n- Applications: personal care, excipients, rubber reinforcement, desiccant\nUse the contact page or quote form to receive technical updates.",
        qs: ["Can you do contract manufacturing?", "Which certificates do you have?"]
      };
    }

    if (/certif|iso|gmp|reach|who|audit|standard|quality/.test(t)) {
      return {
        text: "Our facilities and supply network are globally accredited:\n" + CERTS_LIST.join("\n") + "\nEvery shipment includes plant COA, SDS (GHS compliant), and batch traceability documentation.",
        qs: ["What documents come with a quote?", "Can you do contract manufacturing?"]
      };
    }

    if (/contract|toll|custom|synthesis|cmo|plant|capacit|facility|make/.test(t)) {
      return {
        text: "We coordinate synthesis through **parent company manufacturing infrastructure** alongside a network of **25+ audited contract manufacturing partner facilities** across India:\n- Reaction chemistries: halogenation, esterification, condensation, cryogenic reactions down to -78°C\n- Reactors: GLR, SS316, Hastelloy from 500L to 10,000L\n- Pilot to commercial scale-up with full IP protection (we sign bilateral NDAs upfront).",
        qs: ["Which certificates do you have?", "What documents come with a quote?"]
      };
    }

    if (/document|coa|tds|msds|sds|sample/.test(t)) {
      return {
        text: "Every commercial quote and shipment comes with complete documentation:\n- **Certificate of Analysis (COA)** with HPLC/GC-MS purity validation\n- **Technical Data Sheet (TDS)**\n- **Safety Data Sheet (SDS)** compliant with GHS standards\n- Commercial invoice, packing list, certificate of origin, and dangerous-goods packaging certifications where applicable.",
        qs: ["How do I get a quote?", "Do you have PGMEA?"]
      };
    }

    if (/countr|export|ship|freight|port|fob|cif|destination/.test(t)) {
      return {
        text: "We routinely export to **15+ countries** across North America, Europe, Asia Pacific, and the Middle East. We provide quotes under **FOB India, CFR, CIF, or DAP** to your port of choice. Packaging options include 200L HDPE/steel drums, 1000L IBC totes, and ISO tanks.",
        qs: ["What documents come with a quote?", "Do you have PGMEA?"]
      };
    }

    const cleanedQuery = q.replace(/\b(do|you|have|has|sell|supply|offer|need|want|price|of|for|the|a|an|is|are|available|any|i|we|can|get|me|please|about|what|tell|info|quote|sample|in|stock)\b/gi, ' ').trim();
    const matches = searchCatalogue(cleanedQuery || q, 4);
    if (matches.length) {
      return {
        text: `Yes, we have **${matches[0].name}** in our verified catalogue. Here are the specifications and matching chemical grades available for prompt dispatch:`,
        cards: matches,
        qs: ["What packaging is available?", "How do I get a quote?", "Which certificates do you have?"]
      };
    }

    return {
      text: `We supply over 270+ specialty solvents, pharma intermediates, and performance chemicals. For custom grades or specific inquiries on "${esc(q)}", we can synthesize or source it through our 25+ partner network. Contact our chemical team directly for prompt quotes.`,
      qs: ["Which certificates do you have?", "Can you do contract manufacturing?"]
    };
  }

  // DOM Injection & Attachment
  function initAskAi() {
    // 1. Inject Floating Action Button if absent
    let chatFab = document.getElementById('chatFab');
    if (!chatFab) {
      chatFab = document.createElement('button');
      chatFab.className = 'fab';
      chatFab.id = 'chatFab';
      chatFab.setAttribute('aria-label', 'Open Semzolve AI assistant');
      chatFab.innerHTML = '<span class="dot">✦</span><span class="l">Ask AI</span>';
      document.body.appendChild(chatFab);
    }

    // 2. Inject Chat Dialog if absent
    let chatModal = document.getElementById('chatModal');
    if (!chatModal) {
      chatModal = document.createElement('div');
      chatModal.className = 'chat';
      chatModal.id = 'chatModal';
      chatModal.hidden = true;
      chatModal.setAttribute('role', 'dialog');
      chatModal.setAttribute('aria-label', 'Semzolve AI Assistant');
      chatModal.innerHTML = `
        <div class="ch">
          <span class="dot">✦</span>
          <div>
            <b>Semzolve AI Specialist</b>
            <small><i></i><span>Products, certificates, manufacturing</span></small>
          </div>
          <button type="button" id="chatCloseBtn" aria-label="Close assistant">&times;</button>
        </div>
        <div class="msgs" id="chatMsgs"></div>
        <div class="qs" id="chatQuickQs"></div>
        <form class="cin" id="chatForm">
          <input id="chatInput" placeholder="Ask about a product, CAS, purity, or quote…" aria-label="Message" autocomplete="off">
          <button type="submit" id="chatSendBtn" aria-label="Send">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </button>
        </form>
        <div class="cfoot">Real-time chemical catalogue intelligence &middot; Direct quote generator</div>
      `;
      document.body.appendChild(chatModal);
    }

    // 3. Inject Toast if absent
    if (!document.getElementById('quoteToast')) {
      const toast = document.createElement('div');
      toast.className = 'toast-pill';
      toast.id = 'quoteToast';
      toast.innerHTML = '<span id="toastMsg"></span><a id="toastLink" href="#"></a>';
      document.body.appendChild(toast);
    }

    const chatCloseBtn = document.getElementById('chatCloseBtn');
    const chatMsgs = document.getElementById('chatMsgs');
    const chatQuickQs = document.getElementById('chatQuickQs');
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');

    function openChat() {
      if (!chatModal) return;
      chatModal.hidden = false;
      if (chatFab) chatFab.hidden = true;
      if (chatMsgs && !chatMsgs.children.length) greet();
      setTimeout(() => chatInput && chatInput.focus(), 60);
    }

    function closeChat() {
      if (!chatModal) return;
      chatModal.hidden = true;
      if (chatFab) chatFab.hidden = false;
    }

    window.openChat = openChat;
    window.closeChat = closeChat;

    if (chatFab) chatFab.addEventListener('click', (e) => { e.stopPropagation(); openChat(); });
    if (chatCloseBtn) chatCloseBtn.addEventListener('click', (e) => { e.stopPropagation(); closeChat(); });

    const askAiChip = document.getElementById('askAiChip');
    if (askAiChip) askAiChip.addEventListener('click', (e) => { e.stopPropagation(); openChat(); });

    document.querySelectorAll('.mobile-nav-ai-btn, [data-open-chat]').forEach(el => {
      el.addEventListener('click', (e) => { e.stopPropagation(); openChat(); });
    });

    document.addEventListener('click', (e) => {
      if (chatModal && !chatModal.hidden) {
        const isInsideChat = chatModal.contains(e.target);
        const isOpenTrigger = e.target.closest('#chatFab') || e.target.closest('#askAiChip') || e.target.closest('.mobile-nav-ai-btn');
        if (!isInsideChat && !isOpenTrigger) closeChat();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && chatModal && !chatModal.hidden) closeChat();
    });

    function bubble(role, html) {
      const d = document.createElement('div');
      d.className = 'm ' + role;
      d.innerHTML = html;
      if (chatMsgs) {
        chatMsgs.appendChild(d);
        chatMsgs.scrollTop = chatMsgs.scrollHeight;
      }
      return d;
    }

    function renderQuickQs(list) {
      if (!chatQuickQs) return;
      chatQuickQs.innerHTML = list.map(q => `<button type="button">${esc(q)}</button>`).join('');
    }

    if (chatQuickQs) {
      chatQuickQs.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (btn) sendChat(btn.textContent);
      });
    }

    function greet() {
      bubble('a', md("Hi, I'm the **Semzolve AI Specialist**. Ask me about any chemical in our catalogue, our **certifications**, **manufacturing plants**, or request a quote for export shipments."));
      renderQuickQs(QS);
    }

    function sendChat(text) {
      const msg = String(text || '').trim();
      if (!msg) return;
      if (chatModal && chatModal.hidden) openChat();
      if (chatQuickQs) chatQuickQs.innerHTML = '';
      bubble('u', esc(msg));
      if (chatInput) chatInput.value = '';

      const botBubble = bubble('a', '<span style="color:#55657F; font-size:13px;">Reviewing catalogue specifications...</span>');

      setTimeout(() => {
        const resp = generateAIResponse(msg);
        botBubble.innerHTML = md(resp.text) + renderProductCards(resp.cards || []);
        if (chatMsgs) chatMsgs.scrollTop = chatMsgs.scrollHeight;
        renderQuickQs(resp.qs || QS.slice(0, 3));
      }, 300);
    }

    if (chatForm) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (chatInput) sendChat(chatInput.value);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAskAi);
  } else {
    initAskAi();
  }
})();
