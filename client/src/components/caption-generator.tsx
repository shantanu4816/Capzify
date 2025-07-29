import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Copy, Heart, RefreshCw, Sparkles, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CaptionGeneratorProps {
  uploadedImage?: string | null;
  imageAnalysis?: string | null;
}

interface Caption {
  text: string;
  mood: string;
}

export default function CaptionGenerator({ uploadedImage, imageAnalysis }: CaptionGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [mood, setMood] = useState("casual");
  const [length, setLength] = useState("medium");
  const [generatedCaptions, setGeneratedCaptions] = useState<Caption[]>([]);
  const { toast } = useToast();

  const generateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/generate/captions", data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        const captions = data.captions.map((text: string) => ({ text, mood }));
        setGeneratedCaptions(captions);
        toast({
          title: "Captions generated!",
          description: `Created ${data.captions.length} captions`,
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Generation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    generateMutation.mutate({
      imageBase64: uploadedImage,
      prompt: prompt.trim() || imageAnalysis,
      mood,
      length,
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Caption copied to clipboard",
      });
    } catch {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const getMoodColor = (moodType: string) => {
    switch (moodType) {
      case 'casual': return 'text-[#00FF88]';
      case 'professional': return 'text-[#00D4FF]';
      case 'motivational': return 'text-[#FF0080]';
      case 'trending': return 'text-[#FFD700]';
      default: return 'text-[#00FF88]';
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Generation Controls */}
      <div className="space-y-6">
        <Card className="glass-card border-white/10">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#00FF88]" />
              Caption Settings
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Additional Prompt (Optional)</label>
                <Textarea
                  placeholder="Add context, style, or specific elements you want in the caption..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-[#00FF88] min-h-[100px]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Content Mood</label>
                <Select value={mood} onValueChange={setMood}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-[#00FF88]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/10">
                    <SelectItem value="casual">Casual & Fun</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="motivational">Motivational</SelectItem>
                    <SelectItem value="trending">Trending & Viral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Caption Length</label>
                <div className="grid grid-cols-3 gap-2">
                  {['short', 'medium', 'long'].map((lengthOption) => (
                    <Button
                      key={lengthOption}
                      variant={length === lengthOption ? "default" : "outline"}
                      size="sm"
                      onClick={() => setLength(lengthOption)}
                      className={length === lengthOption 
                        ? "bg-[#00FF88] text-black hover:bg-[#00FF88]/80" 
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                      }
                    >
                      {lengthOption.charAt(0).toUpperCase() + lengthOption.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
              
              <Button 
                onClick={handleGenerate}
                disabled={generateMutation.isPending || (!uploadedImage && !prompt.trim())}
                className="w-full bg-gradient-to-r from-[#FF0080] to-[#00D4FF] text-white hover:shadow-lg hover:shadow-[#FF0080]/25 transition-all transform hover:scale-105"
              >
                {generateMutation.isPending ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5 mr-2" />
                )}
                Generate Captions
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Image Preview */}
        {uploadedImage && (
          <Card className="glass-card border-white/10">
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold mb-4">Uploaded Image</h4>
              <div className="aspect-square bg-white/5 rounded-xl overflow-hidden">
                <img 
                  src={`data:image/jpeg;base64,${uploadedImage}`}
                  alt="Uploaded"
                  className="w-full h-full object-cover"
                />
              </div>
              {imageAnalysis && (
                <div className="mt-4 p-3 bg-white/5 rounded-lg">
                  <p className="text-sm text-gray-300">
                    <strong>AI Analysis:</strong> {imageAnalysis}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Generated Captions */}
      <div className="space-y-6">
        <Card className="glass-card border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Generated Captions</h3>
              {generatedCaptions.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleGenerate}
                  disabled={generateMutation.isPending}
                  className="text-[#00FF88] hover:text-[#00FF88]/80"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            {generatedCaptions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No captions generated yet</p>
                <p className="text-sm mt-2">Upload an image or add a prompt to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {generatedCaptions.map((caption, index) => (
                  <Card key={index} className="bg-white/5 border-white/10 hover:border-[#00FF88]/30 transition-colors group">
                    <CardContent className="p-4">
                      <p className="text-gray-200 mb-3 leading-relaxed">{caption.text}</p>
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getMoodColor(caption.mood)} bg-white/10`}
                        >
                          {caption.mood.charAt(0).toUpperCase() + caption.mood.slice(1)}
                        </Badge>
                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(caption.text)}
                            className="text-[#00D4FF] hover:text-[#00D4FF]/80 h-8 w-8 p-0"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#FF0080] hover:text-[#FF0080]/80 h-8 w-8 p-0"
                          >
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
