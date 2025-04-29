
import React from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface PassPercentageConfigProps {
  value: number;
  onChange: (value: number) => void;
}

const PassPercentageConfig: React.FC<PassPercentageConfigProps> = ({ value, onChange }) => {
  const handleSliderChange = (values: number[]) => {
    onChange(values[0]);
  };

  return (
    <div className="space-y-2 p-3 border rounded-md bg-muted/20 mb-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="pass-percentage" className="text-sm font-medium">
          Pass Percentage Threshold
        </Label>
        <span className="text-sm font-bold bg-gradient-to-r from-brand-purple to-brand-magenta bg-clip-text text-transparent">
          {value}%
        </span>
      </div>
      <Slider
        id="pass-percentage"
        defaultValue={[value]}
        min={20}
        max={80}
        step={5}
        onValueChange={handleSliderChange}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>20%</span>
        <span>40%</span>
        <span>60%</span>
        <span>80%</span>
      </div>
    </div>
  );
};

export default PassPercentageConfig;
