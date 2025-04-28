
import { AnalysisResult } from "./imageAnalysis";
import { AnalysisOptionType } from "@/components/AnalysisOptions";
import { generateTopperList, generateAverageMarks, generateSubjectToppers, calculateStudentStats } from "./dataFormatting";

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
  selectedOptions.forEach(option => {
    switch (option) {
      case 'topperList':
        const toppers = generateTopperList(data);
        content += 'TOPPER LIST:\n';
        content += '-----------------\n';
        toppers.forEach((student, index) => {
          content += `${index + 1}. ${student.name}: ${student.total} (${student.average.toFixed(2)} average, ${student.percentage}%)\n`;
        });
        content += '\n';
        break;
        
      case 'averageMarks':
        const averages = generateAverageMarks(data);
        content += 'AVERAGE MARKS BY SUBJECT:\n';
        content += '-----------------\n';
        averages.forEach(item => {
          content += `${item.subject}: ${item.average.toFixed(2)} (${item.percentage}%)\n`;
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
