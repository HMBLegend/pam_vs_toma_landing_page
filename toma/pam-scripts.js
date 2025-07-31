// Ensure page starts at top on refresh
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}

// Simple scroll reset for page refresh/load only
let scrollResetActive = true;

// Clear any hash from URL that might cause jumping
if (window.location.hash) {
    history.replaceState(null, null, window.location.pathname + window.location.search);
}

// Immediately scroll to top
window.scrollTo(0, 0);

// One brief additional reset after DOM is ready
window.addEventListener('DOMContentLoaded', function() {
    if (scrollResetActive) {
        window.scrollTo(0, 0);
    }
});

// Disable scroll reset immediately on any user interaction
function disableScrollReset() {
    scrollResetActive = false;
    // Remove all listeners once user interacts
    window.removeEventListener('scroll', disableScrollReset);
    window.removeEventListener('wheel', disableScrollReset);
    window.removeEventListener('touchstart', disableScrollReset);
    window.removeEventListener('keydown', disableScrollReset);
}

// Listen for any user interaction to disable reset (but not on UI elements)
window.addEventListener('scroll', disableScrollReset, { passive: true });
window.addEventListener('wheel', disableScrollReset, { passive: true });
window.addEventListener('touchstart', function(e) {
    // Don't disable scroll reset if touching interactive UI elements
    if (e.target.closest('.mobile-menu-toggle, .btn, a, button')) {
        return;
    }
    disableScrollReset();
}, { passive: true });
window.addEventListener('keydown', disableScrollReset, { passive: true });

// Auto-disable after 1 second to prevent interference with normal browsing
setTimeout(() => {
    disableScrollReset();
}, 1000);

// Header scroll effect
function handleHeaderScroll() {
    const header = document.querySelector('.header');
    
    if (!header) return;
    
    const scrollY = window.scrollY;
    
    // Header is transparent when at the top or when scroll bounces negative
    if (scrollY <= 0) {
        header.classList.remove('scrolled');
    } else {
        header.classList.add('scrolled');
    }
}

// Add scroll listener for header effect
window.addEventListener('scroll', handleHeaderScroll, { passive: true });

// Prevent FOUC and mobile menu flash
document.documentElement.classList.add('preload');
window.addEventListener('load', function() {
    // Remove preload class after page loads to restore transitions
    setTimeout(() => {
        document.documentElement.classList.remove('preload');
    }, 100);
});

// Ensure mobile menu is hidden on page load
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.remove('active');
        mobileMenu.style.transform = 'translateX(100%)';
        mobileMenu.style.visibility = 'hidden';
        mobileMenu.style.opacity = '0';
    }
});

// Global mobile menu close function
let globalCloseMenuWithAnimation = null;

// Mobile Menu Functionality - Simplified and Direct
function initMobileMenu() {
    console.log('Initializing mobile menu...');
    
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    
    console.log('Elements found:', {
        toggle: mobileMenuToggle,
        menu: mobileMenu,
        close: mobileMenuClose
    });
    
    if (!mobileMenuToggle || !mobileMenu) {
        console.error('Missing mobile menu elements!');
        return;
    }
    
    // Force initial state
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
    
    // Enhanced click handler with closing animation
    function toggleMenu() {
        console.log('Toggle menu called');
        const isActive = mobileMenu.classList.contains('active');
        
        if (isActive) {
            console.log('Closing menu');
            closeMenuWithAnimation();
        } else {
            console.log('Opening menu');
            openMenu();
        }
    }
    
    function openMenu() {
        // Remove any existing classes
        mobileMenu.classList.remove('closing');
        
        // Temporarily disable transitions, set initial state
        mobileMenu.style.transition = 'none';
        mobileMenu.style.visibility = 'visible';
        mobileMenu.style.transform = 'translateX(100%)';
        mobileMenu.style.opacity = '0';
        
        // Force reflow and re-enable transitions
        mobileMenu.offsetHeight;
        mobileMenu.style.transition = '';
        
        // Add active class for smooth animation
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeMenuWithAnimation() {
        // Add closing class for animation - don't remove active yet
        mobileMenu.classList.add('closing');
        
        // After animation completes, reset the menu state
        setTimeout(() => {
            mobileMenu.classList.remove('closing');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }, 300); // Match the CSS transition duration
    }
    
    // Make close function globally accessible
    globalCloseMenuWithAnimation = closeMenuWithAnimation;
    
    // Single click listener - simplified
    mobileMenuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Menu toggle clicked - SINGLE LISTENER');
        toggleMenu();
    });
    
    // Close button
    if (mobileMenuClose) {
        mobileMenuClose.onclick = function() {
            console.log('Close button clicked');
            closeMenuWithAnimation();
        };
    }
    
    // Close menu when clicking outside
    mobileMenu.onclick = function(e) {
        if (e.target === mobileMenu) {
            console.log('Clicked outside menu, closing');
            closeMenuWithAnimation();
        }
    };
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            console.log('Escape key pressed, closing menu');
            closeMenuWithAnimation();
        }
    });
    
    // Close menu on window resize (when switching to desktop)
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 640 && mobileMenu.classList.contains('active')) {
            console.log('Window resized to desktop, closing menu');
            closeMenuWithAnimation();
        }
    });

    
    console.log('Mobile menu initialized successfully');
}

// Mobile menu will be initialized in the main DOMContentLoaded listener
// Remove duplicate initialization of mobile menu
// setTimeout(initMobileMenu, 100);

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                // Close mobile menu if open
                const mobileMenu = document.querySelector('.mobile-menu');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    if (globalCloseMenuWithAnimation) {
                        globalCloseMenuWithAnimation();
                    } else {
                        // Fallback if global function not available
                        mobileMenu.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                }
                
                // Calculate offset for fixed header
                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});



// Calendar loading animation
document.addEventListener('DOMContentLoaded', function() {
    const calendarLoading = document.querySelector('.calendar-loading');
    const calendlyWrapper = document.querySelector('.calendly-wrapper');
    
    if (calendarLoading && calendlyWrapper) {
        // Hide loading after a short delay to simulate loading
        setTimeout(() => {
            calendarLoading.style.display = 'none';
        }, 2000);
        
        // Alternative: Hide loading when iframe loads
        const iframe = calendlyWrapper.querySelector('iframe');
        if (iframe) {
            iframe.addEventListener('load', function() {
                calendarLoading.style.display = 'none';
            });
        }
    }
});

// Intersection Observer for animations
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.benefit-card, .booking-feature, .dashboard-container');
    animateElements.forEach(el => {
        observer.observe(el);
    });
});

// Copy to clipboard functionality (if needed for sharing)
function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        return new Promise((resolve, reject) => {
            if (document.execCommand('copy')) {
                resolve();
            } else {
                reject();
            }
            document.body.removeChild(textArea);
        });
    }
}

// Lazy loading for images (if needed)
document.addEventListener('DOMContentLoaded', function() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
});

// Form validation (if you add forms later)
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Utility function to debounce function calls
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Wave Animation functionality
function initWaveAnimation() {
    const testimonialsSection = document.getElementById('testimonials');
    const waveAnimations = document.querySelectorAll('.wave-animation');
    
    if (!testimonialsSection || waveAnimations.length === 0) return;
    
    let animationTriggered = false;
    let animationIndex = 0;
    let staticWavesCreated = false;
    
    function triggerWaveAnimation() {
        if (animationIndex >= waveAnimations.length) {
            animationIndex = 0; // Reset for next scroll
        }
        
        const currentWave = waveAnimations[animationIndex];
        if (currentWave) {
            currentWave.classList.add('active');
            
            // Remove active class after animation completes and create static wave
            setTimeout(() => {
                currentWave.classList.remove('active');
                currentWave.classList.add('static');
            }, 3000);
            
            animationIndex++;
        }
    }
    
    function createStaticWaves() {
        if (staticWavesCreated) return;
        
        // Create static wave elements
        const waveContainer = document.querySelector('.wave-animation-container');
        if (waveContainer) {
            // Create static waves with different positions
            for (let i = 0; i < 3; i++) {
                const staticWave = document.createElement('div');
                staticWave.className = 'static-wave';
                staticWave.style.left = `${20 + (i * 25)}%`;
                staticWave.style.animationDelay = `${i * 0.5}s`;
                waveContainer.appendChild(staticWave);
            }
        }
        staticWavesCreated = true;
    }
    
    // Intersection Observer to detect when testimonials section is visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animationTriggered) {
                animationTriggered = true;
                
                // Trigger first wave immediately
                triggerWaveAnimation();
                
                // Trigger subsequent waves with delays
                setTimeout(() => triggerWaveAnimation(), 800);
                setTimeout(() => triggerWaveAnimation(), 1600);
                
                // Create static waves after animation completes
                setTimeout(() => {
                    createStaticWaves();
                }, 3500);
            }
        });
    }, {
        threshold: 0.3, // Trigger when 30% of section is visible
        rootMargin: '0px 0px -100px 0px'
    });
    
    observer.observe(testimonialsSection);
}

// FAQ Accordion functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
                question.setAttribute('aria-expanded', 'false');
            } else {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });
    
    // Open first FAQ item by default
    if (faqItems.length > 0) {
        faqItems[0].classList.add('active');
        faqItems[0].querySelector('.faq-question').setAttribute('aria-expanded', 'true');
    }
});

// Fade-in animations on scroll
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.05, // Reduced threshold for earlier triggering
        rootMargin: '0px 0px -20px 0px' // Reduced margin for earlier triggering
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                console.log('Fade-in animation triggered for:', entry.target);
                // Add a slight delay for staggered animations
                const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                entry.target.style.transitionDelay = `${delay}ms`;
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    const fadeElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .fade-in-scale');
    console.log('Found fade-in elements:', fadeElements.length);
    
    fadeElements.forEach(el => {
        observer.observe(el);
        console.log('Observing element:', el);
    });

    // Also trigger animations for elements that are already in view on page load
    setTimeout(() => {
        fadeElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const isInView = rect.top < window.innerHeight && rect.bottom > 0;
            if (isInView) {
                el.classList.add('visible');
                console.log('Element already in view, made visible:', el);
            }
        });
    }, 100);
}

// Testimonial Carousel
const testimonials = [
    {
        companySize: "Enterprise",
        industry: "Automotive",
        text: "We switched from Numa to PAM and immediately noticed the difference in simplicity and cost savings. The voice AI quality is incredible - our customers can't tell the difference from our best BDC reps. Highly recommend for any dealership looking to upgrade their customer experience.",
        authorName: "Sarah Johnson",
        authorTitle: "General Manager, Atlantic Coast Automotive",
        authorImage: "images/people/image (17).webp"
    },
    {
        companySize: "Mid-Market",
        industry: "Automotive",
        text: "The migration was seamless. PAM's team had us up and running in less than 24 hours with better voice AI than we had with Numa. Our service department is booking 40% more appointments and our customers love the natural conversations.",
        authorName: "Michael Chen",
        authorTitle: "Service Director, Midwest Auto Group",
        authorImage: "images/people/image (16).webp"
    },
    {
        companySize: "Enterprise",
        industry: "Automotive",
        text: "Finally, transparent pricing without hidden fees. PAM saved us thousands compared to Numa's surprise charges, and the revenue impact has been incredible. We're capturing $85K more per month in service revenue alone.",
        authorName: "Lisa Rodriguez",
        authorTitle: "Operations Manager, Southwest Dealership Network",
        authorImage: "images/people/image (10).webp"
    }
];

let currentTestimonial = 0;
let testimonialInterval;
let isHovered = false;
let lastInteractionTime = 0;

function updateTestimonial(index) {
    const testimonial = testimonials[index];
    
    // Update content with fade effect
    const card = document.querySelector('.testimonial-card-large');
    if (card) {
        card.style.opacity = '0.7';
        
        setTimeout(() => {
            document.getElementById('company-size').textContent = testimonial.companySize;
            document.getElementById('industry').textContent = testimonial.industry;
            document.getElementById('testimonial-text').textContent = testimonial.text;
            document.getElementById('author-name').textContent = testimonial.authorName;
            document.getElementById('author-title').textContent = testimonial.authorTitle;
            document.getElementById('author-image').src = testimonial.authorImage;
            document.getElementById('author-image').alt = testimonial.authorName;
            
            card.style.opacity = '1';
        }, 200);
    }
    
    // Update indicators
    document.querySelectorAll('.indicator').forEach((indicator, i) => {
        indicator.classList.toggle('active', i === index);
    });
}

function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    updateTestimonial(currentTestimonial);
}

// Remove or disable the auto-cycle timer for testimonials
function startTestimonialCarousel() {
    // Do nothing: autoplay is disabled
}

function stopTestimonialCarousel() {
    if (testimonialInterval) {
        clearInterval(testimonialInterval);
        testimonialInterval = null;
    }
}

function resetTestimonialTimer() {
    lastInteractionTime = Date.now();
    stopTestimonialCarousel();
    
    // Small delay before restarting to ensure clean state
    setTimeout(() => {
        if (!isHovered) {
            startTestimonialCarousel();
        }
    }, 100);
}

function initTestimonialCarousel() {
    const carousel = document.querySelector('.testimonial-carousel');
    const testimonialCard = document.querySelector('.testimonial-card-large');
    
    if (!carousel || !testimonialCard) return;
    
    // Add click handlers to indicators
    document.querySelectorAll('.indicator').forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentTestimonial = index;
            updateTestimonial(currentTestimonial);
            // Restart the auto-cycle timer
            resetTestimonialTimer();
        });
    });
    
    // Pause on hover with improved state management
    carousel.addEventListener('mouseenter', () => {
        isHovered = true;
        stopTestimonialCarousel();
    });
    
    carousel.addEventListener('mouseleave', () => {
        isHovered = false;
        // Small delay to prevent rapid start/stop cycles
        setTimeout(() => {
            if (!isHovered) {
                startTestimonialCarousel();
            }
        }, 200);
    });
    
    // Add swipe/drag functionality
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    
    // Mouse events
    testimonialCard.addEventListener('mousedown', handleStart);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    
    // Touch events
    testimonialCard.addEventListener('touchstart', handleStart, { passive: false });
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
    
    function handleStart(e) {
        isDragging = true;
        testimonialCard.style.cursor = 'grabbing';
        
        const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
        const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
        
        startX = clientX;
        startY = clientY;
        currentX = clientX;
        currentY = clientY;
        
        // Pause auto-cycling while dragging
        stopTestimonialCarousel();
        
        e.preventDefault();
    }
    
    function handleMove(e) {
        if (!isDragging) return;
        
        const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
        
        currentX = clientX;
        currentY = clientY;
        
        // Add visual feedback during drag
        const deltaX = currentX - startX;
        const opacity = Math.max(0.7, 1 - Math.abs(deltaX) / 200);
        testimonialCard.style.opacity = opacity;
        testimonialCard.style.transform = `translateX(${deltaX * 0.3}px)`;
        
        e.preventDefault();
    }
    
    function handleEnd(e) {
        if (!isDragging) return;
        
        isDragging = false;
        testimonialCard.style.cursor = 'grab';
        
        const deltaX = currentX - startX;
        const deltaY = currentY - startY;
        const threshold = 50;
        
        // Reset visual feedback
        testimonialCard.style.opacity = '';
        testimonialCard.style.transform = '';
        
        // Only handle horizontal swipes
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
            if (deltaX > 0) {
                // Swiped right - go to previous
                currentTestimonial = currentTestimonial === 0 ? testimonials.length - 1 : currentTestimonial - 1;
            } else {
                // Swiped left - go to next
                currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            }
            updateTestimonial(currentTestimonial);
        }
        
        // Reset timer after swipe
        resetTestimonialTimer();
        
        e.preventDefault();
    }
    
    // Keyboard navigation
    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            currentTestimonial = currentTestimonial === 0 ? testimonials.length - 1 : currentTestimonial - 1;
            updateTestimonial(currentTestimonial);
            resetTestimonialTimer();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            updateTestimonial(currentTestimonial);
            resetTestimonialTimer();
        }
    });
    
    // Make carousel focusable for keyboard navigation
    carousel.setAttribute('tabindex', '0');
    carousel.setAttribute('role', 'region');
    carousel.setAttribute('aria-label', 'Customer testimonials carousel');
    
    // Start the auto-cycle
    startTestimonialCarousel();
}

// Marquee Controls
function initMarqueeControls() {
    const marqueeContainers = document.querySelectorAll('.marquee-container');
    
    marqueeContainers.forEach((marqueeContainer, index) => {
        const marqueeTrack = marqueeContainer.querySelector('.marquee-track');
        
        if (!marqueeContainer || !marqueeTrack) return;

        // No cloning needed for static logo bars
        // const logoItems = marqueeTrack.querySelectorAll('.logo-item');
        // logoItems.forEach(item => {
        //     const clone = item.cloneNode(true);
        //     marqueeTrack.appendChild(clone);
        // });
        
        let isScrolling = false;
        let resumeTimer;
        let currentTranslateX = 0;
        
        function getCurrentTranslateX() {
            const transform = getComputedStyle(marqueeTrack).transform;
            if (transform === 'none') return 0;
            const matrix = transform.match(/matrix\((.+)\)/);
            return matrix ? parseFloat(matrix[1].split(', ')[4]) : 0;
        }

        // Pause animation on hover (desktop only)
        marqueeContainer.addEventListener('mouseenter', () => {
            // Only pause on desktop, not mobile
            if (window.innerWidth > 768) {
                marqueeTrack.classList.add('paused');
            }
        });

        // Resume animation on mouse leave (desktop only)
        marqueeContainer.addEventListener('mouseleave', () => {
            // Only resume on desktop, not mobile
            if (window.innerWidth > 768 && !isScrolling) {
                clearTimeout(resumeTimer);
                resumeTimer = setTimeout(() => {
                    marqueeTrack.classList.remove('paused');
                }, 500);
            }
        });

        // Touch/swipe support for mobile (optional - can be removed if not needed)
        let startX = 0;
        let startY = 0;
        
        marqueeContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        marqueeContainer.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Only handle horizontal swipes
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    // Swiped left, can add custom behavior here if needed
                } else {
                    // Swiped right, can add custom behavior here if needed
                }
            }
            
            startX = 0;
            startY = 0;
        });
    });
}

// Initialize animations and testimonial carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initScrollAnimations();
    initTestimonialCarousel();
    initMarqueeControls();
    initFAQAccordion();
    initWaveAnimation();
    
    // Ensure mobile marquee animations work
    if (window.innerWidth <= 768) {
        const marqueeTracks = document.querySelectorAll('.marquee-track');
        marqueeTracks.forEach(track => {
            track.classList.remove('paused');
        });
    }
});

// FAQ Accordion functionality
function initFAQAccordion() {
    // Handle both old and new FAQ formats
    const faqQuestions = document.querySelectorAll('.faq-question, .faq-question-large');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            const answer = question.nextElementSibling;
            
            // Close all other FAQs first
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== question) {
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    const otherAnswer = otherQuestion.nextElementSibling;
                    if (otherAnswer) {
                        otherAnswer.classList.remove('active');
                    }
                }
            });
            
            // Toggle current FAQ
            if (isExpanded) {
                question.setAttribute('aria-expanded', 'false');
                answer.classList.remove('active');
            } else {
                question.setAttribute('aria-expanded', 'true');
                answer.classList.add('active');
            }
        });
    });
}

// Console message for developers
console.log('%cPam AI Website', 'color: #6a2fec; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with ❤️ for car dealerships everywhere', 'color: #6ABCF8; font-size: 14px;'); 