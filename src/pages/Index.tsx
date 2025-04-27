
import React, { useState } from "react";
import Header from "@/components/Header";
import BackgroundAnimation from "@/components/BackgroundAnimation";
import ImageUploader from "@/components/ImageUploader";
import AnalysisOptions, { AnalysisOptionType } from "@/components/AnalysisOptions";
import ResultsDisplay from "@/components/ResultsDisplay";
import CustomQueryInput from "@/components/CustomQueryInput";
import { ArrowDown } from "lucide-react";

const Index = () => {
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [selectedOptions, setSelectedOptions] = useState<AnalysisOptionType[]>([]);
  const [customQuery, setCustomQuery] = useState<string>("");
  const [showCustomQuery, setShowCustomQuery] = useState(false);

  const handleImageAnalyzed = (data: any) => {
    setAnalysisData(data);
  };

  const handleOptionsSelected = (options: AnalysisOptionType[]) => {
    setSelectedOptions(options);
    setShowCustomQuery(options.includes("custom"));
  };

  const handleCustomQuery = (query: string) => {
    setCustomQuery(query);
  };

  return (
    <div className="min-h-screen pb-16">
      <BackgroundAnimation />
      
      <Header />
      
      <main className="container px-4 sm:px-6 max-w-4xl mx-auto space-y-8">
        <ImageUploader onImageAnalyzed={handleImageAnalyzed} />
        
        {analysisData && (
          <div className="flex justify-center">
            <div className="py-4 animate-float">
              <ArrowDown className="h-8 w-8 text-brand-magenta" />
            </div>
          </div>
        )}
        
        {analysisData && (
          <AnalysisOptions 
            onOptionsSelected={handleOptionsSelected}
            onCustomQuery={handleCustomQuery}
          />
        )}
        
        {showCustomQuery && (
          <CustomQueryInput onSubmitQuery={handleCustomQuery} />
        )}
        
        {analysisData && selectedOptions.length > 0 && (
          <ResultsDisplay 
            data={analysisData} 
            selectedOptions={selectedOptions}
            customQuery={customQuery}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
