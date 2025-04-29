
import React, { useState, useCallback, useMemo } from "react";
import Header from "@/components/Header";
import BackgroundAnimation from "@/components/BackgroundAnimation";
import ImageUploader from "@/components/ImageUploader";
import AnalysisOptions, { AnalysisOptionType } from "@/components/AnalysisOptions";
import ResultsDisplay from "@/components/ResultsDisplay";
import { ArrowDown } from "lucide-react";
import { AnalysisResult } from "@/utils/imageAnalysis";

const Index = () => {
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [maxMarksPerSubject, setMaxMarksPerSubject] = useState<number>(50);

  const handleImageAnalyzed = useCallback((data: AnalysisResult | null) => {
    console.log("Analysis data received:", data);
    setAnalysisData(data);
  }, []);

  const handleMaxMarksChange = useCallback((maxMarks: number) => {
    console.log("Max marks set to:", maxMarks);
    setMaxMarksPerSubject(maxMarks);
  }, []);

  // Memoize components to prevent unnecessary re-renders
  const memoizedImageUploader = useMemo(() => (
    <ImageUploader onImageAnalyzed={handleImageAnalyzed} />
  ), [handleImageAnalyzed]);

  const memoizedAnalysisOptions = useMemo(() => (
    analysisData && (
      <AnalysisOptions 
        onOptionsSelected={() => {}} // Simplified as we're not using options
        onMaxMarksChange={handleMaxMarksChange}
      />
    )
  ), [analysisData, handleMaxMarksChange]);

  const memoizedResultsDisplay = useMemo(() => (
    analysisData && (
      <ResultsDisplay 
        data={analysisData} 
        selectedOptions={[]} // Empty as we're not using options
        maxMarksPerSubject={maxMarksPerSubject}
      />
    )
  ), [analysisData, maxMarksPerSubject]);

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
        {memoizedResultsDisplay}
      </main>
    </div>
  );
};

export default Index;
