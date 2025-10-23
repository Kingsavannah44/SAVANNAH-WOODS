// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.menu-item, .testimonial, .gallery-item, .heritage-item').forEach(item => {
    observer.observe(item);
});

// Reservation Form Handling
const reservationForm = document.getElementById('reservationForm');

if (reservationForm) {
    reservationForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(this);
        const reservationData = Object.fromEntries(formData);

        // Basic validation
        if (!validateReservationForm(reservationData)) {
            return;
        }

        // Send form data to backend API
        submitReservationForm(reservationData);

        // Reset form
        this.reset();
    });
}

function validateReservationForm(data) {
    const requiredFields = ['name', 'email', 'phone', 'date', 'time', 'guests'];

    for (const field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            showNotification(`Please fill in the ${field.replace('-', ' ')} field.`, 'error');
            return false;
        }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showNotification('Please enter a valid email address.', 'error');
        return false;
    }

    // Phone validation (Kenya format)
    const phoneRegex = /^(\+254|0)[17]\d{8}$/;
    const cleanPhone = data.phone.replace(/[\s\-\(\)]/g, '');
    if (!phoneRegex.test(cleanPhone)) {
        showNotification('Please enter a valid Kenyan phone number (e.g., +254712345678 or 0712345678).', 'error');
        return false;
    }

    // Date validation (not in the past)
    const selectedDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        showNotification('Please select a future date.', 'error');
        return false;
    }

    return true;
}

// Function to submit reservation form data to backend
async function submitReservationForm(data) {
    try {
        const response = await fetch('http://localhost:3000/reservations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: data.name,
                email: data.email,
                phone: data.phone,
                date: data.date,
                time: data.time,
                guests: data.guests,
                specialRequests: data['special-requests'] || '',
                submittedAt: new Date().toISOString()
            })
        });

        if (response.ok) {
            showNotification('Reservation request submitted successfully! We will contact you shortly.', 'success');
        } else {
            throw new Error('Failed to submit reservation');
        }
    } catch (error) {
        console.error('Error submitting reservation:', error);
        showNotification('Failed to submit reservation. Please try again or contact us directly.', 'error');
    }
}

// Newsletter Form Handling
const newsletterForm = document.querySelector('.newsletter-form');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = this.querySelector('input[type="email"]').value;

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }

        // Simulate newsletter subscription (replace with actual API call)
        showNotification('Thank you for subscribing! You will receive our latest updates.', 'success');

        // Reset form
        this.reset();
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        backgroundColor: type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3',
        color: 'white',
        padding: '15px 20px',
        borderRadius: '5px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: '10000',
        maxWidth: '400px',
        fontWeight: '500',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Dynamic Hero Image Loading with Parallax Effect
class HeroImageLoader {
    constructor() {
        this.heroImages = document.querySelectorAll('.hero-image img, .about-image img, .contact-hero img');
        this.init();
    }

    init() {
        this.heroImages.forEach(img => {
            this.setupImage(img);
        });

        // Add parallax effect for hero sections
        this.addParallaxEffect();
    }

    setupImage(img) {
        // Add loading state
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';

        // Create loading spinner
        const spinner = document.createElement('div');
        spinner.className = 'image-spinner';
        spinner.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 40px;
            height: 40px;
            border: 4px solid rgba(212, 175, 55, 0.3);
            border-top: 4px solid #d4af37;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            z-index: 1;
        `;

        // Position spinner relative to image
        const container = img.parentElement;
        container.style.position = 'relative';
        container.appendChild(spinner);

        // Handle image load
        img.addEventListener('load', () => {
            spinner.remove();
            img.style.opacity = '1';

            // Add loaded class for additional effects
            img.classList.add('image-loaded');
        });

        // Handle image error
        img.addEventListener('error', () => {
            spinner.remove();
            img.style.opacity = '1';
            img.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
        });

        // Trigger load if image is already cached
        if (img.complete) {
            img.dispatchEvent(new Event('load'));
        }
    }

    addParallaxEffect() {
        const heroSections = document.querySelectorAll('.hero, .about-hero, .contact-hero');

        heroSections.forEach(section => {
            const img = section.querySelector('img');
            if (!img) return;

            let ticking = false;

            const updateParallax = () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;

                img.style.transform = `translateY(${rate}px)`;
                ticking = false;
            };

            const requestTick = () => {
                if (!ticking) {
                    requestAnimationFrame(updateParallax);
                    ticking = true;
                }
            };

            window.addEventListener('scroll', requestTick);
        });
    }
}

// Enhanced Image Lazy Loading with Progressive Loading
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;

                    // Add blur placeholder initially
                    if (!img.classList.contains('hero-loaded')) {
                        img.style.filter = 'blur(10px)';
                        img.style.transition = 'filter 0.3s ease';
                    }

                    // Load image
                    img.classList.add('fade-in-up');

                    // Remove blur after load
                    img.addEventListener('load', () => {
                        img.style.filter = 'none';
                    });

                    observer.unobserve(img);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px 0px'
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => {
            img.classList.add('fade-in-up');
            img.addEventListener('load', () => {
                img.style.filter = 'none';
            });
        });
    }

    // Initialize hero image loader
    new HeroImageLoader();
});

// Enhanced Menu Item Hover Effects with Zoom Transitions
document.querySelectorAll('.menu-item').forEach(item => {
    const img = item.querySelector('img');
    const content = item.querySelector('.menu-item-content');
    const button = item.querySelector('.add-to-cart-btn');

    // Add initial state
    if (img) {
        img.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        img.style.transformOrigin = 'center center';
    }

    item.addEventListener('mouseenter', function() {
        // Lift effect with smooth transition
        this.style.transform = 'translateY(-15px) scale(1.05)';
        this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.25)';
        this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';

        // Enhanced image zoom effect with rotation
        if (img) {
            img.style.transform = 'scale(1.2) rotate(3deg)';
            img.style.filter = 'brightness(1.1) contrast(1.1) saturate(1.1)';
        }

        // Content slide up with fade
        if (content) {
            content.style.transform = 'translateY(-8px)';
            content.style.opacity = '0.9';
            content.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        }

        // Button enhanced glow effect
        if (button) {
            button.style.boxShadow = '0 0 30px rgba(212, 175, 55, 0.8), 0 0 60px rgba(212, 175, 55, 0.4)';
            button.style.transform = 'scale(1.08)';
            button.style.backgroundColor = '#b8860b';
        }
    });

    item.addEventListener('mouseleave', function() {
        // Smooth reset effects
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '';

        if (img) {
            img.style.transform = 'scale(1) rotate(0deg)';
            img.style.filter = 'none';
        }

        if (content) {
            content.style.transform = 'translateY(0)';
            content.style.opacity = '1';
        }

        if (button) {
            button.style.boxShadow = '';
            button.style.transform = 'scale(1)';
            button.style.backgroundColor = '#d4af37';
        }
    });

    // Enhanced click effect for images with zoom transition
    if (img) {
        img.addEventListener('click', function(e) {
            e.stopPropagation();

            // Create image preview modal with zoom transition
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.95);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                cursor: pointer;
                animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                backdrop-filter: blur(10px);
            `;

            const modalImg = document.createElement('img');
            modalImg.src = this.src.replace(/w=\d+&h=\d+/, 'w=1200&h=800'); // Higher resolution for modal
            modalImg.style.cssText = `
                max-width: 85%;
                max-height: 85%;
                object-fit: contain;
                border-radius: 15px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
                animation: zoomInScale 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                transform-origin: center center;
            `;

            // Add zoom controls
            const zoomControls = document.createElement('div');
            zoomControls.style.cssText = `
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                gap: 10px;
                background: rgba(0, 0, 0, 0.7);
                padding: 10px 20px;
                border-radius: 25px;
                backdrop-filter: blur(10px);
            `;

            const zoomInBtn = document.createElement('button');
            zoomInBtn.textContent = '+';
            zoomInBtn.style.cssText = `
                background: #d4af37;
                color: #2c1810;
                border: none;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.3s ease;
            `;

            const zoomOutBtn = document.createElement('button');
            zoomOutBtn.textContent = '−';
            zoomOutBtn.style.cssText = zoomInBtn.style.cssText;

            zoomControls.appendChild(zoomOutBtn);
            zoomControls.appendChild(zoomInBtn);

            modal.appendChild(modalImg);
            modal.appendChild(zoomControls);
            document.body.appendChild(modal);

            let currentZoom = 1;
            const maxZoom = 3;
            const minZoom = 0.5;

            zoomInBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (currentZoom < maxZoom) {
                    currentZoom += 0.25;
                    modalImg.style.transform = `scale(${currentZoom})`;
                }
            });

            zoomOutBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (currentZoom > minZoom) {
                    currentZoom -= 0.25;
                    modalImg.style.transform = `scale(${currentZoom})`;
                }
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.animation = 'fadeOut 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                    modalImg.style.animation = 'zoomOutScale 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                    setTimeout(() => {
                        if (modal.parentNode) {
                            modal.parentNode.removeChild(modal);
                        }
                    }, 400);
                }
            });
        });
    }
});

// Dynamic Gallery Slideshow with Image Transitions
class GallerySlideshow {
    constructor() {
        this.galleryItems = document.querySelectorAll('.gallery-item');
        this.currentIndex = 0;
        this.slideshowInterval = null;
        this.isPlaying = false;
        this.transitionDuration = 800; // ms

        this.init();
    }

    init() {
        if (this.galleryItems.length === 0) return;

        this.createSlideshowControls();
        this.addSlideshowFunctionality();
        this.setupInitialState();
        this.startAutoSlideshow();
    }

    createSlideshowControls() {
        const gallerySection = document.querySelector('.gallery-section');
        if (!gallerySection) return;

        const controls = document.createElement('div');
        controls.className = 'slideshow-controls';
        controls.innerHTML = `
            <button class="slideshow-btn prev-btn">❮</button>
            <button class="slideshow-btn play-pause-btn">⏸️</button>
            <button class="slideshow-btn next-btn">❯</button>
            <div class="slideshow-indicators"></div>
        `;

        gallerySection.insertBefore(controls, gallerySection.firstElementChild.nextSibling);

        // Create indicators
        const indicators = controls.querySelector('.slideshow-indicators');
        this.galleryItems.forEach((_, index) => {
            const indicator = document.createElement('span');
            indicator.className = `indicator ${index === 0 ? 'active' : ''}`;
            indicator.addEventListener('click', () => this.goToSlide(index));
            indicators.appendChild(indicator);
        });
    }

    setupInitialState() {
        // Set initial states for smooth transitions
        this.galleryItems.forEach((item, index) => {
            item.style.position = 'absolute';
            item.style.top = '0';
            item.style.left = '0';
            item.style.width = '100%';
            item.style.opacity = index === 0 ? '1' : '0';
            item.style.zIndex = index === 0 ? '2' : '1';
            item.style.transition = `opacity ${this.transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        });
    }

    addSlideshowFunctionality() {
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const playPauseBtn = document.querySelector('.play-pause-btn');

        if (prevBtn) prevBtn.addEventListener('click', () => this.previousSlide());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());
        if (playPauseBtn) playPauseBtn.addEventListener('click', () => this.togglePlayPause());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.previousSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
            if (e.key === ' ') {
                e.preventDefault();
                this.togglePlayPause();
            }
        });

        // Touch/swipe support for mobile
        this.addTouchSupport();
    }

    addTouchSupport() {
        let startX = 0;
        let endX = 0;

        const galleryContainer = document.querySelector('.gallery-grid');
        if (!galleryContainer) return;

        galleryContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        galleryContainer.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;

            if (Math.abs(diffX) > 50) { // Minimum swipe distance
                if (diffX > 0) {
                    this.nextSlide(); // Swipe left
                } else {
                    this.previousSlide(); // Swipe right
                }
            }
        });
    }

    showSlide(index, direction = 'next') {
        const currentItem = this.galleryItems[this.currentIndex];
        const nextItem = this.galleryItems[index];

        // Set transition direction
        const transformDirection = direction === 'next' ? '-100%' : '100%';

        // Prepare next slide
        nextItem.style.opacity = '0';
        nextItem.style.zIndex = '3';
        nextItem.style.transform = `translateX(${transformDirection})`;
        nextItem.style.transition = 'none';

        // Force reflow
        nextItem.offsetHeight;

        // Start transition
        requestAnimationFrame(() => {
            nextItem.style.transition = `opacity ${this.transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${this.transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
            nextItem.style.opacity = '1';
            nextItem.style.transform = 'translateX(0)';

            currentItem.style.opacity = '0';
        });

        // Clean up after transition
        setTimeout(() => {
            currentItem.style.zIndex = '1';
            nextItem.style.zIndex = '2';
            nextItem.style.transform = 'translateX(0)';
        }, this.transitionDuration);

        // Update indicators
        document.querySelectorAll('.indicator').forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });

        this.currentIndex = index;
    }

    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.galleryItems.length;
        this.showSlide(nextIndex, 'next');
    }

    previousSlide() {
        const prevIndex = (this.currentIndex - 1 + this.galleryItems.length) % this.galleryItems.length;
        this.showSlide(prevIndex, 'prev');
    }

    goToSlide(index) {
        if (index === this.currentIndex) return;

        const direction = index > this.currentIndex ? 'next' : 'prev';
        this.showSlide(index, direction);
    }

    togglePlayPause() {
        const playPauseBtn = document.querySelector('.play-pause-btn');
        if (this.isPlaying) {
            this.stopAutoSlideshow();
            playPauseBtn.textContent = '▶️';
        } else {
            this.startAutoSlideshow();
            playPauseBtn.textContent = '⏸️';
        }
    }

    startAutoSlideshow() {
        if (this.slideshowInterval) return;

        this.isPlaying = true;
        this.slideshowInterval = setInterval(() => {
            this.nextSlide();
        }, 4000); // Change slide every 4 seconds
    }

    stopAutoSlideshow() {
        if (this.slideshowInterval) {
            clearInterval(this.slideshowInterval);
            this.slideshowInterval = null;
        }
        this.isPlaying = false;
    }
}

// Hero Image Carousel
class HeroImageCarousel {
    constructor() {
        this.currentIndex = 0;
        this.thumbnails = document.querySelectorAll('.thumbnail');
        this.mainImage = document.querySelector('.hero-main-image img');
        this.prevBtn = document.querySelector('.hero-carousel-controls .prev-btn');
        this.nextBtn = document.querySelector('.hero-carousel-controls .next-btn');
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // 5 seconds

        this.init();
    }

    init() {
        if (!this.thumbnails.length || !this.mainImage) return;

        this.setupEventListeners();
        this.startAutoPlay();
        this.updateActiveThumbnail();
    }

    setupEventListeners() {
        // Thumbnail click events
        this.thumbnails.forEach((thumbnail, index) => {
            thumbnail.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });

        // Navigation button events
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.previousSlide();
            });
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.nextSlide();
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.previousSlide();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.nextSlide();
            }
        });

        // Pause autoplay on hover
        const carousel = document.querySelector('.hero-image-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => {
                this.stopAutoPlay();
            });

            carousel.addEventListener('mouseleave', () => {
                this.startAutoPlay();
            });
        }

        // Touch/swipe support
        this.addTouchSupport();
    }

    addTouchSupport() {
        let startX = 0;
        let endX = 0;
        const carousel = document.querySelector('.hero-image-carousel');

        if (!carousel) return;

        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        carousel.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;

            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            }
        });
    }

    goToSlide(index) {
        if (index === this.currentIndex) return;

        const thumbnail = this.thumbnails[index];
        const newImageSrc = thumbnail.getAttribute('data-image');

        // Add transition effect
        this.mainImage.style.opacity = '0';
        this.mainImage.style.transform = 'scale(0.95)';

        setTimeout(() => {
            this.mainImage.src = newImageSrc;
            this.mainImage.style.opacity = '1';
            this.mainImage.style.transform = 'scale(1)';
        }, 200);

        this.currentIndex = index;
        this.updateActiveThumbnail();
    }

    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.thumbnails.length;
        this.goToSlide(nextIndex);
    }

    previousSlide() {
        const prevIndex = (this.currentIndex - 1 + this.thumbnails.length) % this.thumbnails.length;
        this.goToSlide(prevIndex);
    }

    updateActiveThumbnail() {
        this.thumbnails.forEach((thumbnail, index) => {
            thumbnail.classList.toggle('active', index === this.currentIndex);
        });
    }

    startAutoPlay() {
        if (this.autoPlayInterval) return;

        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// Initialize gallery slideshow and hero carousel
document.addEventListener('DOMContentLoaded', () => {
    new GallerySlideshow();
    new HeroImageCarousel();
});

// Enhanced Gallery Image Modal
document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('click', function() {
        // Create modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.95);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            cursor: pointer;
            animation: fadeIn 0.3s ease;
        `;

        const modalImg = document.createElement('img');
        modalImg.src = this.src;
        modalImg.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            animation: zoomIn 0.3s ease;
        `;

        // Add caption
        const caption = this.parentElement.querySelector('h3, p');
        if (caption) {
            const captionDiv = document.createElement('div');
            captionDiv.textContent = caption.textContent;
            captionDiv.style.cssText = `
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                color: white;
                background-color: rgba(0, 0, 0, 0.7);
                padding: 10px 20px;
                border-radius: 20px;
                font-size: 16px;
                font-weight: 500;
            `;
            modal.appendChild(captionDiv);
        }

        modal.appendChild(modalImg);
        document.body.appendChild(modal);

        // Close modal on click
        modal.addEventListener('click', () => {
            modal.style.animation = 'fadeOut 0.3s ease';
            modalImg.style.animation = 'zoomOut 0.3s ease';
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            }, 300);
        });
    });
});

// Scroll to Top Button
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '↑';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    background-color: #d4af37;
    color: #2c1810;
    border: none;
    border-radius: 50%;
    font-size: 20px;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1000;
`;

document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.style.opacity = '1';
    } else {
        scrollToTopBtn.style.opacity = '0';
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Menu Search and Filter Functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('menu-search');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartBtn = document.getElementById('cart-btn');
    const cartCount = document.getElementById('cart-count');

    let cart = JSON.parse(localStorage.getItem('restaurantCart')) || [];

    // Update cart count display
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    // Initialize cart count
    updateCartCount();

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();

            menuItems.forEach(item => {
                const itemName = item.querySelector('h3').textContent.toLowerCase();
                const itemDesc = item.querySelector('p').textContent.toLowerCase();

                if (itemName.includes(searchTerm) || itemDesc.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter items
            menuItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Add to cart functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));

            // Check if item already in cart
            const existingItem = cart.find(item => item.name === name);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    name: name,
                    price: price,
                    quantity: 1
                });
            }

            // Save to localStorage
            localStorage.setItem('restaurantCart', JSON.stringify(cart));
            updateCartCount();

            // Show notification
            showNotification(`${name} added to cart!`, 'success');

            // Animate button
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Cart modal functionality
    if (cartBtn) {
        cartBtn.addEventListener('click', function() {
            showCartModal();
        });
    }

    function showCartModal() {
        // Remove existing modal
        const existingModal = document.querySelector('.cart-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'cart-modal';
        modal.innerHTML = `
            <div class="cart-modal-content">
                <div class="cart-modal-header">
                    <h3>Your Cart</h3>
                    <button class="cart-modal-close">&times;</button>
                </div>
                <div class="cart-items">
                    ${cart.length === 0 ? '<p>Your cart is empty</p>' : cart.map(item => `
                        <div class="cart-item">
                            <div class="cart-item-info">
                                <h4>${item.name}</h4>
                                <p>$${item.price.toFixed(2)} × ${item.quantity}</p>
                            </div>
                            <div class="cart-item-controls">
                                <button class="quantity-btn" data-action="decrease" data-name="${item.name}">-</button>
                                <span class="quantity">${item.quantity}</span>
                                <button class="quantity-btn" data-action="increase" data-name="${item.name}">+</button>
                                <button class="remove-btn" data-name="${item.name}">Remove</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                ${cart.length > 0 ? `
                    <div class="cart-total">
                        <strong>Total: $${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</strong>
                    </div>
                    <div class="cart-actions">
                        <button class="checkout-btn">Proceed to Checkout</button>
                        <button class="clear-cart-btn">Clear Cart</button>
                    </div>
                ` : ''}
            </div>
        `;

        document.body.appendChild(modal);

        // Modal event listeners
        modal.querySelector('.cart-modal-close').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Quantity and remove buttons
        modal.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const action = this.getAttribute('data-action');
                const name = this.getAttribute('data-name');
                const item = cart.find(item => item.name === name);

                if (action === 'increase') {
                    item.quantity += 1;
                } else if (action === 'decrease' && item.quantity > 1) {
                    item.quantity -= 1;
                }

                localStorage.setItem('restaurantCart', JSON.stringify(cart));
                updateCartCount();
                showCartModal(); // Refresh modal
            });
        });

        modal.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const name = this.getAttribute('data-name');
                cart = cart.filter(item => item.name !== name);
                localStorage.setItem('restaurantCart', JSON.stringify(cart));
                updateCartCount();
                showCartModal(); // Refresh modal
            });
        });

        // Clear cart
        const clearBtn = modal.querySelector('.clear-cart-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', function() {
                cart = [];
                localStorage.setItem('restaurantCart', JSON.stringify(cart));
                updateCartCount();
                showCartModal(); // Refresh modal
            });
        }

        // Checkout (placeholder)
        const checkoutBtn = modal.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function() {
                showNotification('Checkout functionality coming soon!', 'info');
            });
        }
    }
});

// Form Input Enhancements
document.querySelectorAll('input, select, textarea').forEach(element => {
    element.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });

    element.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('focused');
        }
    });
});