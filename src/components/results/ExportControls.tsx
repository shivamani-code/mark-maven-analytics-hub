
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet, Download, File } from "lucide-react";
import { AnalysisResult } from "@/utils/imageAnalysis";
import { AnalysisOptionType } from "../AnalysisOptions";
import { exportAsPDF, exportAsExcel, exportAllData, exportAllDataAsPDF } from "@/utils/exportUtils";
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
      } else if (format === 'all') {
        exportAllData(data, selectedOptions, customQuery);
        toast({
          title: "Complete Export",
          description: "Your complete analysis has been downloaded as a text file.",
        });
      } else if (format === 'all-pdf-tables') {
        exportAllDataAsPDF(data, selectedOptions, customQuery);
        toast({
          title: "Comprehensive PDF Export",
          description: "Your comprehensive analysis with tables has been downloaded.",
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
    <>
      <div className="flex flex-wrap gap-2 justify-between items-center mb-4">
        <div className="text-sm text-muted-foreground">
          Export your analysis results in different formats
        </div>
        <div className="flex flex-wrap gap-2">
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
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleExport('all-pdf-tables')}
            className="bg-gradient-to-r from-brand-purple/20 to-brand-magenta/20"
          >
            <File className="h-4 w-4 mr-2" /> All Tables PDF
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 justify-end mt-8">
        <Button 
          variant="outline"
          onClick={() => handleExport('all')} 
          className="bg-gradient-to-r from-brand-purple/10 to-brand-magenta/10"
        >
          <FileText className="h-4 w-4 mr-2" /> Download Text Report
        </Button>
        <Button 
          onClick={() => handleExport('all-pdf-tables')} 
          className="bg-gradient-brand hover:opacity-90"
        >
          <Download className="h-4 w-4 mr-2" /> Download Complete Tables
        </Button>
      </div>
    </>
  );
};

export default ExportControls;
