import logoImage from "@/assets/Neon.png";

export default function Landing() {
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
        {/* Logo and title */}
        <div className="text-center mb-12 space-y-6">
          <div className="flex justify-center mb-8">
            <img 
              src={logoImage} 
              alt="Capzify" 
              className="h-24 w-auto drop-shadow-2xl" 
            />
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-[#FF1493] via-[#FF69B4] to-[#00BFFF] bg-clip-text text-transparent drop-shadow-2xl">
            Capzify
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            AI-powered social media content creation
          </p>
          
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            Generate stunning captions, bios, hashtags, and photo grids with the power of AI
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
          <div className="glass-card p-6 text-center">
            <div className="text-3xl mb-3">✨</div>
            <h3 className="text-white font-semibold mb-2">AI Captions</h3>
            <p className="text-gray-400 text-sm">Smart captions for any mood</p>
          </div>
          
          <div className="glass-card p-6 text-center">
            <div className="text-3xl mb-3">📝</div>
            <h3 className="text-white font-semibold mb-2">Bio Generator</h3>
            <p className="text-gray-400 text-sm">Personal bios that stand out</p>
          </div>
          
          <div className="glass-card p-6 text-center">
            <div className="text-3xl mb-3">#️⃣</div>
            <h3 className="text-white font-semibold mb-2">Hashtags</h3>
            <p className="text-gray-400 text-sm">Trending tags for reach</p>
          </div>
          
          <div className="glass-card p-6 text-center">
            <div className="text-3xl mb-3">🖼️</div>
            <h3 className="text-white font-semibold mb-2">Photo Grids</h3>
            <p className="text-gray-400 text-sm">Split images into grids</p>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center space-y-6">
          <a
            href="/api/login"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FF1493] to-[#00BFFF] text-white font-semibold rounded-xl text-lg hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-[#FF1493]/25"
          >
            <span>Sign in with Google</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zm4.541 7.544c.011.31-.066.616-.22.888l-2.33 4.131c-.22.393-.629.645-1.068.659-.44-.014-.848-.266-1.068-.659l-2.33-4.131c-.154-.272-.231-.578-.22-.888.011-.31.1-.612.254-.882.308-.54.885-.869 1.507-.869.622 0 1.199.329 1.507.869.154.27.243.572.254.882z"/>
            </svg>
          </a>
          
          <p className="text-gray-500 text-sm">
            Sign in to access all AI-powered features
          </p>
        </div>
      </div>
    </div>
  );
}