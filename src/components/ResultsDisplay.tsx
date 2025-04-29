
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartBarIcon, TableIcon, FileText } from "lucide-react";
import { AnalysisOptionType } from "./AnalysisOptions";
import { AnalysisResult } from "@/utils/imageAnalysis";
import { generateTopperList } from "@/utils/dataFormatting";
import TopperListResults from "./results/TopperListResults";
import PassPercentageConfig from "./PassPercentageConfig";

interface ResultsDisplayProps {
  data: AnalysisResult;
  selectedOptions: AnalysisOptionType[];
  customQuery?: string;
  maxMarksPerSubject?: number;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  data, 
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

  const toppersList = generateTopperList(data, maxMarksPerSubject, passPercentage);

  return (
    <Card className="p-6 animate-fade-in-up">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Students Ranking</h2>
        <p className="text-muted-foreground">
          Students ranked by their total marks
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
        </div>

        <TabsContent value="chart">
          <div className="border rounded-md p-4">
            <h3 className="text-xl font-semibold mb-4 text-gradient-brand">Toppers List</h3>
            <TopperListResults 
              data={toppersList} 
              format="chart" 
              passPercentage={passPercentage}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="table">
          <div className="border rounded-md p-4">
            <h3 className="text-xl font-semibold mb-4 text-gradient-brand">Toppers List</h3>
            <TopperListResults 
              data={toppersList} 
              format="table" 
              passPercentage={passPercentage}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="text">
          <div className="border rounded-md p-4">
            <h3 className="text-xl font-semibold mb-4 text-gradient-brand">Toppers List</h3>
            <TopperListResults 
              data={toppersList} 
              format="text" 
              passPercentage={passPercentage}
            />
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ResultsDisplay;
