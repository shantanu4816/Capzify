import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, Hash, RefreshCw, Sparkles, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface HashtagData {
  highReach: string[];
  mediumReach: string[];
  niche: string[];
}

export default function HashtagGenerator() {
  const [content, setContent] = useState("");
  const [niche, setNiche] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [generatedHashtags, setGeneratedHashtags] = useState<HashtagData | null>(null);
  const { toast } = useToast();

  const generateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/generate/hashtags", data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setGeneratedHashtags(data.hashtags);
        toast({
          title: "Hashtags generated!",
          description: "Created categorized hashtag sets",
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
    if (!content.trim()) {
      toast({
        title: "Missing content",
        description: "Please describe your content",
        variant: "destructive",
      });
      return;
    }

    generateMutation.mutate({
      content: content.trim(),
      niche: niche.trim() || undefined,
      targetAudience: targetAudience.trim() || undefined,
    });
  };

  const copyHashtagGroup = async (hashtags: string[], groupName: string) => {
    try {
      const hashtagString = hashtags.map(tag => `#${tag}`).join(' ');
      await navigator.clipboard.writeText(hashtagString);
      toast({
        title: "Copied!",
        description: `${groupName} hashtags copied to clipboard`,
      });
    } catch {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const copyAllHashtags = async () => {
    if (!generatedHashtags) return;

    try {
      const allHashtags = [
        ...generatedHashtags.highReach,
        ...generatedHashtags.mediumReach,
        ...generatedHashtags.niche
      ];
      const hashtagString = allHashtags.map(tag => `#${tag}`).join(' ');
      await navigator.clipboard.writeText(hashtagString);
      toast({
        title: "Copied!",
        description: "All hashtags copied to clipboard",
      });
    } catch {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const hashtagClick = async (hashtag: string) => {
    try {
      await navigator.clipboard.writeText(`#${hashtag}`);
      toast({
        title: "Copied!",
        description: `#${hashtag} copied to clipboard`,
      });
    } catch {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Input Form */}
      <div className="space-y-6">
        <Card className="glass-card border-white/10">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Hash className="w-5 h-5 text-[#00FF88]" />
              Hashtag Settings
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Describe your content</label>
                <Textarea
                  placeholder="e.g., Sunset photo at the beach, workout motivation post, cooking tutorial..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-[#00FF88] min-h-[100px]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Niche (Optional)</label>
                <Input
                  type="text"
                  placeholder="e.g., fitness, travel, food, tech"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-[#00FF88]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Target Audience (Optional)</label>
                <Input
                  type="text"
                  placeholder="e.g., Gen Z, entrepreneurs, fitness enthusiasts"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-[#00FF88]"
                />
              </div>
              
              <Button 
                onClick={handleGenerate}
                disabled={generateMutation.isPending || !content.trim()}
                className="w-full bg-gradient-to-r from-[#FF0080] to-[#00D4FF] text-white hover:shadow-lg hover:shadow-[#FF0080]/25 transition-all transform hover:scale-105"
              >
                {generateMutation.isPending ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Hash className="w-5 h-5 mr-2" />
                )}
                Generate Hashtags
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Generated Hashtags */}
      <div className="space-y-6">
        <Card className="glass-card border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Trending Hashtags</h3>
              {generatedHashtags && (
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
            
            {!generatedHashtags ? (
              <div className="text-center py-12 text-gray-500">
                <Hash className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No hashtags generated yet</p>
                <p className="text-sm mt-2">Describe your content to get started</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* High Reach */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-400">High Reach (1M+ posts)</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyHashtagGroup(generatedHashtags.highReach, 'High reach')}
                      className="text-[#00FF88] hover:text-[#00FF88]/80 h-6 text-xs"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {generatedHashtags.highReach.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-gradient-to-r from-[#00FF88]/20 to-[#00D4FF]/20 text-[#00FF88] px-3 py-1 text-sm border border-[#00FF88]/30 cursor-pointer hover:bg-[#00FF88]/30 transition-colors"
                        onClick={() => hashtagClick(tag)}
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Medium Reach */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-400">Medium Reach (100K-1M posts)</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyHashtagGroup(generatedHashtags.mediumReach, 'Medium reach')}
                      className="text-[#FF0080] hover:text-[#FF0080]/80 h-6 text-xs"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {generatedHashtags.mediumReach.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-gradient-to-r from-[#FF0080]/20 to-[#00D4FF]/20 text-[#FF0080] px-3 py-1 text-sm border border-[#FF0080]/30 cursor-pointer hover:bg-[#FF0080]/30 transition-colors"
                        onClick={() => hashtagClick(tag)}
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Niche Tags */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-400">Niche Tags (10K-100K posts)</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyHashtagGroup(generatedHashtags.niche, 'Niche')}
                      className="text-[#00D4FF] hover:text-[#00D4FF]/80 h-6 text-xs"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {generatedHashtags.niche.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-gradient-to-r from-[#00D4FF]/20 to-[#00FF88]/20 text-[#00D4FF] px-3 py-1 text-sm border border-[#00D4FF]/30 cursor-pointer hover:bg-[#00D4FF]/30 transition-colors"
                        onClick={() => hashtagClick(tag)}
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Button 
                  onClick={copyAllHashtags}
                  className="w-full bg-gradient-to-r from-[#00FF88] to-[#00D4FF] text-black hover:shadow-lg hover:shadow-[#00FF88]/25 transition-all mt-4"
                >
                  <Copy className="w-5 h-5 mr-2" />
                  Copy All Hashtags
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
