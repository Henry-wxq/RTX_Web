document.addEventListener('DOMContentLoaded', function() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    // Observe all sections with fade-in-section class
    document.querySelectorAll('.fade-in-section').forEach(section => {
        observer.observe(section);
    });

    // Section Navigation Code
    const navLinks = document.querySelectorAll('.section-nav a');
    const sections = document.querySelectorAll('.consulting-section');
    
    // Add click event listeners for smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            const navHeight = document.querySelector('.section-nav').offsetHeight;
            const mainNavHeight = 60; // Adjust based on your main nav height
            
            window.scrollTo({
                top: targetSection.offsetTop - (navHeight + mainNavHeight),
                behavior: 'smooth'
            });
        });
    });
    
    // Update active state on scroll
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const navHeight = document.querySelector('.section-nav').offsetHeight;
            const mainNavHeight = 60;
            
            if (pageYOffset >= (sectionTop - navHeight - mainNavHeight - 100)) {
                current = '#' + section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === current) {
                link.classList.add('active');
            }
        });
    });
}); 