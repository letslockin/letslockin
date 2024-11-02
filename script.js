// Add smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Animate elements when they come into view
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, {
    threshold: 0.1
});

document.querySelectorAll('.feature-card, .demo-container').forEach((el) => observer.observe(el));

// Update progress bars animation
function updateProgress() {
    const progress = document.querySelectorAll('.progress');
    progress.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
}

// Call updateProgress when demo section is in view
const demoSection = document.querySelector('.demo');
const demoObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        updateProgress();
    }
}, { threshold: 0.5 });

demoObserver.observe(demoSection);