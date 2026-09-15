# 📊 Mark Maven Analytics Hub

**Mark Maven Analytics Hub** is a web-based academic performance analytics platform designed to turn student mark-sheet data into useful rankings, statistics, and visual insights.

The application provides an interactive workflow for uploading one or more mark-sheet images, processing the resulting student data, calculating performance metrics, ranking students, identifying subject toppers, analyzing pass percentages, and presenting the results through charts, tables, and text-based reports.

> **Current implementation note:** The image-analysis layer currently uses deterministic mock data generated from uploaded image content. It is structured so that a real OCR/computer-vision/AI extraction service can be integrated later.

## ✨ Features

### 📷 Mark Sheet Upload

* Upload one or multiple mark-sheet images
* Drag-and-drop support
* Image preview before analysis
* Add additional mark sheets
* Remove individual images
* Clear all uploaded images
* Supports common image formats such as JPG, PNG, and GIF
* Sequential processing of multiple images

The uploader processes multiple images one at a time and merges their analysis results into a combined dataset.

### 📈 Student Performance Analytics

The application calculates and organizes:

* Total marks
* Average marks
* Percentage
* Pass/fail status
* Student rankings
* Class average
* Overall pass percentage
* Subject-wise performance
* Subject toppers

The analytics utilities centralize these calculations so the same dataset can be reused across different result views.

### 🏆 Topper Analysis

Students can be ranked according to their total marks.

The ranking system provides:

* Rank
* Student name
* Total marks
* Percentage
* Pass/fail status

Results can be displayed as a table or chart, with support for expanding the list beyond the initial top entries.

### 📚 Subject-Wise Analysis

The application can identify the highest-performing student for each subject and calculate their corresponding percentage.

This provides a simple way to identify subject-level academic leaders.

### ✅ Pass Percentage Analysis

The dashboard supports configurable passing thresholds.

Users can change:

* Maximum marks per subject
* Passing percentage

The application then recalculates student percentages and pass/fail status accordingly.

### 📊 Multiple Result Views

Analysis results can be presented in multiple formats:

**Charts**

* Visual student comparison
* Total marks and percentage visualization

**Tables**

* Ranked student information
* Marks
* Percentage
* Pass/fail status

**Text**

* Structured raw analysis output

The visualization layer uses Recharts for interactive data presentation.

### ⚙️ Configurable Maximum Marks

The application allows the user to define the maximum marks available for each subject.

For example:

```text
Maximum marks per subject: 50
```

The value is then used when calculating percentages and determining pass/fail status.

### 📑 Export

The project includes export functionality for analysis results.

Current export options include:

* PDF-style report generation
* CSV export for spreadsheet-compatible data
* Comprehensive analysis reports
* Student-level marks and percentage data

## 🧠 Analysis Architecture

The current analysis pipeline is intentionally separated from the user interface.

```text
Uploaded Image
      │
      ▼
Image Processing Layer
      │
      ▼
AnalysisResult
      │
      ├── Students
      ├── Subjects
      ├── Class Average
      └── Pass Percentage
      │
      ▼
Data Formatting Layer
      │
      ├── Student Ranking
      ├── Subject Toppers
      ├── Student Statistics
      └── Performance Metrics
      │
      ▼
Visualization Layer
      │
      ├── Charts
      ├── Tables
      └── Text
      │
      ▼
Export Layer
      ├── PDF
      └── CSV
```

The central `AnalysisResult` structure contains student records, subjects, class average, and pass percentage, making it possible to replace the current mock analysis engine with a real extraction backend without rewriting the entire UI.

## 🏗️ Project Structure

```text
mark-maven-analytics-hub/
│
├── public/
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
│
├── src/
│   │
│   ├── components/
│   │   ├── AnalysisOptions.tsx
│   │   ├── BackgroundAnimation.tsx
│   │   ├── CustomQueryInput.tsx
│   │   ├── Header.tsx
│   │   ├── ImageUploader.tsx
│   │   ├── PassPercentageConfig.tsx
│   │   ├── ResultsDisplay.tsx
│   │   │
│   │   ├── results/
│   │   │   ├── ExportControls.tsx
│   │   │   ├── PassPercentageResults.tsx
│   │   │   ├── ResultSection.tsx
│   │   │   ├── StudentsTable.tsx
│   │   │   ├── SubjectToppersResults.tsx
│   │   │   └── TopperListResults.tsx
│   │   │
│   │   └── ui/
│   │       └── reusable shadcn/Radix components
│   │
│   ├── pages/
│   │   ├── Index.tsx
│   │   └── NotFound.tsx
│   │
│   ├── utils/
│   │   ├── imageAnalysis.ts
│   │   ├── dataFormatting.ts
│   │   └── exportUtils.ts
│   │
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
│
├── components.json
├── eslint.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.*
├── tsconfig.*
└── vite.config.*
```

## 🔄 Application Flow

The main page coordinates the major components:

```text
Header
   │
   ▼
ImageUploader
   │
   ▼
AnalysisResult
   │
   ▼
AnalysisOptions
   │
   ▼
ResultsDisplay
   │
   ├── Charts
   ├── Tables
   └── Text
```

The main `Index` page stores the current analysis data and maximum-marks configuration and passes the information into the relevant components.

## 🛠️ Technology Stack

| Technology      | Purpose                           |
| --------------- | --------------------------------- |
| React           | Frontend UI                       |
| TypeScript      | Type-safe application development |
| Vite            | Development and build tooling     |
| Tailwind CSS    | Styling                           |
| shadcn/ui       | UI components                     |
| Radix UI        | Accessible component primitives   |
| Recharts        | Data visualization                |
| React Router    | Application routing               |
| TanStack Query  | Client-side query infrastructure  |
| React Hook Form | Form handling                     |
| Zod             | Validation                        |
| Lucide React    | Icons                             |

The dependency configuration confirms the project is centered around React, TypeScript, Vite, Tailwind, shadcn/Radix, Recharts and supporting frontend libraries.

## 🚀 Getting Started

### Clone the repository

```bash
git clone https://github.com/shivamani-code/mark-maven-analytics-hub.git
cd mark-maven-analytics-hub
```

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Run linting

```bash
npm run lint
```

### Preview production build

```bash
npm run preview
```

These scripts are defined in the project's `package.json`.

## 🎯 Design Goals

Mark Maven is designed around a simple idea:

> **Turn raw academic marks into actionable academic insights.**

Instead of manually calculating totals, percentages, rankings, toppers, and pass rates, the interface organizes those calculations into a single interactive workflow.

## 🔮 Future Development

The current architecture leaves room for several important upgrades:

### Real OCR / AI Extraction

Replace the mock image-analysis engine with a real pipeline using:

```text
Mark Sheet Image
      ↓
OCR
      ↓
Table / Layout Detection
      ↓
Student + Subject Extraction
      ↓
Data Validation
      ↓
Analytics Engine
```

### AI-Powered Queries

The project already contains UI concepts for custom analysis queries. A future backend could support requests such as:

```text
Show students who scored above 90%
Find students at risk of failing
Which subject has the lowest class average?
Who improved the most?
```

### Backend Integration

A backend could provide:

* persistent student datasets
* authentication
* database storage
* institutional dashboards
* multi-user access
* historical performance tracking

### Advanced Analytics

Future versions could include:

* performance trends
* subject difficulty analysis
* student improvement tracking
* predictive performance
* attendance correlation
* semester comparisons
* class-to-class comparison

## ⚠️ Current Limitations

The most important current limitation is the image-analysis engine.

`imageAnalysis.ts` currently does **not extract marks from the uploaded image**. Instead, it generates deterministic mock student data based on a hash of the image content.

Therefore, the current project should be considered a **frontend analytics prototype / foundation for an AI mark-sheet analysis system**, rather than a production OCR system.

The export layer also currently generates CSV or text-based files rather than true native Excel workbooks and formatted PDF documents.

## 👨‍💻 Project

**Mark Maven Analytics Hub** is an academic analytics project focused on simplifying student performance analysis through an interactive web interface.

Built using modern frontend technologies with a modular architecture designed for future integration of real OCR, AI and backend analytics systems.
