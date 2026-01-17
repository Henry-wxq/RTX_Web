// Enhanced smooth scrolling for navigation links and buttons
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Calculate header height for offset
            const headerHeight = document.querySelector('.nav-wrapper').offsetHeight;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navigation bar background change on scroll
const nav = document.querySelector('.nav-wrapper');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.style.background = 'rgba(255, 255, 255, 1)';
        nav.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    } else {
        nav.style.background = 'rgba(255, 255, 255, 1)';
        nav.style.boxShadow = 'none';
    }
});

// Form validation and submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form elements
        const button = this.querySelector('button[type="submit"]');
        const originalText = button.textContent;
        const originalBgColor = button.style.backgroundColor;
        
        // Collect form data
        const formData = {
            firstName: document.getElementById('firstName')?.value.trim(),
            lastName: document.getElementById('lastName')?.value.trim(),
            businessEmail: document.getElementById('businessEmail')?.value.trim(),
            companyName: document.getElementById('companyName')?.value.trim(),
            phoneNumber: document.getElementById('phoneNumber')?.value.trim(),
            country: document.getElementById('country')?.value,
            industry: document.getElementById('industry')?.value
        };
        
        // Client-side validation
        if (!formData.firstName || !formData.lastName || !formData.businessEmail || 
            !formData.companyName || !formData.phoneNumber || !formData.country || !formData.industry) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.businessEmail)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Disable button and show loading state
        button.disabled = true;
        button.textContent = 'Sending...';
        button.style.backgroundColor = '#999';
        
        try {
            // Get API endpoint from environment or use default
            const API_URL = window.API_URL || 'http://localhost:3000/api/contact';
            
            // Send form data to backend
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                // Show success message
                button.textContent = 'Message Sent!';
                button.style.backgroundColor = '#34c759';
                
                // Show success message to user
                alert(data.message || 'Your message has been sent successfully. We will contact you within 24 business hours.');
                
                // Reset form
                this.reset();
                
                // Reset button after delay
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.backgroundColor = originalBgColor;
                    button.disabled = false;
                }, 3000);
            } else {
                // Show error message
                button.textContent = 'Error';
                button.style.backgroundColor = '#ff3b30';
                alert(data.error || 'An error occurred. Please try again later.');
                
                // Reset button after delay
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.backgroundColor = originalBgColor;
                    button.disabled = false;
                }, 3000);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            
            // Show error message
            button.textContent = 'Error';
            button.style.backgroundColor = '#ff3b30';
            alert('Network error. Please check your connection and try again.');
            
            // Reset button after delay
            setTimeout(() => {
                button.textContent = originalText;
                button.style.backgroundColor = originalBgColor;
                button.disabled = false;
            }, 3000);
        }
    });
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-out');
    observer.observe(section);
});

// Enhanced dropdown interaction
document.querySelectorAll('.nav-item').forEach(item => {
    let timeout;
    const dropdown = item.querySelector('.nav-dropdown');
    
    if (!dropdown) return;

    item.addEventListener('mouseenter', () => {
        clearTimeout(timeout);
        dropdown.style.opacity = '1';
        dropdown.style.visibility = 'visible';
        dropdown.style.transform = 'translateY(0)';
    });
    
    item.addEventListener('mouseleave', () => {
        timeout = setTimeout(() => {
            dropdown.style.opacity = '0';
            dropdown.style.visibility = 'hidden';
            dropdown.style.transform = 'translateY(-10px)';
        }, 100);
    });
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-item')) {
        document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
            dropdown.style.opacity = '0';
            dropdown.style.visibility = 'hidden';
            dropdown.style.transform = 'translateY(-10px)';
        });
    }
});

// Add this debugging code
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    const navItems = document.querySelectorAll('.nav-item');
    console.log('Nav items found:', navItems.length);
    
    navItems.forEach(item => {
        const dropdown = item.querySelector('.nav-dropdown');
        if (dropdown) {
            console.log('Dropdown found for item');
        }
    });
}); 