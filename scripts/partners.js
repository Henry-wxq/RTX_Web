document.addEventListener('DOMContentLoaded', function() {
    // Get all available letters from the sections
    const sections = document.querySelectorAll('.letter-section');
    const availableLetters = new Set();
    sections.forEach(section => {
        availableLetters.add(section.id);
    });

    // Disable letters that don't have corresponding sections
    const navLinks = document.querySelectorAll('.alphabet-nav a');
    navLinks.forEach(link => {
        const letter = link.getAttribute('href').replace('#', '');
        if (!availableLetters.has(letter)) {
            link.classList.add('disabled');
        }
    });

    // Smooth scroll to section when clicking on a letter
    document.querySelector('.alphabet-nav').addEventListener('click', function(e) {
        if (e.target.tagName === 'A' && !e.target.classList.contains('disabled')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});
