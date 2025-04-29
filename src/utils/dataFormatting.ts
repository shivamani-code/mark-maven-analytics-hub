
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

export interface StudentStatsResult {
  name: string;
  subjects: Record<string, number>;
  totalMarks: number;
  percentage: number;
}

// Generate a sorted list of students by total marks (toppers first)
export const generateTopperList = (data: AnalysisResult, maxMarksPerSubject: number = 50): TopperListResult[] => {
  if (!data || !data.students || data.students.length === 0) {
    console.error("Invalid data provided to generateTopperList");
    return [];
  }

  return data.students
    .map(student => {
      const subjects = data.subjects;
      const total = subjects.reduce((sum, subject) => {
        const mark = student[subject];
        return sum + (typeof mark === 'number' ? mark : 0);
      }, 0);
      
      const maxPossibleMarks = subjects.length * maxMarksPerSubject;
      const percentage = maxPossibleMarks > 0 ? (total / maxPossibleMarks) * 100 : 0;
      
      return {
        name: student.name as string,
        total,
        average: parseFloat((total / (subjects.length || 1)).toFixed(2)),
        percentage: parseFloat(percentage.toFixed(1))
      };
    })
    .sort((a, b) => b.total - a.total);
};

// Generate a list of subject toppers
export const generateSubjectToppers = (data: AnalysisResult, maxMarksPerSubject: number = 50): SubjectTopperResult[] => {
  if (!data || !data.subjects || data.subjects.length === 0 || !data.students || data.students.length === 0) {
    console.error("Invalid data provided to generateSubjectToppers");
    return [];
  }

  return data.subjects.map(subject => {
    // Find the student with the highest mark in this subject
    const topStudent = [...data.students].sort((a, b) => {
      const markA = a[subject];
      const markB = b[subject];
      const numA = typeof markA === 'number' ? markA : 0;
      const numB = typeof markB === 'number' ? markB : 0;
      return numB - numA;
    })[0];
    
    const marks = typeof topStudent[subject] === 'number' ? topStudent[subject] as number : 0;
    const percentage = maxMarksPerSubject > 0 ? (marks / maxMarksPerSubject) * 100 : 0;
    
    return {
      subject,
      topperName: topStudent.name as string,
      marks,
      percentage: parseFloat(percentage.toFixed(1))
    };
  });
};

// Calculate average marks for each subject
export const generateAverageMarks = (data: AnalysisResult, maxMarksPerSubject: number = 50): { subject: string; average: number; percentage: number }[] => {
  if (!data || !data.subjects || data.subjects.length === 0 || !data.students || data.students.length === 0) {
    console.error("Invalid data provided to generateAverageMarks");
    return [];
  }

  return data.subjects.map(subject => {
    const total = data.students.reduce((sum, student) => {
      const mark = student[subject];
      return sum + (typeof mark === 'number' ? mark : 0);
    }, 0);
    
    const average = total / data.students.length;
    const percentage = maxMarksPerSubject > 0 ? (average / maxMarksPerSubject) * 100 : 0;
    
    return {
      subject,
      average: parseFloat(average.toFixed(2)),
      percentage: parseFloat(percentage.toFixed(1))
    };
  });
};

// Calculate individual student stats with percentage
export const calculateStudentStats = (student: Student, subjects: string[], maxMarksPerSubject: number = 50): { totalMarks: number; percentage: number } => {
  if (!student || !subjects || subjects.length === 0) {
    console.error("Invalid data provided to calculateStudentStats");
    return { totalMarks: 0, percentage: 0 };
  }

  const totalMarks = subjects.reduce((sum, subject) => {
    const mark = student[subject];
    return sum + (typeof mark === 'number' ? mark : 0);
  }, 0);
  
  const maxPossible = subjects.length * maxMarksPerSubject;
  const percentage = maxPossible > 0 ? (totalMarks / maxPossible) * 100 : 0;
  
  return {
    totalMarks,
    percentage: parseFloat(percentage.toFixed(1))
  };
};

// Generate comprehensive student statistics for all students
export const generateAllStudentsStats = (data: AnalysisResult, maxMarksPerSubject: number = 50): StudentStatsResult[] => {
  if (!data || !data.students || data.students.length === 0 || !data.subjects || data.subjects.length === 0) {
    console.error("Invalid data provided to generateAllStudentsStats");
    return [];
  }

  return data.students.map(student => {
    const stats = calculateStudentStats(student, data.subjects, maxMarksPerSubject);
    
    // Create a subjects record from the student object
    const subjectData: Record<string, number> = {};
    data.subjects.forEach(subject => {
      const mark = student[subject];
      subjectData[subject] = typeof mark === 'number' ? mark : 0;
    });
    
    return {
      name: student.name as string,
      subjects: subjectData,
      totalMarks: stats.totalMarks,
      percentage: stats.percentage
    };
  }).sort((a, b) => b.totalMarks - a.totalMarks); // Sort by total marks
};
