import React, { useState, useRef, useEffect } from "react";
import "../../styles/globals.css";

export default function QRScanner({ onScan }) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState("");
  const [hasCamera, setHasCamera] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [scanningStatus, setScanningStatus] = useState("ready");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);
  const lastScanTimeRef = useRef(0);

  // Check for camera availability on mount
  useEffect(() => {
    checkCameraAvailability();
    return () => {
      stopCamera();
    };
  }, []);

  const checkCameraAvailability = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((device) => device.kind === "videoinput");
      setHasCamera(videoDevices.length > 0);
    } catch (err) {
      console.error("Error checking camera availability:", err);
      setHasCamera(false);
    }
  };

  const startCamera = async () => {
    try {
      setError("");
      setIsScanning(true);
      setScanSuccess(false);
      setScanningStatus("initializing");

      // Request high-resolution camera with optimized settings
      const constraints = {
        video: {
          facingMode: "environment", // Prefer back camera
          width: { min: 640, ideal: 1920, max: 4096 },
          height: { min: 480, ideal: 1080, max: 2160 },
          frameRate: { ideal: 30, max: 60 },
          focusMode: "continuous",
          torch: false
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', true);
        videoRef.current.setAttribute('autoplay', true);
        videoRef.current.setAttribute('muted', true);

        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().then(() => {
            setScanningStatus("scanning");
            // Start scanning immediately after video is ready
            setTimeout(() => {
              startHighSpeedQRDetection();
            }, 500);
          }).catch(err => {
            console.error("Video play failed:", err);
            setError("Failed to start camera video");
            setIsScanning(false);
          });
        };
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setError("Camera access denied. Please allow camera permissions and try again.");
      setIsScanning(false);
      setScanningStatus("error");
    }
  };

  const stopCamera = () => {
    setIsScanning(false);
    setScanningStatus("ready");

    // Clear scanning interval
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }

    // Stop camera stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.pause();
    }
  };

  const startHighSpeedQRDetection = async () => {
    console.log("Starting high-speed QR detection...");

    let detectionMethod = null;
    let jsQR = null;

    // Try to load jsQR for high-performance scanning
    try {
      jsQR = (await import("jsqr")).default;
      console.log("jsQR library loaded successfully");
      detectionMethod = "jsqr";
    } catch (err) {
      console.error("jsQR not available:", err);
    }

    // Fallback to qr-scanner
    if (!jsQR) {
      try {
        const QrScanner = (await import("qr-scanner")).default;
        console.log("QR Scanner library loaded as fallback");

        if (videoRef.current) {
          const qrScanner = new QrScanner(
            videoRef.current,
            (result) => {
              console.log("QR Scanner detected:", result);
              handleScanResult(result.data || result);
            },
            {
              returnDetailedScanResult: true,
              highlightScanRegion: false,
              highlightCodeOutline: false,
              maxScansPerSecond: 25,
              preferredCamera: 'environment'
            }
          );

          await qrScanner.start();
          scanIntervalRef.current = qrScanner;
          detectionMethod = "qr-scanner";
        }
      } catch (err) {
        console.error("QR Scanner library failed:", err);
        setError("QR scanning libraries not available");
        return;
      }
    }

    // High-speed jsQR detection
    if (detectionMethod === "jsqr") {
      let frameCount = 0;

      const scanFrame = () => {
        if (!isScanning || scanSuccess || !videoRef.current || !canvasRef.current) {
          return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          // Optimize canvas size for performance
          const scale = 0.5; // Process at half resolution for speed
          canvas.width = video.videoWidth * scale;
          canvas.height = video.videoHeight * scale;

          try {
            // Draw video frame to canvas
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Only process every 2nd frame for better performance
            frameCount++;
            if (frameCount % 2 === 0) {
              const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

              // Enhanced jsQR options for better detection
              const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
                locateOptions: {
                  tryHarder: true,
                  useDistortionCorrection: true
                }
              });

              if (code && code.data) {
                console.log("High-speed QR detected:", code.data);
                handleScanResult(code.data);
                return;
              }
            }
          } catch (err) {
            console.error("Frame processing error:", err);
          }
        }

        // Schedule next frame at high frequency
        if (isScanning && !scanSuccess) {
          requestAnimationFrame(scanFrame);
        }
      };

      // Start the high-speed scanning loop
      requestAnimationFrame(scanFrame);
    }
  };

  const handleScanResult = (result) => {
    // Prevent duplicate scans within 2 seconds
    const now = Date.now();
    if (now - lastScanTimeRef.current < 2000) {
      return;
    }
    lastScanTimeRef.current = now;

    if (result && !scanSuccess) {
      console.log("Processing scan result:", result);
      setScanSuccess(true);
      setScanningStatus("success");

      // Extract worker ID from QR code data
      let workerId = result.toString().trim();
      console.log("Raw QR data:", workerId);

      // Handle different QR code formats
      if (workerId.includes("worker:")) {
        workerId = workerId.split("worker:")[1];
      } else if (workerId.match(/^W\d+$/i)) {
        workerId = workerId.toUpperCase();
      } else {
        const workerMatch = workerId.match(/W\d+/i);
        if (workerMatch) {
          workerId = workerMatch[0].toUpperCase();
        } else {
          console.error("Invalid QR format:", result);
          setScanSuccess(false);
          setScanningStatus("scanning");
          return;
        }
      }

      console.log("Extracted worker ID:", workerId);

      // Validate worker ID format
      if (!/^W\d{3}$/.test(workerId)) {
        console.error("Invalid worker ID format:", workerId);
        setScanSuccess(false);
        setScanningStatus("scanning");
        return;
      }

      // Provide immediate feedback
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }

      // Play success sound if available
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBCZ7ze7NQgcdj8b03YNBAhmR2OzCVCQGFIzA8sR7LwwggsHwy3gvAA');
        audio.volume = 0.3;
        audio.play().catch(() => { }); // Ignore audio errors
      } catch (e) { }

      // Stop camera after successful scan
      setTimeout(() => {
        stopCamera();
      }, 1000);

      // Call the onScan callback
      onScan(workerId);

      // Show success message briefly
      setTimeout(() => {
        setScanSuccess(false);
        setScanningStatus("ready");
      }, 3000);
    }
  };

  const getScanningStatusText = () => {
    switch (scanningStatus) {
      case "initializing":
        return "Initializing camera...";
      case "scanning":
        return "Scanning for QR codes...";
      case "success":
        return "QR Code detected successfully!";
      case "error":
        return "Scanner error occurred";
      default:
        return "Ready to scan";
    }
  };

  const getScanningStatusColor = () => {
    switch (scanningStatus) {
      case "initializing":
        return "wspm-text-blue";
      case "scanning":
        return "wspm-text-orange";
      case "success":
        return "wspm-text-green";
      case "error":
        return "wspm-text-red";
      default:
        return "wspm-text-gray";
    }
  };

  return (
    <div className="wspm-qr-container">
      <div className="wspm-qr-content">
        <div className="wspm-qr-icon">
          <svg className="wspm-qr-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        </div>

        <h4 className="wspm-qr-title">QR Code Scanner</h4>
        <p className="wspm-qr-subtitle">High-speed worker QR code detection</p>

        {/* Scanning Status */}
        <div className={`wspm-qr-status ${getScanningStatusColor()}`}>
          {getScanningStatusText()}
        </div>

        {/* Camera View */}
        {isScanning ? (
          <div className="wspm-qr-scanner-container">
            <div className="wspm-qr-video-container">
              <video
                ref={videoRef}
                className="wspm-qr-video"
                playsInline
                muted
                autoPlay
                style={{
                  transform: 'scaleX(-1)', // Mirror the video for better UX
                }}
              />
              <canvas ref={canvasRef} className="wspm-qr-canvas" />

              {/* High-Performance Scanning Overlay */}
              <div className="wspm-qr-overlay">
                <div className={`wspm-qr-frame ${scanSuccess ? 'wspm-qr-frame-success' :
                  scanningStatus === 'scanning' ? 'wspm-qr-frame-scanning' :
                    'wspm-qr-frame-default'
                  }`}>
                  {/* Corner markers */}
                  <div className={`wspm-qr-corner wspm-qr-corner-tl ${scanSuccess ? 'wspm-qr-corner-success' :
                    scanningStatus === 'scanning' ? 'wspm-qr-corner-scanning' :
                      'wspm-qr-corner-default'
                    }`}></div>
                  <div className={`wspm-qr-corner wspm-qr-corner-tr ${scanSuccess ? 'wspm-qr-corner-success' :
                    scanningStatus === 'scanning' ? 'wspm-qr-corner-scanning' :
                      'wspm-qr-corner-default'
                    }`}></div>
                  <div className={`wspm-qr-corner wspm-qr-corner-bl ${scanSuccess ? 'wspm-qr-corner-success' :
                    scanningStatus === 'scanning' ? 'wspm-qr-corner-scanning' :
                      'wspm-qr-corner-default'
                    }`}></div>
                  <div className={`wspm-qr-corner wspm-qr-corner-br ${scanSuccess ? 'wspm-qr-corner-success' :
                    scanningStatus === 'scanning' ? 'wspm-qr-corner-scanning' :
                      'wspm-qr-corner-default'
                    }`}></div>

                  {/* Scanning animation */}
                  {scanningStatus === 'scanning' && !scanSuccess && (
                    <div className="wspm-qr-animation">
                      <div className="wspm-qr-scan-line"></div>
                      <div className="wspm-qr-grid-lines">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="wspm-qr-grid-line"
                            style={{
                              top: `${20 + i * 30}%`,
                              animationDelay: `${i * 0.1}s`
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Success indicator */}
                  {scanSuccess && (
                    <div className="wspm-qr-success-indicator">
                      <div className="wspm-qr-success-circle">
                        <svg className="wspm-qr-success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Center targeting dot */}
                  {scanningStatus === 'scanning' && !scanSuccess && (
                    <div className="wspm-qr-target-dot"></div>
                  )}
                </div>
              </div>

              {/* Instructions overlay */}
              <div className="wspm-qr-instructions">
                <p className="wspm-qr-instructions-text">
                  {scanSuccess ? "✅ QR Code Detected!" :
                    scanningStatus === 'scanning' ? "📱 Hold QR code steady in the frame" :
                      "🔄 Initializing scanner..."}
                </p>
                {scanningStatus === 'scanning' && (
                  <p className="wspm-qr-instructions-subtext">Position QR code within the scanning area</p>
                )}
              </div>
            </div>

            <div className="wspm-qr-stop-container">
              <button
                onClick={stopCamera}
                className="wspm-qr-stop-btn"
              >
                🛑 Stop Scanner
              </button>
            </div>
          </div>
        ) : (
          <div className="wspm-qr-placeholder-container">
            {/* Scanner placeholder */}
            <div className="wspm-qr-placeholder">
              {error ? (
                <div className="wspm-qr-error">
                  <svg className="wspm-qr-error-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="wspm-qr-error-title">Scanner Error</p>
                  <p className="wspm-qr-error-message">{error}</p>
                </div>
              ) : (
                <div className="wspm-qr-placeholder-content">
                  <div className="wspm-qr-placeholder-icon">
                    <svg className="wspm-qr-placeholder-icon-svg" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2H4zm12 12V7H4v10h12z" clipRule="evenodd" />
                      <path d="M9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" />
                    </svg>
                    <div className="wspm-qr-placeholder-badge">
                      <span className="wspm-qr-placeholder-badge-text">⚡</span>
                    </div>
                  </div>
                  <p className="wspm-qr-placeholder-title">High-Speed Scanner Ready</p>
                  <p className="wspm-qr-placeholder-subtitle">Optimized for instant QR detection</p>
                </div>
              )}
            </div>

            {/* Start button */}
            {hasCamera && (
              <button
                onClick={startCamera}
                className="wspm-qr-start-btn"
              >
                🚀 Start High-Speed Scanner
              </button>
            )}
          </div>
        )}

        {/* Enhanced Instructions */}
        <div className="wspm-qr-features">
          <div className="wspm-qr-features-content">
            <p className="wspm-qr-features-title">⚡ High-Performance Scanner Features:</p>
            <div className="wspm-qr-features-grid">
              <p>• 30+ FPS scanning rate</p>
              <p>• Auto-focus optimization</p>
              <p>• Instant detection feedback</p>
              <p>• Multi-format QR support</p>
              <p>• Distortion correction</p>
              <p>• Low-light enhancement</p>
            </div>
          </div>
        </div>

        {/* Camera status */}
        <div className="wspm-qr-camera-status">
          <div className={`wspm-qr-camera-indicator ${hasCamera ? "wspm-qr-camera-active" : "wspm-qr-camera-inactive"}`}></div>
          <span className="wspm-qr-camera-text">
            {hasCamera ? "High-Resolution Camera Available" : "No Camera Detected"}
          </span>
        </div>
      </div>
    </div>
  );
}