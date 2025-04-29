
import React, { useState } from "react";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { TopperListResult } from "@/utils/dataFormatting";

interface TopperListResultsProps {
  data: TopperListResult[];
  format: string;
  passPercentage?: number;
}

const TopperListResults: React.FC<TopperListResultsProps> = ({ 
  data, 
  format,
  passPercentage = 40 
}) => {
  const [expandToppers, setExpandToppers] = useState(false);
  
  const getDisplayedToppers = () => {
    return expandToppers ? data : data.slice(0, 10);
  };

  if (!data || data.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No data available for toppers list.
      </div>
    );
  }
  
  if (format === 'chart') {
    const displayedToppers = getDisplayedToppers().slice(0, 15);
    
    // Add color coding based on pass/fail status
    const customData = displayedToppers.map(student => ({
      ...student,
      color: student.passing ? "#10B981" : "#EF4444"  // Green if passing, red if failing
    }));
    
    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={customData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} interval={0} />
          <YAxis domain={[0, 'dataMax + 10']} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }} 
            formatter={(value, name) => [
              `${value}`, 
              name === "percentage" ? "Percentage" : "Total Marks"
            ]}
            labelFormatter={(label) => {
              const student = customData.find(s => s.name === label);
              return `${label} (${student?.passing ? 'Pass' : 'Fail'})`;
            }}
          />
          <Legend />
          <Bar 
            name="Total Marks" 
            dataKey="total" 
            fill="#8884d8" 
            stroke={(data) => data.passing ? "#10B981" : "#EF4444"}
            strokeWidth={2}
          />
          <Bar 
            name="Percentage" 
            dataKey="percentage" 
            fill="#82ca9d"
            stroke={(data) => data.passing ? "#10B981" : "#EF4444"}
            strokeWidth={2}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  } else if (format === 'table') {
    return (
      <>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Student Name</TableHead>
              <TableHead>Total Marks</TableHead>
              <TableHead>Percentage</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getDisplayedToppers().map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.total}</TableCell>
                <TableCell>{item.percentage}%</TableCell>
                <TableCell>
                  <Badge className={item.passing ? "bg-green-500" : "bg-red-500"}>
                    {item.passing ? "Pass" : "Fail"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {data.length > 10 && (
          <div className="flex justify-center mt-4">
            <Button 
              variant="outline"
              onClick={() => setExpandToppers(!expandToppers)}
              className="flex items-center gap-1"
            >
              {expandToppers ? (
                <>
                  Show Less <ChevronUp className="h-4 w-4 ml-1" />
                </>
              ) : (
                <>
                  See More <ChevronDown className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        )}
      </>
    );
  } else {
    return (
      <div className="p-4 whitespace-pre-wrap bg-muted/30 rounded-md">
        {JSON.stringify(data, null, 2)}
      </div>
    );
  }
};

export default TopperListResults;
