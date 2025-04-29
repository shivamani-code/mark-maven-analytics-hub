
import React, { useState } from "react";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { AnalysisResult } from "@/utils/imageAnalysis";
import { generateAllStudentsStats } from "@/utils/dataFormatting";

interface StudentsTableProps {
  data: AnalysisResult;
  maxMarksPerSubject: number;
  passPercentage?: number;
}

const StudentsTable: React.FC<StudentsTableProps> = ({ 
  data, 
  maxMarksPerSubject,
  passPercentage = 40
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;
  
  if (!data || !data.students || data.students.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No student data available.
      </div>
    );
  }
  
  const totalPages = Math.ceil(data.students.length / studentsPerPage);
  const allStudentStats = generateAllStudentsStats(data, maxMarksPerSubject, passPercentage);
  
  const getPaginatedStudents = () => {
    const startIndex = (currentPage - 1) * studentsPerPage;
    const endIndex = startIndex + studentsPerPage;
    return data.students.slice(startIndex, endIndex);
  };
  
  const paginatedStudents = getPaginatedStudents();
  
  return (
    <div className="border rounded-md">
      <div className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              {data.subjects.map(subject => (
                <TableHead key={subject}>{subject}</TableHead>
              ))}
              <TableHead>Total</TableHead>
              <TableHead>Percentage</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedStudents.map((student, index) => {
              const stats = allStudentStats.find(s => s.name === student.name);
              
              return (
                <TableRow 
                  key={index}
                  className={stats?.passing ? "bg-green-50" : "bg-red-50"}
                >
                  <TableCell className="font-medium">{student.name}</TableCell>
                  {data.subjects.map(subject => {
                    const mark = student[subject];
                    const markValue = typeof mark === 'number' ? mark : 0;
                    const subjectPercentage = (markValue / maxMarksPerSubject) * 100;
                    
                    return (
                      <TableCell 
                        key={subject}
                        className={subjectPercentage >= passPercentage ? "" : "text-red-500"}
                      >
                        {markValue}
                      </TableCell>
                    );
                  })}
                  <TableCell className="font-bold">{stats?.totalMarks || 0}</TableCell>
                  <TableCell>{stats?.percentage || 0}%</TableCell>
                  <TableCell>
                    <Badge className={stats?.passing ? "bg-green-500" : "bg-red-500"}>
                      {stats?.passing ? "Pass" : "Fail"}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-center p-4">
          <Pagination>
            <PaginationContent>
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious onClick={() => setCurrentPage(prev => prev - 1)} />
                </PaginationItem>
              )}
              
              {Array.from({length: Math.min(totalPages, 5)}, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else {
                  const middlePage = Math.min(Math.max(currentPage, 3), totalPages - 2);
                  pageNum = middlePage - 2 + i;
                  if (pageNum < 1) pageNum = 1;
                  if (pageNum > totalPages) pageNum = totalPages;
                }
                return pageNum;
              }).map(page => (
                <PaginationItem key={page}>
                  <PaginationLink 
                    isActive={page === currentPage}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationNext onClick={() => setCurrentPage(prev => prev + 1)} />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default StudentsTable;
