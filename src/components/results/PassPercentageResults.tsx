
import React from "react";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { AnalysisResult } from "@/utils/imageAnalysis";
import { generateAllStudentsStats } from "@/utils/dataFormatting";

interface PassPercentageResultsProps {
  data: AnalysisResult;
  format: string;
  passPercentage?: number;
}

const COLORS = ['#10B981', '#EF4444']; // Green for pass, red for fail

const PassPercentageResults: React.FC<PassPercentageResultsProps> = ({ 
  data, 
  format,
  passPercentage = 40
}) => {
  if (!data || !data.students || data.students.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No data available for pass percentage analysis.
      </div>
    );
  }

  const studentStats = generateAllStudentsStats(data, 50, passPercentage);
  const passCount = studentStats.filter(student => student.passing).length;
  const failCount = data.students.length - passCount;
  const actualPassPercentage = (passCount / data.students.length) * 100;
  
  const chartData = [
    { name: 'Pass', value: passCount },
    { name: 'Fail', value: failCount }
  ];
  
  if (format === 'chart') {
    return (
      <>
        <p className="mb-4 text-sm text-muted-foreground">
          Pass threshold set at {passPercentage}% minimum marks
        </p>
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
      </>
    );
  } else if (format === 'table') {
    return (
      <>
        <p className="mb-4 text-sm text-muted-foreground">
          Pass threshold set at {passPercentage}% minimum marks
        </p>
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
              <TableCell>{actualPassPercentage.toFixed(1)}%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Fail</TableCell>
              <TableCell>{failCount}</TableCell>
              <TableCell>{(100 - actualPassPercentage).toFixed(1)}%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </>
    );
  } else {
    return (
      <div className="p-4 whitespace-pre-wrap bg-muted/30 rounded-md">
        {JSON.stringify({
          passThreshold: passPercentage,
          passCount,
          failCount,
          passPercentage: actualPassPercentage.toFixed(1)
        }, null, 2)}
      </div>
    );
  }
};

export default PassPercentageResults;
