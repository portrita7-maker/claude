/* =================================================================
   ROMAN POPOV — Portfolio JS
   Modern interactions, animations, and effects
   ================================================================= */

(() => {
    'use strict';

    // ===== LOADER =====
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.querySelector('.loader')?.classList.add('hide');
        }, 1200);
    });

    // ===== CUSTOM CURSOR =====
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    let mouseX = 0, mouseY = 0, fx = 0, fy = 0;

    if (cursor && follower && window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        });

        const animateFollower = () => {
            fx += (mouseX - fx) * 0.15;
            fy += (mouseY - fy) * 0.15;
            follower.style.transform = `translate(${fx}px, ${fy}px) translate(-50%, -50%)`;
            requestAnimationFrame(animateFollower);
        };
        animateFollower();

        const hoverables = document.querySelectorAll('a, button, .skill-card, .project-card, .info-card, .timeline-content, .contact-card, .achievement-card');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => follower.classList.add('hover'));
            el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
        });
    }

    // ===== PARTICLES CANVAS =====
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouseParticle = { x: -1000, y: -1000 };

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        document.addEventListener('mousemove', e => {
            mouseParticle.x = e.clientX;
            mouseParticle.y = e.clientY;
        });

        class Particle {
            constructor() {
                this.reset();
                this.y = Math.random() * canvas.height;
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.size = Math.random() * 1.6 + 0.4;
                const hues = [262, 190, 322];
                this.hue = hues[Math.floor(Math.random() * hues.length)];
                this.opacity = Math.random() * 0.5 + 0.2;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Mouse repulsion
                const dx = this.x - mouseParticle.x;
                const dy = this.y - mouseParticle.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    const force = (120 - dist) / 120;
                    this.x += (dx / dist) * force * 1.5;
                    this.y += (dy / dist) * force * 1.5;
                }

                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue}, 80%, 65%, ${this.opacity})`;
                ctx.fill();
            }
        }

        const initParticles = () => {
            particles = [];
            const count = Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 18000));
            for (let i = 0; i < count; i++) particles.push(new Particle());
        };
        initParticles();
        window.addEventListener('resize', initParticles);

        const drawConnections = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 130) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `hsla(${particles[i].hue}, 70%, 60%, ${0.15 * (1 - dist / 130)})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            }
        };

        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            drawConnections();
            requestAnimationFrame(animateParticles);
        };
        animateParticles();
    }

    // ===== TYPED TEXT =====
    const typedEl = document.getElementById('typed');
    if (typedEl) {
        const phrases = [
            'AI-решения',
            'веб-сайты',
            'автоматизацию',
            'Telegram-ботов',
            'умные системы',
        ];
        let phraseIdx = 0, charIdx = 0, deleting = false;

        const tick = () => {
            const current = phrases[phraseIdx];
            if (deleting) {
                typedEl.textContent = current.substring(0, charIdx--);
                if (charIdx < 0) {
                    deleting = false;
                    phraseIdx = (phraseIdx + 1) % phrases.length;
                    setTimeout(tick, 300);
                    return;
                }
            } else {
                typedEl.textContent = current.substring(0, charIdx++);
                if (charIdx > current.length) {
                    deleting = true;
                    setTimeout(tick, 1800);
                    return;
                }
            }
            setTimeout(tick, deleting ? 40 : 80);
        };
        tick();
    }

    // ===== NAVBAR SCROLL =====
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.querySelector('.scroll-progress');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    const onScroll = () => {
        const scrolled = window.scrollY;

        if (navbar) {
            navbar.classList.toggle('scrolled', scrolled > 30);
        }

        if (scrollProgress) {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const pct = max > 0 ? (scrolled / max) * 100 : 0;
            scrollProgress.style.width = pct + '%';
        }

        // Active nav
        let active = '';
        sections.forEach(s => {
            const top = s.offsetTop - 120;
            if (scrolled >= top) active = s.id;
        });
        navLinks.forEach(l => {
            l.classList.toggle('active', l.getAttribute('href') === `#${active}`);
        });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ===== MOBILE MENU =====
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.nav-menu');
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });
        navMenu.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                menuToggle.classList.remove('open');
                navMenu.classList.remove('open');
            });
        });
    }

    // ===== REVEAL ON SCROLL =====
    const revealEls = document.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    revealEls.forEach(el => observer.observe(el));

    // Add stagger on grids
    document.querySelectorAll('.skills-grid, .projects-grid, .contact-grid, .achievements-grid').forEach(grid => {
        Array.from(grid.children).forEach((child, i) => {
            if (child.hasAttribute('data-reveal')) {
                child.style.transitionDelay = (i * 0.08) + 's';
            }
        });
    });

    // ===== COUNTER ANIMATION =====
    const counters = document.querySelectorAll('[data-count]');
    const counterObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.dataset.count, 10);
            const duration = 1600;
            const start = performance.now();

            const step = now => {
                const t = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - t, 3);
                el.textContent = Math.floor(eased * target);
                if (t < 1) requestAnimationFrame(step);
                else el.textContent = target;
            };
            requestAnimationFrame(step);
            counterObs.unobserve(el);
        });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObs.observe(c));

    // ===== TILT EFFECT ON CARDS =====
    const tiltCards = document.querySelectorAll('.project-card, .info-card, .skill-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rx = ((y - cy) / cy) * -4;
            const ry = ((x - cx) / cx) * 4;
            card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            if (href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // ===== PARALLAX FOR ORBS =====
    let scrollY = 0;
    let ticking = false;
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
        if (!ticking) {
            requestAnimationFrame(() => {
                document.querySelectorAll('.gradient-orb').forEach((orb, i) => {
                    const speed = (i + 1) * 0.08;
                    orb.style.transform = `translateY(${scrollY * speed}px)`;
                });
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // ===== KEYBOARD SHORTCUT (just for fun — press G to scroll to top) =====
    document.addEventListener('keydown', e => {
        if (e.key === 'g' && !e.target.matches('input, textarea')) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    // ===== CONSOLE EASTER EGG =====
    console.log(
        '%c👋 Привет!',
        'font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #8b5cf6, #06b6d4); -webkit-background-clip: text; color: transparent;'
    );
    console.log(
        '%cЕсли ты смотришь сюда — ты явно разбираешься. Давай работать вместе!',
        'font-size: 14px; color: #a8a8c0;'
    );
    console.log(
        '%c📧 romap41@yandex.ru   📱 +7 (912) 629-44-16',
        'font-size: 13px; color: #06b6d4;'
    );
})();
