
import React from "react";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { SubjectTopperResult } from "@/utils/dataFormatting";

interface SubjectToppersResultsProps {
  data: SubjectTopperResult[];
  format: string;
  maxMarksPerSubject: number;
}

const SubjectToppersResults: React.FC<SubjectToppersResultsProps> = ({ 
  data, format, maxMarksPerSubject 
}) => {
  if (format === 'chart') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="subject" />
          <YAxis domain={[0, maxMarksPerSubject]} />
          <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }} />
          <Legend />
          <Bar name="Marks" dataKey="marks" fill="#8B5CF6" />
          <Bar name="Percentage" dataKey="percentage" fill="#D946EF" />
        </BarChart>
      </ResponsiveContainer>
    );
  } else if (format === 'table') {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subject</TableHead>
            <TableHead>Topper</TableHead>
            <TableHead>Marks</TableHead>
            <TableHead>Percentage</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.subject}</TableCell>
              <TableCell>{item.topperName}</TableCell>
              <TableCell>{item.marks}</TableCell>
              <TableCell>{item.percentage}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  } else {
    return (
      <div className="p-4 whitespace-pre-wrap bg-muted/30 rounded-md">
        {JSON.stringify(data, null, 2)}
      </div>
    );
  }
};

export default SubjectToppersResults;
