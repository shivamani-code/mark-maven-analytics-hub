
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
  Users,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { AnalysisOptionType } from "./AnalysisOptions";
import { AnalysisResult } from "@/utils/imageAnalysis";
import { exportAsPDF, exportAsExcel, exportAllData } from "@/utils/exportUtils";
import { useToast } from "@/hooks/use-toast";
import { generateTopperList, generateAverageMarks, generateSubjectToppers } from "@/utils/dataFormatting";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

interface ResultsDisplayProps {
  data: AnalysisResult;
  selectedOptions: AnalysisOptionType[];
  customQuery?: string;
}

// Define colors for charts
const COLORS = ['#8B5CF6', '#D946EF', '#0EA5E9', '#F97316', '#10B981', '#6366F1'];

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ data, selectedOptions, customQuery }) => {
  const [activeFormat, setActiveFormat] = useState("chart");
  const [expandToppers, setExpandToppers] = useState(false);
  const [currentStudentPage, setCurrentStudentPage] = useState(1);
  const { toast } = useToast();
  
  const studentsPerPage = 10;
  const totalStudentPages = Math.ceil(data.students.length / studentsPerPage);

  // Convert data for average marks chart
  const getAverageChart = () => {
    const subjects = data.subjects || [];
    const students = data.students || [];
    
    // Calculate average for each subject
    const subjectAverages = subjects.map(subject => {
      const total = students.reduce((sum, student) => sum + (student[subject] as number), 0);
      return {
        subject,
        average: parseFloat((total / students.length).toFixed(1))
      };
    });
    
    return subjectAverages;
  };

  // Convert data for toppers chart
  const getToppersChart = () => {
    const students = data.students || [];
    return students
      .map(student => {
        // Calculate total marks and percentage
        const total = Object.keys(student)
          .filter(key => key !== 'name')
          .reduce((sum, subject) => sum + (student[subject] as number), 0);
        
        const maxPossibleMarks = Object.keys(student).filter(key => key !== 'name').length * 50; // Assuming each subject is out of 50
        const percentage = (total / maxPossibleMarks) * 100;
        
        return {
          name: student.name,
          total,
          percentage: parseFloat(percentage.toFixed(1))
        };
      })
      .sort((a, b) => b.total - a.total);
  };

  // Filter toppers based on expand state
  const getDisplayedToppers = () => {
    const allToppers = getToppersChart();
    return expandToppers ? allToppers : allToppers.slice(0, 10);
  };

  // Generate pie chart data for pass percentage
  const getPassPercentageChart = () => {
    const students = data.students || [];
    const passCount = students.length * (data.passPercentage / 100);
    const failCount = students.length - passCount;
    
    return [
      { name: 'Pass', value: passCount },
      { name: 'Fail', value: failCount }
    ];
  };

  // Generate data for subject-wise toppers
  const getSubjectToppers = () => {
    const subjects = data.subjects || [];
    const students = data.students || [];
    
    return subjects.map(subject => {
      const topStudent = [...students].sort((a, b) => 
        ((b[subject] as number) || 0) - ((a[subject] as number) || 0)
      )[0];
      return {
        subject,
        topperName: topStudent.name,
        marks: topStudent[subject],
        percentage: parseFloat((((topStudent[subject] as number) / 50) * 100).toFixed(1)) // Assuming each subject is out of 50
      };
    });
  };

  // Get paginated students data
  const getPaginatedStudents = () => {
    const startIndex = (currentStudentPage - 1) * studentsPerPage;
    const endIndex = startIndex + studentsPerPage;
    return data.students.slice(startIndex, endIndex);
  };

  // Calculate student total marks and percentage
  const calculateStudentStats = (student) => {
    const subjects = data.subjects;
    const totalMarks = subjects.reduce((sum, subject) => sum + (student[subject] as number), 0);
    const maxPossible = subjects.length * 50; // Assuming each subject is out of 50
    const percentage = (totalMarks / maxPossible) * 100;
    
    return {
      totalMarks,
      percentage: parseFloat(percentage.toFixed(1))
    };
  };

  // Format data based on selected option
  const getOptionData = (option: AnalysisOptionType) => {
    switch (option) {
      case 'topperList':
        return getDisplayedToppers();
      case 'averageMarks':
        return getAverageChart();
      case 'subjectToppers':
        return getSubjectToppers();
      case 'passPercentage':
        return getPassPercentageChart();
      default:
        return [];
    }
  };

  // Handle which chart/table to render based on selected option
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
              <Tooltip />
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
              <YAxis />
              <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }} />
              <Legend />
              <Bar name="Marks" dataKey="marks" fill="#8B5CF6" />
              <Bar name="Percentage" dataKey="percentage" fill="#D946EF" />
            </BarChart>
          </ResponsiveContainer>
        );
      } else if (option === 'averageMarks') {
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={optionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }} />
              <Legend />
              <Bar name="Average Score" dataKey="average" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        );
      } else if (option === 'topperList') {
        const displayedToppers = getDisplayedToppers().slice(0, 15); // Display up to 15 in the chart
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={displayedToppers}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} interval={0} />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }} />
              <Legend />
              <Bar yAxisId="left" name="Total Marks" dataKey="total" fill="#8884d8" />
              <Bar yAxisId="right" name="Percentage" dataKey="percentage" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        );
      }
    } else if (format === 'table') {
      if (option === 'passPercentage') {
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
              {optionData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.value}</TableCell>
                  <TableCell>{((item.value / data.students.length) * 100).toFixed(1)}%</TableCell>
                </TableRow>
              ))}
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
                <TableHead>Subject</TableHead>
                <TableHead>Average Score</TableHead>
                <TableHead>Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {optionData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.subject}</TableCell>
                  <TableCell>{item.average}</TableCell>
                  <TableCell>{((item.average / 50) * 100).toFixed(1)}%</TableCell>
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
    
    // Default text format for any option
    return (
      <div className="p-4 whitespace-pre-wrap bg-muted/30 rounded-md">
        {JSON.stringify(optionData, null, 2)}
      </div>
    );
  };

  // Add the All Students component
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
                  const stats = calculateStudentStats(student);
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      {data.subjects.map(subject => (
                        <TableCell key={subject}>{student[subject]}</TableCell>
                      ))}
                      <TableCell className="font-bold">{stats.totalMarks}</TableCell>
                      <TableCell>{stats.percentage}%</TableCell>
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
                  
                  {Array.from({length: totalStudentPages}, (_, i) => i + 1).map(page => (
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
      </div>

      <Tabs defaultValue="chart" value={activeFormat} onValueChange={setActiveFormat}>
        <div className="flex justify-between items-center mb-4">
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
          
          <div className="flex space-x-2">
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
          </div>
        </div>

        {selectedOptions.map((option) => (
          <div key={option} className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gradient-brand">
              {option === 'topperList' && 'Topper List'}
              {option === 'averageMarks' && 'Average Marks'}
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
        
        {/* Always show All Students section */}
        {renderAllStudents()}

        <div className="flex justify-end mt-4">
          <Button 
            onClick={() => handleExport('all')} 
            className="bg-gradient-brand hover:opacity-90"
          >
            <Download className="h-4 w-4 mr-2" /> Download All Results
          </Button>
        </div>
      </Tabs>
    </Card>
  );
};

export default ResultsDisplay;
