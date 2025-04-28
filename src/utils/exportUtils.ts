
import { AnalysisResult } from "./imageAnalysis";
import { AnalysisOptionType } from "@/components/AnalysisOptions";
import { 
  generateTopperList, 
  generateAverageMarks, 
  generateSubjectToppers, 
  calculateStudentStats,
  generateAllStudentsStats
} from "./dataFormatting";

// Function to export data as PDF
export const exportAsPDF = (data: AnalysisResult, selectedOptions: AnalysisOptionType[], customQuery?: string) => {
  // In a real app, this would use a PDF generation library like jspdf
  // For this demo, we'll create a text representation and download it
  const content = generateTextContent(data, selectedOptions, customQuery);
  
  // Create a Blob and download it with a .pdf extension
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'mark-sheet-analysis.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Function to export data as Excel
export const exportAsExcel = (data: AnalysisResult, selectedOptions: AnalysisOptionType[], customQuery?: string) => {
  // In a real app, this would use an Excel generation library like xlsx
  // For this demo, we'll create a CSV and download it
  let content = '';
  
  // Add headers
  content += 'Mark Sheet Analysis Results\n\n';
  
  // Add class statistics
  content += 'Class Statistics:\n';
  content += `Class Average,${data.classAverage}\n`;
  content += `Pass Percentage,${data.passPercentage}%\n\n`;
  
  // Add student data
  content += 'Student Data:\n';
  
  // Add headers for student table
  const headers = ['Name', ...data.subjects, 'Total', 'Percentage'];
  content += headers.join(',') + '\n';
  
  // Add data for each student
  data.students.forEach(student => {
    const stats = calculateStudentStats(student, data.subjects);
    
    const row = [
      student.name,
      ...data.subjects.map(subject => student[subject]),
      stats.totalMarks,
      `${stats.percentage}%`
    ];
    content += row.join(',') + '\n';
  });
  
  // Create a Blob and download it with a .csv extension
  const blob = new Blob([content], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'mark-sheet-analysis.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Function to generate the text content for exports
const generateTextContent = (data: AnalysisResult, selectedOptions: AnalysisOptionType[], customQuery?: string): string => {
  let content = 'MARK SHEET ANALYSIS RESULTS\n\n';
  
  // Add overall statistics
  content += `Class Average: ${data.classAverage}\n`;
  content += `Pass Percentage: ${data.passPercentage}%\n\n`;
  
  // Add selected analyses
  if (selectedOptions.length > 0) {
    content += 'SELECTED ANALYSES:\n\n';
  }
  
  selectedOptions.forEach(option => {
    switch (option) {
      case 'topperList':
        const toppers = generateTopperList(data);
        content += 'TOPPER LIST:\n';
        content += '-----------------\n';
        toppers.forEach((student, index) => {
          content += `${index + 1}. ${student.name}: ${student.total} marks (${student.percentage}%)\n`;
        });
        content += '\n';
        break;
        
      case 'averageMarks':
        const studentStats = generateAllStudentsStats(data);
        content += 'ALL STUDENTS MARKS & PERCENTAGES:\n';
        content += '-----------------\n';
        studentStats.forEach((student, index) => {
          content += `${index + 1}. ${student.name}: ${student.totalMarks} marks (${student.percentage}%)\n`;
        });
        content += '\n';
        break;
        
      case 'subjectToppers':
        const subjectToppers = generateSubjectToppers(data);
        content += 'SUBJECT-WISE TOPPERS:\n';
        content += '-----------------\n';
        subjectToppers.forEach(item => {
          content += `${item.subject}: ${item.topperName} (${item.marks}, ${item.percentage}%)\n`;
        });
        content += '\n';
        break;
        
      case 'passPercentage':
        content += `PASS PERCENTAGE: ${data.passPercentage}%\n\n`;
        break;
        
      case 'custom':
        if (customQuery) {
          content += 'CUSTOM QUERY RESULTS:\n';
          content += '-----------------\n';
          content += `Query: "${customQuery}"\n`;
          content += 'In a production app, this would include the AI-generated response to your query.\n\n';
        }
        break;
    }
  });
  
  // Add all students' data
  content += 'ALL STUDENT DATA:\n';
  content += '-----------------\n';
  
  // Create header row with subjects
  let headerRow = 'Name';
  data.subjects.forEach(subject => {
    headerRow += `\t${subject}`;
  });
  headerRow += '\tTotal\tPercentage';
  content += headerRow + '\n';
  
  // Add each student's data with total and percentage
  data.students.forEach(student => {
    const stats = calculateStudentStats(student, data.subjects);
    
    let row = student.name;
    data.subjects.forEach(subject => {
      row += `\t${student[subject]}`;
    });
    row += `\t${stats.totalMarks}\t${stats.percentage}%`;
    content += row + '\n';
  });
  
  return content;
};

// Function to export all data in a comprehensive format
export const exportAllData = (data: AnalysisResult, selectedOptions: AnalysisOptionType[], customQuery?: string) => {
  // For the "Download All Results" button, we'll create a comprehensive text file
  const content = generateTextContent(data, selectedOptions, customQuery);
  
  // Create a Blob and download it
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'complete-mark-sheet-analysis.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// New function to export all data as a PDF with tables
export const exportAllDataAsPDF = (data: AnalysisResult, selectedOptions: AnalysisOptionType[], customQuery?: string) => {
  // In a real implementation, we would use a proper PDF library like jsPDF
  // with auto-table plugin to generate actual tables
  // For this demo, we'll create a structured text file that mimics table format
  
  let content = "==========================================\n";
  content += "           COMPREHENSIVE ANALYSIS REPORT           \n";
  content += "==========================================\n\n";
  
  // Add class summary
  content += "CLASS SUMMARY:\n";
  content += "----------------\n";
  content += `Class Average: ${data.classAverage}\n`;
  content += `Pass Percentage: ${data.passPercentage}%\n\n`;
  
  // Add all selected analyses in table format
  selectedOptions.forEach(option => {
    switch (option) {
      case 'topperList':
        const toppers = generateTopperList(data);
        content += "TOPPER LIST:\n";
        content += "----------------\n";
        content += "Rank | Name | Total Marks | Percentage\n";
        content += "----------------------------------------\n";
        toppers.forEach((student, index) => {
          content += `${index + 1} | ${student.name} | ${student.total} | ${student.percentage}%\n`;
        });
        content += "\n\n";
        break;
        
      case 'averageMarks':
        const studentStats = generateAllStudentsStats(data);
        content += "ALL STUDENTS MARKS & PERCENTAGES:\n";
        content += "----------------\n";
        content += "Rank | Name | Total Marks | Percentage\n";
        content += "----------------------------------------\n";
        studentStats.forEach((student, index) => {
          content += `${index + 1} | ${student.name} | ${student.totalMarks} | ${student.percentage}%\n`;
        });
        content += "\n\n";
        break;
        
      case 'subjectToppers':
        const subjectToppers = generateSubjectToppers(data);
        content += "SUBJECT-WISE TOPPERS:\n";
        content += "----------------\n";
        content += "Subject | Topper Name | Marks | Percentage\n";
        content += "----------------------------------------\n";
        subjectToppers.forEach(item => {
          content += `${item.subject} | ${item.topperName} | ${item.marks} | ${item.percentage}%\n`;
        });
        content += "\n\n";
        break;
        
      case 'passPercentage':
        content += "PASS PERCENTAGE:\n";
        content += "----------------\n";
        content += "Status | Count | Percentage\n";
        content += "----------------------------------------\n";
        const passCount = Math.round(data.students.length * (data.passPercentage / 100));
        const failCount = data.students.length - passCount;
        content += `Pass | ${passCount} | ${data.passPercentage}%\n`;
        content += `Fail | ${failCount} | ${(100 - data.passPercentage).toFixed(1)}%\n\n\n`;
        break;
        
      case 'custom':
        if (customQuery) {
          content += "CUSTOM QUERY RESULTS:\n";
          content += "----------------\n";
          content += `Query: "${customQuery}"\n`;
          content += "In a production app, this would include the AI-generated response to your query.\n\n\n";
        }
        break;
    }
  });
  
  // Always add complete student data table
  content += "COMPLETE STUDENT DATA:\n";
  content += "----------------\n";
  
  // Create header row with proper spacing for table-like format
  let headerRow = "Name";
  data.subjects.forEach(subject => {
    headerRow += ` | ${subject}`;
  });
  headerRow += " | Total | Percentage";
  content += headerRow + "\n";
  content += "-".repeat(headerRow.length) + "\n";
  
  // Add each student's data
  data.students.forEach(student => {
    const stats = calculateStudentStats(student, data.subjects);
    
    let row = student.name as string;
    data.subjects.forEach(subject => {
      row += ` | ${student[subject]}`;
    });
    row += ` | ${stats.totalMarks} | ${stats.percentage}%`;
    content += row + "\n";
  });
  
  // Create a Blob and download it with a .pdf extension
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'comprehensive-tables-analysis.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
