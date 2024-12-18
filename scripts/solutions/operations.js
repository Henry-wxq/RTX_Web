document.addEventListener('DOMContentLoaded', function() {
    // Simple intersection observer with adjusted options
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        },
        {
            threshold: 0.01,  // Reduced threshold to trigger earlier
            rootMargin: '50px'  // Added margin to pre-load content before it's visible
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