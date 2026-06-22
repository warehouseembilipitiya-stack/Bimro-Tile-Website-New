/**
 * Bimro Tile - Products Page Specific JavaScript
 * Updated to match new HTML structure and enhanced features
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all products page-specific functions
    initializeGalleryImageSwitching();
    initializeSpecsTableInteractions();
    initializeProductCardAnimations();
    initializeScrollAnimations();
    initializeProductActions();
    initializeTouchGestures();
    initializeKeyboardNavigation();
});

/**
 * Gallery Image Switching - UPDATED for new structure
 * Handles main image switching with thumbnail clicks
 */
function initializeGalleryImageSwitching() {
    const thumbnails = document.querySelectorAll('.gallery-thumbnail');
    const mainImage = document.querySelector('.main-image');
    
    // Only initialize if elements exist
    if (thumbnails.length === 0 || !mainImage) return;
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            const thumbImg = this.querySelector('img');
            if (!thumbImg) return;
            
            // Remove active class from all thumbnails
            thumbnails.forEach(thumb => thumb.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            this.classList.add('active');
            
            // Add loading effect to main image
            mainImage.classList.add('loading');
            
            // Store current main image source
            const currentMainSrc = mainImage.src;
            const currentMainAlt = mainImage.alt;
            
            // Create new image to preload
            const newImage = new Image();
            
            newImage.onload = function() {
                // Smooth transition effect
                mainImage.style.opacity = '0.7';
                
                setTimeout(() => {
                    // Update main image
                    mainImage.src = thumbImg.src;
                    mainImage.alt = thumbImg.alt;
                    
                    // Update thumbnail with old main image
                    thumbImg.src = currentMainSrc;
                    thumbImg.alt = currentMainAlt;
                    
                    // Restore opacity and remove loading
                    mainImage.style.opacity = '1';
                    mainImage.classList.remove('loading');
                }, 300);
            };
            
            newImage.onerror = function() {
                // Remove loading effect on error
                mainImage.classList.remove('loading');
                console.warn('Failed to load image:', thumbImg.src);
            };
            
            // Start loading the new image
            newImage.src = thumbImg.src;
        });
    });
}

/**
 * Specifications Table Interactions
 * Enhanced hover effects for specification tables
 */
function initializeSpecsTableInteractions() {
    const specsRows = document.querySelectorAll('.specs-table tr');
    
    specsRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(3px)';
            this.style.boxShadow = '2px 0 0 var(--secondary-color)';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
            this.style.boxShadow = 'none';
        });
    });
}

/**
 * Product Card Animations
 * Staggered animations for related product cards
 */
function initializeProductCardAnimations() {
    const productCards = document.querySelectorAll('.product-card');
    
    if (productCards.length === 0) return;
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    productCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

/**
 * Scroll Animations
 * Enhanced scroll-triggered animations
 */
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.details-content, .details-specs, .gallery-container, .feature-item');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, index * 50);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Product Actions Enhanced
 * Improved functionality for action buttons
 */
function initializeProductActions() {
    const whatsappBtn = document.querySelector('.btn-whatsapp');
    const catalogBtn = document.querySelector('.btn-secondary');
    
    // WhatsApp button enhancement
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function(e) {
            // Add click effect
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Show loading state
            const originalHTML = this.innerHTML;
            this.innerHTML = '<i class="fab fa-whatsapp"></i> Opening WhatsApp...';
            
            setTimeout(() => {
                this.innerHTML = originalHTML;
            }, 2000);
            
            // Analytics tracking
            console.log('WhatsApp inquiry initiated for Modern Marble Collection');
            
            // Optional: Show notification
            showNotification('Opening WhatsApp...', 'success');
        });
    }
    
    // Catalog download button
    if (catalogBtn) {
        catalogBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add loading state
            const originalHTML = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing...';
            this.style.pointerEvents = 'none';
            
            // Simulate download preparation
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-check"></i> Download Ready';
                
                setTimeout(() => {
                    this.innerHTML = originalHTML;
                    this.style.pointerEvents = 'auto';
                    showNotification('Catalog download would start here. Contact us for the latest catalog.', 'info');
                }, 1500);
            }, 2000);
        });
    }
}

/**
 * Touch/Swipe Support for Mobile Gallery
 * Enhanced touch gestures for mobile devices
 */
function initializeTouchGestures() {
    const galleryMain = document.querySelector('.gallery-main');
    const thumbnails = document.querySelectorAll('.gallery-thumbnail');
    
    if (!galleryMain || thumbnails.length === 0) return;
    
    let startX = 0;
    let endX = 0;
    let startY = 0;
    let endY = 0;
    
    galleryMain.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }, { passive: true });
    
    galleryMain.addEventListener('touchend', function(e) {
        endX = e.changedTouches[0].clientX;
        endY = e.changedTouches[0].clientY;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diffX = startX - endX;
        const diffY = Math.abs(startY - endY);
        
        // Only trigger if horizontal swipe is stronger than vertical
        if (Math.abs(diffX) > swipeThreshold && diffY < Math.abs(diffX)) {
            const currentActive = document.querySelector('.gallery-thumbnail.active');
            const currentIndex = Array.from(thumbnails).indexOf(currentActive);
            
            let newIndex;
            if (diffX > 0) {
                // Swipe left - next image
                newIndex = currentIndex < thumbnails.length - 1 ? currentIndex + 1 : 0;
            } else {
                // Swipe right - previous image
                newIndex = currentIndex > 0 ? currentIndex - 1 : thumbnails.length - 1;
            }
            
            if (thumbnails[newIndex]) {
                thumbnails[newIndex].click();
                
                // Visual feedback
                galleryMain.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    galleryMain.style.transform = 'scale(1)';
                }, 200);
            }
        }
    }
}

/**
 * Keyboard Navigation Support
 * Enhanced keyboard accessibility
 */
function initializeKeyboardNavigation() {
    const thumbnails = document.querySelectorAll('.gallery-thumbnail');
    
    if (thumbnails.length === 0) return;
    
    // Make thumbnails focusable
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.setAttribute('tabindex', '0');
        thumbnail.setAttribute('role', 'button');
        thumbnail.setAttribute('aria-label', `Gallery image ${index + 1}`);
        
        thumbnail.addEventListener('keydown', function(e) {
            let newIndex = index;
            
            switch(e.key) {
                case 'ArrowLeft':
                    newIndex = index > 0 ? index - 1 : thumbnails.length - 1;
                    break;
                case 'ArrowRight':
                    newIndex = index < thumbnails.length - 1 ? index + 1 : 0;
                    break;
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    this.click();
                    return;
                default:
                    return;
            }
            
            e.preventDefault();
            thumbnails[newIndex].focus();
            thumbnails[newIndex].click();
        });
    });
    
    // Global keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Escape to close any active states
        if (e.key === 'Escape') {
            // Remove focus from any focused element
            if (document.activeElement) {
                document.activeElement.blur();
            }
        }
    });
}

/**
 * Feature Items Hover Enhancement
 * Enhanced interactions for feature grid items
 */
function initializeFeatureInteractions() {
    const featureItems = document.querySelectorAll('.feature-item');
    
    featureItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
            this.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
            
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1.1)';
                icon.style.color = 'var(--primary-color)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-2px) scale(1)';
            this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1)';
                icon.style.color = 'var(--secondary-color)';
            }
        });
    });
}

/**
 * Utility function to show notifications
 * Enhanced notification system
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Add icon based on type
    let icon = '';
    switch(type) {
        case 'success':
            icon = '<i class="fas fa-check-circle"></i> ';
            break;
        case 'info':
            icon = '<i class="fas fa-info-circle"></i> ';
            break;
        case 'warning':
            icon = '<i class="fas fa-exclamation-triangle"></i> ';
            break;
        case 'error':
            icon = '<i class="fas fa-times-circle"></i> ';
            break;
    }
    
    notification.innerHTML = icon + message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '80px', // Below header
        right: '20px',
        background: getNotificationColor(type),
        color: 'white',
        padding: '12px 20px',
        borderRadius: 'var(--border-radius)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: '9999',
        fontSize: '14px',
        fontWeight: '500',
        opacity: '0',
        transform: 'translateX(100%)',
        transition: 'all 0.3s ease',
        maxWidth: '300px',
        wordWrap: 'break-word'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

function getNotificationColor(type) {
    switch(type) {
        case 'success': return '#28a745';
        case 'info': return '#17a2b8';
        case 'warning': return '#ffc107';
        case 'error': return '#dc3545';
        default: return '#17a2b8';
    }
}

/**
 * Lazy Loading for Images
 * Performance optimization for gallery images
 */
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if (images.length === 0) return;
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        img.classList.add('lazy');
        imageObserver.observe(img);
    });
}

/**
 * Initialize additional features
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeFeatureInteractions();
    initializeLazyLoading();
});

// Add CSS for animations
const additionalCSS = `
.animate-in {
    animation: slideInUp 0.8s ease forwards;
}

@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.gallery-thumbnail:focus {
    outline: 2px solid var(--secondary-color);
    outline-offset: 2px;
}

.btn:focus {
    outline: 2px solid var(--secondary-color);
    outline-offset: 2px;
}

.feature-item {
    transition: all 0.3s ease;
}

.feature-item i {
    transition: all 0.3s ease;
}

img.lazy {
    opacity: 0;
    transition: opacity 0.3s;
}

img.loaded {
    opacity: 1;
}

.notification {
    font-family: var(--font-primary);
}
`;

// Add the additional CSS to the page
if (!document.getElementById('products-additional-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'products-additional-styles';
    styleSheet.textContent = additionalCSS;
    document.head.appendChild(styleSheet);
}