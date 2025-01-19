// Three.js initialization and background setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    canvas: document.getElementById('particles-bg'), 
    alpha: true 
});

// Responsive particle size
const getParticleSize = () => {
    if (window.innerWidth >= 2560) return 0.007;
    if (window.innerWidth >= 1920) return 0.006;
    return 0.005;
};

// Particle system setup
const setupParticles = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = window.innerWidth < 768 ? 500 : 1000;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 5;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: getParticleSize(),
        color: '#4B91F7'
    });

    return new THREE.Points(particlesGeometry, particlesMaterial);
};

// Initialize particles
let particlesMesh = setupParticles();
scene.add(particlesMesh);
camera.position.z = 3;

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    particlesMesh.rotation.y += 0.001;
    renderer.render(scene, camera);
}

animate();

// Mobile menu functionality
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
let isMenuOpen = false;

mobileMenuButton.addEventListener('click', () => {
    isMenuOpen = !isMenuOpen;
    mobileMenu.style.display = isMenuOpen ? 'block' : 'none';
    
    if (isMenuOpen) {
        mobileMenu.style.opacity = '0';
        mobileMenu.style.transform = 'translateY(-10px)';
        requestAnimationFrame(() => {
            mobileMenu.style.transition = 'all 0.3s ease';
            mobileMenu.style.opacity = '1';
            mobileMenu.style.transform = 'translateY(0)';
        });
    }
});

// Close menu when clicking outside
document.addEventListener('click', (event) => {
    if (isMenuOpen && !event.target.closest('#mobile-menu') && 
        !event.target.closest('#mobile-menu-button')) {
        isMenuOpen = false;
        mobileMenu.style.display = 'none';
    }
});

// Intersection Observer for animations
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Handle badge animations if present
                const badges = entry.target.querySelectorAll('.badge-container');
                badges.forEach((badge, index) => {
                    setTimeout(() => {
                        badge.classList.add('visible');
                    }, index * 100);
                });
            }
        });
    },
    { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    }
);

// Observe elements for animations
document.addEventListener('DOMContentLoaded', () => {
    // Observe certificate sections
    document.querySelectorAll('.certificate-section').forEach((section) => {
        observer.observe(section);
    });

    // Observe timeline items
    document.querySelectorAll('.timeline-item').forEach((item) => {
        observer.observe(item);
    });

    // Initial animation for tech cards
    document.querySelectorAll('.tech-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
});

// Responsive handling
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Update camera aspect ratio
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        // Recreate particles for new screen size
        scene.remove(particlesMesh);
        particlesMesh = setupParticles();
        scene.add(particlesMesh);
    }, 250);
});

// Performance optimization for scroll events
let lastKnownScrollPosition = 0;
let ticking = false;

document.addEventListener('scroll', () => {
    lastKnownScrollPosition = window.scrollY;

    if (!ticking) {
        window.requestAnimationFrame(() => {
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

// Smooth page load animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    requestAnimationFrame(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    });
});
