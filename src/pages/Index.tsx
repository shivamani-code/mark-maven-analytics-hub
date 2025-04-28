
import React, { useState, useCallback, useMemo } from "react";
import Header from "@/components/Header";
import BackgroundAnimation from "@/components/BackgroundAnimation";
import ImageUploader from "@/components/ImageUploader";
import AnalysisOptions, { AnalysisOptionType } from "@/components/AnalysisOptions";
import ResultsDisplay from "@/components/ResultsDisplay";
import CustomQueryInput from "@/components/CustomQueryInput";
import { ArrowDown } from "lucide-react";
import { AnalysisResult } from "@/utils/imageAnalysis";

const Index = () => {
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<AnalysisOptionType[]>([]);
  const [customQuery, setCustomQuery] = useState<string>("");
  const [showCustomQuery, setShowCustomQuery] = useState(false);

  const handleImageAnalyzed = useCallback((data: AnalysisResult) => {
    console.log("Analysis data received:", data);
    setAnalysisData(data);
    // Reset options when a new image is analyzed
    setSelectedOptions([]);
    setShowCustomQuery(false);
  }, []);

  const handleOptionsSelected = useCallback((options: AnalysisOptionType[]) => {
    console.log("Options selected:", options);
    setSelectedOptions(options);
    setShowCustomQuery(options.includes("custom"));
  }, []);

  const handleCustomQuery = useCallback((query: string) => {
    console.log("Custom query set:", query);
    setCustomQuery(query);
  }, []);

  // Memoize components to prevent unnecessary re-renders
  const memoizedImageUploader = useMemo(() => (
    <ImageUploader onImageAnalyzed={handleImageAnalyzed} />
  ), [handleImageAnalyzed]);

  const memoizedAnalysisOptions = useMemo(() => (
    analysisData && (
      <AnalysisOptions 
        onOptionsSelected={handleOptionsSelected}
        onCustomQuery={handleCustomQuery}
      />
    )
  ), [analysisData, handleOptionsSelected, handleCustomQuery]);

  const memoizedCustomQueryInput = useMemo(() => (
    showCustomQuery && (
      <CustomQueryInput onSubmitQuery={handleCustomQuery} />
    )
  ), [showCustomQuery, handleCustomQuery]);

  const memoizedResultsDisplay = useMemo(() => (
    analysisData && selectedOptions.length > 0 && (
      <ResultsDisplay 
        data={analysisData} 
        selectedOptions={selectedOptions}
        customQuery={customQuery}
      />
    )
  ), [analysisData, selectedOptions, customQuery]);

  return (
    <div className="min-h-screen pb-16">
      <BackgroundAnimation />
      
      <Header />
      
      <main className="container px-4 sm:px-6 max-w-4xl mx-auto space-y-8">
        {memoizedImageUploader}
        
        {analysisData && (
          <div className="flex justify-center">
            <div className="py-4 animate-float">
              <ArrowDown className="h-8 w-8 text-brand-magenta" />
            </div>
          </div>
        )}
        
        {memoizedAnalysisOptions}
        {memoizedCustomQueryInput}
        {memoizedResultsDisplay}
      </main>
    </div>
  );
};

export default Index;
