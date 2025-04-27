
import React, { useState } from "react";
import { Send, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface CustomQueryInputProps {
  onSubmitQuery: (query: string) => void;
}

const CustomQueryInput: React.FC<CustomQueryInputProps> = ({ onSubmitQuery }) => {
  const [query, setQuery] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast({
        title: "Empty query",
        description: "Please enter a query to analyze.",
        variant: "destructive",
      });
      return;
    }
    
    onSubmitQuery(query);
    toast({
      title: "Custom query submitted",
      description: "Analyzing your specific request...",
    });
  };

  return (
    <Card className="p-4 animate-fade-in-up">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
        <div className="flex items-center relative">
          <Search className="absolute left-3 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a specific question about the mark sheet data..."
            className="pl-10 w-full rounded-md border border-input bg-background px-3 py-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
        <Button type="submit" className="self-end hover-lift bg-brand-purple hover:bg-brand-purple/90">
          <Send className="mr-2 h-4 w-4" />
          Submit Query
        </Button>
      </form>
    </Card>
  );
};

export default CustomQueryInput;
