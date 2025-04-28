
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  ChartBarIcon, 
  TableIcon, 
  FileText, 
  FileSpreadsheet, 
  Download, 
  ChartPie,
  ChevronDown,
  ChevronUp,
  File
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { AnalysisOptionType } from "./AnalysisOptions";
import { AnalysisResult } from "@/utils/imageAnalysis";
import { exportAsPDF, exportAsExcel, exportAllData, exportAllDataAsPDF } from "@/utils/exportUtils";
import { useToast } from "@/hooks/use-toast";
import { generateTopperList, generateAverageMarks, generateSubjectToppers, generateAllStudentsStats } from "@/utils/dataFormatting";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

interface ResultsDisplayProps {
  data: AnalysisResult;
  selectedOptions: AnalysisOptionType[];
  customQuery?: string;
  maxMarksPerSubject?: number;
}

const COLORS = ['#8B5CF6', '#D946EF', '#0EA5E9', '#F97316', '#10B981', '#6366F1'];

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ data, selectedOptions, customQuery, maxMarksPerSubject = 50 }) => {
  const [activeFormat, setActiveFormat] = useState("chart");
  const [expandToppers, setExpandToppers] = useState(false);
  const [currentStudentPage, setCurrentStudentPage] = useState(1);
  const { toast } = useToast();
  
  const studentsPerPage = 10;
  const totalStudentPages = Math.ceil(data.students.length / studentsPerPage);

  const getPaginatedStudents = () => {
    const startIndex = (currentStudentPage - 1) * studentsPerPage;
    const endIndex = startIndex + studentsPerPage;
    return data.students.slice(startIndex, endIndex);
  };

  const getOptionData = (option: AnalysisOptionType) => {
    switch (option) {
      case 'topperList':
        return generateTopperList(data, maxMarksPerSubject);
      case 'averageMarks':
        return generateAllStudentsStats(data, maxMarksPerSubject);
      case 'subjectToppers':
        return generateSubjectToppers(data, maxMarksPerSubject);
      case 'passPercentage':
        const passCount = Math.round(data.students.length * (data.passPercentage / 100));
        const failCount = data.students.length - passCount;
        return [
          { name: 'Pass', value: passCount },
          { name: 'Fail', value: failCount }
        ];
      default:
        return [];
    }
  };

  const getDisplayedToppers = () => {
    const allToppers = generateTopperList(data, maxMarksPerSubject);
    return expandToppers ? allToppers : allToppers.slice(0, 10);
  };

  const renderContent = (option: AnalysisOptionType, format: string) => {
    const optionData = getOptionData(option);
    
    if (format === 'chart') {
      if (option === 'passPercentage') {
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={optionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {optionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} students`, null]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      } else if (option === 'subjectToppers') {
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={optionData}>
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
      } else if (option === 'averageMarks') {
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={optionData.slice(0, 15)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} interval={0} />
              <YAxis domain={[0, 'dataMax + 10']} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }} />
              <Legend />
              <Bar name="Total Marks" dataKey="totalMarks" fill="#0EA5E9" />
              <Bar name="Percentage" dataKey="percentage" fill="#F97316" />
            </BarChart>
          </ResponsiveContainer>
        );
      } else if (option === 'topperList') {
        const displayedToppers = getDisplayedToppers().slice(0, 15);
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={displayedToppers}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} interval={0} />
              <YAxis domain={[0, 'dataMax + 10']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }} 
                formatter={(value, name) => [`${value}`, name === "percentage" ? "Percentage" : "Total Marks"]}
              />
              <Legend />
              <Bar name="Total Marks" dataKey="total" fill="#8884d8" />
              <Bar name="Percentage" dataKey="percentage" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        );
      }
    } else if (format === 'table') {
      if (option === 'passPercentage') {
        const passCount = Math.round(data.students.length * (data.passPercentage / 100));
        const failCount = data.students.length - passCount;
        
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
      } else if (option === 'topperList') {
        return (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Total Marks</TableHead>
                  <TableHead>Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getDisplayedToppers().map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.total}</TableCell>
                    <TableCell>{item.percentage}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
          </>
        );
      } else if (option === 'averageMarks') {
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Total Marks</TableHead>
                <TableHead>Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {optionData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.totalMarks}</TableCell>
                  <TableCell>{item.percentage}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );
      } else if (option === 'subjectToppers') {
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
              {optionData.map((item, index) => (
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
      }
    }
    
    return (
      <div className="p-4 whitespace-pre-wrap bg-muted/30 rounded-md">
        {JSON.stringify(optionData, null, 2)}
      </div>
    );
  };

  const renderAllStudents = () => {
    const paginatedStudents = getPaginatedStudents();
    
    return (
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 text-gradient-brand">All Students Data</h3>
        
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
          
          {totalStudentPages > 1 && (
            <div className="flex justify-center p-4">
              <Pagination>
                <PaginationContent>
                  {currentStudentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious onClick={() => setCurrentStudentPage(prev => prev - 1)} />
                    </PaginationItem>
                  )}
                  
                  {Array.from({length: Math.min(totalStudentPages, 5)}, (_, i) => {
                    let pageNum;
                    if (totalStudentPages <= 5) {
                      pageNum = i + 1;
                    } else {
                      const middlePage = Math.min(Math.max(currentStudentPage, 3), totalStudentPages - 2);
                      pageNum = middlePage - 2 + i;
                      if (pageNum < 1) pageNum = 1;
                      if (pageNum > totalStudentPages) pageNum = totalStudentPages;
                    }
                    return pageNum;
                  }).map(page => (
                    <PaginationItem key={page}>
                      <PaginationLink 
                        isActive={page === currentStudentPage}
                        onClick={() => setCurrentStudentPage(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  {currentStudentPage < totalStudentPages && (
                    <PaginationItem>
                      <PaginationNext onClick={() => setCurrentStudentPage(prev => prev + 1)} />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleExport = (format: string) => {
    try {
      if (format === 'pdf') {
        exportAsPDF(data, selectedOptions, customQuery);
        toast({
          title: "PDF Export",
          description: "Your analysis has been downloaded as a PDF file.",
        });
      } else if (format === 'excel') {
        exportAsExcel(data, selectedOptions, customQuery);
        toast({
          title: "Excel Export",
          description: "Your analysis has been downloaded as a CSV file.",
        });
      } else if (format === 'all') {
        exportAllData(data, selectedOptions, customQuery);
        toast({
          title: "Complete Export",
          description: "Your complete analysis has been downloaded as a text file.",
        });
      } else if (format === 'all-pdf-tables') {
        exportAllDataAsPDF(data, selectedOptions, customQuery);
        toast({
          title: "Comprehensive PDF Export",
          description: "Your comprehensive analysis with tables has been downloaded.",
        });
      }
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: "There was a problem exporting your data. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="p-6 animate-fade-in-up">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Analysis Results</h2>
        <p className="text-muted-foreground">
          View your selected analysis results in different formats
        </p>
        {maxMarksPerSubject !== 50 && (
          <p className="text-sm text-brand-purple">
            Using {maxMarksPerSubject} as maximum marks per subject for calculations
          </p>
        )}
      </div>

      <Tabs defaultValue="chart" value={activeFormat} onValueChange={setActiveFormat}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="chart" className="data-[state=active]:bg-white">
              <ChartBarIcon className="h-4 w-4 mr-2" /> Charts
            </TabsTrigger>
            <TabsTrigger value="table" className="data-[state=active]:bg-white">
              <TableIcon className="h-4 w-4 mr-2" /> Tables
            </TabsTrigger>
            <TabsTrigger value="text" className="data-[state=active]:bg-white">
              <FileText className="h-4 w-4 mr-2" /> Text
            </TabsTrigger>
          </TabsList>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleExport('pdf')}
            >
              <FileText className="h-4 w-4 mr-2" /> PDF
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleExport('excel')}
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" /> Excel
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleExport('all-pdf-tables')}
              className="bg-gradient-to-r from-brand-purple/20 to-brand-magenta/20"
            >
              <File className="h-4 w-4 mr-2" /> All Tables PDF
            </Button>
          </div>
        </div>

        {selectedOptions.map((option) => (
          <div key={option} className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gradient-brand">
              {option === 'topperList' && 'Topper List'}
              {option === 'averageMarks' && 'All Students Performance'}
              {option === 'subjectToppers' && 'Subject-wise Toppers'}
              {option === 'passPercentage' && 'Pass Percentage'}
              {option === 'custom' && 'Custom Query Results'}
            </h3>
            
            {option === 'custom' ? (
              <div>
                <p className="text-sm text-muted-foreground mb-3">Query: "{customQuery}"</p>
                <div className="bg-muted/30 p-4 rounded-md">
                  <p>Custom query results would appear here in a real app.</p>
                  <p className="text-muted-foreground text-sm mt-2">
                    In a production app, this would process the query through an AI model and return relevant data.
                  </p>
                </div>
              </div>
            ) : (
              <div className="border rounded-md">
                <TabsContent value="chart" className="p-4">
                  {renderContent(option, 'chart')}
                </TabsContent>
                <TabsContent value="table" className="p-4">
                  {renderContent(option, 'table')}
                </TabsContent>
                <TabsContent value="text" className="p-4">
                  {renderContent(option, 'text')}
                </TabsContent>
              </div>
            )}
          </div>
        ))}
        
        {renderAllStudents()}

        <div className="flex flex-wrap gap-2 justify-end mt-8">
          <Button 
            variant="outline"
            onClick={() => handleExport('all')} 
            className="bg-gradient-to-r from-brand-purple/10 to-brand-magenta/10"
          >
            <FileText className="h-4 w-4 mr-2" /> Download Text Report
          </Button>
          <Button 
            onClick={() => handleExport('all-pdf-tables')} 
            className="bg-gradient-brand hover:opacity-90"
          >
            <Download className="h-4 w-4 mr-2" /> Download Complete Tables
          </Button>
        </div>
      </Tabs>
    </Card>
  );
};

export default ResultsDisplay;
