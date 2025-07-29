import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Grid3X3, Hash, User, Play, Upload, Menu } from "lucide-react";
import ContentTabs from "@/components/content-tabs";
import capzifyLogo from "../assets/capzify-logo.png";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <img 
                src={capzifyLogo} 
                alt="Capzify Logo" 
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold gradient-text">Capzify</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="#tools" className="text-gray-300 hover:text-[#FF1493] transition-colors">Tools</a>
              <a href="#templates" className="text-gray-300 hover:text-[#FF1493] transition-colors">Templates</a>
              <a href="#pricing" className="text-gray-300 hover:text-[#FF1493] transition-colors">Pricing</a>
              <Button className="bg-gradient-to-r from-[#FF1493] to-[#00BFFF] text-black hover:shadow-lg hover:shadow-[#FF1493]/25 transition-all">
                Get Started
              </Button>
            </div>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#FF1493] rounded-full filter blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#C71585] rounded-full filter blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-[#00BFFF] rounded-full filter blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Create <span className="gradient-text">Viral Content</span><br />
              with AI Magic ✨
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Transform your photos into engaging captions, stunning grid posts, and trending hashtags. 
              The ultimate AI-powered content creation tool for Gen Z creators.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-[#FF1493] to-[#00BFFF] text-black hover:shadow-2xl hover:shadow-[#FF1493]/30 transition-all transform hover:scale-105 w-full sm:w-auto"
                onClick={() => document.getElementById('main-app')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload & Generate
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="glass-card border-white/20 hover:bg-white/10 transition-all w-full sm:w-auto"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
            
            {/* Feature Preview Cards */}
            <div className="grid md:grid-cols-3 gap-6 mt-16">
              <Card className="glass-card border-white/10 hover:bg-white/10 transition-all group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF1493] to-[#00BFFF] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Camera className="text-black text-xl" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">AI Captions</h3>
                  <p className="text-gray-400">Generate viral captions from your photos using advanced AI</p>
                </CardContent>
              </Card>
              
              <Card className="glass-card border-white/10 hover:bg-white/10 transition-all group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C71585] to-[#00BFFF] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Grid3X3 className="text-black text-xl" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Grid Converter</h3>
                  <p className="text-gray-400">Split single images into stunning Instagram grid layouts</p>
                </CardContent>
              </Card>
              
              <Card className="glass-card border-white/10 hover:bg-white/10 transition-all group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00BFFF] to-[#FF1493] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Hash className="text-black text-xl" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Trending Tags</h3>
                  <p className="text-gray-400">Get the hottest hashtags for maximum reach and engagement</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Main App Interface */}
      <section id="main-app" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <ContentTabs />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src={capzifyLogo} 
                  alt="Capzify Logo" 
                  className="w-8 h-8 object-contain"
                />
                <span className="text-xl font-bold gradient-text">Capzify</span>
              </div>
              <p className="text-gray-400 text-sm">The ultimate AI-powered content creation tool for Gen Z creators.</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Tools</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-[#FF1493] transition-colors">AI Captions</a></li>
                <li><a href="#" className="hover:text-[#FF1493] transition-colors">Grid Converter</a></li>
                <li><a href="#" className="hover:text-[#FF1493] transition-colors">Bio Generator</a></li>
                <li><a href="#" className="hover:text-[#FF1493] transition-colors">Hashtag Generator</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-[#FF1493] transition-colors">About</a></li>
                <li><a href="#" className="hover:text-[#FF1493] transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-[#FF1493] transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-[#FF1493] transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                  <span className="text-cyan-400">𝕏</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                  <span className="text-pink-400">📷</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                  <span className="text-white">🎵</span>
                </a>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 Capzify. All rights reserved.</p>
            <div className="flex space-x-6 text-sm text-gray-400 mt-4 sm:mt-0">
              <a href="#" className="hover:text-[#FF1493] transition-colors">Privacy</a>
              <a href="#" className="hover:text-[#FF1493] transition-colors">Terms</a>
              <a href="#" className="hover:text-[#FF1493] transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
