/**
 * Bimro Tile - Branches Page Specific JavaScript
 * Handles all interactive elements specific to the branches page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all branches page-specific functions
    initializeBranchSearch();
    initializeBranchFilters();
    initializeDirectionsButtons();
    initializeScrollAnimations();
    initializeBranchStatusUpdater();
    initializeContactButtons();
});

/**
 * Branch Search Functionality
 * Filters branches based on search input
 */
function initializeBranchSearch() {
    const searchInput = document.getElementById('branchSearch');
    const branchCards = document.querySelectorAll('.branch-card');
    const noResults = document.getElementById('noResults');
    
    if (!searchInput || branchCards.length === 0) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        let visibleCards = 0;
        
        branchCards.forEach(card => {
            const branchName = card.querySelector('.branch-name').textContent.toLowerCase();
            const branchLocation = card.querySelector('.branch-location').textContent.toLowerCase();
            const branchAddress = card.querySelector('.detail-item span').textContent.toLowerCase();
            
            const isMatch = branchName.includes(searchTerm) || 
                          branchLocation.includes(searchTerm) || 
                          branchAddress.includes(searchTerm);
            
            if (isMatch) {
                card.style.display = 'block';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                visibleCards++;
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
        
        // Show/hide no results message
        if (visibleCards === 0 && searchTerm !== '') {
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
        }
        
        // Update active filter if search is active
        if (searchTerm !== '') {
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
        }
    });
    
    // Clear search functionality
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            this.value = '';
            this.dispatchEvent(new Event('input'));
            this.blur();
        }
    });
}

/**
 * Branch Filter Functionality
 * Filters branches by category (all, main, showroom)
 */
function initializeBranchFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const branchCards = document.querySelectorAll('.branch-card');
    const searchInput = document.getElementById('branchSearch');
    const noResults = document.getElementById('noResults');
    
    if (filterButtons.length === 0 || branchCards.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Clear search input
            if (searchInput) {
                searchInput.value = '';
            }
            
            const filterCategory = this.getAttribute('data-filter');
            let visibleCards = 0;
            
            branchCards.forEach((card, index) => {
                const cardCategory = card.getAttribute('data-category');
                
                if (filterCategory === 'all' || cardCategory === filterCategory) {
                    // Show card with staggered animation
                    setTimeout(() => {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    }, index * 100);
                    visibleCards++;
                } else {
                    // Hide card
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
            
            // Hide no results message when filtering
            noResults.style.display = 'none';
        });
    });
}

/**
 * Directions Button Functionality
 * Handles click events for direction buttons
 */
function initializeDirectionsButtons() {
    const directionsButtons = document.querySelectorAll('.directions-btn');
    
    // Branch coordinates (you can replace with actual coordinates)
    const branchCoordinates = {
        'embilipitiya': { lat: 6.3431, lng: 80.8498, address: 'Moraketiya Road, Pallegama, Embilipitiya' },
        'tissa': { lat: 6.2882, lng: 81.2877, address: 'Main Street, Tissamaharama' },
        'pellmadulla': { lat: 6.9597, lng: 80.5771, address: 'Colombo Road, Pellmadulla' },
        'rakwana': { lat: 6.4167, lng: 80.5833, address: 'Ratnapura Road, Rakwana' }
    };
    
    directionsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const location = this.getAttribute('data-location');
            const branchData = branchCoordinates[location];
            
            if (branchData) {
                // Add loading state
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening...';
                this.disabled = true;
                
                // Create Google Maps URL
                const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(branchData.address)}&travelmode=driving`;
                
                // Open in new tab
                setTimeout(() => {
                    window.open(mapsUrl, '_blank');
                    
                    // Restore button
                    this.innerHTML = originalText;
                    this.disabled = false;
                }, 1000);
                
                // Track analytics (optional)
                console.log(`Directions requested for: ${location}`);
            }
        });
    });
}

/**
 * Scroll Animations
 * Handles scroll-triggered animations for branch cards
 */
function initializeScrollAnimations() {
    const branchCards = document.querySelectorAll('.branch-card');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered animation delay
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, index * 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    branchCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        observer.observe(card);
    });
}

/**
 * Branch Status Updater
 * Updates the open/closed status based on current time
 */
function initializeBranchStatusUpdater() {
    const statusElements = document.querySelectorAll('.branch-status');
    
    function updateBranchStatus() {
        const now = new Date();
        const currentHour = now.getHours();
        const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday
        
        // Business hours: 7:30 AM to 6:00 PM (7.5 to 18.0 in 24h format)
        // Main branch: Monday - Sunday
        // Other branches: Monday - Sunday (8:00 AM to 6:00 PM for some)
        
        statusElements.forEach(statusElement => {
            const branchCard = statusElement.closest('.branch-card');
            const isMainBranch = branchCard.classList.contains('main-branch');
            const statusText = statusElement.querySelector('.status-text');
            const statusIcon = statusElement.querySelector('i');
            
            let isOpen = false;
            
            if (isMainBranch) {
                // Main branch: 7:30 AM to 6:00 PM, 7 days a week
                isOpen = currentHour >= 7.5 && currentHour < 18;
            } else {
                // Other branches: 8:00 AM to 6:00 PM, 7 days a week
                isOpen = currentHour >= 8 && currentHour < 18;
            }
            
            if (isOpen) {
                statusText.textContent = 'Open Now';
                statusIcon.className = 'fas fa-clock';
                statusElement.style.color = '#28a745';
            } else {
                statusText.textContent = 'Closed';
                statusIcon.className = 'fas fa-times-circle';
                statusElement.style.color = '#dc3545';
            }
        });
    }
    
    // Update immediately and then every minute
    updateBranchStatus();
    setInterval(updateBranchStatus, 60000);
}

/**
 * Contact Button Enhancements
 * Adds click tracking and user feedback for contact buttons
 */
function initializeContactButtons() {
    const whatsappButtons = document.querySelectorAll('.btn-whatsapp');
    const callButtons = document.querySelectorAll('a[href^="tel:"]');
    
    // WhatsApp button enhancements
    whatsappButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add click effect
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Extract branch name for analytics
            const branchCard = this.closest('.branch-card');
            const branchName = branchCard.querySelector('.branch-name').textContent;
            
            console.log(`WhatsApp contact initiated for: ${branchName}`);
            
            // Optional: Show confirmation toast
            showNotification(`Opening WhatsApp for ${branchName}...`, 'info');
        });
    });
    
    // Call button enhancements
    callButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const phoneNumber = this.textContent;
            const branchCard = this.closest('.branch-card');
            const branchName = branchCard.querySelector('.branch-name').textContent;
            
            console.log(`Call initiated to ${phoneNumber} for ${branchName}`);
            
            // Optional: Show confirmation for mobile devices
            if (window.innerWidth <= 768) {
                showNotification(`Calling ${branchName}...`, 'info');
            }
        });
    });
}

/**
 * Utility function to show notifications
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'info' ? '#17a2b8' : '#28a745',
        color: 'white',
        padding: '12px 20px',
        borderRadius: '4px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        zIndex: '9999',
        fontSize: '14px',
        fontWeight: '500',
        opacity: '0',
        transform: 'translateX(100%)',
        transition: 'all 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

/**
 * Branch Card Hover Effects
 * Enhanced hover interactions for branch cards
 */
function initializeBranchCardEffects() {
    const branchCards = document.querySelectorAll('.branch-card');
    
    branchCards.forEach(card => {
        let hoverTimeout;
        
        card.addEventListener('mouseenter', function() {
            clearTimeout(hoverTimeout);
            
            // Highlight effect
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 15px 35px rgba(0,0,0,0.2)';
            
            // Image zoom effect
            const image = this.querySelector('.branch-image');
            if (image) {
                image.style.transform = 'scale(1.08)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            hoverTimeout = setTimeout(() => {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
                
                const image = this.querySelector('.branch-image');
                if (image) {
                    image.style.transform = 'scale(1.05)';
                }
            }, 100);
        });
    });
}

/**
 * Keyboard Navigation Support
 */
function initializeKeyboardNavigation() {
    const branchCards = document.querySelectorAll('.branch-card');
    const searchInput = document.getElementById('branchSearch');
    
    // Make branch cards focusable
    branchCards.forEach((card, index) => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'article');
        card.setAttribute('aria-label', `Branch ${index + 1}: ${card.querySelector('.branch-name').textContent}`);
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                // Focus on the first action button
                const firstButton = this.querySelector('.branch-actions .btn');
                if (firstButton) {
                    firstButton.focus();
                }
            }
        });
    });
    
    // Search input keyboard shortcuts
    if (searchInput) {
        document.addEventListener('keydown', function(e) {
            // Ctrl/Cmd + F to focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                searchInput.focus();
            }
        });
    }
}

// Initialize additional features when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeBranchCardEffects();
    initializeKeyboardNavigation();
});

// Resize handler for responsive adjustments
window.addEventListener('resize', function() {
    // Recalculate any position-dependent elements
    const branchCards = document.querySelectorAll('.branch-card');
    branchCards.forEach(card => {
        if (card.style.display === 'none') return;
        
        // Reset any stuck animations
        card.style.transform = '';
        card.style.opacity = '';
    });
});