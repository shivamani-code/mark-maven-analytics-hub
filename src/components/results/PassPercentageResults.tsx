
import React from "react";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { AnalysisResult } from "@/utils/imageAnalysis";

interface PassPercentageResultsProps {
  data: AnalysisResult;
  format: string;
}

const COLORS = ['#8B5CF6', '#D946EF', '#0EA5E9', '#F97316', '#10B981', '#6366F1'];

const PassPercentageResults: React.FC<PassPercentageResultsProps> = ({ data, format }) => {
  const passCount = Math.round(data.students.length * (data.passPercentage / 100));
  const failCount = data.students.length - passCount;
  
  const chartData = [
    { name: 'Pass', value: passCount },
    { name: 'Fail', value: failCount }
  ];
  
  if (format === 'chart') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} students`, null]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  } else if (format === 'table') {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>Count</TableHead>
            <TableHead>Percentage</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Pass</TableCell>
            <TableCell>{passCount}</TableCell>
            <TableCell>{data.passPercentage}%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Fail</TableCell>
            <TableCell>{failCount}</TableCell>
            <TableCell>{(100 - data.passPercentage).toFixed(1)}%</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  } else {
    return (
      <div className="p-4 whitespace-pre-wrap bg-muted/30 rounded-md">
        {JSON.stringify(chartData, null, 2)}
      </div>
    );
  }
};

export default PassPercentageResults;
