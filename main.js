// SkillVantage Coaching Platform - Main JavaScript
class SkillVantageApp {
    constructor() {
        this.currentPersona = null;
        this.currentOnboardingStep = 0;
        this.analyticsData = this.generateMockAnalytics();
        this.coaches = this.generateMockCoaches();
        this.personaProfiles = this.getPersonaProfiles();
        this.init();
    }

    init() {
        this.initAnimations();
        this.initPersonaSelector();
        this.initPersonaOnboarding();
        this.initProgressCharts();
        this.initInteractiveElements();
        this.initScrollAnimations();
        this.initTypewriterEffect();
    }

    // Initialize core animations
    initAnimations() {
        // Particle background using p5.js
        if (typeof p5 !== 'undefined') {
            this.initParticleBackground();
        }

        // Initialize Anime.js animations
        this.initPageTransitions();
    }

    // Particle background effect
    initParticleBackground() {
        const sketch = (p) => {
            let particles = [];
            
            p.setup = () => {
                const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
                canvas.parent('particle-bg');
                canvas.style('position', 'fixed');
                canvas.style('top', '0');
                canvas.style('left', '0');
                canvas.style('z-index', '-1');
                
                // Create particles
                for (let i = 0; i < 50; i++) {
                    particles.push({
                        x: p.random(p.width),
                        y: p.random(p.height),
                        vx: p.random(-0.5, 0.5),
                        vy: p.random(-0.5, 0.5),
                        size: p.random(2, 6)
                    });
                }
            };
            
            p.draw = () => {
                p.clear();
                
                // Update and draw particles
                particles.forEach(particle => {
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    
                    // Wrap around edges
                    if (particle.x < 0) particle.x = p.width;
                    if (particle.x > p.width) particle.x = 0;
                    if (particle.y < 0) particle.y = p.height;
                    if (particle.y > p.height) particle.y = 0;
                    
                    // Draw particle
                    p.fill(255, 102, 0, 100);
                    p.noStroke();
                    p.circle(particle.x, particle.y, particle.size);
                });
                
                // Draw connections
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const dist = p.dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                        if (dist < 100) {
                            p.stroke(255, 102, 0, 50 * (1 - dist / 100));
                            p.strokeWeight(1);
                            p.line(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                        }
                    }
                }
            };
            
            p.windowResized = () => {
                p.resizeCanvas(p.windowWidth, p.windowHeight);
            };
        };
        
        new p5(sketch);
    }

    // Initialize persona selector
    initPersonaSelector() {
        const personas = document.querySelectorAll('.persona-card');
        
        personas.forEach(card => {
            card.addEventListener('click', () => {
                const personaType = card.dataset.persona;
                this.selectPersona(personaType);
                this.openPersonaOnboarding(personaType);
            });
            
            // Hover effects
            card.addEventListener('mouseenter', (e) => {
                anime({
                    targets: card,
                    scale: 1.05,
                    rotateY: 5,
                    boxShadow: '0 20px 40px rgba(255, 102, 0, 0.2)',
                    duration: 300,
                    easing: 'easeOutCubic'
                });
            });
            
            card.addEventListener('mouseleave', (e) => {
                anime({
                    targets: card,
                    scale: 1,
                    rotateY: 0,
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    duration: 300,
                    easing: 'easeOutCubic'
                });
            });
        });
    }

    initPersonaOnboarding() {
        const personaButtons = document.querySelectorAll('[data-start-persona]');
        personaButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.stopPropagation();
                const personaType = button.dataset.startPersona;
                this.selectPersona(personaType);
                this.openPersonaOnboarding(personaType);
            });
        });

        const nextButton = document.getElementById('onboarding-next');
        const backButton = document.getElementById('onboarding-back');

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                this.handleOnboardingNext();
            });
        }

        if (backButton) {
            backButton.addEventListener('click', () => {
                this.handleOnboardingBack();
            });
        }

        this.selectPersona('individual', { silent: true });
    }

    // Select user persona
    selectPersona(personaType, options = {}) {
        const { silent = false } = options;
        const data = this.personaProfiles[personaType];
        if (!data) return;

        this.currentPersona = personaType;

        document.querySelectorAll('.persona-card').forEach(card => {
            card.classList.toggle('active', card.dataset.persona === personaType);
        });
        
        // Update UI based on persona
        this.updateDashboardForPersona(personaType);
        
        // Animate selection
        const selectedCard = document.querySelector(`[data-persona="${personaType}"]`);
        if (selectedCard) {
            anime({
                targets: selectedCard,
                scale: [1, 1.03, 1],
                duration: 450,
                easing: 'easeOutCubic'
            });
        }
        
        // Show success message
        if (!silent) {
            this.showNotification(data.notification);
        }
    }

    // Update dashboard for selected persona
    updateDashboardForPersona(personaType) {
        const data = this.personaProfiles[personaType];
        if (!data) return;
        
        // Update dashboard title
        const titleElement = document.getElementById('dashboard-title');
        if (titleElement) {
            anime({
                targets: titleElement,
                opacity: [1, 0],
                duration: 200,
                complete: () => {
                    titleElement.textContent = data.dashboard.title;
                    anime({
                        targets: titleElement,
                        opacity: [0, 1],
                        duration: 200
                    });
                }
            });
        }
        
        // Update metrics
        this.updateMetrics(data.dashboard.metrics);
    }

    // Initialize progress charts
    initProgressCharts() {
        if (typeof echarts !== 'undefined') {
            this.createProgressChart();
            this.createAnalyticsChart();
            this.createSkillsRadar();
        }
    }

    // Create progress tracking chart
    createProgressChart() {
        const chartElement = document.getElementById('progress-chart');
        if (!chartElement) return;
        
        const chart = echarts.init(chartElement);
        const option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c}%'
            },
            series: [{
                name: 'Progress',
                type: 'pie',
                radius: ['60%', '80%'],
                center: ['50%', '50%'],
                data: [
                    { value: 75, name: 'Completed', itemStyle: { color: '#FF6600' } },
                    { value: 25, name: 'Remaining', itemStyle: { color: '#E0E0E0' } }
                ],
                label: {
                    show: false
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        };
        
        chart.setOption(option);
        
        // Animate chart on load
        setTimeout(() => {
            chart.dispatchAction({
                type: 'highlight',
                seriesIndex: 0,
                dataIndex: 0
            });
        }, 1000);
    }

    // Create analytics chart
    createAnalyticsChart() {
        const chartElement = document.getElementById('analytics-chart');
        if (!chartElement) return;
        
        const chart = echarts.init(chartElement);
        const option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                axisLine: { lineStyle: { color: '#001F3F' } }
            },
            yAxis: {
                type: 'value',
                axisLine: { lineStyle: { color: '#001F3F' } }
            },
            series: [{
                name: 'Performance',
                type: 'line',
                smooth: true,
                data: [65, 72, 78, 85, 88, 92],
                lineStyle: { color: '#FF6600', width: 3 },
                itemStyle: { color: '#FF6600' },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(255, 102, 0, 0.3)' },
                            { offset: 1, color: 'rgba(255, 102, 0, 0.1)' }
                        ]
                    }
                }
            }]
        };
        
        chart.setOption(option);
    }

    // Create skills radar chart
    createSkillsRadar() {
        const chartElement = document.getElementById('skills-radar');
        if (!chartElement) return;
        
        const chart = echarts.init(chartElement);
        const option = {
            backgroundColor: 'transparent',
            tooltip: {},
            radar: {
                indicator: [
                    { name: 'Leadership', max: 100 },
                    { name: 'Communication', max: 100 },
                    { name: 'Strategy', max: 100 },
                    { name: 'Innovation', max: 100 },
                    { name: 'Execution', max: 100 },
                    { name: 'Teamwork', max: 100 }
                ],
                axisLine: { lineStyle: { color: '#001F3F' } },
                splitLine: { lineStyle: { color: '#E0E0E0' } }
            },
            series: [{
                name: 'Skills',
                type: 'radar',
                data: [{
                    value: [85, 78, 92, 88, 82, 90],
                    name: 'Current Level',
                    itemStyle: { color: '#FF6600' },
                    areaStyle: { color: 'rgba(255, 102, 0, 0.3)' }
                }]
            }]
        };
        
        chart.setOption(option);
    }

    // Initialize interactive elements
    initInteractiveElements() {
        // CTA buttons
        const ctaButtons = document.querySelectorAll('.cta-button');
        ctaButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleCTAClick(button);
            });
        });
        
        // Navigation items
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigation(item);
            });
        });
        
        // AI recommendation cards
        const recommendationCards = document.querySelectorAll('.recommendation-card');
        recommendationCards.forEach(card => {
            card.addEventListener('click', () => {
                this.handleRecommendationClick(card);
            });
        });
    }

    // Handle CTA button clicks
    handleCTAClick(button) {
        const action = button.dataset.action;
        
        // Animate button
        anime({
            targets: button,
            scale: [1, 0.95, 1],
            duration: 200,
            easing: 'easeOutCubic'
        });
        
        switch (action) {
            case 'get-started':
                this.showModal('get-started-modal');
                break;
            case 'explore-coachhub':
                window.location.href = 'coachhub.html';
                break;
            case 'book-session':
                this.showBookingInterface();
                break;
            default:
                this.showNotification('Feature coming soon!');
        }
    }

    // Initialize scroll animations
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    anime({
                        targets: element,
                        opacity: [0, 1],
                        translateY: [20, 0],
                        duration: 600,
                        easing: 'easeOutCubic',
                        delay: anime.stagger(100)
                    });
                    
                    observer.unobserve(element);
                }
            });
        }, observerOptions);
        
        // Observe elements
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            observer.observe(el);
        });
    }

    // Initialize typewriter effect
    initTypewriterEffect() {
        const typewriterElement = document.getElementById('typewriter-text');
        if (typewriterElement && typeof Typed !== 'undefined') {
            new Typed('#typewriter-text', {
                strings: [
                    'Transform Coaching into Measurable Growth',
                    'Powered by AI Intelligence',
                    'Personalized Development Paths',
                    'Data-Driven Leadership Excellence'
                ],
                typeSpeed: 50,
                backSpeed: 30,
                backDelay: 2000,
                loop: true,
                showCursor: true,
                cursorChar: '|'
            });
        }
    }

    // Generate mock analytics data
    generateMockAnalytics() {
        return {
            totalUsers: 1247,
            activeSessions: 89,
            completionRate: 78,
            satisfactionScore: 4.8,
            monthlyGrowth: 15,
            topSkills: ['Leadership', 'Communication', 'Strategy', 'Innovation'],
            recentActivity: [
                { user: 'Sarah Chen', action: 'Completed Leadership Assessment', time: '2 min ago' },
                { user: 'Michael Rodriguez', action: 'Booked Executive Coaching Session', time: '5 min ago' },
                { user: 'Jennifer Liu', action: 'Achieved Goal Milestone', time: '8 min ago' }
            ]
        };
    }

    // Generate mock coach data
    generateMockCoaches() {
        return [
            {
                id: 1,
                name: 'Dr. Sarah Mitchell',
                expertise: ['Executive Leadership', 'Change Management', 'Team Dynamics'],
                rating: 4.9,
                sessions: 247,
                specialties: ['C-Suite Coaching', 'Organizational Transformation'],
                availability: 'Available today'
            },
            {
                id: 2,
                name: 'James Thompson',
                expertise: ['Strategic Planning', 'Performance Optimization', 'Innovation'],
                rating: 4.8,
                sessions: 189,
                specialties: ['Startup Mentoring', 'Scale-up Leadership'],
                availability: 'Next available: Tomorrow'
            },
            {
                id: 3,
                name: 'Dr. Emily Chen',
                expertise: ['Emotional Intelligence', 'Communication', 'Conflict Resolution'],
                rating: 4.9,
                sessions: 312,
                specialties: ['Leadership Presence', 'Cross-cultural Teams'],
                availability: 'Available this week'
            }
        ];
    }

    // Show notification
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-orange-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        anime({
            targets: notification,
            translateX: [300, 0],
            opacity: [0, 1],
            duration: 300,
            easing: 'easeOutCubic'
        });
        
        setTimeout(() => {
            anime({
                targets: notification,
                translateX: [0, 300],
                opacity: [1, 0],
                duration: 300,
                easing: 'easeInCubic',
                complete: () => {
                    document.body.removeChild(notification);
                }
            });
        }, 3000);
    }

    // Show modal
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            anime({
                targets: modal,
                opacity: [0, 1],
                duration: 300,
                easing: 'easeOutCubic'
            });
        }
    }

    // Update metrics display
    updateMetrics(metrics) {
        const metricsContainer = document.getElementById('metrics-container');
        if (metricsContainer) {
            metricsContainer.innerHTML = metrics.map(metric => `
                <div class="metric-card bg-white rounded-lg p-6 shadow-sm border border-gray-200 animate-on-scroll">
                    <div class="flex items-center justify-between gap-4">
                        <div>
                            <p class="text-sm font-medium text-gray-600">${metric.label}</p>
                            <p class="text-3xl font-bold text-${metric.color}-500 mt-2">${metric.value}</p>
                            <p class="text-xs uppercase tracking-[0.16em] text-gray-400 mt-3">${metric.detail}</p>
                        </div>
                        <div class="w-12 h-12 bg-${metric.color}-100 rounded-full flex items-center justify-center text-${metric.color}-600 font-bold text-sm">
                            ${metric.badge}
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }

    // Handle navigation
    handleNavigation(navItem) {
        const target = navItem.dataset.target;
        
        // Update active state
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        navItem.classList.add('active');
        
        // Navigate to target
        if (target && target !== '#') {
            window.location.href = target;
        }
    }

    // Handle recommendation clicks
    handleRecommendationClick(card) {
        const recommendation = card.dataset.recommendationLabel || card.dataset.recommendation;
        
        anime({
            targets: card,
            scale: [1, 0.98, 1],
            duration: 200,
            easing: 'easeOutCubic'
        });
        
        this.showNotification(`Exploring recommendation: ${recommendation}`);
    }

    // Show booking interface
    showBookingInterface() {
        const data = this.personaProfiles[this.currentPersona || 'individual'];
        this.showNotification(`Opening booking flow for ${data.label}...`);
        // This would typically open a booking modal or redirect to booking page
    }

    openPersonaOnboarding(personaType) {
        this.currentPersona = personaType;
        this.currentOnboardingStep = 0;
        this.renderOnboardingStep();
        this.showModal('persona-onboarding-modal');
    }

    handleOnboardingNext() {
        const data = this.personaProfiles[this.currentPersona || 'individual'];
        if (!data) return;

        if (this.currentOnboardingStep >= data.onboardingSteps.length - 1) {
            closeModal('persona-onboarding-modal');
            this.showNotification(`${data.label} created successfully.`);
            return;
        }

        this.currentOnboardingStep += 1;
        this.renderOnboardingStep();
    }

    handleOnboardingBack() {
        if (this.currentOnboardingStep <= 0) {
            closeModal('persona-onboarding-modal');
            return;
        }

        this.currentOnboardingStep -= 1;
        this.renderOnboardingStep();
    }

    renderOnboardingStep() {
        const data = this.personaProfiles[this.currentPersona || 'individual'];
        if (!data) return;

        const step = data.onboardingSteps[this.currentOnboardingStep];
        if (!step) return;

        const personaLabel = document.getElementById('onboarding-persona-label');
        const stepTitle = document.getElementById('onboarding-step-title');
        const stepCopy = document.getElementById('onboarding-step-copy');
        const progress = document.getElementById('onboarding-progress');
        const fields = document.getElementById('onboarding-fields');
        const goal = document.getElementById('onboarding-step-goal');
        const back = document.getElementById('onboarding-back');
        const next = document.getElementById('onboarding-next');

        if (personaLabel) personaLabel.textContent = `${data.label} Setup`;
        if (stepTitle) stepTitle.textContent = step.title;
        if (stepCopy) stepCopy.textContent = step.copy;
        if (goal) goal.textContent = step.goal;

        if (progress) {
            progress.innerHTML = data.onboardingSteps.map((item, index) => `
                <div class="walkthrough-step ${index === this.currentOnboardingStep ? 'active' : ''} border border-gray-200 rounded-2xl p-4">
                    <p class="text-xs font-semibold uppercase tracking-[0.16em] text-orange-500 mb-1">Step ${index + 1}</p>
                    <p class="font-semibold text-gray-900">${item.nav}</p>
                </div>
            `).join('');
        }

        if (fields) {
            fields.innerHTML = step.fields.map(field => `
                <label class="block ${field.fullWidth ? 'md:col-span-2' : ''}">
                    <span class="text-sm font-medium text-gray-700">${field.label}</span>
                    ${field.type === 'select'
                        ? `<select class="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900" name="${field.name}">
                            ${field.options.map(option => `<option>${option}</option>`).join('')}
                           </select>`
                        : `<input class="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900" type="${field.type}" name="${field.name}" placeholder="${field.placeholder || ''}">`
                    }
                </label>
            `).join('');
        }

        if (back) back.textContent = this.currentOnboardingStep === 0 ? 'Cancel' : 'Back';
        if (next) next.textContent = this.currentOnboardingStep === data.onboardingSteps.length - 1 ? 'Create User' : 'Next Step';
    }

    updatePersonaPreview(personaType) {
        const data = this.personaExperience[personaType];
        const label = document.getElementById('persona-preview-label');
        const story = document.getElementById('persona-preview-story');

        if (label) label.textContent = data.label;
        if (story) story.textContent = data.preview;
    }

    renderDemoSteps(personaType) {
        const data = this.personaExperience[personaType];
        const container = document.getElementById('demo-steps-container');
        if (!container) return;

        container.innerHTML = data.demoSteps.map((step, index) => `
            <button class="demo-step ${index === 0 ? 'active' : ''} w-full text-left bg-white border border-gray-200 rounded-2xl p-5" data-demo-step="${index}">
                <div class="flex items-start gap-4">
                    <div class="demo-step-index w-10 h-10 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center font-bold">${index + 1}</div>
                    <div>
                        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-orange-500 mb-2">${step.label}</p>
                        <h3 class="font-display font-semibold text-lg text-gray-900">${step.title}</h3>
                        <p class="text-sm text-gray-600 mt-1">${step.short}</p>
                    </div>
                </div>
            </button>
        `).join('');

        container.querySelectorAll('[data-demo-step]').forEach(step => {
            step.addEventListener('click', () => {
                this.setDemoStep(Number(step.dataset.demoStep));
            });
        });
    }

    setDemoStep(stepIndex) {
        const data = this.personaExperience[this.currentPersona || 'individual'];
        const step = data.demoSteps[stepIndex];
        if (!step) return;

        this.currentDemoStep = stepIndex;

        document.querySelectorAll('[data-demo-step]').forEach(button => {
            button.classList.toggle('active', Number(button.dataset.demoStep) === stepIndex);
        });

        const personaLabel = document.getElementById('demo-persona-label');
        const stageTitle = document.getElementById('demo-stage-title');
        const stageLabel = document.getElementById('demo-stage-label');
        const stageCopy = document.getElementById('demo-stage-copy');
        const stageProof = document.getElementById('demo-stage-proof');
        const stageFocus = document.getElementById('demo-stage-focus');
        const stageCTA = document.getElementById('demo-stage-cta');
        const metricValue = document.getElementById('demo-stage-metric-value');
        const metricLabel = document.getElementById('demo-stage-metric-label');

        if (personaLabel) personaLabel.textContent = `${data.label} Demo`;
        if (stageTitle) stageTitle.textContent = step.title;
        if (stageLabel) stageLabel.textContent = `Step ${stepIndex + 1} of ${data.demoSteps.length}`;
        if (stageCopy) stageCopy.textContent = step.copy;
        if (stageProof) stageProof.textContent = step.proof;
        if (stageFocus) stageFocus.textContent = step.focus;
        if (stageCTA) stageCTA.textContent = step.cta;
        if (metricValue) metricValue.textContent = step.metricValue;
        if (metricLabel) metricLabel.textContent = step.metricLabel;

        this.updateDemoLivePanel(data, step, stepIndex);
        this.updateWalkthroughModal(data, step, stepIndex);
    }

    updateDemoLivePanel(data, step, stepIndex) {
        const liveTitle = document.getElementById('demo-live-title');
        const liveBadge = document.getElementById('demo-live-badge');
        const liveCopy = document.getElementById('demo-live-copy');
        const liveHighlights = document.getElementById('demo-live-highlights');

        if (liveTitle) liveTitle.textContent = step.title;
        if (liveBadge) liveBadge.textContent = `Step ${stepIndex + 1}`;
        if (liveCopy) liveCopy.textContent = step.copy;
        if (liveHighlights) {
            liveHighlights.innerHTML = [
                `Persona: ${data.label}`,
                step.metricLabel,
                step.focus,
                step.cta
            ].map(item => `
                <div class="rounded-2xl bg-white/10 border border-white/15 px-4 py-3 text-sm font-medium">${item}</div>
            `).join('');
        }
    }

    updateWalkthroughModal(data, step, stepIndex) {
        const personaLabel = document.getElementById('walkthrough-persona-label');
        const title = document.getElementById('walkthrough-title');
        const copy = document.getElementById('walkthrough-copy');
        const proof = document.getElementById('walkthrough-proof');
        const focus = document.getElementById('walkthrough-focus');
        const stepsContainer = document.getElementById('walkthrough-steps');

        if (personaLabel) personaLabel.textContent = `${data.label} Walkthrough`;
        if (title) title.textContent = step.title;
        if (copy) copy.textContent = step.copy;
        if (proof) proof.textContent = step.proof;
        if (focus) focus.textContent = step.cta;
        if (stepsContainer) {
            stepsContainer.innerHTML = data.demoSteps.map((item, index) => `
                <div class="walkthrough-step ${index === stepIndex ? 'active' : ''} border border-gray-200 rounded-2xl p-4">
                    <p class="text-xs font-semibold uppercase tracking-[0.16em] text-orange-500 mb-1">Step ${index + 1}</p>
                    <p class="font-semibold text-gray-900">${item.title}</p>
                </div>
            `).join('');
        }
    }

    openDemoWalkthrough() {
        this.showModal('demo-walkthrough-modal');
        this.setDemoStep(this.currentDemoStep || 0);
    }

    advanceDemoStep(forceWalkthrough = false) {
        const data = this.personaExperience[this.currentPersona || 'individual'];
        const nextStep = (this.currentDemoStep + 1) % data.demoSteps.length;
        this.setDemoStep(nextStep);

        if (forceWalkthrough) {
            this.showModal('demo-walkthrough-modal');
        }
    }

    updateRecommendations(personaType) {
        const data = this.personaExperience[personaType];
        const container = document.getElementById('recommendations-container');
        if (!container) return;

        container.innerHTML = data.recommendations.map(item => `
            <div class="recommendation-card bg-${item.color}-50 border border-${item.color}-200 rounded-lg p-4" data-recommendation="${item.id}" data-recommendation-label="${item.title}">
                <div class="flex items-start">
                    <div class="w-8 h-8 bg-${item.color}-500 rounded-full flex items-center justify-center mr-3 mt-1 text-white text-xs font-bold">
                        ${item.badge}
                    </div>
                    <div>
                        <h4 class="font-semibold text-gray-900 mb-1">${item.title}</h4>
                        <p class="text-sm text-gray-600">${item.copy}</p>
                    </div>
                </div>
            </div>
        `).join('');

        container.querySelectorAll('.recommendation-card').forEach(card => {
            card.addEventListener('click', () => {
                this.handleRecommendationClick(card);
            });
        });
    }

    updateCoreHubShowcase(personaType) {
        const data = this.personaExperience[personaType];
        const storyCopy = document.getElementById('corehub-story-copy');
        const personaContext = document.getElementById('corehub-persona-context');
        const capabilities = document.getElementById('corehub-capabilities');

        if (storyCopy) storyCopy.textContent = data.corehub.copy;
        if (personaContext) personaContext.textContent = data.corehub.context;
        if (capabilities) {
            capabilities.innerHTML = data.corehub.capabilities.map(item => `
                <div class="rounded-2xl bg-white/10 border border-white/15 px-4 py-3 text-sm font-medium">${item}</div>
            `).join('');
        }
    }

    getPersonaProfiles() {
        return {
            individual: {
                label: 'Individual User',
                notification: 'Individual user selected.',
                dashboard: {
                    title: 'Personal Growth Dashboard',
                    metrics: [
                        { label: 'Goal Progress', value: '78%', detail: '90-day growth plan', color: 'orange', badge: 'GP' },
                        { label: 'Skill Development', value: '85%', detail: 'communication and leadership', color: 'blue', badge: 'SD' },
                        { label: 'Coaching Sessions', value: '12', detail: 'completed this quarter', color: 'green', badge: 'CS' },
                        { label: 'AI Insights', value: '24', detail: 'actionable nudges delivered', color: 'purple', badge: 'AI' }
                    ]
                },
                onboardingSteps: [
                    {
                        nav: 'Account',
                        title: 'Create your individual account',
                        copy: 'Start with the personal details needed to create the user profile.',
                        goal: 'Capture the core identity and login details for the new individual user.',
                        fields: [
                            { label: 'Full name', name: 'fullName', type: 'text', placeholder: 'Alex Morgan' },
                            { label: 'Email address', name: 'email', type: 'email', placeholder: 'alex@example.com' },
                            { label: 'Password', name: 'password', type: 'password', placeholder: 'Create a password' },
                            { label: 'Career stage', name: 'careerStage', type: 'select', options: ['Early Career', 'Mid Career', 'Senior Leader', 'Career Transition'] }
                        ]
                    },
                    {
                        nav: 'Goals',
                        title: 'Define personal development goals',
                        copy: 'Choose the focus areas that will shape recommendations and coaching.',
                        goal: 'Use goals to personalize the dashboard, learning plan, and coaching path.',
                        fields: [
                            { label: 'Primary goal', name: 'primaryGoal', type: 'select', options: ['Leadership Growth', 'Career Progression', 'Communication Skills', 'Confidence & Presence'] },
                            { label: 'Preferred coaching format', name: 'coachingFormat', type: 'select', options: ['1-on-1 Coaching', 'Group Coaching', 'Hybrid'] },
                            { label: 'Target start date', name: 'startDate', type: 'date' },
                            { label: 'Current challenge', name: 'challenge', type: 'text', placeholder: 'What would you like to improve first?' }
                        ]
                    },
                    {
                        nav: 'Profile',
                        title: 'Complete the individual profile',
                        copy: 'Add profile details used for tailored matching and onboarding.',
                        goal: 'Finish the user profile so the platform can match the right coach and content.',
                        fields: [
                            { label: 'Industry', name: 'industry', type: 'text', placeholder: 'Technology' },
                            { label: 'Location', name: 'location', type: 'text', placeholder: 'New York, NY' },
                            { label: 'Top skill to build', name: 'topSkill', type: 'text', placeholder: 'Executive communication' },
                            { label: 'Preferred session cadence', name: 'cadence', type: 'select', options: ['Weekly', 'Biweekly', 'Monthly'] }
                        ]
                    }
                ],
                demoSteps: [
                    { label: 'Onboarding', title: 'Sign up and choose a persona', short: 'Start the story with a fast intake and a personalized entry point.', copy: 'A new user completes a lightweight intake, selects Individual User, and immediately sees a dashboard tailored to personal and career growth.', proof: '“We can go from first visit to a personalized experience in just a few clicks.”', focus: 'Personal onboarding with coaching and learning aligned from the first session.', cta: 'Click Individual User, then scroll into the dashboard to show personalized metrics and recommendations.', metricValue: '4 min', metricLabel: 'Time To Launch' },
                    { label: 'AI Match', title: 'Receive tailored recommendations', short: 'The platform surfaces the next best actions automatically.', copy: 'COREHUB™ recommends coaching sessions, learning modules, and development priorities based on the user’s intake, goals, and skill gaps.', proof: '“Instead of browsing manually, the platform suggests where this user should focus first.”', focus: 'AI guides the learner toward the right coach, right content, and right next step.', cta: 'Open the recommendation cards and talk through why each suggestion fits this persona.', metricValue: '3', metricLabel: 'Smart Suggestions' },
                    { label: 'Coaching', title: 'Book a coaching moment', short: 'Turn recommendations into action with one next-step flow.', copy: 'From the dashboard, the user can book a focused session around communication, leadership, or strategy without leaving the platform context.', proof: '“The experience moves from insight to action immediately, which is what keeps engagement high.”', focus: 'Coaching is embedded into the workflow, not treated like a separate destination.', cta: 'Use the Book Your Next Session button as the transition from insight to action.', metricValue: '1 click', metricLabel: 'Session Booking' },
                    { label: 'Learning', title: 'Apply learning in the flow of work', short: 'Recommended modules reinforce the coaching plan.', copy: 'The user receives learning pathways that support their coaching goals, creating continuity between reflection, practice, and development.', proof: '“Coaching and learning reinforce each other here instead of living in separate silos.”', focus: 'Every development step can trigger relevant training content and reflection prompts.', cta: 'Reference the Learning Management System as the reinforcement layer after coaching.', metricValue: '2 paths', metricLabel: 'Assigned Pathways' },
                    { label: 'Outcomes', title: 'Track progress and celebrate growth', short: 'Dashboards make growth tangible for the user.', copy: 'The user sees progress, engagement, and AI insights in one place, making the impact of coaching more concrete and motivating.', proof: '“We’re not just offering coaching. We’re showing measurable movement over time.”', focus: 'Progress tracking turns an abstract development journey into visible momentum.', cta: 'Close the story by pointing back to dashboard metrics and progress visualization.', metricValue: '78%', metricLabel: 'Growth Visibility' }
                ],
                recommendations: [
                    { id: 'leadership-workshop', title: 'Leadership Workshop', copy: 'Build leadership presence with a two-day immersive session tailored to personal growth goals.', color: 'orange', badge: 'LW' },
                    { id: 'communication-coaching', title: 'Communication Mastery', copy: 'Schedule a 1-on-1 coaching sprint to improve clarity, confidence, and influence.', color: 'blue', badge: 'CM' },
                    { id: 'strategy-session', title: 'Career Alignment Session', copy: 'Use AI insights to map goals, milestones, and the next career development move.', color: 'green', badge: 'CA' }
                ],
                corehub: {
                    copy: 'COREHUB™ gives an individual one connected place to discover coaching, access learning, see AI guidance, and track growth over time.',
                    context: 'For an Individual User, COREHUB™ connects intake, coaching sessions, learning pathways, and progress tracking without switching tools.',
                    capabilities: ['Personalized onboarding', 'Coach and course recommendations', 'Goal-based progress tracking', 'Always-on AI guidance']
                }
            },
            employer: {
                label: 'Employer / HR Leader',
                notification: 'Employer / HR Leader selected.',
                dashboard: {
                    title: 'Team Leadership Dashboard',
                    metrics: [
                        { label: 'Team Performance', value: '92%', detail: 'leadership cohort adoption', color: 'orange', badge: 'TP' },
                        { label: 'Leadership Score', value: '88%', detail: 'manager capability growth', color: 'blue', badge: 'LS' },
                        { label: 'Engagement Rate', value: '90%', detail: 'active coaching participation', color: 'green', badge: 'ER' },
                        { label: 'ROI Metrics', value: '3.4x', detail: 'program impact signal', color: 'purple', badge: 'ROI' }
                    ]
                },
                onboardingSteps: [
                    {
                        nav: 'Account',
                        title: 'Create the HR leader account',
                        copy: 'Start with the account details for the program owner.',
                        goal: 'Set up the primary HR or people leader who will manage the program.',
                        fields: [
                            { label: 'Full name', name: 'fullName', type: 'text', placeholder: 'Jordan Taylor' },
                            { label: 'Work email', name: 'email', type: 'email', placeholder: 'jordan@company.com' },
                            { label: 'Password', name: 'password', type: 'password', placeholder: 'Create a password' },
                            { label: 'Job title', name: 'jobTitle', type: 'text', placeholder: 'VP of People' }
                        ]
                    },
                    {
                        nav: 'Company',
                        title: 'Add organization details',
                        copy: 'Define the team and company context for the leadership program.',
                        goal: 'Establish the organization profile that will shape analytics and recommendations.',
                        fields: [
                            { label: 'Company name', name: 'company', type: 'text', placeholder: 'Acme Corp' },
                            { label: 'Team size', name: 'teamSize', type: 'select', options: ['1-50', '51-200', '201-500', '500+'] },
                            { label: 'Program type', name: 'programType', type: 'select', options: ['Manager Development', 'Executive Coaching', 'Leadership Cohort', 'Culture Transformation'] },
                            { label: 'Launch date', name: 'launchDate', type: 'date' }
                        ]
                    },
                    {
                        nav: 'Outcomes',
                        title: 'Set the leadership outcomes',
                        copy: 'Choose what success should look like for the program.',
                        goal: 'Use success criteria to personalize dashboards, alerts, and reporting.',
                        fields: [
                            { label: 'Primary business goal', name: 'businessGoal', type: 'select', options: ['Retention', 'Leadership Readiness', 'Manager Effectiveness', 'Culture Improvement'] },
                            { label: 'Coaching audience', name: 'audience', type: 'text', placeholder: 'First-line managers' },
                            { label: 'Reporting cadence', name: 'reportingCadence', type: 'select', options: ['Monthly', 'Quarterly', 'Biannual'] },
                            { label: 'Executive sponsor', name: 'sponsor', type: 'text', placeholder: 'Chief People Officer' }
                        ]
                    }
                ],
                demoSteps: [
                    { label: 'Program Setup', title: 'Launch a cohort for managers', short: 'Frame the story around a people leader or HR owner.', copy: 'An HR leader enters the platform to launch a leadership cohort, align managers to goals, and configure the development experience for a team.', proof: '“This is where the platform shifts from individual experience to enterprise enablement.”', focus: 'The same system now serves program design, team development, and executive visibility.', cta: 'Click Employer / HR Leader and call out how the dashboard instantly changes from personal to team-level metrics.', metricValue: '24 hrs', metricLabel: 'Program Setup' },
                    { label: 'Insights', title: 'Receive AI-driven team insights', short: 'Highlight visibility into skill gaps and engagement patterns.', copy: 'COREHUB™ identifies common development themes, coaching priorities, and performance risks across the manager population.', proof: '“Instead of guessing where to invest, HR gets a live read on where coaching and learning should focus.”', focus: 'AI moves from personal guidance to portfolio-level workforce insight.', cta: 'Reference the analytics and recommendation areas as the operating panel for team coaching decisions.', metricValue: '5', metricLabel: 'Leadership Signals' },
                    { label: 'Coaching', title: 'Match leaders to the right support', short: 'Show how coaching recommendations become a structured program.', copy: 'Managers can be routed into coaching products, curated workshops, and guided development paths based on their role and gaps.', proof: '“The platform turns insight into deployment by matching people to the right intervention.”', focus: 'Coaching becomes targeted, scalable, and easier to operationalize.', cta: 'Use recommendation cards to explain how HR can assign a leadership workshop or communication sprint.', metricValue: '87%', metricLabel: 'Manager Match Rate' },
                    { label: 'Learning', title: 'Reinforce growth with training', short: 'Support the cohort with aligned content and modules.', copy: 'Leadership programs are reinforced through learning pathways inside the same platform, making coaching stick through structured follow-through.', proof: '“Coaching is powerful, but the real win is when training and application keep the momentum going.”', focus: 'Learning pathways turn one-off sessions into sustained development behavior.', cta: 'Tie this step to the LMS page and the AI tools section.', metricValue: '6 modules', metricLabel: 'Assigned Learning' },
                    { label: 'Outcomes', title: 'Report outcomes to the business', short: 'Close on visibility and ROI.', copy: 'HR leaders can view adoption, engagement, leadership growth, and outcome metrics that tie the program back to business value.', proof: '“This is where coaching stops being a soft investment and becomes a measurable capability program.”', focus: 'Analytics make the value of leadership development easier to defend and expand.', cta: 'Land the demo on the dashboard and platform analytics sections to show measurable impact.', metricValue: '3.4x', metricLabel: 'ROI Signal' }
                ],
                recommendations: [
                    { id: 'leadership-workshop', title: 'Manager Leadership Cohort', copy: 'Launch a guided cohort for new and emerging leaders with progress tracking and coaching touchpoints.', color: 'orange', badge: 'ML' },
                    { id: 'communication-coaching', title: 'Executive Communication Sprint', copy: 'Support high-visibility leaders with focused communication and influence coaching.', color: 'blue', badge: 'EC' },
                    { id: 'strategy-session', title: 'Culture & Retention Review', copy: 'Use platform analytics to identify engagement gaps and prioritize leadership interventions.', color: 'green', badge: 'CR' }
                ],
                corehub: {
                    copy: 'COREHUB™ gives HR and people leaders one shared operating layer to launch programs, monitor performance, route talent to support, and report outcomes.',
                    context: 'For an Employer / HR Leader, COREHUB™ unifies coaching deployment, manager development, analytics, and ROI visibility in one platform.',
                    capabilities: ['Leadership cohort setup', 'Portfolio-level AI insights', 'Coaching and LMS orchestration', 'Outcome reporting for stakeholders']
                }
            },
            business: {
                label: 'Small Business',
                notification: 'Small Business selected.',
                dashboard: {
                    title: 'Business Growth Dashboard',
                    metrics: [
                        { label: 'Team Adoption', value: '74%', detail: 'active team participation', color: 'orange', badge: 'TA' },
                        { label: 'Training Progress', value: '81%', detail: 'learning pathway completion', color: 'blue', badge: 'TP' },
                        { label: 'Performance Gains', value: '19%', detail: 'quarter-over-quarter lift', color: 'green', badge: 'PG' },
                        { label: 'Cost Savings', value: '$18K', detail: 'annualized coaching efficiency', color: 'purple', badge: 'CS' }
                    ]
                },
                onboardingSteps: [
                    {
                        nav: 'Account',
                        title: 'Create the business owner account',
                        copy: 'Start with the owner or admin who will launch the workspace.',
                        goal: 'Set up the main account that will manage coaching and learning for the business.',
                        fields: [
                            { label: 'Full name', name: 'fullName', type: 'text', placeholder: 'Casey Reed' },
                            { label: 'Business email', name: 'email', type: 'email', placeholder: 'casey@business.com' },
                            { label: 'Password', name: 'password', type: 'password', placeholder: 'Create a password' },
                            { label: 'Business role', name: 'role', type: 'select', options: ['Owner', 'Founder', 'Operations Lead', 'HR Admin'] }
                        ]
                    },
                    {
                        nav: 'Business',
                        title: 'Tell us about the business',
                        copy: 'Add the company setup needed for a lightweight team rollout.',
                        goal: 'Use business context to size the workspace and recommend the right setup.',
                        fields: [
                            { label: 'Business name', name: 'businessName', type: 'text', placeholder: 'BrightPath Studio' },
                            { label: 'Number of employees', name: 'employeeCount', type: 'select', options: ['1-10', '11-25', '26-50', '51-100'] },
                            { label: 'Industry', name: 'industry', type: 'text', placeholder: 'Professional Services' },
                            { label: 'Workspace launch date', name: 'launchDate', type: 'date' }
                        ]
                    },
                    {
                        nav: 'Plan',
                        title: 'Choose the first rollout focus',
                        copy: 'Pick the first coaching and learning priorities for the team.',
                        goal: 'Create a practical starting point for the business coaching culture.',
                        fields: [
                            { label: 'Top team priority', name: 'priority', type: 'select', options: ['Leadership Skills', 'Communication', 'Manager Readiness', 'Team Performance'] },
                            { label: 'Preferred coaching format', name: 'coachingFormat', type: 'select', options: ['Team Sessions', '1-on-1 + Team Mix', 'Learning Modules First'] },
                            { label: 'Budget range', name: 'budget', type: 'select', options: ['Starter', 'Growth', 'Scale'] },
                            { label: 'Success measure', name: 'successMeasure', type: 'text', placeholder: 'Improve manager effectiveness' }
                        ]
                    }
                ],
                demoSteps: [
                    { label: 'Launch', title: 'Stand up a coaching culture quickly', short: 'Lead with affordability and speed to value.', copy: 'A small business owner enters the platform looking for a simple way to introduce coaching, learning, and development without building a complex program from scratch.', proof: '“This is designed to feel enterprise-grade without enterprise overhead.”', focus: 'The platform helps smaller teams create a coaching culture with less friction and lower complexity.', cta: 'Select Small Business and frame the story around speed, simplicity, and affordability.', metricValue: '1 week', metricLabel: 'Launch Window' },
                    { label: 'AI Guidance', title: 'See what the team needs most', short: 'Use AI to prioritize the most valuable interventions.', copy: 'COREHUB™ highlights where the team is stuck, which skills need attention, and what coaching or learning resources can drive the fastest impact.', proof: '“For smaller teams, prioritization matters even more, and the AI layer helps do that work.”', focus: 'AI acts like a strategic assistant for leaders with limited bandwidth.', cta: 'Use the recommendation cards as the proof point for fast, guided prioritization.', metricValue: '3 priorities', metricLabel: 'Focus Areas' },
                    { label: 'Enablement', title: 'Assign coaching and modules', short: 'Move from insight to action with minimal admin lift.', copy: 'The owner can assign modules, connect team members to coaching support, and keep everyone moving in a branded environment.', proof: '“This is the plug-and-play layer that makes the platform feel immediately useful.”', focus: 'Coaching, learning, and administration stay lightweight and manageable.', cta: 'Reference the team portal, modules, and coach matching story together.', metricValue: '2 hrs', metricLabel: 'Admin Time' },
                    { label: 'Engagement', title: 'Keep the team engaged', short: 'Show how the platform keeps momentum visible.', copy: 'Employees see clear progress, leaders see participation, and the platform keeps surfacing relevant next steps to avoid stall-out.', proof: '“Momentum is what small teams need most, and the dashboard makes that visible.”', focus: 'The platform helps a growing team stay focused without constant manual follow-up.', cta: 'Use the dashboard section to reinforce that everyone can see progress at a glance.', metricValue: '74%', metricLabel: 'Adoption' },
                    { label: 'Results', title: 'Connect development to business outcomes', short: 'Close on performance and efficiency.', copy: 'The business owner can show how better coaching and training drive stronger performance, retention, and operational efficiency over time.', proof: '“The value here is not just employee growth, it is business growth through people growth.”', focus: 'This is where the platform becomes a practical growth engine for a scaling team.', cta: 'End with cost savings, performance gains, and the COREHUB™ platform story.', metricValue: '$18K', metricLabel: 'Efficiency Gain' }
                ],
                recommendations: [
                    { id: 'leadership-workshop', title: 'Team Coaching Starter Pack', copy: 'Launch coaching for your core team with low-friction setup and clear first milestones.', color: 'orange', badge: 'TS' },
                    { id: 'communication-coaching', title: 'Customer-Facing Communication Lab', copy: 'Strengthen clarity, collaboration, and confidence for client-facing employees.', color: 'blue', badge: 'CL' },
                    { id: 'strategy-session', title: 'Growth Planning Session', copy: 'Use AI insights to align people development with hiring, retention, and business goals.', color: 'green', badge: 'GP' }
                ],
                corehub: {
                    copy: 'COREHUB™ gives small businesses one simple place to activate coaching, assign learning, monitor adoption, and connect development to growth outcomes.',
                    context: 'For a Small Business, COREHUB™ brings together team coaching, plug-and-play training, AI prioritization, and visible ROI without enterprise complexity.',
                    capabilities: ['Fast program rollout', 'AI prioritization for busy leaders', 'Branded coaching and learning hub', 'Business-friendly outcome tracking']
                }
            }
        };
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.skillVantageApp = new SkillVantageApp();
});

// Utility functions
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        anime({
            targets: modal,
            opacity: [1, 0],
            duration: 300,
            easing: 'easeInCubic',
            complete: () => {
                modal.classList.add('hidden');
            }
        });
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        window.skillVantageApp.showNotification('Copied to clipboard!');
    });
}
