import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CameraCard from './components/CameraCard';
import OutputPanel from './components/OutputPanel';
import ControlPanel from './components/ControlPanel';
import LandingPage from './components/LandingPage';

const ISL_SIGNS = [
  'Hello', 'Thank You', 'Please', 'Yes', 'No', 
  'Help', 'Good Morning', 'Goodbye', 'Sorry', 'Welcome'
];

function App() {
  // State to control view navigation
  const [showLanding, setShowLanding] = useState(true);

  // App Core State
  const [darkMode, setDarkMode] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [recognizedSign, setRecognizedSign] = useState('');
  const [convertedSpeech, setConvertedSpeech] = useState('');
  
  // New State for Camera Switching ('user' = front, 'environment' = back)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  
  const detectionIntervalRef = useRef<number | null>(null);

  // Clean up camera when component unmounts
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Updated startCamera to accept an optional mode
  const startCamera = async (requestedMode?: 'user' | 'environment') => {
    // Stop any existing stream before starting a new one
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    const modeToUse = requestedMode || facingMode;

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: modeToUse,
          // Use 'ideal' constraints for mobile compatibility
          width: { ideal: 1280 }, 
          height: { ideal: 720 }
        },
        audio: false
      });
      setStream(mediaStream);
      setIsCameraActive(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please ensure camera permissions are granted.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraActive(false);
    }
  };

  // New function to toggle camera
  const handleToggleCamera = () => {
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newMode);
    
    // Only restart the camera if it's currently active
    if (isCameraActive) {
      startCamera(newMode);
    }
  };

  const simulateGestureDetection = () => {
    const randomSign = ISL_SIGNS[Math.floor(Math.random() * ISL_SIGNS.length)];
    setRecognizedSign(randomSign);
    setTimeout(() => {
      setConvertedSpeech(prev => (prev ? `${prev} ${randomSign}` : randomSign));
    }, 500);
  };

  const handleStartDetection = () => {
    setIsDetecting(true);
    detectionIntervalRef.current = window.setInterval(() => {
      simulateGestureDetection();
    }, 3000);
  };

  const handleStopDetection = () => {
    setIsDetecting(false);
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
  };

  const handleReset = () => {
    handleStopDetection();
    setRecognizedSign('');
    setConvertedSpeech('');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (showLanding) {
    return <LandingPage onGetStarted={() => {
      setShowLanding(false);
      startCamera(); 
    }} />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-black' 
        : 'bg-gradient-to-br from-teal-50 via-white to-slate-100'
    }`}>
      <Header darkMode={darkMode} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <CameraCard
              darkMode={darkMode}
              isActive={isCameraActive}
              stream={stream}
            />

            <OutputPanel
              darkMode={darkMode}
              recognizedSign={recognizedSign}
              convertedSpeech={convertedSpeech}
            />
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <ControlPanel
                darkMode={darkMode}
                isDetecting={isDetecting}
                isCameraActive={isCameraActive}
                onStartDetection={handleStartDetection}
                onStopDetection={handleStopDetection}
                onReset={handleReset}
                onToggleDarkMode={toggleDarkMode}
                onToggleCamera={handleToggleCamera} // Pass the new handler
              />
              
              <button 
                onClick={() => {
                  stopCamera();
                  setShowLanding(true);
                }}
                className={`w-full mt-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer darkMode={darkMode} />
    </div>
  );
}

export default App;