// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add animation on scroll
document.addEventListener('DOMContentLoaded', function() {
    const advantageItems = document.querySelectorAll('.advantage-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    advantageItems.forEach(item => {
        observer.observe(item);
    });
});

// Add hover effect for advantage items
document.querySelectorAll('.advantage-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
    });

    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Optional: Add fade-in animation for images when they load
document.querySelectorAll('.advantage-item img').forEach(img => {
    img.addEventListener('load', function() {
        this.style.opacity = '1';
    });
});
