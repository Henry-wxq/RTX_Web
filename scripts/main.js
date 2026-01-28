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
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const message = this.querySelector('textarea').value;
    
    if (!name || !email || !message) {
        alert('Please fill in all fields');
        return;
    }
    
    // Here you would typically send the form data to your server
    console.log('Form submitted:', { name, email, message });
    
    // Show success message
    const button = this.querySelector('button');
    const originalText = button.textContent;
    button.textContent = 'Message Sent!';
    button.style.backgroundColor = '#34c759';
    
    // Reset form and button
    setTimeout(() => {
        this.reset();
        button.textContent = originalText;
        button.style.backgroundColor = '';
    }, 3000);
});

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