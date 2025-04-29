
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartBarIcon, TableIcon, FileText } from "lucide-react";
import { AnalysisOptionType } from "./AnalysisOptions";
import { AnalysisResult } from "@/utils/imageAnalysis";
import { generateAllStudentsStats } from "@/utils/dataFormatting";
import StudentsTable from "./results/StudentsTable";
import ResultSection from "./results/ResultSection";
import ExportControls from "./results/ExportControls";
import PassPercentageConfig from "./PassPercentageConfig";

interface ResultsDisplayProps {
  data: AnalysisResult;
  selectedOptions: AnalysisOptionType[];
  customQuery?: string;
  maxMarksPerSubject?: number;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  data, 
  selectedOptions, 
  customQuery, 
  maxMarksPerSubject = 50 
}) => {
  const [activeFormat, setActiveFormat] = useState("chart");
  const [passPercentage, setPassPercentage] = useState(40); // Default pass percentage threshold

  if (!data || !data.students || data.students.length === 0) {
    return (
      <Card className="p-6 animate-fade-in-up">
        <div className="text-center text-muted-foreground">
          No data available for analysis.
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 animate-fade-in-up">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Analysis Results</h2>
        <p className="text-muted-foreground">
          View your selected analysis results in different formats
        </p>
        {maxMarksPerSubject !== 50 && (
          <p className="text-sm text-brand-purple">
            Using {maxMarksPerSubject} as maximum marks per subject for calculations
          </p>
        )}
      </div>

      {/* Pass percentage configuration slider */}
      <PassPercentageConfig 
        value={passPercentage} 
        onChange={setPassPercentage} 
      />

      <Tabs defaultValue="chart" value={activeFormat} onValueChange={setActiveFormat}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="chart" className="data-[state=active]:bg-white">
              <ChartBarIcon className="h-4 w-4 mr-2" /> Charts
            </TabsTrigger>
            <TabsTrigger value="table" className="data-[state=active]:bg-white">
              <TableIcon className="h-4 w-4 mr-2" /> Tables
            </TabsTrigger>
            <TabsTrigger value="text" className="data-[state=active]:bg-white">
              <FileText className="h-4 w-4 mr-2" /> Text
            </TabsTrigger>
          </TabsList>
          
          <ExportControls 
            data={data} 
            selectedOptions={selectedOptions} 
            customQuery={customQuery} 
          />
        </div>

        <TabsContent value="chart">
          {selectedOptions.map((option) => (
            <ResultSection 
              key={option} 
              option={option} 
              data={data} 
              format="chart" 
              customQuery={customQuery} 
              maxMarksPerSubject={maxMarksPerSubject}
              passPercentage={passPercentage}
            />
          ))}
        </TabsContent>
        
        <TabsContent value="table">
          {selectedOptions.map((option) => (
            <ResultSection 
              key={option} 
              option={option} 
              data={data} 
              format="table" 
              customQuery={customQuery} 
              maxMarksPerSubject={maxMarksPerSubject}
              passPercentage={passPercentage}
            />
          ))}
        </TabsContent>
        
        <TabsContent value="text">
          {selectedOptions.map((option) => (
            <ResultSection 
              key={option} 
              option={option} 
              data={data} 
              format="text" 
              customQuery={customQuery} 
              maxMarksPerSubject={maxMarksPerSubject}
              passPercentage={passPercentage}
            />
          ))}
        </TabsContent>
        
        {/* Always display the students table at the bottom */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-gradient-brand">All Students Data</h3>
          <StudentsTable 
            data={data} 
            maxMarksPerSubject={maxMarksPerSubject}
            passPercentage={passPercentage} 
          />
        </div>
      </Tabs>
    </Card>
  );
};

export default ResultsDisplay;
