
import { Student, AnalysisResult } from "./imageAnalysis";

export interface TopperListResult {
  name: string;
  total: number;
  average: number;
  percentage: number;
}

export interface SubjectTopperResult {
  subject: string;
  topperName: string;
  marks: number;
  percentage: number;
}

export const generateTopperList = (data: AnalysisResult): TopperListResult[] => {
  return data.students
    .map(student => {
      const subjects = Object.keys(student).filter(key => key !== 'name');
      const total = subjects.reduce((sum, subject) => sum + (student[subject] as number), 0);
      const maxPossibleMarks = subjects.length * 50; // Assuming max marks per subject is 50
      const percentage = (total / maxPossibleMarks) * 100;
      
      return {
        name: student.name as string,
        total,
        average: parseFloat((total / subjects.length).toFixed(2)),
        percentage: parseFloat(percentage.toFixed(1))
      };
    })
    .sort((a, b) => b.total - a.total);
};

export const generateSubjectToppers = (data: AnalysisResult): SubjectTopperResult[] => {
  return data.subjects.map(subject => {
    const topStudent = [...data.students].sort(
      (a, b) => (b[subject] as number) - (a[subject] as number)
    )[0];
    
    const marks = topStudent[subject] as number;
    const percentage = (marks / 50) * 100; // Assuming max marks per subject is 50
    
    return {
      subject,
      topperName: topStudent.name as string,
      marks,
      percentage: parseFloat(percentage.toFixed(1))
    };
  });
};

export const generateAverageMarks = (data: AnalysisResult): { subject: string; average: number; percentage: number }[] => {
  return data.subjects.map(subject => {
    const total = data.students.reduce((sum, student) => sum + (student[subject] as number), 0);
    const average = parseFloat((total / data.students.length).toFixed(2));
    const percentage = (average / 50) * 100; // Assuming max marks per subject is 50
    
    return {
      subject,
      average,
      percentage: parseFloat(percentage.toFixed(1))
    };
  });
};

// Calculate individual student stats with percentage
export const calculateStudentStats = (student: Student, subjects: string[]): { totalMarks: number; percentage: number } => {
  const totalMarks = subjects.reduce((sum, subject) => sum + (student[subject] as number), 0);
  const maxPossible = subjects.length * 50; // Assuming each subject is out of 50
  const percentage = (totalMarks / maxPossible) * 100;
  
  return {
    totalMarks,
    percentage: parseFloat(percentage.toFixed(1))
  };
};
