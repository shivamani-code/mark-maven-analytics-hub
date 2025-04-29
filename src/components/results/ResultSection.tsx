
import React from "react";
import { AnalysisResult } from "@/utils/imageAnalysis";
import { AnalysisOptionType } from "../AnalysisOptions";
import TopperListResults from "./TopperListResults";
import SubjectToppersResults from "./SubjectToppersResults";
import PassPercentageResults from "./PassPercentageResults";
import { generateTopperList, generateSubjectToppers } from "@/utils/dataFormatting";

interface ResultSectionProps {
  option: AnalysisOptionType;
  data: AnalysisResult;
  format: string;
  customQuery?: string;
  maxMarksPerSubject: number;
}

const ResultSection: React.FC<ResultSectionProps> = ({ 
  option, data, format, customQuery, maxMarksPerSubject 
}) => {
  const getOptionTitle = () => {
    switch(option) {
      case 'topperList': return 'Topper List';
      case 'averageMarks': return 'All Students Performance';
      case 'subjectToppers': return 'Subject-wise Toppers';
      case 'passPercentage': return 'Pass Percentage';
      case 'custom': return 'Custom Query Results';
      default: return '';
    }
  };

  const renderOptionContent = () => {
    if (option === 'custom') {
      return (
        <div>
          <p className="text-sm text-muted-foreground mb-3">Query: "{customQuery}"</p>
          <div className="bg-muted/30 p-4 rounded-md">
            <p>Custom query results would appear here in a real app.</p>
            <p className="text-muted-foreground text-sm mt-2">
              In a production app, this would process the query through an AI model and return relevant data.
            </p>
          </div>
        </div>
      );
    }

    switch (option) {
      case 'topperList':
        return <TopperListResults 
                 data={generateTopperList(data, maxMarksPerSubject)} 
                 format={format} 
               />;
      case 'subjectToppers':
        return <SubjectToppersResults 
                 data={generateSubjectToppers(data, maxMarksPerSubject)} 
                 format={format} 
                 maxMarksPerSubject={maxMarksPerSubject}
               />;
      case 'passPercentage':
        return <PassPercentageResults 
                 data={data} 
                 format={format} 
               />;
      default:
        return null;
    }
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4 text-gradient-brand">
        {getOptionTitle()}
      </h3>
      <div className="border rounded-md">
        <div className="p-4">
          {renderOptionContent()}
        </div>
      </div>
    </div>
  );
};

export default ResultSection;
