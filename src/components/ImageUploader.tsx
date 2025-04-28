
import React, { useState, useCallback, memo } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Upload, FileImage, Check, AlertTriangle, Brain, ImagePlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { analyzeImage } from "@/utils/imageAnalysis";
import { AnalysisResult } from "@/utils/imageAnalysis";
import { mergeAnalysisResults } from "@/utils/imageAnalysis";

interface ImageUploaderProps {
  onImageAnalyzed: (data: any) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageAnalyzed }) => {
  const { toast } = useToast();
  const [isDragActive, setIsDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [currentAnalysisIndex, setCurrentAnalysisIndex] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);

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
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    }
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  }, []);

  const handleFiles = useCallback((files: File[]) => {
    const imageFiles = files.filter(file => file.type.match('image.*'));
    
    if (imageFiles.length === 0) {
      toast({
        title: "No valid images",
        description: "Please upload image files.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setTotalImages(imageFiles.length);
    setCurrentAnalysisIndex(0);
    setAnalysisResults([]);
    
    const imagePromises = imageFiles.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            resolve(e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises)
      .then(imageDataArray => {
        setSelectedImages(imageDataArray);
        processImagesSequentially(imageDataArray);
      });
  }, [toast]);

  const processImagesSequentially = useCallback(async (imageDataArray: string[]) => {
    const results: AnalysisResult[] = [];

    for (let i = 0; i < imageDataArray.length; i++) {
      setCurrentAnalysisIndex(i + 1);
      try {
        const result = await analyzeImage(imageDataArray[i]);
        results.push(result);
      } catch (error) {
        console.error("Error analyzing image:", error);
        toast({
          title: "Analysis Error",
          description: `Failed to analyze image ${i + 1}. Please try again.`,
          variant: "destructive",
        });
      }
    }

    setIsLoading(false);
    
    if (results.length > 0) {
      // Merge all results if there are multiple images
      const mergedResult = results.length > 1 ? mergeAnalysisResults(results) : results[0];
      
      toast({
        title: "Analysis Complete",
        description: `Successfully analyzed ${results.length} mark sheet${results.length > 1 ? 's' : ''}.`,
      });
      
      setAnalysisResults(results);
      onImageAnalyzed(mergedResult);
    }
  }, [toast, onImageAnalyzed]);

  const removeImage = useCallback((index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    
    // If we've already analyzed the images, remove that result and remerge
    if (analysisResults.length > 0) {
      const newResults = analysisResults.filter((_, i) => i !== index);
      setAnalysisResults(newResults);
      
      if (newResults.length > 0) {
        const mergedResult = newResults.length > 1 ? mergeAnalysisResults(newResults) : newResults[0];
        onImageAnalyzed(mergedResult);
      } else {
        // No images left
        onImageAnalyzed(null);
      }
    }
  }, [analysisResults, onImageAnalyzed]);

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
            <p className="text-lg font-medium">Analyzing mark sheets... ({currentAnalysisIndex}/{totalImages})</p>
          </div>
        ) : selectedImages.length > 0 ? (
          <div className="flex flex-col items-center space-y-4 w-full">
            <p className="text-lg font-medium">{selectedImages.length} mark sheet{selectedImages.length > 1 ? 's' : ''} uploaded successfully!</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-h-64 overflow-y-auto p-2">
              {selectedImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={image} 
                    alt={`Mark sheet ${index + 1}`} 
                    className="h-32 object-cover rounded-md border border-border"
                  />
                  <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute bottom-2 right-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex gap-4">
              <Button onClick={() => setSelectedImages([])} variant="outline" size="sm">
                Clear All
              </Button>
              <Button onClick={() => document.getElementById('file-upload')?.click()} variant="outline" size="sm">
                <ImagePlus className="mr-2 h-4 w-4" /> Add More
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-muted rounded-full p-4 animate-pulse-slow">
              <Upload className="h-10 w-10 text-brand-purple" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Upload Mark Sheet Images</h3>
              <p className="text-muted-foreground max-w-md">
                Drag and drop one or more mark sheet images here, or click to browse
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
                multiple
                className="hidden" 
                onChange={handleFileChange} 
              />
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <AlertTriangle className="h-3 w-3 mr-1" />
              <span>Supported formats: JPG, PNG, GIF (max 5MB per image)</span>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(ImageUploader);
