/*
 * Summer 2026 Europe Trip Planning Website
 * Interactive JavaScript Features
 */

// ========================================
// SMOOTH SCROLLING
// ========================================

/**
 * Smooth scroll to a section when clicking navigation links or buttons
 * @param {string} sectionId - The ID of the section to scroll to
 */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const navbarHeight = document.getElementById('navbar').offsetHeight;
        const targetPosition = section.offsetTop - navbarHeight - 20;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Add smooth scrolling to all nav links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
});

// ========================================
// NAVBAR SCROLL EFFECTS
// ========================================

/**
 * Add/remove class to navbar based on scroll position
 * Updates active nav link based on current section in view
 */
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    const scrollPosition = window.scrollY;

    // Add shadow when scrolled
    if (scrollPosition > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Update active nav link based on scroll position
    updateActiveNavLink();
});

/**
 * Update the active nav link based on which section is currently in view
 */
function updateActiveNavLink() {
    const sections = document.querySelectorAll('.section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let currentSection = '';
    const navbarHeight = document.getElementById('navbar').offsetHeight;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - navbarHeight - 100;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// ========================================
// ITINERARY TAB SWITCHING
// ========================================

/**
 * Switch between different itinerary tabs (Italy, Interlaken, Budapest)
 * @param {string} tabName - The name of the tab to show ('italy', 'interlaken', 'budapest')
 */
function showItineraryTab(tabName) {
    // Hide all itinerary content
    const allContent = document.querySelectorAll('.itinerary-content');
    allContent.forEach(content => {
        content.classList.remove('active');
    });

    // Remove active class from all tabs
    const allTabs = document.querySelectorAll('.tab-btn');
    allTabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // Show selected content
    const selectedContent = document.getElementById(`${tabName}-itinerary`);
    if (selectedContent) {
        selectedContent.classList.add('active');
    }

    // Add active class to clicked tab
    const clickedTab = event.target;
    if (clickedTab) {
        clickedTab.classList.add('active');
    }
}

// ========================================
// TOGGLE ALTERNATIVES
// ========================================

/**
 * Toggle visibility of alternative accommodation options
 * @param {string} destination - The destination to toggle alternatives for
 */
function toggleAlternatives(destination) {
    const alternativesSection = document.getElementById(`${destination}-alternatives`);
    const button = event.target;

    // Button text map for different destinations
    const buttonTextMap = {
        'italy': '20+ Verified Properties',
        'interlaken': '10+ Verified Properties',
        'budapest': '12+ Verified Properties'
    };

    const buttonText = buttonTextMap[destination] || '20+ Verified Properties';

    if (alternativesSection) {
        const isHidden = alternativesSection.style.display === 'none' ||
                        alternativesSection.style.display === '';

        if (isHidden) {
            alternativesSection.style.display = 'block';
            button.innerHTML = '<i class="fas fa-times"></i> Hide Alternatives';

            // Smooth scroll to alternatives
            setTimeout(() => {
                alternativesSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }, 100);
        } else {
            alternativesSection.style.display = 'none';
            button.innerHTML = `<i class="fas fa-list"></i> View All Accommodation Options (${buttonText})`;
        }
    }
}

// ========================================
// BOOKING CHECKLIST PERSISTENCE
// ========================================

/**
 * Save checklist state to localStorage
 */
function saveChecklistState() {
    const checkboxes = document.querySelectorAll('.task-item input[type="checkbox"]');
    const checklistState = {};

    checkboxes.forEach(checkbox => {
        checklistState[checkbox.id] = checkbox.checked;
    });

    try {
        localStorage.setItem('tripChecklistState', JSON.stringify(checklistState));
    } catch (e) {
        console.log('Could not save checklist state to localStorage');
    }
}

/**
 * Load checklist state from localStorage
 */
function loadChecklistState() {
    try {
        const savedState = localStorage.getItem('tripChecklistState');
        if (savedState) {
            const checklistState = JSON.parse(savedState);

            Object.keys(checklistState).forEach(checkboxId => {
                const checkbox = document.getElementById(checkboxId);
                if (checkbox) {
                    checkbox.checked = checklistState[checkboxId];
                    updateTaskItemStyle(checkbox);
                }
            });
        }
    } catch (e) {
        console.log('Could not load checklist state from localStorage');
    }
}

/**
 * Update task item styling based on checkbox state
 * @param {HTMLElement} checkbox - The checkbox element
 */
function updateTaskItemStyle(checkbox) {
    const taskItem = checkbox.closest('.task-item');
    const label = taskItem.querySelector('label');

    if (checkbox.checked) {
        taskItem.style.opacity = '0.6';
        label.style.textDecoration = 'line-through';
    } else {
        taskItem.style.opacity = '1';
        label.style.textDecoration = 'none';
    }
}

// Add event listeners to all checkboxes
document.addEventListener('DOMContentLoaded', function() {
    const checkboxes = document.querySelectorAll('.task-item input[type="checkbox"]');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateTaskItemStyle(this);
            saveChecklistState();
            updateChecklistProgress();
        });
    });

    // Load saved state
    loadChecklistState();
    updateChecklistProgress();
});

/**
 * Update checklist progress indicator (if we add one in the future)
 */
function updateChecklistProgress() {
    const checkboxes = document.querySelectorAll('.task-item input[type="checkbox"]');
    const total = checkboxes.length;
    const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
    const percentage = total > 0 ? Math.round((checked / total) * 100) : 0;

    // Store for potential future use
    window.tripPlanningProgress = {
        total: total,
        completed: checked,
        percentage: percentage
    };

    // Log progress for user awareness
    if (checked > 0 && checked === total) {
        console.log('🎉 All tasks completed! You\'re ready for your trip!');
    }
}

// ========================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ========================================

/**
 * Add fade-in animations to elements as they enter viewport
 */
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe cards and highlights
    const animatedElements = document.querySelectorAll(
        '.highlight-card, .day-card, .budget-category, .activity-item'
    );

    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
});

// ========================================
// PRINT FUNCTIONALITY
// ========================================

/**
 * Prepare page for printing (expand all sections, show all content)
 */
window.addEventListener('beforeprint', function() {
    // Show all itinerary tabs
    const allItineraryContent = document.querySelectorAll('.itinerary-content');
    allItineraryContent.forEach(content => {
        content.classList.add('active');
    });

    // Show all alternatives
    const allAlternatives = document.querySelectorAll('.alternatives-section');
    allAlternatives.forEach(alt => {
        alt.style.display = 'block';
    });
});

/**
 * Restore normal view after printing
 */
window.addEventListener('afterprint', function() {
    // Restore only the first itinerary tab as active
    const allItineraryContent = document.querySelectorAll('.itinerary-content');
    allItineraryContent.forEach((content, index) => {
        if (index === 0) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });

    // Hide alternatives again
    const allAlternatives = document.querySelectorAll('.alternatives-section');
    allAlternatives.forEach(alt => {
        alt.style.display = 'none';
    });
});

// ========================================
// BUDGET CALCULATOR (OPTIONAL ENHANCEMENT)
// ========================================

/**
 * Calculate total budget based on user selections
 * This can be expanded in the future to allow customization
 */
function calculateBudget() {
    const budgetData = {
        flights: { min: 3500, max: 6000 },
        accommodations: { min: 3635, max: 5551 },
        carRental: { min: 1200, max: 1500 },
        transport: { min: 3200, max: 3700 },
        activities: { min: 6500, max: 8600 },
        meals: { min: 4000, max: 6000 },
        contingency: { min: 1000, max: 2000 }
    };

    let totalMin = 0;
    let totalMax = 0;

    Object.values(budgetData).forEach(category => {
        totalMin += category.min;
        totalMax += category.max;
    });

    return {
        min: totalMin,
        max: totalMax,
        perPerson: {
            min: Math.round(totalMin / 7),
            max: Math.round(totalMax / 7)
        }
    };
}

// ========================================
// TOOLTIP FUNCTIONALITY (Future Enhancement)
// ========================================

/**
 * Add tooltips to important terms and acronyms
 * Can be expanded to show helpful hints throughout the site
 */
function initializeTooltips() {
    // This is a placeholder for future tooltip functionality
    // Could use a library like Tippy.js or implement custom tooltips
    console.log('Tooltip system initialized');
}

// ========================================
// MOBILE MENU TOGGLE (if needed in future)
// ========================================

/**
 * Toggle mobile navigation menu
 * Currently not needed as we have a responsive horizontal menu
 * Keeping for potential future mobile optimization
 */
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.classList.toggle('mobile-active');
    }
}

// ========================================
// EXPORT ITINERARY (Future Enhancement)
// ========================================

/**
 * Export itinerary to different formats (PDF, iCal, etc.)
 * Placeholder for future functionality
 */
function exportItinerary(format) {
    console.log(`Exporting itinerary as ${format}...`);
    // Future: Implement export to PDF, iCal, Google Calendar, etc.
    alert(`Export to ${format} feature coming soon!`);
}

// ========================================
// INITIALIZATION
// ========================================

/**
 * Initialize all features when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('✈️ Summer 2026 Europe Trip Planning Website Loaded!');
    console.log('📍 Italy • Switzerland • Hungary | July 11-28, 2026');

    // Set initial active nav link
    updateActiveNavLink();

    // Initialize tooltips (placeholder)
    initializeTooltips();

    // Calculate and log budget (for debugging)
    const budget = calculateBudget();
    console.log('💰 Budget Range:', `$${budget.min.toLocaleString()} - $${budget.max.toLocaleString()}`);
    console.log('👤 Per Person:', `$${budget.perPerson.min.toLocaleString()} - $${budget.perPerson.max.toLocaleString()}`);

    // Add enter key support for checkboxes
    const checkboxes = document.querySelectorAll('.task-item input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        const label = checkbox.nextElementSibling;
        if (label) {
            label.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event('change'));
                }
            });
        }
    });
});

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Format currency for display
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code (default: 'USD')
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

/**
 * Format date for display
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
    return new Intl.DateFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

/**
 * Calculate days until trip
 * @returns {number} Number of days until July 11, 2026
 */
function daysUntilTrip() {
    const tripDate = new Date('2026-07-11');
    const today = new Date();
    const diffTime = tripDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

// Log countdown (optional feature)
if (daysUntilTrip() > 0) {
    console.log(`🗓️  ${daysUntilTrip()} days until departure!`);
}

// ========================================
// ERROR HANDLING
// ========================================

/**
 * Global error handler for graceful degradation
 */
window.addEventListener('error', function(event) {
    console.error('An error occurred:', event.error);
    // Optionally show user-friendly error message
});

/**
 * Handle missing images gracefully
 */
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            // Replace with placeholder or hide
            this.style.backgroundColor = '#e9ecef';
            this.alt = 'Image not available';
        });
    });
});

// ========================================
// ACCESSIBILITY ENHANCEMENTS
// ========================================

/**
 * Add keyboard navigation support
 */
document.addEventListener('keydown', function(e) {
    // ESC key closes any open modals or alternatives
    if (e.key === 'Escape') {
        const alternatives = document.querySelectorAll('.alternatives-section');
        alternatives.forEach(alt => {
            if (alt.style.display === 'block') {
                alt.style.display = 'none';
            }
        });
    }
});

/**
 * Announce page region changes to screen readers
 */
function announceRegion(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);

    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Add screen reader only class to CSS if needed
const style = document.createElement('style');
style.textContent = `
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
`;
document.head.appendChild(style);

console.log('🎉 All interactive features loaded and ready!');
