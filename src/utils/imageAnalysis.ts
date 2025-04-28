// This file contains the AI image analysis logic
// In a real app, this would connect to a backend AI service

export interface Student {
  name: string;
  [subject: string]: number | string;
}

export interface AnalysisResult {
  students: Student[];
  subjects: string[];
  classAverage: number;
  passPercentage: number;
}

// Cache for previously analyzed images to avoid redundant processing
const analysisCache = new Map<string, AnalysisResult>();

/**
 * Analyzes a mark sheet image and extracts student data
 * In a real implementation, this would use computer vision AI to extract text and data
 * For now, this is a more advanced mock that uses the image data to "simulate" AI analysis
 */
export const analyzeImage = async (imageData: string): Promise<AnalysisResult> => {
  // Generate a more unique cache key based on image data
  const cacheKey = generateCacheKey(imageData);
  
  // Check if this image was already analyzed
  if (analysisCache.has(cacheKey)) {
    console.log("Using cached analysis results");
    return analysisCache.get(cacheKey)!;
  }

  // In a real app, this would send the image to an AI service
  return new Promise((resolve, reject) => {
    // Use setTimeout to simulate asynchronous processing without blocking the main thread
    setTimeout(() => {
      try {
        console.log("Processing new image data...");
        
        // Generate a hash value from the image data to create deterministic but different results
        // for different images
        const hashValue = generateSimpleHash(imageData);
        
        // Generate realistic mock data based on the mark sheet in the image
        // Use the hash value to create different but deterministic results for different images
        const result = generateMockData(hashValue);
        
        // Cache the result for future use
        analysisCache.set(cacheKey, result);
        
        resolve(result);
      } catch (error) {
        console.error("Error analyzing image:", error);
        reject(error);
      }
    }, 1000);
  });
};

// Generate a unique cache key for the image
const generateCacheKey = (imageData: string): string => {
  // Create a more unique identifier for the image
  // Take samples from different parts of the image data
  const dataLength = imageData.length;
  let key = '';
  
  // Sample at 10% intervals plus take first and last 10 chars for more uniqueness
  for (let i = 0; i < 10; i++) {
    const position = Math.floor(dataLength * (i / 10));
    key += imageData.charAt(position);
  }
  
  // Add beginning and end sequences to improve uniqueness
  key += imageData.substring(0, 10) + imageData.substring(dataLength - 10);
  
  return key;
};

// More efficient function to generate a hash-like number from a string
const generateSimpleHash = (str: string): number => {
  let hash = 0;
  const strLength = Math.min(str.length, 1000); // Process only first 1000 chars for performance
  
  for (let i = 0; i < strLength; i += 3) { // Sample every 3rd character for speed
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// Generate mock data with variations based on the hash value
const generateMockData = (hashValue: number): AnalysisResult => {
  // Use the hash to create deterministic but different data sets
  const subjects = ["ODYC", "E.CHE", "EDC", "BEE"];
  
  // Create a list of potential students
  const potentialStudents = [
    { name: "ALA VAMSHIKA", baseMarks: [35, 32.5, 28, 33] },
    { name: "AMANAGANTI SHIVA", baseMarks: [15, 26, 8, 24] },
    { name: "AMBATI DINEKAR", baseMarks: [9, 13.5, 9, 22] },
    { name: "APPAM VISHNUVARDHAN", baseMarks: [30, 24.5, 22, 31] },
    { name: "B BALAKRISHNA", baseMarks: [34.5, 31, 21, 26] },
    { name: "B SHIVA KUMAR", baseMarks: [33.5, 32.5, 25, 32] },
    { name: "BADRI SHIVA MANI", baseMarks: [31, 34.5, 28, 29.5] },
    { name: "BEKKAM JESHWANTH", baseMarks: [34.5, 30, 20, 19] },
    { name: "BELLALA USHASRI", baseMarks: [35, 29.5, 25, 32] },
    { name: "BUDUGA MEGHRAJ", baseMarks: [35, 34.5, 32, 33] },
    { name: "BURRAVENI HARSHA VARDHAN", baseMarks: [31, 32, 24, 29] },
    { name: "CHAKALI SAI SHILPA", baseMarks: [28.5, 31, 29, 28] },
    { name: "CHIMEKALA TEJASWINI", baseMarks: [34, 31.5, 29, 28] },
    { name: "CHINNI ARAVIND", baseMarks: [23.5, 31.5, 16, 25] },
    { name: "DHARMAWAR RAMAKANTH", baseMarks: [34, 32, 19, 29] },
    { name: "GOLLA HARSHINI", baseMarks: [36, 35, 29, 30] },
    { name: "JAKKULA RAJESHWAR", baseMarks: [32, 30, 25, 28] },
    { name: "KADARI MAHESH", baseMarks: [29, 31, 24, 27] },
    { name: "KAMPA POOJITHA", baseMarks: [37, 36, 32, 33] },
    { name: "KUNCHALA SRINIVAS", baseMarks: [31, 29, 23, 26] }
  ];
  
  // Use the hash to select and modify student data
  // This ensures different images give different but consistent results
  const numStudents = 15 + (hashValue % 6); // Between 15-20 students
  
  let students: Student[] = [];
  let totalMarks = 0;
  let totalSubjects = 0;
  let passingMarks = 0;
  
  // Create a shuffled order based on hash to randomize which students we take for each image
  const shuffledOrder = Array.from({length: potentialStudents.length}, (_, i) => i)
    .sort((a, b) => ((a * hashValue) % 100) - ((b * hashValue) % 100));
  
  // Select and modify student data
  for (let i = 0; i < numStudents; i++) {
    const studentIndex = shuffledOrder[i % shuffledOrder.length];
    const baseStudent = potentialStudents[studentIndex];
    
    // Create student with marks that vary based on hash
    const student: Student = { name: baseStudent.name };
    
    subjects.forEach((subject, index) => {
      // Add variation to base marks, but keep within 0-50 range
      // Use different parts of the hash for different subjects to ensure more variation
      const variationFactor = ((hashValue + (i * (index + 1))) % 11) - 5;
      let mark = Math.max(0, Math.min(50, baseStudent.baseMarks[index] + variationFactor));
      mark = Number(mark.toFixed(1)); // Format to one decimal place
      
      student[subject] = mark;
      
      totalMarks += mark;
      totalSubjects++;
      
      if (mark >= 20) {
        passingMarks++;
      }
    });
    
    students.push(student);
  }
  
  const classAverage = parseFloat((totalMarks / totalSubjects).toFixed(1));
  const passPercentage = parseFloat(((passingMarks / totalSubjects) * 100).toFixed(1));
  
  return {
    students,
    subjects,
    classAverage,
    passPercentage,
  };
};
