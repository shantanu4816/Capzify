import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CloudUpload, Camera, History, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface UploadZoneProps {
  onImageUpload: (imageBase64: string) => void;
  onAnalysisComplete: (analysis: string) => void;
}

export default function UploadZone({ onImageUpload, onAnalysisComplete }: UploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiRequest("POST", "/api/upload", formData);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setPreviewImage(`data:image/jpeg;base64,${data.imageBase64}`);
        onImageUpload(data.imageBase64);
        onAnalysisComplete(data.analysis);
        toast({
          title: "Image uploaded successfully!",
          description: "Ready to generate content",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    uploadMutation.mutate(formData);
  }, [uploadMutation, toast]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleUrlUpload = () => {
    if (!imageUrl.trim()) return;
    
    // Convert URL to blob and then upload
    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        const file = new File([blob], 'image.jpg', { type: blob.type });
        handleFile(file);
      })
      .catch(() => {
        toast({
          title: "URL upload failed",
          description: "Unable to load image from URL",
          variant: "destructive",
        });
      });
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Upload Area */}
      <div className="space-y-6">
        <div className="gradient-border">
          <div 
            className={`gradient-border-content p-8 text-center transition-all ${
              dragActive ? 'bg-white/10' : ''
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#00FF88]/20 to-[#00D4FF]/20 flex items-center justify-center mb-4">
                {uploadMutation.isPending ? (
                  <Loader2 className="text-[#00FF88] text-3xl animate-spin" />
                ) : (
                  <CloudUpload className="text-[#00FF88] text-3xl" />
                )}
              </div>
              <h3 className="text-2xl font-semibold mb-2">Upload Your Photo</h3>
              <p className="text-gray-400">Drag & drop or click to upload. Supports JPG, PNG, WebP</p>
            </div>
            
            <input 
              type="file" 
              id="photoUpload" 
              className="hidden" 
              accept="image/*"
              onChange={handleFileInput}
              disabled={uploadMutation.isPending}
            />
            <Label 
              htmlFor="photoUpload" 
              className="inline-block bg-gradient-to-r from-[#00FF88] to-[#00D4FF] text-black px-8 py-4 rounded-xl font-semibold cursor-pointer hover:shadow-lg hover:shadow-[#00FF88]/25 transition-all"
            >
              <span className="flex items-center gap-2">
                {uploadMutation.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span>+</span>
                )}
                Choose Photo
              </span>
            </Label>
            
            <div className="mt-6 text-sm text-gray-500">
              Or paste image URL
            </div>
            <div className="flex gap-2 mt-2">
              <Input 
                type="url" 
                placeholder="https://example.com/image.jpg" 
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-[#00FF88]"
              />
              <Button 
                onClick={handleUrlUpload}
                disabled={!imageUrl.trim() || uploadMutation.isPending}
                variant="outline"
                className="border-white/10 hover:bg-white/10"
              >
                Load
              </Button>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <Card className="glass-card border-white/10">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold mb-4">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 border-white/10"
              >
                <Camera className="w-4 h-4 text-[#00FF88]" />
                <span className="text-sm">Take Photo</span>
              </Button>
              <Button 
                variant="outline"
                className="flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 border-white/10"
              >
                <History className="w-4 h-4 text-[#00D4FF]" />
                <span className="text-sm">Recent</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Preview Area */}
      <div className="space-y-6">
        <Card className="glass-card border-white/10">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold mb-4">Preview</h4>
            <div className="aspect-square bg-white/5 rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden">
              {previewImage ? (
                <img 
                  src={previewImage} 
                  alt="Preview" 
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-center text-gray-500">
                  <CloudUpload className="w-16 h-16 mx-auto mb-2 opacity-50" />
                  <p>No image uploaded</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
