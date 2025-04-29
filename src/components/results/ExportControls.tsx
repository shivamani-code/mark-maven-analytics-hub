
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet } from "lucide-react";
import { AnalysisResult } from "@/utils/imageAnalysis";
import { AnalysisOptionType } from "../AnalysisOptions";
import { exportAsPDF, exportAsExcel } from "@/utils/exportUtils";
import { useToast } from "@/hooks/use-toast";

interface ExportControlsProps {
  data: AnalysisResult;
  selectedOptions: AnalysisOptionType[];
  customQuery?: string;
}

const ExportControls: React.FC<ExportControlsProps> = ({ data, selectedOptions, customQuery }) => {
  const { toast } = useToast();

  const handleExport = (format: string) => {
    try {
      if (format === 'pdf') {
        exportAsPDF(data, selectedOptions, customQuery);
        toast({
          title: "PDF Export",
          description: "Your analysis has been downloaded as a PDF file.",
        });
      } else if (format === 'excel') {
        exportAsExcel(data, selectedOptions, customQuery);
        toast({
          title: "Excel Export",
          description: "Your analysis has been downloaded as a CSV file.",
        });
      }
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: "There was a problem exporting your data. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-wrap gap-2 justify-end items-center">
      <div className="text-sm text-muted-foreground mr-auto">
        Export results
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => handleExport('pdf')}
      >
        <FileText className="h-4 w-4 mr-2" /> PDF
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => handleExport('excel')}
      >
        <FileSpreadsheet className="h-4 w-4 mr-2" /> Excel
      </Button>
    </div>
  );
};

export default ExportControls;
