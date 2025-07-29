import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Copy, Sparkles, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function BioGenerator() {
  const [occupation, setOccupation] = useState("");
  const [interests, setInterests] = useState("");
  const [personality, setPersonality] = useState("fun");
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [generatedBios, setGeneratedBios] = useState<string[]>([]);
  const { toast } = useToast();

  const generateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/generate/bio", data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setGeneratedBios(data.bios);
        toast({
          title: "Bios generated!",
          description: `Created ${data.bios.length} bio variations`,
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
    if (!occupation.trim() || !interests.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in occupation and interests",
        variant: "destructive",
      });
      return;
    }

    generateMutation.mutate({
      occupation: occupation.trim(),
      interests: interests.trim(),
      personality,
      includeEmojis,
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Bio copied to clipboard",
      });
    } catch {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const getPersonalityColor = (personalityType: string) => {
    switch (personalityType) {
      case 'fun': return 'text-[#00FF88]';
      case 'professional': return 'text-[#00D4FF]';
      case 'minimalist': return 'text-[#FFFFFF]';
      case 'inspiring': return 'text-[#FF0080]';
      case 'creative': return 'text-[#FFD700]';
      default: return 'text-[#00FF88]';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">
          <span className="gradient-text">Bio Generator</span>
        </h2>
        <p className="text-gray-400">Create the perfect social media bio that represents you</p>
      </div>
      
      <Card className="glass-card border-white/10">
        <CardContent className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">What do you do?</label>
                <Input
                  type="text"
                  placeholder="e.g., Content Creator, Student, Entrepreneur"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-[#00FF88]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Your interests (3-5)</label>
                <Input
                  type="text"
                  placeholder="e.g., Travel, Photography, Fitness, Tech"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-[#00FF88]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Personality</label>
                <Select value={personality} onValueChange={setPersonality}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-[#00FF88]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/10">
                    <SelectItem value="fun">Fun & Energetic</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="minimalist">Minimalist</SelectItem>
                    <SelectItem value="inspiring">Inspiring & Motivational</SelectItem>
                    <SelectItem value="creative">Creative & Artistic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Include emojis?</label>
                <div className="flex space-x-4">
                  <Button
                    variant={includeEmojis ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIncludeEmojis(true)}
                    className={includeEmojis 
                      ? "bg-[#00FF88] text-black hover:bg-[#00FF88]/80" 
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                    }
                  >
                    Yes
                  </Button>
                  <Button
                    variant={!includeEmojis ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIncludeEmojis(false)}
                    className={!includeEmojis 
                      ? "bg-[#00FF88] text-black hover:bg-[#00FF88]/80" 
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                    }
                  >
                    No
                  </Button>
                </div>
              </div>
              
              <Button 
                onClick={handleGenerate}
                disabled={generateMutation.isPending || !occupation.trim() || !interests.trim()}
                className="w-full bg-gradient-to-r from-[#FF0080] to-[#00D4FF] text-white hover:shadow-lg hover:shadow-[#FF0080]/25 transition-all transform hover:scale-105"
              >
                {generateMutation.isPending ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5 mr-2" />
                )}
                Generate Bio
              </Button>
            </div>
            
            {/* Generated Bio Preview */}
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold mb-4">Generated Bios</h4>
                
                {generatedBios.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No bios generated yet</p>
                    <p className="text-sm mt-2">Fill in the form and click generate</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {generatedBios.map((bio, index) => (
                      <Card key={index} className="bg-white/5 border-white/10 hover:border-[#00FF88]/30 transition-colors group">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${getPersonalityColor(personality)} bg-white/10`}
                            >
                              OPTION {index + 1}
                            </Badge>
                            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(bio)}
                                className="text-[#00D4FF] hover:text-[#00D4FF]/80 h-8 w-8 p-0"
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-line">{bio}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
