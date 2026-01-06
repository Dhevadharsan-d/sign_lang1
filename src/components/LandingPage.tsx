import { ArrowRight, Video, Mic, Shield } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-slate-100 flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-20 text-center relative overflow-hidden">
        
        {/* Background Decorations */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-sm font-medium mb-4 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            Real-time Translation System
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-gray-900 mb-6">
            Breaking Silence, <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-600">
              Building Connections
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
            Our AI-powered platform translates sign language gestures into spoken words in real-time. Designed to bridge the communication gap, providing instant voice synthesis for seamless interaction.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onGetStarted}
              className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-full text-lg font-bold hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-full text-lg font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300">
              Read Documentation
            </button>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="bg-white/60 backdrop-blur-lg border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Video className="w-6 h-6 text-teal-600" />}
              title="Visual Recognition"
              desc="Advanced computer vision detects hand signs with high precision directly from your camera stream."
            />
            <FeatureCard 
              icon={<Mic className="w-6 h-6 text-blue-600" />}
              title="Speech Synthesis"
              desc="Instantly converts recognized sign language gestures into natural-sounding audible speech."
            />
            <FeatureCard 
              icon={<Shield className="w-6 h-6 text-indigo-600" />}
              title="Secure & Private"
              desc="Privacy-focused processing ensures your video feed is handled securely and responsibly."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}