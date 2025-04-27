
import React, { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Upload, FileImage, Check, AlertTriangle, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { analyzeImage } from "@/utils/imageAnalysis";

interface ImageUploaderProps {
  onImageAnalyzed: (data: any) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageAnalyzed }) => {
  const { toast } = useToast();
  const [isDragActive, setIsDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.match('image.*')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      if (e.target?.result) {
        const imageData = e.target.result as string;
        setSelectedImage(imageData);
        
        try {
          // Analyze the image data with our analysis function
          const analysisResult = await analyzeImage(imageData);
          
          // Set loading to false after analysis
          setIsLoading(false);
          
          toast({
            title: "Analysis Complete",
            description: "Mark sheet data has been successfully extracted.",
          });
          
          // Send the analysis data to the parent component
          onImageAnalyzed(analysisResult);
        } catch (error) {
          console.error("Image analysis failed:", error);
          setIsLoading(false);
          toast({
            title: "Analysis Failed",
            description: "Could not extract data from the image. Please try a clearer image.",
            variant: "destructive",
          });
        }
      }
    };
    
    reader.readAsDataURL(file);
  };

  return (
    <Card className={`p-6 border-2 transition-colors duration-300 ${isDragActive ? 'border-brand-purple border-dashed bg-brand-light' : 'border-border'}`}>
      <div
        className="flex flex-col items-center justify-center space-y-4 py-12"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isLoading ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-brand-purple/30 border-t-brand-purple rounded-full animate-spin"></div>
              <Brain className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-brand-magenta" />
            </div>
            <p className="text-lg font-medium">Analyzing mark sheet...</p>
          </div>
        ) : selectedImage ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <img 
                src={selectedImage} 
                alt="Uploaded mark sheet" 
                className="max-h-48 rounded-md object-contain"
              />
              <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                <Check className="h-4 w-4 text-white" />
              </div>
            </div>
            <p className="text-lg font-medium">Mark sheet uploaded successfully!</p>
            <Button onClick={() => setSelectedImage(null)} variant="outline" size="sm">
              Upload a different image
            </Button>
          </div>
        ) : (
          <>
            <div className="bg-muted rounded-full p-4 animate-pulse-slow">
              <Upload className="h-10 w-10 text-brand-purple" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Upload Mark Sheet Image</h3>
              <p className="text-muted-foreground max-w-md">
                Drag and drop a mark sheet image here, or click to browse
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => document.getElementById('file-upload')?.click()}
                className="bg-gradient-brand hover:opacity-90 animate-scale-in"
              >
                <FileImage className="mr-2 h-5 w-5" /> Browse Files
              </Button>
              <input 
                id="file-upload" 
                type="file"
                accept="image/*"
                className="hidden" 
                onChange={handleFileChange} 
              />
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <AlertTriangle className="h-3 w-3 mr-1" />
              <span>Supported formats: JPG, PNG, GIF (max 5MB)</span>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default ImageUploader;
