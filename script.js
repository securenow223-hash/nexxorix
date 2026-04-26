// Global Variables
let isScrolling = false;
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    initAll();
});

function initAll() {
    // Initialize all components
    initNavbar();
    initAnimations();
    initCounters();
    initTestimonials();
    initContactForm();
    initLiveChat();
    initSmoothScroll();
    initServiceCards();
    initStats();
    initScrollEffects();
}

// ========================================
// NAVBAR FUNCTIONALITY
// ========================================
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Active nav link on scroll
    window.addEventListener('scroll', throttle(setActiveNavLink, 100));
}

function setActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}` || link.textContent.toLowerCase() === current) {
            link.classList.add('active');
        }
    });
}

// ========================================
// SMOOTH SCROLL & ANCHOR LINKS
// ========================================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', smoothScrollTo);
    });
}

function smoothScrollTo(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
        const targetPosition = targetSection.offsetTop - 80;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// ========================================
// SCROLL ANIMATIONS
// ========================================
function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all animate elements
    document.querySelectorAll('[class*="animate-"]').forEach(el => {
        observer.observe(el);
    });
}

// ========================================
// COUNTER ANIMATIONS
// ========================================
function initCounters() {
    const counters = document.querySelectorAll('[data-target]');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const increment = target / 100;
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 20);
}

// ========================================
// TESTIMONIALS SLIDER
// ========================================
function initTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    let currentTestimonial = 0;

    if (testimonials.length === 0) return;

    setInterval(() => {
        testimonials[currentTestimonial].classList.remove('active');
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        testimonials[currentTestimonial].classList.add('active');
    }, 5000);
}

// ========================================
// CONTACT FORM
// ========================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simulate form submission
        const submitBtn = form.querySelector('.form-submit');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Show success message
            showFormSuccess(form);
        }, 2000);
    });
}

function showFormSuccess(form) {
    const successMsg = document.createElement('div');
    successMsg.className = 'form-success';
    successMsg.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <div>
            <h4>Thank You!</h4>
            <p>Your message has been sent successfully. We'll get back to you within 24 hours.</p>
        </div>
    `;
    
    form.innerHTML = '';
    form.appendChild(successMsg);
    
    setTimeout(() => {
        window.location.href = 'contact.html#contact-form';
    }, 5000);
}

// ========================================
// LIVE CHAT
// ========================================
function initLiveChat() {
    const chat = document.getElementById('liveChat');
    const chatToggle = document.getElementById('chatToggle');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendMessage');
    const messages = chat.querySelector('.chat-messages');

    if (!chat) return;

    // Toggle chat
    chatToggle.addEventListener('click', () => {
        chat.classList.toggle('open');
    });

    // Send message
    sendBtn.addEventListener('click', sendChatMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendChatMessage();
    });

    function sendChatMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        // Add user message
        addMessage(message, 'user');
        chatInput.value = '';

        // Simulate bot response
        setTimeout(() => {
            const responses = [
                "Thanks for your message! Our team will get back to you soon.",
                "Great question! Let me connect you with our expert.",
                "Perfect! I'll have someone contact you within 24 hours.",
                "Thank you! We'll review your inquiry and respond promptly."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addMessage(randomResponse, 'bot');
        }, 1000);
    }

    function addMessage(text, sender) {
        const messageEl = document.createElement('div');
        messageEl.className = `message ${sender}`;
        messageEl.textContent = text;
        messages.appendChild(messageEl);
        messages.scrollTop = messages.scrollHeight;
    }
}

// ========================================
// SERVICE CARDS HOVER EFFECTS
// ========================================
function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// ========================================
// SCROLL EFFECTS & PARALLAX
// ========================================
function initScrollEffects() {
    window.addEventListener('scroll', throttle(handleScrollEffects, 16));
}

function handleScrollEffects() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    parallaxElements.forEach(el => {
        const speed = el.getAttribute('data-parallax');
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });

    // Hero floating shapes
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
        const speed = 0.5 + (index * 0.1);
        shape.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
    });
}

// ========================================
// STATS ANIMATION
// ========================================
function initStats() {
    const statsContainers = document.querySelectorAll('.stats-grid, .story-stats, .services-hero-stats');
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stats = entry.target.querySelectorAll('.stat-number');
                stats.forEach(stat => animateCounter(stat));
            }
        });
    }, { threshold: 0.3 });

    statsContainers.forEach(container => {
        statsObserver.observe(container);
    });
}

// ========================================
// UTILITY FUNCTIONS
// ========================================
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Back to top button
function initBackToTop() {
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Initialize back to top
initBackToTop();

// ========================================
// PAGE-SPECIFIC INITIALIZATIONS
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // Services page specific
    if (document.querySelector('.services-grid-section')) {
        initServiceInteractions();
    }

    // Contact page specific
    if (document.getElementById('contactForm')) {
        initContactPage();
    }

    // About page specific
    if (document.querySelector('.team-grid')) {
        initTeamCards();
    }
});

function initServiceInteractions() {
    const serviceCards = document.querySelectorAll('.service-card[data-service]');
    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            const serviceId = card.getAttribute('data-service');
            const targetSection = document.getElementById(serviceId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

function initContactPage() {
    // Phone number click to call
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', () => {
            // Analytics tracking can be added here
        });
    });
}

function initTeamCards() {
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', () => {
            const social = member.querySelector('.team-social');
            social.style.opacity = '1';
            social.style.transform = 'translateY(0)';
        });
        
        member.addEventListener('mouseleave', () => {
            const social = member.querySelector('.team-social');
            social.style.opacity = '0';
            social.style.transform = 'translateY(10px)';
        });
    });
}

// Preloader (if needed)
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Error handling for missing elements
window.addEventListener('error', (e) => {
    console.log('Script error:', e.message);
});

// Performance optimization
if ('IntersectionObserver' in window) {
    console.log('IntersectionObserver supported');
} else {
    // Fallback for older browsers
    console.log('Loading polyfill for IntersectionObserver');
}