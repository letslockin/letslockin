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
        // Reduce particle count significantly by increasing the divisor
        const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 25000);
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
        this.facemesh = null;
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
        this.lastDrawTime = 0;
        this.frameInterval = 1000 / 10; // Limit to 10 FPS
        this.lastUIUpdate = 0;
        this.uiUpdateInterval = 100; // Reduce to 100ms (was 200ms)
        this.emotionBuffer = [];
        this.distanceBuffer = [];
        this.bufferSize = 2;  // Reduce buffer size (was 3)
        this.isInitialized = false;
        this.alertSound = document.getElementById('distance-alert');
        this.normalSound = document.getElementById('distance-normal');
        this.isAlertPlaying = false;
        this.lastAlertTime = 0;
        this.alertCooldown = 3000; // 3 seconds between alerts

        // Add this to ensure sounds are loaded
        if (this.alertSound) {
            this.alertSound.load();
            console.log('Alert sound loaded');
        } else {
            console.warn('Alert sound element not found');
        }
        
        if (this.normalSound) {
            this.normalSound.load();
            console.log('Normal sound loaded');
        } else {
            console.warn('Normal sound element not found');
        }
    }

    async init() {
        if (this.isInitialized) return;
        
        try {
            // Setup webcam and canvas
            this.webcam = document.getElementById('webcam');
            this.canvas = document.getElementById('output-canvas');
            
            if (!this.webcam || !this.canvas) {
                throw new Error('Required elements not found');
            }

            this.ctx = this.canvas.getContext('2d');
            this.canvas.width = 640;
            this.canvas.height = 480;

            // Load Facemesh instead of Blazeface
            this.facemesh = await faceLandmarksDetection.load(
                faceLandmarksDetection.SupportedPackages.mediapipeFacemesh
            );

            // Request camera permission only when initializing
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
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

            this.isInitialized = true;
            this.isRunning = true;
            this.detectLoop();

        } catch (error) {
            console.error('Error initializing posture detector:', error);
            throw error;
        }
    }

    async detectLoop(timestamp) {
        if (!this.isRunning) return;
        
        try {
            if (this.webcam.readyState === this.webcam.HAVE_ENOUGH_DATA) {
                this.ctx.drawImage(this.webcam, 0, 0);

                const predictions = await this.facemesh.estimateFaces({
                    input: this.webcam,
                    returnTensors: false,
                    flipHorizontal: false,
                    predictIrises: false
                });

                if (predictions.length > 0) {
                    const face = predictions[0];
                    const landmarks = face.scaledMesh;
                    const coords = landmarks.reduce((acc, point) => {
                        acc.minX = Math.min(acc.minX, point[0]);
                        acc.minY = Math.min(acc.minY, point[1]);
                        acc.maxX = Math.max(acc.maxX, point[0]);
                        acc.maxY = Math.max(acc.maxY, point[1]);
                        return acc;
                    }, { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });

                    let x = Math.round(coords.minX);
                    let y = Math.round(coords.minY);
                    let width = Math.round(coords.maxX - coords.minX);
                    let height = Math.round(coords.maxY - coords.minY);

                    // Ensure coordinates are valid (keep this for detection logic)
                    x = Math.max(0, Math.min(x, this.canvas.width - width));
                    y = Math.max(0, Math.min(y, this.canvas.height - height));
                    width = Math.min(width, this.canvas.width - x);
                    height = Math.min(height, this.canvas.height - y);

                    // Draw high-tech corners
                    const side_length_x = 0.4 * width;
                    const side_length_y = 0.4 * height;
                    const longer_side = Math.max(width, height);
                    const thickness = Math.max(4, 0.07 * longer_side);

                    this.ctx.strokeStyle = '#63B3ED'; // Lighter blue color
                    this.ctx.lineWidth = thickness;
                    this.ctx.lineCap = 'round';

                    // Draw top right corner
                    this.ctx.beginPath();
                    this.ctx.moveTo(x + width, y);
                    this.ctx.lineTo(x + width - side_length_x, y);
                    this.ctx.stroke();

                    this.ctx.beginPath();
                    this.ctx.moveTo(x + width, y);
                    this.ctx.lineTo(x + width, y + side_length_y);
                    this.ctx.stroke();

                    // Draw bottom left corner
                    this.ctx.beginPath();
                    this.ctx.moveTo(x, y + height);
                    this.ctx.lineTo(x + side_length_x, y + height);
                    this.ctx.stroke();

                    this.ctx.beginPath();
                    this.ctx.moveTo(x, y + height);
                    this.ctx.lineTo(x, y + height - side_length_y);
                    this.ctx.stroke();

                    // Create temporary canvas for face processing (keep all this logic)
                    const faceCanvas = document.createElement('canvas');
                    faceCanvas.width = 160;
                    faceCanvas.height = 160;
                    const faceCtx = faceCanvas.getContext('2d');

                    faceCtx.drawImage(
                        this.webcam,
                        x, y, width, height,
                        0, 0, 160, 160
                    );

                    // Process for emotion detection
                    const emotionPrediction = tf.tidy(() => {
                        return tf.browser.fromPixels(faceCanvas)
                            .mean(2)
                            .toFloat()
                            .expandDims(-1)
                            .expandDims(0)
                            .div(255.0);
                    });

                    const prediction = await this.model.predict(emotionPrediction);
                    const probabilities = await prediction.data();

                    const distance = this.calculateFaceDistance(
                        width, height,
                        this.webcam.videoWidth,
                        this.webcam.videoHeight
                    );

                    const emotionConfidences = Object.entries(this.emotionMap)
                        .map(([index, emotion]) => ({
                            emotion,
                            confidence: probabilities[index]
                        }));

                    this.updateUI(emotionConfidences, distance);

                    // Cleanup
                    tf.dispose([emotionPrediction, prediction]);
                    faceCanvas.remove();
                }
            }
        } catch (error) {
            console.error('Detection loop error:', error);
        }

        requestAnimationFrame((timestamp) => this.detectLoop(timestamp));
    }

    updateUI(emotionConfidences, distance) {
        const now = performance.now();
        if (now - this.lastUIUpdate < this.uiUpdateInterval) {
            this.emotionBuffer.push(emotionConfidences);
            this.distanceBuffer.push(distance);
            if (this.emotionBuffer.length > this.bufferSize) {
                this.emotionBuffer.shift();
                this.distanceBuffer.shift();
            }
            return;
        }
        this.lastUIUpdate = now;

        // Update posture with corrected distance interpretations
        const postureLabel = document.getElementById('posture-label');
        const confidenceBar = document.getElementById('posture-confidence');
        
        let postureStatus = '';
        let barColor = '';
        
        // Calculate color based on distance ranges with corrected messages
        if (distance <= 3) {
            postureStatus = 'Too far from screen';
            barColor = '#FF0000'; // Pure red
            this.playDistanceAlert(false).catch(console.error);
        } else if (distance > 19) {
            postureStatus = 'Too close to screen';
            barColor = '#FF0000'; // Pure red
            this.playDistanceAlert(true).catch(console.error);
        } else if (distance > 5 && distance <= 14) {
            postureStatus = 'Good posture';
            barColor = '#00FF00'; // Pure green
            this.playNormalDistance().catch(console.error);
        } else if (distance > 3 && distance <= 5) {
            postureStatus = 'Too far from screen';
            // Transition from red to yellow (3-5 range)
            const ratio = (distance - 3) / 2;
            const r = 255;
            const g = Math.round(ratio * 255);
            barColor = `rgb(${r}, ${g}, 0)`;
            this.playDistanceAlert(false).catch(console.error);
        } else if (distance > 14 && distance <= 17) {
            postureStatus = 'Lean back a bit';
            // Transition from green to yellow (14-17 range)
            const ratio = (distance - 14) / 3;
            const r = Math.round(ratio * 255);
            const g = 255;
            barColor = `rgb(${r}, ${g}, 0)`;
        } else if (distance > 17 && distance <= 19) {
            postureStatus = 'Too close to screen';
            // Transition from yellow to red (17-19 range)
            const ratio = (distance - 17) / 2;
            const r = 255;
            const g = Math.round(255 * (1 - ratio));
            barColor = `rgb(${r}, ${g}, 0)`;
            this.playDistanceAlert(true).catch(console.error);
        }
        
        if (postureLabel && confidenceBar) {
            postureLabel.textContent = postureStatus;
            postureLabel.style.color = barColor;
            const scaledWidth = Math.min(100, (distance / 24) * 100);
            confidenceBar.style.width = `${scaledWidth}%`;
            confidenceBar.style.background = barColor;
            confidenceBar.style.transition = 'background-color 0.3s ease, width 0.3s ease';
        }

        // Update emotions list - show only top 3
        const detectionList = document.getElementById('detection-list');
        if (detectionList) {
            const sortedEmotions = emotionConfidences
                .sort((a, b) => b.confidence - a.confidence)
                .slice(0, 3); // Only show top 3 emotions

            const fragment = document.createDocumentFragment();
            
            sortedEmotions.forEach(({emotion, confidence}) => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span>${emotion}</span>
                        <div class="emotion-bar-container">
                            <div class="emotion-bar" style="width: ${confidence * 100}%;"></div>
                        </div>
                        <span>${(confidence * 100).toFixed(1)}%</span>
                    </div>
                `;
                fragment.appendChild(listItem);
            });

            detectionList.innerHTML = '';
            detectionList.appendChild(fragment);
        }

        // Clear buffers
        this.emotionBuffer = [];
        this.distanceBuffer = [];
    }

    async stop() {
        this.isRunning = false;
        if (this.webcam && this.webcam.srcObject) {
            const tracks = this.webcam.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            this.webcam.srcObject = null;
        }
        this.isInitialized = false;
        this.isAlertPlaying = false;
        this.lastAlertTime = 0;
        if (this.alertSound) this.alertSound.pause();
        if (this.normalSound) this.normalSound.pause();

        // Reset audio state
        this.isAlertPlaying = false;
        this.lastAlertTime = 0;
        
        try {
            if (this.alertSound) {
                this.alertSound.pause();
                this.alertSound.currentTime = 0;
            }
            if (this.normalSound) {
                this.normalSound.pause();
                this.normalSound.currentTime = 0;
            }
        } catch (error) {
            console.error('Error stopping sounds:', error);
        }
    }

    calculateFaceDistance(faceWidth, faceHeight, frameWidth, frameHeight) {
        const cameraSize = frameWidth * frameHeight;
        const faceArea = faceWidth * faceHeight;
        return (faceArea * 100) / cameraSize;
    }

    async playDistanceAlert(isTooClose) {
        const currentTime = Date.now();
        if (currentTime - this.lastAlertTime < this.alertCooldown) {
            return;
        }

        if (!this.isAlertPlaying && this.alertSound) {
            this.isAlertPlaying = true;
            this.lastAlertTime = currentTime;
            
            try {
                // Reset the sound to beginning
                this.alertSound.currentTime = 0;
                
                // Create a user interaction promise
                const playPromise = this.alertSound.play();
                
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            console.log('Alert sound playing successfully');
                        })
                        .catch(error => {
                            console.error('Error playing alert sound:', error);
                            // Reset the alert state if playback fails
                            this.isAlertPlaying = false;
                        });
                }

                const message = isTooClose ? 
                    "You're too close to the screen!" : 
                    "You're too far from the screen!";
                console.log(message);
                
            } catch (error) {
                console.error('Error in playDistanceAlert:', error);
                this.isAlertPlaying = false;
            }
        }
    }

    async playNormalDistance() {
        if (this.isAlertPlaying && this.normalSound) {
            this.isAlertPlaying = false;
            
            try {
                this.normalSound.currentTime = 0;
                
                const playPromise = this.normalSound.play();
                
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            console.log('Normal sound playing successfully');
                        })
                        .catch(error => {
                            console.error('Error playing normal sound:', error);
                        });
                }
                
                console.log("Distance is now normal");
                
            } catch (error) {
                console.error('Error in playNormalDistance:', error);
            }
        }
    }

    updatePostureInfo(distance) {
        // ... existing distance calculation code ...

        // Add this after the distance calculation
        if (distance < 40) {
            this.playDistanceAlert(true).catch(console.error); // Too close
        } else if (distance > 80) {
            this.playDistanceAlert(false).catch(console.error); // Too far
        } else {
            this.playNormalDistance().catch(console.error); // Normal distance
        }

        // ... rest of the existing code ...
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

    // Initialize detector but don't start it yet
    const detector = new PostureDetector();
    
    // Add start and stop demo button functionality
    const startDemoBtn = document.getElementById('start-demo');
    const stopDemoBtn = document.getElementById('stop-demo');
    const demoContainer = document.querySelector('.demo-container');
    
    if (startDemoBtn && stopDemoBtn && demoContainer) {
        startDemoBtn.addEventListener('click', async () => {
            try {
                await detector.init();
                demoContainer.classList.add('active');
                startDemoBtn.style.display = 'none';
                stopDemoBtn.style.display = 'inline-flex';
            } catch (error) {
                console.error('Failed to start demo:', error);
                alert('Failed to start demo. Please ensure camera access is allowed.');
            }
        });

        stopDemoBtn.addEventListener('click', async () => {
            await detector.stop();
            demoContainer.classList.remove('active');
            startDemoBtn.style.display = 'inline-flex';
            stopDemoBtn.style.display = 'none';
            
            // Reset the UI elements
            const postureLabel = document.getElementById('posture-label');
            const confidenceBar = document.getElementById('posture-confidence');
            const detectionList = document.getElementById('detection-list');
            
            if (postureLabel) postureLabel.textContent = '-';
            if (confidenceBar) confidenceBar.style.width = '0%';
            if (detectionList) detectionList.innerHTML = '';
        });
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

    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
});

// Handle window resize
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
});