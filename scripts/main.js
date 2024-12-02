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