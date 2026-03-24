// SkillVantage Coaching Platform - Main JavaScript
class SkillVantageApp {
    constructor() {
        this.currentPersona = null;
        this.analyticsData = this.generateMockAnalytics();
        this.coaches = this.generateMockCoaches();
        this.init();
    }

    init() {
        this.initAnimations();
        this.initPersonaSelector();
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
            card.addEventListener('click', (e) => {
                const personaType = card.dataset.persona;
                this.selectPersona(personaType);
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

    // Select user persona
    selectPersona(personaType) {
        this.currentPersona = personaType;
        
        // Update UI based on persona
        this.updateDashboardForPersona(personaType);
        
        // Animate selection
        const selectedCard = document.querySelector(`[data-persona="${personaType}"]`);
        anime({
            targets: selectedCard,
            scale: [1, 1.1, 1],
            backgroundColor: '#FF6600',
            color: '#FFFFFF',
            duration: 600,
            easing: 'easeOutElastic(1, .8)'
        });
        
        // Show success message
        this.showNotification(`Welcome, ${personaType} user! Your dashboard has been personalized.`);
    }

    // Update dashboard for selected persona
    updateDashboardForPersona(personaType) {
        const personaData = {
            individual: {
                title: 'Personal Growth Dashboard',
                focus: 'Life & Career Coaching',
                metrics: ['Goal Progress', 'Skill Development', 'Wellness Score', 'Career Alignment']
            },
            employer: {
                title: 'Team Leadership Dashboard',
                focus: 'Leadership Development',
                metrics: ['Team Performance', 'Leadership Score', 'Engagement Rate', 'ROI Metrics']
            },
            business: {
                title: 'Business Growth Dashboard',
                focus: 'Coaching Culture',
                metrics: ['Team Adoption', 'Training Progress', 'Performance Gains', 'Cost Savings']
            }
        };
        
        const data = personaData[personaType];
        
        // Update dashboard title
        const titleElement = document.getElementById('dashboard-title');
        if (titleElement) {
            anime({
                targets: titleElement,
                opacity: [1, 0],
                duration: 200,
                complete: () => {
                    titleElement.textContent = data.title;
                    anime({
                        targets: titleElement,
                        opacity: [0, 1],
                        duration: 200
                    });
                }
            });
        }
        
        // Update metrics
        this.updateMetrics(data.metrics);
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
                <div class="metric-card bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                    <h3 class="text-sm font-medium text-gray-600">${metric}</h3>
                    <p class="text-2xl font-bold text-orange-500 mt-2">${Math.floor(Math.random() * 40) + 60}%</p>
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
        const recommendation = card.dataset.recommendation;
        
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
        this.showNotification('Booking interface opening...');
        // This would typically open a booking modal or redirect to booking page
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