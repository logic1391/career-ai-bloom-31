# Master Prompt — AI-Powered Resume Analyzer & Interview Preparation Platform

## Context and Role

You are a Machine Learning Engineer and Full-Stack AI Developer with expertise in creating intelligent career platforms, tasked with designing and building a production-grade AI-Powered Resume Analyzer & Interview Preparation Platform.

The platform should utilize cutting-edge AI/ML algorithms, Natural Language Processing (NLP), Large Language Models (LLMs), vector search systems, and scalable cloud architecture to provide customized resume analysis, ATS optimization, interview preparation, and career recommendations.

The system should be seamless, responsive, AI-powered, and scalable, with the added emphasis on security and accessibility, and production-ready.

The platform should provide a smart workflow to the user that:

* Analyzes uploaded resumes
Gets structured resume data.
Analyzes resumes and job descriptions
* Calculates scores for backward compatibility with ATSs
Asks artificial intelligence to create interview questions
Identifies skills and enhancements that could be missing
Suggests individual learning plans
Occasionally tracks users' progress and analytics

Further, the platform should feature secure authentication, cloud file management, JSON schema responses, observability capabilities, and scalable deployment architecture.

---

# Objective

Create a full fledged AI-powered career support application that:

Resumes uploaded in PDF/DOCX are processed.
Using NLP, extracts structured candidate information
Conducts an ATS compatibility analysis
Assigns a match with a job description
* Generates AI-generated interview preparation material
Proposes additional skills and career enhancements
* Supports individual learning goals
Provides recruiter and candidate dashboards
* Ensures secure authentication & authorization
Stores Analytics and User Activity securely
- Supports scalable ML inference and vector search pipelines

---

# Core AI/ML Requirements

## Resume Parsing Engine

Build an intelligent pipeline for parsing resumes that:

* Extracts:

  * Name
  * Email
  * Phone Number
  * Skills
  * Experience
  * Education
  * Certifications
  * Projects
  * Achievements
* Supports:

  * PDF resumes
  * DOCX resumes
  OCR Resumes with images
* Supports different types of resumes and resume formats.
Applies text normalization and preprocessing
Uses NLP pipelines for entity recognition

The extraction system must:

Accept and ignore malformed resumes gracefully.
Keep high parsing accuracy
Support multilingual resume parsing (optional)

---

## ATS Score Analyzer

Use an ATS (Applicant Tracking System) scoring engine that:

Compares resumes to job advertisements or job descriptions
* Calculates:

  * Keyword match percentage
  * Skill alignment score
  * Experience relevance score
  * Education relevance score
  * Semantic similarity score
This is a similarity search using embedding.
* Highlights:

  * Missing keywords
  * Missing skills
  * Weak sections
  * Formatting issues
* Offers optimized ideas that are actionable

The ATS engine should:

Match the text by semantics using NLP.
Use caution not to use a simple keyword-stuffing logic.
Support dynamic weighting for various job roles

---

## AI Interview Preparation System

Create an AI-based interview preparation platform that:

* Generates:

  * Technical interview questions
  * Behavioral interview questions
  * HR interview questions
  * Project-based questions
* Personalizes questions using:

  * Resume content
  * Job description
  * Candidate experience level
  * Target job role
* Generates:

  * Sample answers
  * Improvement suggestions
  * Follow-up questions
* Supports:

  * Mock interview sessions
  * Real-time AI feedback
  * Voice interaction (optional)

---

## Recommendation Engine

The recommendation system should:

* Suggest:

  * Missing technical skills
  * Relevant certifications
  * Learning resources
  * Career roadmap recommendations
* Use:

  * Collaborative filtering
  * Embedding similarity
  * LLM-powered reasoning
* Coordinate career development initiatives and create individualized career development plans.

---

The requirements of vector search and retrieval.

Adopt an appropriate vector database system that:

* Stores:

  * Resume embeddings
  * Job description embeddings
  * Skill embeddings
  * Interview question embeddings
* Supports:

  * Semantic similarity search
  * Retrieval-Augmented Generation (RAG)
  * Fast nearest-neighbor retrieval
* Optimizes:

  * Low-latency querying
  * Embedding indexing
  * Scalable retrieval pipelines

---

# Frontend Requirements

## UI/UX Requirements

The platform is to have:

* Modern responsive dashboard
Animations and interactions for transitions
* AI-generated insights panels
Visualization of the interactive ATS score is available.
* Resume upload workflow
* Interview preparation dashboard
* Learning roadmap visualization
* User analytics dashboard

The UI must:

* Be fully responsive
* Support mobile/tablet/desktop
* Follow accessibility standards
Ensure that semantic HTML and ARIA labels are used.
* Ensure an optimal user experience when it comes to performance.

---

## Resume Upload Workflow

It is required that users be able to:

* Upload resumes securely
* Drag-and-drop files
* Preview uploaded resumes
Search for structured data on the web.Search on the Web for Structured data.
Get the analysis feedback in real time.

Supported formats:

* PDF
* DOCX
The format is PNG/JPG, with the ability to support OCR (opt-in).

---

## Visualization Requirements

The following should be included on the dashboard:

* ATS score charts
* Skill match graphs
* Interview readiness metrics
* Learning progress indicators
Start analysis of the quality of the resumes again.Re-establish the quality analysis visualizations.

Apply smooth animation and interactive visual narration appropriately.

---

# Backend Requirements

Realize scalable backend services that:

* Handle resume uploads
AI inference pipelines are triggered by the input.The input triggers AI inference pipelines.
* Manage ATS scoring
* Generate interview questions
* Store user analytics
Completely support vector search queries.Support vector search queries completely!
103. Manage authentication and authorization.
* Add a support feature to return structured JSON responses.

The backend must:

Design in a modular and scalable way
* Support asynchronous processing
* Use API versioning
Support high concurrent traffic.

---

# Authentication and Authorization

Use secure authentication with:

* JWT-based authentication
* OAuth login support
* Session management
* Role-based access control

Supported roles:

* Candidate
* Recruiter
* Admin

Security requirements:

* Password hashing
* Secure token storage
* Rate limiting
* CSRF protection
* Secure API validation

---

# Database Requirements

The platform has to be able to store securely:

* User profiles
* Resume metadata
* ATS scores
* Interview history
* Learning recommendations
* Analytics
* Job descriptions
* Activity logs

The Database architecture should:

* Support scalability
* Optimize query performance
* Maintain relational integrity
Where appropriate, use support vector indexing.

---

# AI Model Requirements

The ML system should support:

* Transformer-based NLP models
* Embedding generation
Named Entity Recognition (NER)
* Text classification
* Semantic similarity models
* Retrieval-Augmented Generation (RAG)

The system should:

* Optimize inference latency
* Support model versioning
* Enable fine-tuning pipelines
* Support GPU acceleration

---

# Data Processing Requirements

All input to the user should be:

* Sanitized
* Validated
* Escaped properly

Prevent:

* XSS attacks
* Injection attacks
* File upload exploits
* Malicious prompt injections

The platform must:

* Validate file formats
Limit the size of uploads
Store securely

---

# API Requirements

The API system should include:

* Structured JSON responses
Avoid using odd HTTP status codes.Do not use strange HTTP status codes.
* Centralized error handling
* Authentication middleware
* Logging middleware
* Rate limiting

API endpoints should have:

* Resume Upload API
* ATS Analysis API
* Interview Question API
* Recommendation API
* Authentication API
* Analytics API

---

# Performance Optimization Requirements

The platform must:

Add a new Asset Optimization feature that reduces bundle sizes in the frontend.
* Lazy-load heavy components
* Use caching mechanisms
* Optimize database queries
* Reduce inference latency
* Create and use a CDN-based approach for delivering assets
Handle heavy AI processes with background job queues

The AI pipeline should:

* Support batching
* Use asynchronous inference
* Optimize embedding generation
* Prevent API bottlenecks

---

# Scalability Requirements

The system architecture should:

* Support microservices architecture
* Enable horizontal scaling
* Use containerized deployment
Support distributed inference systems
Resist high traffic loads
- Have a low response latency

---

# Observability and Monitoring

Set up monitoring systems for:

* API performance
* AI inference latency
* Error tracking
* System health
* Database performance
* User analytics

The platform should:

* Maintain structured logs
* Alert on errors
Gain a centralized view of monitoring dashboards

---

# Error Handling Requirements

Handle gracefully:

* Invalid file uploads
* Resume parsing failures
* AI inference failures
* Vector search failures
* Authentication failures
* API timeouts
* Database connection failures

Provide:

* Structured error responses
* User-friendly frontend messages
The log file feature will be available in the backend to help with debugging.

---

# Deployment Requirements

The platform needs to be deployable via:

* Docker containers
* CI/CD pipelines
* Cloud-native infrastructure
* Environment variable configuration
* Secure secret management

The deploying targets could be:

* AWS
* GCP
* Azure
* Vercel
* Render
* Railway

---

# Documentation Requirements

Provide documentation for:

* Folder structure
* API architecture
* ML pipeline architecture
* Environment configuration
* Deployment setup
* Database schema
* Authentication flow
* Vector database setup
* Model training/inference setup

---

# Technology Stack

## Frontend

* React / Next.js
* TypeScript
* Tailwind CSS
* Framer Motion
* Shadcn UI

---

## Backend

* Node.js
Express.js / Next.js API Routes
* FastAPI (for ML inference services)
* Redis

---

## Machine Learning & NLP

* PyTorch
* TensorFlow
* Scikit-learn
* Hugging Face Transformers
* spaCy
* LangChain

---

## Vector Database

* Pinecone
* Weaviate
* FAISS

---

## Database

* PostgreSQL
* MongoDB

---

## Authentication

* NextAuth.js
* JWT
* OAuth 2.0

---

## File Processing

* PyPDF2
* pdfplumber
* Tesseract OCR

---

## DevOps & Deployment

* Docker
* Kubernetes
* AWS / GCP / Azure
* Vercel
* Render
* Railway

---

## Monitoring & Logging

* Prometheus
* Grafana
* Sentry

---

# Expected Output

The end system should deliver:

* Intelligent resume analysis
* Accurate ATS scoring
* AI-powered interview preparation
* Personalized career recommendations
Responsive and modern UI
* Secure authentication
* Scalable backend architecture
* Production-grade AI pipelines
In real time analysis and monitoring.
* High-performance semantic search
* Smooth user experience
* Production-ready deployment architecture
