
import { Student, AnalysisResult } from "./imageAnalysis";

export interface TopperListResult {
  name: string;
  total: number;
  average: number;
}

export interface SubjectTopperResult {
  subject: string;
  topperName: string;
  marks: number;
}

export const generateTopperList = (data: AnalysisResult): TopperListResult[] => {
  return data.students
    .map(student => {
      const subjects = Object.keys(student).filter(key => key !== 'name');
      const total = subjects.reduce((sum, subject) => sum + (student[subject] as number), 0);
      return {
        name: student.name as string,
        total,
        average: parseFloat((total / subjects.length).toFixed(2))
      };
    })
    .sort((a, b) => b.total - a.total);
};

export const generateSubjectToppers = (data: AnalysisResult): SubjectTopperResult[] => {
  return data.subjects.map(subject => {
    const topStudent = [...data.students].sort(
      (a, b) => (b[subject] as number) - (a[subject] as number)
    )[0];
    
    return {
      subject,
      topperName: topStudent.name as string,
      marks: topStudent[subject] as number
    };
  });
};

export const generateAverageMarks = (data: AnalysisResult): { subject: string; average: number }[] => {
  return data.subjects.map(subject => {
    const total = data.students.reduce((sum, student) => sum + (student[subject] as number), 0);
    return {
      subject,
      average: parseFloat((total / data.students.length).toFixed(2))
    };
  });
};

// More formatting utility functions would be added here in a real app
