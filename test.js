    async detectLoop() {
        if (!this.isRunning) return;

        try {
            if (this.webcam.readyState === this.webcam.HAVE_ENOUGH_DATA) {
                this.ctx.drawImage(this.webcam, 0, 0);

                try {
                    const predictions = await this.blazeface.estimateFaces(this.webcam, false);

                    if (predictions.length > 0) {
                        const face = predictions[0];
                        const [x, y] = face.topLeft;
                        const [width, height] = [
                            face.bottomRight[0] - face.topLeft[0],
                            face.bottomRight[1] - face.topLeft[1]
                        ];

                        // Draw face detection box
                        this.ctx.strokeStyle = '#00ff00';
                        this.ctx.lineWidth = 2;
                        this.ctx.strokeRect(x, y, width, height);

                        // Extract and preprocess face image
                        const faceImage = tf.tidy(() => {
                            const img = tf.browser.fromPixels(this.webcam);
                            // Crop and resize
                            const cropped = tf.image.cropAndResize(
                                img.expandDims(),
                                [[
                                    y / this.webcam.height,
                                    x / this.webcam.width,
                                    (y + height) / this.webcam.height,
                                    (x + width) / this.webcam.width
                                ]],
                                [0],
                                [160, 160]
                            );
                            // Correct the dimensions for the emotion model
                            return cropped.mean(3)
                                        .expandDims(3)  // Add channel dimension
                                        .expandDims(0)  // Add batch dimension
                                        .div(255.0);    // Normalize
                        });

                        // Calculate distance
                        const distance = this.calculateFaceDistance(
                            width,
                            height,
                            this.webcam.videoWidth,
                            this.webcam.videoHeight
                        );

                        // Make prediction
                        const prediction = await this.model.predict(faceImage).data();
                        
                        // Update UI
                        this.updateUI(
                            Object.entries(this.emotionMap).map(([index, emotion]) => ({
                                emotion,
                                confidence: prediction[index]
                            })),
                            distance
                        );

                        // Cleanup
                        tf.dispose(faceImage);
                    } else {
                        this.updateUI([], 0);
                    }
                } catch (detectionError) {
                    console.error('Face detection error:', detectionError);
                }
            }
        } catch (error) {
            console.error('Main detection loop error:', error);
        }

        requestAnimationFrame(() => this.detectLoop());
    }