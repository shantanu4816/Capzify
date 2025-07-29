import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, PenTool, Grid3X3, User, Hash } from "lucide-react";
import UploadZone from "./upload-zone";
import CaptionGenerator from "./caption-generator";
import BioGenerator from "./bio-generator";
import HashtagGenerator from "./hashtag-generator";
import GridConverter from "./grid-converter";

export default function ContentTabs() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageAnalysis, setImageAnalysis] = useState<string | null>(null);

  return (
    <Tabs defaultValue="upload" className="w-full">
      <TabsList className="grid w-full grid-cols-5 glass-card border-white/10 bg-transparent p-2 h-auto">
        <TabsTrigger 
          value="upload" 
          className="flex flex-col sm:flex-row items-center gap-2 px-3 py-3 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00FF88] data-[state=active]:to-[#00D4FF] data-[state=active]:text-black"
        >
          <Upload className="w-4 h-4" />
          <span className="hidden sm:inline">Upload</span>
        </TabsTrigger>
        <TabsTrigger 
          value="captions" 
          className="flex flex-col sm:flex-row items-center gap-2 px-3 py-3 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00FF88] data-[state=active]:to-[#00D4FF] data-[state=active]:text-black"
        >
          <PenTool className="w-4 h-4" />
          <span className="hidden sm:inline">Captions</span>
        </TabsTrigger>
        <TabsTrigger 
          value="grid" 
          className="flex flex-col sm:flex-row items-center gap-2 px-3 py-3 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00FF88] data-[state=active]:to-[#00D4FF] data-[state=active]:text-black"
        >
          <Grid3X3 className="w-4 h-4" />
          <span className="hidden sm:inline">Grid</span>
        </TabsTrigger>
        <TabsTrigger 
          value="bio" 
          className="flex flex-col sm:flex-row items-center gap-2 px-3 py-3 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00FF88] data-[state=active]:to-[#00D4FF] data-[state=active]:text-black"
        >
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">Bio</span>
        </TabsTrigger>
        <TabsTrigger 
          value="hashtags" 
          className="flex flex-col sm:flex-row items-center gap-2 px-3 py-3 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00FF88] data-[state=active]:to-[#00D4FF] data-[state=active]:text-black"
        >
          <Hash className="w-4 h-4" />
          <span className="hidden sm:inline">Tags</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upload" className="mt-8">
        <UploadZone 
          onImageUpload={setUploadedImage} 
          onAnalysisComplete={setImageAnalysis}
        />
      </TabsContent>

      <TabsContent value="captions" className="mt-8">
        <CaptionGenerator 
          uploadedImage={uploadedImage}
          imageAnalysis={imageAnalysis}
        />
      </TabsContent>

      <TabsContent value="grid" className="mt-8">
        <GridConverter uploadedImage={uploadedImage} />
      </TabsContent>

      <TabsContent value="bio" className="mt-8">
        <BioGenerator />
      </TabsContent>

      <TabsContent value="hashtags" className="mt-8">
        <HashtagGenerator />
      </TabsContent>
    </Tabs>
  );
}
