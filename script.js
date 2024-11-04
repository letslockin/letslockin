// Initialize GSAP
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin);


class Particle {
    constructor(container) {
        this.container = container;
        this.element = document.createElement('div');
        this.element.className = 'particle';
        
        // Randomize particle properties
        this.size = Math.random() * 4 + 2;
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = Math.random() * -2 - 1; // Negative for upward movement
        this.opacity = Math.random() * 0.5 + 0.2;
        
        // Set initial styles
        this.element.style.width = `${this.size}px`;
        this.element.style.height = `${this.size}px`;
        this.element.style.opacity = this.opacity;
        
        this.container.appendChild(this.element);
        this.updatePosition();
    }

    updatePosition() {
        this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Reset particle position when it goes off screen
        if (this.y < -10) {
            this.y = window.innerHeight + 10;
            this.x = Math.random() * window.innerWidth;
        }
        if (this.x < -10) this.x = window.innerWidth + 10;
        if (this.x > window.innerWidth + 10) this.x = -10;

        this.updatePosition();
    }

    getPosition() {
        return { x: this.x, y: this.y };
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
        this.lines = [];
        this.container = document.createElement('div');
        this.container.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            pointer-events: none;
        `;
        document.querySelector('.hero').appendChild(this.container);
        
        this.createParticles();
        this.animate();
        
        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
    }

    createParticles() {
        // Create particles based on screen size
        const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 10000);
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(this.container));
        }
    }

    drawLines() {
        // Remove old lines
        this.lines.forEach(line => line.remove());
        this.lines = [];

        // Draw new lines between nearby particles
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i].getPosition();
                const p2 = this.particles[j].getPosition();
                const distance = Math.hypot(p1.x - p2.x, p1.y - p2.y);
                
                if (distance < 150) { // Connection distance threshold
                    const opacity = (150 - distance) / 150;
                    const line = document.createElement('div');
                    line.className = 'particle-line';
                    const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
                    
                    line.style.cssText = `
                        position: absolute;
                        left: ${p1.x}px;
                        top: ${p1.y}px;
                        width: ${distance}px;
                        height: 1px;
                        opacity: ${opacity * 0.5};
                        transform: rotate(${angle}rad);
                    `;
                    
                    this.container.appendChild(line);
                    this.lines.push(line);
                }
            }
        }
    }

    animate() {
        this.particles.forEach(particle => particle.move());
        this.drawLines();
        requestAnimationFrame(() => this.animate());
    }

    handleResize() {
        // Clear existing particles and lines
        this.particles.forEach(particle => particle.element.remove());
        this.lines.forEach(line => line.remove());
        this.particles = [];
        this.lines = [];
        
        // Create new particles for new window size
        this.createParticles();
    }
}

// Smooth scroll handling
const smoothScroll = (target) => {
    const offset = 80; // Adjust this value based on your navbar height
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
    
    gsap.to(window, {
        duration: 1,
        scrollTo: { y: targetPosition, autoKill: false },
        ease: 'power2.inOut'
    });
};

// Text animation for the main title
function animateMainTitle() {
    const title = document.querySelector('.hero-content h1');
    const line1 = title.querySelector('.line1');
    const line2 = title.querySelector('.line2');
    
    [line1, line2].forEach((line, lineIndex) => {
        const text = line.textContent;
        line.textContent = '';
        
        [...text].forEach((char, charIndex) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.opacity = '0';
            span.style.transform = 'translateY(20px)';
            line.appendChild(span);

            gsap.to(span, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                delay: (lineIndex * text.length + charIndex) * 0.05,
                ease: 'power2.out'
            });
        });
    });
}

// Animate elements when they come into view
function initScrollAnimations() {
    // Feature cards animation
    gsap.utils.toArray('.feature-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top bottom-=100',
                toggleActions: 'play none none reverse'
            },
            y: 100,
            opacity: 0,
            duration: 1,
            delay: index * 0.2,
            ease: 'power3.out'
        });
    });

    // Section titles animation
    gsap.utils.toArray('h2').forEach((title) => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top bottom-=50',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power2.out'
        });
    });
}

function animateFeatures() {
    console.log("Animating features");
    gsap.from('#features .feature-card', {
      opacity: 0,
      y: 50,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out"
    });
  }

// Progress bar animation
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress');
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        gsap.to(bar, {
            scrollTrigger: {
                trigger: bar,
                start: 'top bottom-=100',
                toggleActions: 'play none none reverse'
            },
            width: width,
            duration: 1.5,
            ease: 'power2.out'
        });
    });
}

// Feedback functionality
function initFeedback() {
    const feedbackBtn = document.querySelector('.feedback-btn');
    const modal = document.querySelector('.feedback-modal');
    const closeBtn = document.querySelector('.close-modal');
    const form = document.querySelector('.feedback-form');

    // Hide feedback button initially
    feedbackBtn.style.opacity = '0';
    feedbackBtn.style.visibility = 'hidden';

    // Show/hide feedback button based on scroll position
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const showPosition = window.innerHeight * 0.5; // Show after 50% of viewport height

        if (scrollPosition > showPosition) {
            feedbackBtn.style.opacity = '1';
            feedbackBtn.style.visibility = 'visible';
        } else {
            feedbackBtn.style.opacity = '0';
            feedbackBtn.style.visibility = 'hidden';
        }
    });

    // Existing modal functionality
    feedbackBtn.addEventListener('click', () => {
        modal.classList.add('active');
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const feedback = form.querySelector('textarea').value;
        console.log('Feedback submitted:', feedback);
        form.reset();
        modal.classList.remove('active');
        alert('Thank you for your feedback!');
    });
}

// Login functionality
function initLogin() {
    const loginBtn = document.querySelector('.login-btn');
    const modal = document.querySelector('.login-modal');
    const closeBtn = modal.querySelector('.close-modal');
    const form = modal.querySelector('.login-form');
    const signupLink = modal.querySelector('.signup-link a');
    const forgotPassword = modal.querySelector('.forgot-password');

    // Open modal
    loginBtn.addEventListener('click', () => {
        modal.classList.add('active');
    });

    // Close modal
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // Close when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]').value;
        const password = form.querySelector('input[type="password"]').value;

        try {
            // Here you would typically make an API call to your backend
            console.log('Login attempt:', { email, password });
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // For demo purposes, always succeed
            alert('Login successful!');
            modal.classList.remove('active');
            form.reset();
            
            // Update UI to show logged-in state
            loginBtn.textContent = 'Profile';
            
        } catch (error) {
            alert('Login failed. Please try again.');
        }
    });

    // Handle signup link click
    signupLink.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Sign up functionality coming soon!');
    });

    // Handle forgot password click
    forgotPassword.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Password reset functionality coming soon!');
    });
}

// Add after ParticleSystem class and before smoothScroll function
class PostureDetector {
    constructor() {
        this.model = null;
        this.blazeface = null;
        this.webcam = null;
        this.canvas = null;
        this.ctx = null;
        this.isRunning = false;
        this.emotionMap = {
            0: 'Neutral',
            1: 'Happy',
            2: 'Sad',
            3: 'Surprise',
            4: 'Fear',
            5: 'Disgusted',
            6: 'Angry'
        };
    }

    async init() {
        try {
            // Setup webcam first
            this.webcam = document.getElementById('webcam');
            this.canvas = document.getElementById('output-canvas');
            
            if (!this.webcam || !this.canvas) {
                throw new Error('Required elements not found');
            }

            this.ctx = this.canvas.getContext('2d');

            // Set initial canvas size
            this.canvas.width = 640;
            this.canvas.height = 480;

            // Load Blazeface model
            this.blazeface = await blazeface.load();

            // Request webcam access
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                }
            });
            
            this.webcam.srcObject = stream;
            
            // Wait for video to be ready
            await new Promise(resolve => {
                this.webcam.onloadedmetadata = () => {
                    this.canvas.width = this.webcam.videoWidth;
                    this.canvas.height = this.webcam.videoHeight;
                    this.webcam.play();
                    resolve();
                };
            });

            // Load the emotion model
            this.model = await tf.loadLayersModel('tf2js_model/model.json');
            
            console.log('All models loaded successfully');

            // Start detection loop
            this.isRunning = true;
            this.detectLoop();

        } catch (error) {
            console.error('Error initializing posture detector:', error);
            throw error;
        }
    }

    async detectLoop() {
        if (!this.isRunning) return;

        try {
            if (this.webcam.readyState === this.webcam.HAVE_ENOUGH_DATA) {
                // Draw current frame to main canvas
                this.ctx.drawImage(this.webcam, 0, 0);

                const predictions = await this.blazeface.estimateFaces(this.webcam, false);

                if (predictions.length > 0) {
                    const face = predictions[0];
                    
                    // Get face coordinates
                    let [x, y] = face.topLeft.map(Math.round);
                    let [endX, endY] = face.bottomRight.map(Math.round);
                    let width = endX - x;
                    let height = endY - y;

                    // Adjust to 80% of the width
                    const widthReduction = width * 0.2; // 20% reduction
                    x += widthReduction / 2; // Center the reduced width
                    width = width * 0.8; // 80% of original width

                    // Ensure coordinates are within bounds
                    x = Math.max(0, x);
                    y = Math.max(0, y);
                    width = Math.min(width, this.canvas.width - x);
                    height = Math.min(height, this.canvas.height - y);

                    // Draw face detection box (for visualization)
                    this.ctx.strokeStyle = '#00ff00';
                    this.ctx.lineWidth = 2;
                    this.ctx.strokeRect(x, y, width, height);

                    // Create temporary canvas for face region
                    const faceCanvas = document.createElement('canvas');
                    faceCanvas.width = width;
                    faceCanvas.height = height;
                    const faceCtx = faceCanvas.getContext('2d');

                    // Draw only the face region to the temporary canvas
                    faceCtx.drawImage(
                        this.webcam,     // source
                        x, y,            // source x, y
                        width, height,   // source width, height
                        0, 0,            // destination x, y
                        width, height    // destination width, height
                    );

                    // Process the face for emotion detection
                    const emotionPrediction = tf.tidy(() => {
                        const faceTensor = tf.browser.fromPixels(faceCanvas)
                            .mean(2)
                            .toFloat()
                            .expandDims(-1);
                        const resized = tf.image.resizeBilinear(faceTensor, [160, 160]);
                        const normalized = resized.div(255.0);
                        return normalized.expandDims(0);
                    });

                    // Get predictions
                    const prediction = await this.model.predict(emotionPrediction);
                    const probabilities = await prediction.data();

                    // Calculate distance for posture
                    const distance = this.calculateFaceDistance(
                        width,
                        height,
                        this.webcam.videoWidth,
                        this.webcam.videoHeight
                    );

                    // Process results
                    const emotionConfidences = Object.entries(this.emotionMap)
                        .map(([index, emotion]) => ({
                            emotion,
                            confidence: probabilities[index]
                        }))
                        .sort((a, b) => b.confidence - a.confidence);

                    // Update UI
                    this.updateUI(emotionConfidences, distance);

                    // Cleanup tensors
                    tf.dispose([emotionPrediction, prediction]);
                } else {
                    this.updateUI([], 0);
                }
            }
        } catch (error) {
            console.error('Detection loop error:', error);
        }

        requestAnimationFrame(() => this.detectLoop());
    }

    updateUI(emotionConfidences, distance) {
        // Update posture status based on distance
        const postureLabel = document.getElementById('posture-label');
        const confidenceBar = document.getElementById('posture-confidence');
        
        let postureStatus = '';
        if (distance <= 7) {
            postureStatus = 'Too far from screen';
        } else if (distance > 18) {
            postureStatus = 'Too close to screen';
        } else {
            postureStatus = 'Good posture';
        }
        
        if (postureLabel && confidenceBar) {
            postureLabel.textContent = postureStatus;
            // Scale the distance to a maximum of 30%
            const scaledWidth = Math.min(100, (distance / 25) * 100);
            confidenceBar.style.width = `${scaledWidth}%`;
        }

        // Update emotion predictions
        const detectionList = document.getElementById('detection-list');
        if (detectionList) {
            detectionList.innerHTML = ''; // Clear existing items
            
            emotionConfidences.forEach(({emotion, confidence}) => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span>${emotion}</span>
                        <div class="emotion-bar-container" style="flex-grow: 1; margin: 0 10px;">
                            <div class="emotion-bar" style="width: ${confidence * 100}%; background: #4A90E2;"></div>
                        </div>
                        <span>${(confidence * 100).toFixed(1)}%</span>
                    </div>
                `;
                detectionList.appendChild(listItem);
            });
        }
    }

    stop() {
        this.isRunning = false;
        if (this.webcam && this.webcam.srcObject) {
            this.webcam.srcObject.getTracks().forEach(track => track.stop());
        }
    }

    calculateFaceDistance(faceWidth, faceHeight, frameWidth, frameHeight) {
        const cameraSize = frameWidth * frameHeight;
        const faceArea = faceWidth * faceHeight;
        return (faceArea * 100) / cameraSize;
    }
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    // Existing initializations
    new ParticleSystem();
    animateMainTitle();
    initScrollAnimations();
    initProgressBars();
    initFeedback();
    initLogin();

    // Add Get Started button functionality
    const getStartedBtn = document.querySelector('.hero-content .cta-btn');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => {
            const featuresSection = document.querySelector('#features');
            if (featuresSection) {
                smoothScroll(featuresSection);
            }
        });
    }

    // Add PostureDetector initialization
    try {
        const detector = new PostureDetector();
        await detector.init();
    } catch (error) {
        console.error('Failed to initialize posture detector:', error);
    }

    // Handle navigation clicks
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            let target;

            switch(targetId) {
                case '#home':
                    target = document.querySelector('.hero');
                    break;
                case '#features':
                    target = document.querySelector('#features');
                    break;
                case '#demo':
                    target = document.querySelector('#demo');
                    break;
                case '#contact':
                    target = document.querySelector('#contact');
                    break;
                default:
                    target = document.querySelector(targetId);
            }

            if (target) {
                smoothScroll(target);
            }
        });
    });

    // Remove loading overlay
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
});

// Handle window resize
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
});