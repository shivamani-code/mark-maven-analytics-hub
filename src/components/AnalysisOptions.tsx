
import React, { useState } from "react";
import { CheckCircle, ChevronDown, Trophy, Calculator, BookOpen, CheckCheck, Search, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

export type AnalysisOptionType = 
  | "topperList" 
  | "averageMarks" 
  | "subjectToppers" 
  | "passPercentage" 
  | "custom";

interface AnalysisOption {
  id: AnalysisOptionType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

interface AnalysisOptionsProps {
  onOptionsSelected: (options: AnalysisOptionType[]) => void;
  onCustomQuery: (query: string) => void;
}

const AnalysisOptions: React.FC<AnalysisOptionsProps> = ({ onOptionsSelected, onCustomQuery }) => {
  const [selectedOptions, setSelectedOptions] = useState<AnalysisOptionType[]>([]);
  const [showOptions, setShowOptions] = useState(true);
  const [customQuery, setCustomQuery] = useState("");
  const [isCustomSelected, setIsCustomSelected] = useState(false);

  const options: AnalysisOption[] = [
    {
      id: "topperList",
      label: "Topper List",
      icon: <Trophy className="h-5 w-5 text-yellow-500" />,
      description: "Rank all students by their total marks across all subjects"
    },
    {
      id: "averageMarks",
      label: "All Students Performance",
      icon: <Calculator className="h-5 w-5 text-blue-500" />,
      description: "View all students' marks with totals and percentages"
    },
    {
      id: "subjectToppers",
      label: "Subject-wise Toppers",
      icon: <BookOpen className="h-5 w-5 text-green-500" />,
      description: "Identify top performers in each individual subject"
    },
    {
      id: "passPercentage",
      label: "Pass Percentage",
      icon: <CheckCheck className="h-5 w-5 text-purple-500" />,
      description: "Calculate the overall passing percentage of students"
    }
  ];

  const toggleOption = (optionId: AnalysisOptionType) => {
    setSelectedOptions(prev => 
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const toggleCustomOption = () => {
    setIsCustomSelected(!isCustomSelected);
    if (!isCustomSelected) {
      if (!selectedOptions.includes("custom")) {
        setSelectedOptions(prev => [...prev, "custom"]);
      }
    } else {
      setSelectedOptions(prev => prev.filter(id => id !== "custom"));
    }
  };

  const handleAnalyze = () => {
    onOptionsSelected(selectedOptions);
    if (isCustomSelected && customQuery.trim()) {
      onCustomQuery(customQuery);
    }
  };

  return (
    <Card className="p-6 animate-fade-in-up">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Select Analysis Options</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowOptions(!showOptions)}
        >
          <ChevronDown className={`h-5 w-5 transition-transform ${!showOptions ? 'rotate-180' : ''}`} />
        </Button>
      </div>
      
      {showOptions && (
        <>
          <div className="space-y-3 mb-6">
            {options.map((option) => (
              <div 
                key={option.id} 
                className={`flex items-center space-x-3 p-3 rounded-md transition-colors cursor-pointer hover-lift ${
                  selectedOptions.includes(option.id) 
                    ? 'bg-muted/80 border border-primary/30' 
                    : 'hover:bg-muted'
                }`}
                onClick={() => toggleOption(option.id)}
              >
                <Checkbox 
                  checked={selectedOptions.includes(option.id)}
                  onCheckedChange={() => toggleOption(option.id)}
                  className="data-[state=checked]:bg-brand-purple data-[state=checked]:text-primary-foreground"
                />
                <div className="flex flex-1 items-center space-x-3">
                  {option.icon}
                  <div>
                    <p className="font-medium">{option.label}</p>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </div>
                {selectedOptions.includes(option.id) && (
                  <CheckCircle className="h-5 w-5 text-brand-purple animate-scale-in" />
                )}
              </div>
            ))}
            
            {/* Custom query option */}
            <div 
              className={`flex items-start space-x-3 p-3 rounded-md transition-colors cursor-pointer hover-lift ${
                isCustomSelected 
                  ? 'bg-muted/80 border border-primary/30' 
                  : 'hover:bg-muted'
              }`}
              onClick={toggleCustomOption}
            >
              <Checkbox 
                checked={isCustomSelected}
                onCheckedChange={toggleCustomOption}
                className="mt-1 data-[state=checked]:bg-brand-purple data-[state=checked]:text-primary-foreground"
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-3">
                  <PlusCircle className="h-5 w-5 text-brand-magenta" />
                  <p className="font-medium">Custom Analysis Query</p>
                </div>
                <div className="flex items-center relative">
                  <Search className="h-4 w-4 absolute left-3 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="E.g., Show students who scored above 90 in Math"
                    className="pl-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={customQuery}
                    onChange={(e) => setCustomQuery(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
              {isCustomSelected && (
                <CheckCircle className="h-5 w-5 text-brand-purple animate-scale-in" />
              )}
            </div>
          </div>
          
          <Button 
            onClick={handleAnalyze} 
            disabled={selectedOptions.length === 0}
            className={`w-full bg-gradient-brand hover:opacity-90 ${
              selectedOptions.length > 0 ? 'animate-pulse-slow' : ''
            }`}
          >
            Analyze Selected Options
          </Button>
        </>
      )}
    </Card>
  );
};

export default AnalysisOptions;
