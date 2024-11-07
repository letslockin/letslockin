// GSAP
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
        // make the particles fly up :)
        this.speedY = Math.random() * -2 - 1;
        this.opacity = Math.random() * 0.5 + 0.2;
        
        // set styles
        this.element.style.width = `${this.size}px`;
        this.element.style.height = `${this.size}px`;
        this.element.style.opacity = this.opacity;

        // append to the container
        this.container.appendChild(this.element);
        this.updatePosition();
    }

    updatePosition() {
        this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;

        // reset particles when they go off screen
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
        
        // handle the partivcles for different portviews
        window.addEventListener('resize', () => this.handleResize());
    }

    createParticles() {
        // reduct the total number of particles for optimal performance :)
        const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 25000);
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(this.container));
        }
    }

    drawLines() {
        // Remove old lines
        this.lines.forEach(line => line.remove());
        this.lines = [];

        // draw new lines between nearby particles
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i].getPosition();
                const p2 = this.particles[j].getPosition();
                const distance = Math.hypot(p1.x - p2.x, p1.y - p2.y);
                
                // threshold
                if (distance < 150) {
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
        // clear particles when resize and regenerate for the new portview
        this.particles.forEach(particle => particle.element.remove());
        this.lines.forEach(line => line.remove());
        this.particles = [];
        this.lines = [];
        
        this.createParticles();
    }
}

// smooth scroll
const smoothScroll = (target) => {
    const offset = 80;
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
    
    gsap.to(window, {
        duration: 1,
        scrollTo: { y: targetPosition, autoKill: false },
        ease: 'power2.inOut'
    });
};

// text animations
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

// animate elements when they come into view
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

    // section titles animation
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

// progress bar animation (for the info section in demo)
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

// feedback function for the feedback button
function initFeedback() {
    const feedbackBtn = document.querySelector('.feedback-btn');
    const modal = document.querySelector('.feedback-modal');
    const closeBtn = document.querySelector('.close-modal');
    const form = document.querySelector('.feedback-form');

    // hide feedback button initially
    feedbackBtn.style.opacity = '0';
    feedbackBtn.style.visibility = 'hidden';

    // show/hide feedback button based on scroll position
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const showPosition = window.innerHeight * 0.5;

        if (scrollPosition > showPosition) {
            feedbackBtn.style.opacity = '1';
            feedbackBtn.style.visibility = 'visible';
        } else {
            feedbackBtn.style.opacity = '0';
            feedbackBtn.style.visibility = 'hidden';
        }
    });

    // existing modal functionality
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

// login function
function initLogin() {
    const loginBtn = document.querySelector('.login-btn');
    const modal = document.querySelector('.login-modal');
    const closeBtn = modal.querySelector('.close-modal');
    const form = modal.querySelector('.login-form');
    const signupLink = modal.querySelector('.signup-link a');
    const forgotPassword = modal.querySelector('.forgot-password');

    // open modal
    loginBtn.addEventListener('click', () => {
        modal.classList.add('active');
    });

    // Close modal
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // close when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]').value;
        const password = form.querySelector('input[type="password"]').value;

        try {
            // API call to backend (I will do it later)
            console.log('Login attempt:', { email, password });
            
            // simulate API call for now
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // for demo purposes, always succeed :)))
            alert('Login successful!');
            modal.classList.remove('active');
            form.reset();
            
            // update UI to show logged-in state
            loginBtn.textContent = 'Profile';
            
        } catch (error) {
            alert('Login failed. Please try again.');
        }
    });

    // handle signup link click
    signupLink.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Sign up functionality coming soon!');
    });

    // handle forgot password click
    forgotPassword.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Password reset functionality coming soon!');
    });
}

// add after ParticleSystem class and before smoothScroll function
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
        this.alertCooldown = 1000; // 1 seconds between alerts

        // for debugging
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

        // Add overworking detection properties
        this.stressedVal = 0;
        this.stepsPrintVal = 0;
        this.stressStatus = 0;
        this.stressStartTime = 0;
        this.stressSound = document.getElementById('stress-alert');
        this.stressAlertDuration = 4000; // 4 seconds in milliseconds
        
        // Load stress sound
        if (this.stressSound) {
            this.stressSound.load();
            console.log('Stress alert sound loaded');
        }

        // Update cooldown times
        this.distanceAlertCooldown = 300; // 0.3 seconds for distance alerts
        this.lastDistanceAlertTime = 0;
        
        // Separate stress alert properties
        this.stressAlertDuration = 4000; // 4 seconds for stress alert
        this.stressStartTime = 0;
        this.stressStatus = 0;

        // Add state tracking for posture
        this.isInGoodPosture = false;
        this.lastPostureState = null;
        this.isPlayingAlert = false;

        // Initialize audio context for Safari compatibility
        this.audioContext = null;
        this.alertBuffer = null;
        this.normalBuffer = null;
        this.isAudioInitialized = false;

        // Simplified overwork detection properties
        this.overworkThreshold = 0.3; // 30% threshold for overwork
        this.minFramesForOverwork = 30; // Minimum frames needed before checking

        // Add visibility tracking
        this.isTabVisible = true;
        this.setupVisibilityTracking();

        // Detection loop properties
        this.backgroundInterval = null;
        this.backgroundFPS = 8; // FPS when in background
    }

    setupVisibilityTracking() {
        document.addEventListener('visibilitychange', () => {
            this.isTabVisible = document.visibilityState === 'visible';
            
            // Clear any existing background interval
            if (this.backgroundInterval) {
                clearTimeout(this.backgroundInterval);
                this.backgroundInterval = null;
            }
            
            // Hide/show visual elements
            if (this.canvas) {
                this.canvas.style.display = this.isTabVisible ? 'block' : 'none';
            }
            if (this.webcam) {
                this.webcam.style.display = this.isTabVisible ? 'block' : 'none';
            }

            // Restart the loop with appropriate timing method
            if (this.isRunning) {
                if (this.isTabVisible) {
                    requestAnimationFrame(() => this.detectLoop());
                } else {
                    this.detectLoop();
                }
            }
        });
    }

    // reset values
    resetStressValues() {
        this.stressedVal = 0;
        this.stepsPrintVal = 0;
        this.stressStatus = 0;
        this.stressStartTime = 0;
    }

    // play overworking alert
    async playStressAlert() {
        try {
            if (this.stressSound) {
                this.stressSound.currentTime = 0;
                const playPromise = this.stressSound.play();
                
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            console.log('Stress alert sound playing successfully');
                        })
                        .catch(error => {
                            console.error('Error playing stress alert:', error);
                        });
                }
            }
        } catch (error) {
            console.error('Error in playStressAlert:', error);
        }
    }

    async initAudio() {
        if (this.isAudioInitialized) return;

        try {
            // Create audio context with Safari compatibility
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();

            // Load audio files
            const alertResponse = await fetch('assets/sounds/alert.mp3');
            const normalResponse = await fetch('assets/sounds/normal.mp3');
            
            const alertArrayBuffer = await alertResponse.arrayBuffer();
            const normalArrayBuffer = await normalResponse.arrayBuffer();
            
            this.alertBuffer = await this.audioContext.decodeAudioData(alertArrayBuffer);
            this.normalBuffer = await this.audioContext.decodeAudioData(normalArrayBuffer);
            
            this.isAudioInitialized = true;
        } catch (error) {
            console.error('Error initializing audio:', error);
        }
    }

    async playSound(buffer) {
        if (!this.audioContext || !buffer) return;
        
        try {
            const source = this.audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(this.audioContext.destination);
            source.start(0);
            return source;
        } catch (error) {
            console.error('Error playing sound:', error);
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

            // load Facemesh (468 landmarks)
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
            
            // Start the detection loop with setTimeout
            setTimeout(() => this.detectLoop(), this.intervalTime);

            await this.initAudio(); // Initialize audio when starting detector

        } catch (error) {
            console.error('Error initializing posture detector:', error);
            throw error;
        }
    }

    async detectLoop() {
        if (!this.isRunning) return;
        
        try {
            if (this.webcam.readyState === this.webcam.HAVE_ENOUGH_DATA) {
                // Only update canvas when tab is visible
                if (this.isTabVisible) {
                    this.ctx.drawImage(this.webcam, 0, 0);
                }

                const predictions = await this.facemesh.estimateFaces({
                    input: this.webcam,
                    returnTensors: false,
                    flipHorizontal: false,
                    predictIrises: false
                });

                if (predictions.length > 0) {
                    const face = predictions[0];
                    const landmarks = face.scaledMesh;
                    
                    // Calculate coordinates without drawing if tab is hidden
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

                    // Only draw visual elements if tab is visible
                    if (this.isTabVisible) {
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
                    }

                    // Process emotions and update UI regardless of visibility
                    const faceCanvas = document.createElement('canvas');
                    faceCanvas.width = 160;
                    faceCanvas.height = 160;
                    const faceCtx = faceCanvas.getContext('2d');

                    faceCtx.drawImage(
                        this.webcam,
                        x, y, width, height,
                        0, 0, 160, 160
                    );

                    // Continue with emotion detection and UI updates
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

                    // Update UI only if tab is visible
                    if (this.isTabVisible) {
                        this.updateUI(emotionConfidences, distance);
                    } else {
                        // Still process alerts and tracking without visual updates
                        this.processAlertsAndTracking(emotionConfidences, distance);
                    }

                    // Cleanup
                    tf.dispose([emotionPrediction, prediction]);
                    faceCanvas.remove();
                }
            }
        } catch (error) {
            console.error('Detection loop error:', error);
        }

        // Use requestAnimationFrame when visible, setTimeout when hidden
        if (this.isRunning) {
            if (this.isTabVisible) {
                requestAnimationFrame(() => this.detectLoop());
            } else {
                this.backgroundInterval = setTimeout(
                    () => this.detectLoop(), 
                    1000 / this.backgroundFPS
                );
            }
        }
    }

    calculateEmotionValue(emotionConfidences) {
        const sortedEmotions = emotionConfidences.sort((a, b) => b.confidence - a.confidence);
        const mostConfidentEmotion = sortedEmotions[0].emotion;
        
        if (['Happy', 'Neutral', 'Surprise'].includes(mostConfidentEmotion)) {
            this.stressedVal++;
            this.stepsPrintVal++;
        } else {
            this.stressedVal--;
            this.stepsPrintVal++;
        }

        return {
            emotionVal: this.stressedVal / this.stepsPrintVal,
            sortedEmotions
        };
    }

    processAlertsAndTracking(emotionConfidences, distance) {
        // Process distance alerts
        if (distance <= 3 || distance > 19) {
            this.playDistanceAlert(distance > 19).catch(console.error);
            this.isInGoodPosture = false;
        } else if (distance > 5 && distance <= 14) {
            if (this.lastPostureState !== 'good') {
                this.playNormalDistance().catch(console.error);
            }
            this.isInGoodPosture = true;
        }

        // Process emotions and stress
        const { emotionVal } = this.calculateEmotionValue(emotionConfidences);

        // Check for overwork
        if (this.stepsPrintVal >= this.minFramesForOverwork) {
            if (emotionVal <= this.overworkThreshold) {
                this.playStressAlert().catch(console.error);
                this.resetStressValues();
            } else {
                this.resetStressValues();
            }
        }
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

        // Get UI elements
        const postureLabel = document.getElementById('posture-label');
        const confidenceBar = document.getElementById('posture-confidence');
        const detectionList = document.getElementById('detection-list');
        
        // Calculate emotion values
        const { emotionVal, sortedEmotions } = this.calculateEmotionValue(emotionConfidences);

        let postureStatus = '';
        let barColor = '';
        
        // Determine current posture state
        let currentPostureState;
        if (distance <= 3) {
            currentPostureState = 'too_far';
            postureStatus = 'Too far from screen';
            barColor = '#FF0000';
            this.playDistanceAlert(false).catch(console.error);
            this.isInGoodPosture = false;
        } else if (distance > 5 && distance <= 14) {
            currentPostureState = 'good';
            postureStatus = 'Good posture';
            barColor = '#00FF00';
            if (this.lastPostureState !== 'good') {
                this.playNormalDistance().catch(console.error);
                this.isInGoodPosture = true;
            }
        } else if (distance > 19) {
            currentPostureState = 'too_close';
            postureStatus = 'Too close to screen';
            barColor = '#FF0000';
            this.playDistanceAlert(true).catch(console.error);
            this.isInGoodPosture = false;
        } else if (distance > 3 && distance <= 5) {
            currentPostureState = 'other';
            postureStatus = 'Too far from screen';
            const ratio = (distance - 3) / 2;
            const r = 255;
            const g = Math.round(ratio * 255);
            barColor = `rgb(${r}, ${g}, 0)`;
            this.isInGoodPosture = false;
            this.playDistanceAlert(false).catch(console.error);
        } else if (distance > 14 && distance <= 17) {
            currentPostureState = 'other';
            postureStatus = 'Lean back a bit';
            const ratio = (distance - 14) / 3;
            const r = Math.round(ratio * 255);
            const g = 255;
            barColor = `rgb(${r}, ${g}, 0)`;
            this.isInGoodPosture = false;
        } else if (distance > 17 && distance <= 19) {
            currentPostureState = 'other';
            postureStatus = 'Too close to screen';
            const ratio = (distance - 17) / 2;
            const r = 255;
            const g = Math.round(255 * (1 - ratio));
            barColor = `rgb(${r}, ${g}, 0)`;
            this.isInGoodPosture = false;
        }

        // Update last posture state
        this.lastPostureState = currentPostureState;

        // Update UI elements
        if (postureLabel && confidenceBar) {
            postureLabel.textContent = postureStatus;
            postureLabel.style.color = barColor;
            const scaledWidth = Math.min(100, (distance / 24) * 100);
            confidenceBar.style.width = `${scaledWidth}%`;
            confidenceBar.style.background = barColor;
            confidenceBar.style.transition = 'background-color 0.3s ease, width 0.3s ease';
        }

        // Update detection list
        if (detectionList) {
            detectionList.innerHTML = '';
            
            // Calculate inverted emotion value (100% -> 0%, -100% -> 100%)
            const invertedEmotionVal = 1 - emotionVal; // This inverts the scale
            const displayPercentage = (invertedEmotionVal * 100).toFixed(1);
            
            // Add overwork state indicator
            const overworkItem = document.createElement('li');
            overworkItem.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>Overwork State</span>
                    <div class="emotion-bar-container">
                        <div class="emotion-bar" style="width: ${invertedEmotionVal * 100}%;"></div>
                    </div>
                    <span>${displayPercentage}%</span>
                </div>
            `;
            detectionList.appendChild(overworkItem);

            // Add top 3 emotions
            sortedEmotions.slice(0, 3).forEach(({emotion, confidence}) => {
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
                detectionList.appendChild(listItem);
            });
        }
    }

    resetStressValues() {
        this.stressedVal = 0;
        this.stepsPrintVal = 0;
        this.stressStatus = 0;
        this.stressStartTime = 0;
    }

    async stop() {
        this.isRunning = false;
        if (this.webcam && this.webcam.srcObject) {
            const tracks = this.webcam.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            this.webcam.srcObject = null;
        }
        
        // Reset all states
        this.isInGoodPosture = false;
        this.lastPostureState = null;
        this.resetStressValues();
        
        // Stop all sounds
        if (this.alertSound) {
            this.alertSound.onended = null; // Remove event listener
            this.alertSound.pause();
            this.alertSound.currentTime = 0;
        }
        if (this.normalSound) {
            this.normalSound.pause();
            this.normalSound.currentTime = 0;
        }
        if (this.stressSound) {
            this.stressSound.pause();
            this.stressSound.currentTime = 0;
        }
        
        this.isInitialized = false;
        this.isPlayingAlert = false;

        if (this.audioContext) {
            await this.audioContext.close();
            this.audioContext = null;
            this.isAudioInitialized = false;
        }

        // Clear the detection interval if it exists
        if (this.detectionInterval) {
            clearTimeout(this.detectionInterval);
            this.detectionInterval = null;
        }

        // Clear the background interval if it exists
        if (this.backgroundInterval) {
            clearTimeout(this.backgroundInterval);
            this.backgroundInterval = null;
        }
    }

    calculateFaceDistance(faceWidth, faceHeight, frameWidth, frameHeight) {
        const cameraSize = frameWidth * frameHeight;
        const faceArea = faceWidth * faceHeight;
        return (faceArea * 100) / cameraSize;
    }

    async playDistanceAlert(isTooClose) {
        const currentTime = Date.now();
        if (currentTime - this.lastDistanceAlertTime < this.distanceAlertCooldown) {
            return;
        }

        try {
            if (!this.isAudioInitialized) {
                await this.initAudio();
            }
            
            this.lastDistanceAlertTime = currentTime;
            await this.playSound(this.alertBuffer);
            console.log('Distance alert sound playing successfully');
        } catch (error) {
            console.error('Error playing distance alert:', error);
        }
    }

    async playNormalDistance() {
        if (!this.isInGoodPosture) {
            try {
                if (!this.isAudioInitialized) {
                    await this.initAudio();
                }
                
                await this.playSound(this.normalBuffer);
                console.log('Normal sound playing successfully');
            } catch (error) {
                console.error('Error playing normal sound:', error);
            }
        }
    }

    updatePostureInfo(distance) {
        if (distance < 40) {
            this.playDistanceAlert(true).catch(console.error); // Too close
        } else if (distance > 80) {
            this.playDistanceAlert(false).catch(console.error); // Too far
        } else {
            this.playNormalDistance().catch(console.error); // Normal distance
        }
    }
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Initialize GSAP plugins first
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

        // Initialize basic UI components
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

        // initialize detector (but not start yet)
        const detector = new PostureDetector();
        
        // start and stop demo button functions
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

        // navigation clicks
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

        // remove loading overlay
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 500);

        // hamburger menu functionality
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // close menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    } catch (error) {
        console.error('Error initializing the page:', error);
        alert('Failed to initialize the page. Please try again.');
    }
});

// window resize
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
});