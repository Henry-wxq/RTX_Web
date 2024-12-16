document.addEventListener('DOMContentLoaded', function() {
    // Simple intersection observer
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        },
        {
            threshold: 0.1
        }
    );

    // Observe all sections
    document.querySelectorAll('.fade-in-section').forEach(section => {
        observer.observe(section);
    });

    // Navigation functionality
    const navLinks = document.querySelectorAll('.section-nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            targetSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
}); 