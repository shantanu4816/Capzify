import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Grid3X3, Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GridConverterProps {
  uploadedImage?: string | null;
}

export default function GridConverter({ uploadedImage }: GridConverterProps) {
  const [gridSize, setGridSize] = useState("3x3");
  const [gridImages, setGridImages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const convertToGrid = async () => {
    if (!uploadedImage) {
      toast({
        title: "No image uploaded",
        description: "Please upload an image first",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Determine grid dimensions
        const [cols, rows] = gridSize.split('x').map(Number);
        const pieceWidth = img.width / cols;
        const pieceHeight = img.height / rows;

        canvas.width = pieceWidth;
        canvas.height = pieceHeight;

        const pieces: string[] = [];

        // Create each grid piece
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            ctx.clearRect(0, 0, pieceWidth, pieceHeight);
            
            // Draw the portion of the image
            ctx.drawImage(
              img,
              col * pieceWidth, row * pieceHeight, pieceWidth, pieceHeight,
              0, 0, pieceWidth, pieceHeight
            );

            // Convert to data URL
            pieces.push(canvas.toDataURL('image/jpeg', 0.9));
          }
        }

        setGridImages(pieces);
        setIsProcessing(false);
        
        toast({
          title: "Grid created!",
          description: `Split into ${rows}x${cols} grid pieces`,
        });
      };

      img.src = `data:image/jpeg;base64,${uploadedImage}`;
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "Conversion failed",
        description: "Unable to process the image",
        variant: "destructive",
      });
    }
  };

  const downloadImage = (dataUrl: string, index: number) => {
    const link = document.createElement('a');
    link.download = `grid-piece-${index + 1}.jpg`;
    link.href = dataUrl;
    link.click();
  };

  const downloadAll = () => {
    gridImages.forEach((dataUrl, index) => {
      setTimeout(() => downloadImage(dataUrl, index), index * 100);
    });
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Controls */}
      <div className="space-y-6">
        <Card className="glass-card border-white/10">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Grid3X3 className="w-5 h-5 text-[#00FF88]" />
              Grid Settings
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Grid Size</label>
                <Select value={gridSize} onValueChange={setGridSize}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-[#00FF88]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/10">
                    <SelectItem value="2x2">2x2 Grid (4 pieces)</SelectItem>
                    <SelectItem value="3x3">3x3 Grid (9 pieces)</SelectItem>
                    <SelectItem value="1x3">1x3 Horizontal (3 pieces)</SelectItem>
                    <SelectItem value="3x1">3x1 Vertical (3 pieces)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={convertToGrid}
                disabled={isProcessing || !uploadedImage}
                className="w-full bg-gradient-to-r from-[#FF0080] to-[#00D4FF] text-white hover:shadow-lg hover:shadow-[#FF0080]/25 transition-all transform hover:scale-105"
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Grid3X3 className="w-5 h-5 mr-2" />
                )}
                Convert to Grid
              </Button>

              {gridImages.length > 0 && (
                <Button 
                  onClick={downloadAll}
                  variant="outline"
                  className="w-full bg-white/5 border-white/10 hover:bg-white/10"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download All Pieces
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Original Image Preview */}
        {uploadedImage && (
          <Card className="glass-card border-white/10">
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold mb-4">Original Image</h4>
              <div className="aspect-square bg-white/5 rounded-xl overflow-hidden">
                <img 
                  src={`data:image/jpeg;base64,${uploadedImage}`}
                  alt="Original"
                  className="w-full h-full object-cover"
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Grid Preview */}
      <div className="space-y-6">
        <Card className="glass-card border-white/10">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-6">Grid Preview</h3>
            
            {gridImages.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Grid3X3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No grid created yet</p>
                <p className="text-sm mt-2">Upload an image and convert to grid</p>
              </div>
            ) : (
              <div>
                <div 
                  className={`grid gap-2 mb-4 ${
                    gridSize === '2x2' ? 'grid-cols-2' :
                    gridSize === '3x3' ? 'grid-cols-3' :
                    gridSize === '1x3' ? 'grid-cols-3' :
                    'grid-cols-1'
                  }`}
                >
                  {gridImages.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={imageUrl}
                        alt={`Grid piece ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-lg border border-white/20"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Button
                          size="sm"
                          onClick={() => downloadImage(imageUrl, index)}
                          className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="text-center text-sm text-gray-400">
                  <p>Hover over pieces to download individually</p>
                  <p>Post these in order to create your Instagram grid</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
