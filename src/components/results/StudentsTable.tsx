
import React, { useState } from "react";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { AnalysisResult } from "@/utils/imageAnalysis";
import { generateAllStudentsStats } from "@/utils/dataFormatting";

interface StudentsTableProps {
  data: AnalysisResult;
  maxMarksPerSubject: number;
}

const StudentsTable: React.FC<StudentsTableProps> = ({ data, maxMarksPerSubject }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;
  const totalPages = Math.ceil(data.students.length / studentsPerPage);
  
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedStudents.map((student, index) => {
              const stats = generateAllStudentsStats(data, maxMarksPerSubject).find(s => s.name === student.name);
              return (
                <TableRow key={index}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  {data.subjects.map(subject => (
                    <TableCell key={subject}>{student[subject]}</TableCell>
                  ))}
                  <TableCell className="font-bold">{stats?.totalMarks || 0}</TableCell>
                  <TableCell>{stats?.percentage || 0}%</TableCell>
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
