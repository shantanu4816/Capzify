import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import logoImage from "@assets/20250729_1720_Enhanced Neon Logo_remix_01k1b07533e7f891dryy51aqzq_1753792282917.png";

export default function Welcome() {
  const { user } = useAuth();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Show content after a brief delay for smooth animation
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const displayName = user?.firstName || user?.email?.split('@')[0] || 'there';

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-[#FF1493]/20 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-[#00BFFF]/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-[#FF1493]/10 to-[#00BFFF]/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        <div className={`text-center space-y-8 transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img 
              src={logoImage} 
              alt="Capzify" 
              className="h-20 w-auto drop-shadow-2xl" 
            />
          </div>

          {/* Welcome message */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              Hey <span className="bg-gradient-to-r from-[#FF1493] to-[#00BFFF] bg-clip-text text-transparent">{displayName}</span>
            </h1>
            
            <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-[#FF1493] via-[#FF69B4] to-[#00BFFF] bg-clip-text text-transparent">
              Welcome to Capzify
            </h2>
          </div>

          {/* Description */}
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Ready to create amazing social media content with AI?
          </p>

          {/* Continue button */}
          <div className="pt-8">
            <button
              onClick={() => window.location.href = '/'}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FF1493] to-[#00BFFF] text-white font-semibold rounded-xl text-lg hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-[#FF1493]/25"
            >
              <span>Get Started</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}