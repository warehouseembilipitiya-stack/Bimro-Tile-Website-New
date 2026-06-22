/**
 * Bimro Tile - Home Page Specific JavaScript
 * Handles all interactive elements specific to the homepage
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all homepage-specific functions
    heroSlider();
    productCategoryFilter();
    newsletterSubscription();
    brandsCarousel();
});

/**
 * Hero Slider
 * Controls the hero section image slider with automatic and manual navigation
 * With improved handling for scroll events and visibility
 */
function heroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    let currentSlide = 0;
    let slideInterval;
    
    // Only initialize if elements exist
    if (slides.length === 0 || dots.length === 0) return;
    
    // Initialize slider
    function initSlider() {
        // Set first slide as active
        slides[0].classList.add('active');
        dots[0].classList.add('active');
        
        // Start automatic slideshow
        startSlideshow();
        
        // Add click events to dots for manual navigation
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const slideIndex = parseInt(dot.getAttribute('data-slide'));
                currentSlide = slideIndex;
                showSlide(currentSlide);
                resetSlideshow();
            });
        });
    }
    
    // Show specific slide
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }
    
    // Advance to next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    // Start automatic slideshow
    function startSlideshow() {
        // Prevent multiple intervals
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
        slideInterval = setInterval(nextSlide, 4000); // Change slide every 4 seconds
    }
    
    // Reset slideshow timer (after manual navigation)
    function resetSlideshow() {
        clearInterval(slideInterval);
        startSlideshow();
    }
    
    // Check if element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom > 0 &&
            rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
            rect.right > 0
        );
    }
    
    // Handle visibility changes (scroll events, tab changes)
    function handleVisibilityChange() {
        // Get the hero section
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;
        
        // Check if hero section is visible
        if (isElementInViewport(heroSection)) {
            startSlideshow(); // Resume slideshow if visible
        } else {
            clearInterval(slideInterval); // Pause slideshow if not visible
        }
    }
    
    // Add event listeners for visibility changes
    window.addEventListener('scroll', handleVisibilityChange);
    window.addEventListener('resize', handleVisibilityChange);
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            startSlideshow();
        } else {
            clearInterval(slideInterval);
        }
    });
    
    // Pause slideshow on hover (optional)
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        heroSection.addEventListener('mouseleave', () => {
            startSlideshow();
        });
    }
    
    // Initialize the slider
    initSlider();
    
    // Initial visibility check
    handleVisibilityChange();

    // Ensure slideshow starts on page load if hero is at least partially visible
    if (heroSection && isElementInViewport(heroSection)) {
        startSlideshow();
    }
}

/**
 * Product Category Filter
 * Filters products based on category selection
 */
function productCategoryFilter() {
    const categoryButtons = document.querySelectorAll('.product-category-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    // Only initialize if elements exist
    if (categoryButtons.length === 0 || productCards.length === 0) return;
    
    // Add click event to each category button
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Get selected category
            const filterCategory = this.getAttribute('data-category');
            
            // Filter products
            filterProducts(filterCategory);
        });
    });
    
    // Filter products based on selected category
    function filterProducts(category) {
        productCards.forEach(card => {
            const productCategory = card.getAttribute('data-category');
            
            if (category === 'all' || productCategory === category) {
                // Show product with animation
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            } else {
                // Hide product with animation
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }
}

/**
 * Brands Logo Carousel
 * Controls the automatic and manual sliding of brand logos
 */
function brandsCarousel() {
    const track = document.querySelector('.brands-track');
    const items = document.querySelectorAll('.brand-item');
    const prevBtn = document.querySelector('.brands-prev');
    const nextBtn = document.querySelector('.brands-next');
    
    // Only initialize if elements exist
    if (!track || items.length === 0) return;
    
    let currentPosition = 0;
    let itemWidth = 20; // This should match the CSS flex percentage
    const itemCount = items.length;
    const visibleItems = 5; // Number of visible items at once
    const slideDelay = 3000; // 3 seconds per slide
    let autoSlideInterval;
    
    // Duplicate items for seamless infinite loop
    function duplicateItems() {
        // Clone the first set of items and append to the end
        items.forEach(item => {
            const clone = item.cloneNode(true);
            track.appendChild(clone);
        });
    }
    
    // Initialize the carousel
    function initCarousel() {
        // Duplicate items for infinite scroll
        duplicateItems();
        
        // Start auto sliding
        startAutoSlide();
        
        // Add click events to arrows
        prevBtn.addEventListener('click', slidePrev);
        nextBtn.addEventListener('click', slideNext);
        
        // Pause on hover
        track.addEventListener('mouseenter', pauseAutoSlide);
        track.addEventListener('mouseleave', startAutoSlide);
    }
    
    // Slide to a specific position
    function slideTo(position) {
        track.style.transform = `translateX(-${position}%)`;
    }
    
    // Slide to previous set
    function slidePrev() {
        resetAutoSlide();
        
        currentPosition -= itemWidth;
        
        // Check if we need to jump to the end (for infinite loop)
        if (currentPosition < 0) {
            // Jump to duplicate section without transition
            track.style.transition = 'none';
            currentPosition = itemWidth * itemCount;
            slideTo(currentPosition);
            
            // Force reflow
            track.offsetHeight;
            
            // Restore transition and slide one step back
            track.style.transition = 'transform 0.3s ease';
            currentPosition -= itemWidth;
        }
        
        slideTo(currentPosition);
    }
    
    // Slide to next set
    function slideNext() {
        resetAutoSlide();
        
        currentPosition += itemWidth;
        
        // Check if we need to jump to the start (for infinite loop)
        if (currentPosition >= itemWidth * (itemCount + visibleItems)) {
            // Wait for transition to complete
            setTimeout(() => {
                // Jump to original section without transition
                track.style.transition = 'none';
                currentPosition = 0;
                slideTo(currentPosition);
                
                // Force reflow
                track.offsetHeight;
                
                // Restore transition
                track.style.transition = 'transform 0.3s ease';
            }, 300);
        }
        
        slideTo(currentPosition);
    }
    
    // Start automatic sliding
    function startAutoSlide() {
        if (!autoSlideInterval) {
            autoSlideInterval = setInterval(slideNext, slideDelay);
        }
    }
    
    // Pause automatic sliding
    function pauseAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }
    
    // Reset the auto slide timer
    function resetAutoSlide() {
        pauseAutoSlide();
        startAutoSlide();
    }
    
    // Adjust for different screen sizes
    function adjustForScreenSize() {
        // Check window width and update itemWidth
        if (window.innerWidth <= 576) {
            // Mobile: 2 visible items
            itemWidth = 50;
        } else if (window.innerWidth <= 768) {
            // Tablet: 3 visible items
            itemWidth = 33.333;
        } else if (window.innerWidth <= 992) {
            // Small desktop: 4 visible items
            itemWidth = 25;
        } else {
            // Large desktop: 5 visible items
            itemWidth = 20;
        }
        
        // Update the current position to reflect the new itemWidth
        slideTo(currentPosition);
    }
    
    // Handle window resize
    window.addEventListener('resize', adjustForScreenSize);
    
    // Initialize the carousel
    initCarousel();
}

/**
 * Newsletter Subscription
 * Handles newsletter form submission and success message display
 */
function newsletterSubscription() {
    const form = document.querySelector('.newsletter-form');
    
    // Only initialize if form exists
    if (!form) return;
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get email input
        const emailInput = this.querySelector('input[type="email"]');
        
        // Validate email input
        if (emailInput && emailInput.value) {
            // In a real implementation, you would send this to your backend
            // For now, just show success message
            displaySuccessMessage(form);
        }
    });
    
    // Display success message after form submission
    function displaySuccessMessage(form) {
        // Create success message element
        const successMessage = document.createElement('div');
        successMessage.className = 'newsletter-success';
        successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Thank you for subscribing to our newsletter!';
        
        // Get container and add success message
        const newsletterContainer = form.closest('.newsletter .container');
        newsletterContainer.appendChild(successMessage);
        
        // Hide form with animation
        form.style.opacity = '0';
        setTimeout(() => {
            form.style.display = 'none';
            // Show success message with animation
            successMessage.style.opacity = '1';
        }, 300);
    }
}