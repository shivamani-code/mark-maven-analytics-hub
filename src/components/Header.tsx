
import React from "react";
import { FileImage, Brain, BarChart } from "lucide-react";

const Header = () => {
  return (
    <header className="relative z-10 py-6">
      <div className="container">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="flex items-center space-x-2 animate-float">
            <FileImage className="h-8 w-8 text-brand-purple" />
            <Brain className="h-10 w-10 text-brand-magenta" />
            <BarChart className="h-8 w-8 text-brand-blue" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">
            <span className="text-gradient-brand">MarkMaven</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Upload mark sheets, get intelligent insights through AI-powered analysis
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
