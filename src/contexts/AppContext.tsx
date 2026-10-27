import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

const API_BASE_URL = 'http://localhost:8000';
const API_KEY_STORAGE_KEY = 'everypage_pure_api_key';
const SESSION_ID_STORAGE_KEY = 'everypage_session_id';

export interface Job {
  job_id: string;
  document_name?: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  created_at: string;
  updated_at?: string;
  completed_at?: string;
  errors?: Array<{ code: string; message: string; context?: unknown }>;
  results?: JobResult;
}

export interface PageResult {
  page_number: number;
  status: string;
  data?: unknown;
  error_message?: string;
  raw_response?: string;
}

export interface JobResult {
  processing_summary: {
    total_pages: number;
    successful_pages: number;
    failed_pages: number;
  };
  pages: PageResult[];
}

export type OutputFormat = 'json' | 'text';

export interface PromptTemplate {
  task: string;
  format: OutputFormat;
  structure: string;
}

export const promptTemplates: Record<string, PromptTemplate> = {
  transcribe: {
    task: "Accurately transcribe all text content visible on page {page_number}. Preserve formatting like line breaks where appropriate.",
    format: "json",
    structure: `{\n  "transcription": "/* The full transcribed text from the page */"\n}`
  },
  summarize: {
    task: "Provide a concise summary of the main points and key takeaways visible on page {page_number}.",
    format: "json",
    structure: `{\n  "summary": "/* A brief overall summary of the page content */",\n  "key_points": [\n    "/* List of key takeaways or important pieces of information */"\n  ]\n}`
  },
  translate_es: {
    task: "Detect the source language and accurately translate all text content visible on page {page_number} to Spanish.",
    format: "json",
    structure: `{\n  "original_language": "/* The detected source language (e.g., English, French) */",\n  "spanish_translation": "/* The translated text in Spanish */"\n}`
  },
  translate_zh: {
    task: "Detect the source language and accurately translate all text content visible on page {page_number} to Chinese (Simplified).",
    format: "json",
    structure: `{\n  "original_language": "/* The detected source language */",\n  "chinese_translation": "/* The translated text in Chinese (Simplified) */"\n}`
  },
  qa: {
    task: "Analyze the document on page {page_number} and answer the following question: [***PLACE YOUR QUESTION HERE***]",
    format: "json",
    structure: `{\n  "question": "/* The specific question asked */",\n  "answer": "/* The answer found on the page, or null if not found */"\n}`
  },
  extract_entities: {
    task: "Identify and extract key named entities (like people, organizations, locations, dates) visible on page {page_number}. Include any relevant attributes found.",
    format: "json",
    structure: `{\n  "entities": [\n    {\n      "text": "/* The text of the identified entity */",\n      "type": "/* The type of entity (e.g., PERSON, ORG, LOC, DATE) */",\n      "...additional_attributes": "/* Extract any other relevant details found about this entity */"\n    }\n  ]\n}`
  }
};

interface AppContextType {
  // API Key
  apiKey: string;
  setApiKey: (key: string) => void;
  
  // Session ID
  sessionId: string;
  
  // Task Config
  taskDescription: string;
  setTaskDescription: (task: string) => void;
  outputFormat: OutputFormat;
  setOutputFormat: (format: OutputFormat) => void;
  outputStructure: string;
  setOutputStructure: (structure: string) => void;
  useMetaIntelligence: boolean;
  setUseMetaIntelligence: (use: boolean) => void;
  selectedTemplate: string;
  setSelectedTemplate: (template: string) => void;
  loadTemplate: (templateKey: string) => void;
  
  // Jobs
  jobs: Job[];
  isLoadingJobs: boolean;
  fetchJobs: () => Promise<void>;
  
  // Selected Job Details
  selectedJob: Job | null;
  isLoadingDetails: boolean;
  fetchJobDetails: (jobId: string) => Promise<void>;
  clearSelectedJob: () => void;
  
  // Upload
  submitDocument: (file: File) => Promise<{ success: boolean; jobId?: string; error?: string }>;
  
  // Download helpers
  downloadJobJson: () => void;
  downloadJobCsv: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

// Generate a unique session ID
function generateSessionId(): string {
  const timestamp = new Date().getTime();
  const randomPart = Math.random().toString(36).substring(2, 15);
  return `session_${timestamp}_${randomPart}`;
}

function getOrCreateSessionId(): string {
  let sessionId = localStorage.getItem(SESSION_ID_STORAGE_KEY);
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem(SESSION_ID_STORAGE_KEY, sessionId);
    console.log('New session ID generated:', sessionId);
  }
  return sessionId;
}

function escapeHtml(unsafe: string | null | undefined): string {
  if (unsafe === null || typeof unsafe === 'undefined') return '';
  return unsafe
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function AppProvider({ children }: { children: ReactNode }) {
  // Session ID (stable across page reloads)
  const [sessionId] = useState(() => getOrCreateSessionId());
  
  // API Key state
  const [apiKey, setApiKeyState] = useState(() => {
    return sessionStorage.getItem(API_KEY_STORAGE_KEY) || '';
  });
  
  // Task config state
  const [taskDescription, setTaskDescription] = useState('');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('json');
  const [outputStructure, setOutputStructure] = useState('');
  const [useMetaIntelligence, setUseMetaIntelligence] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  
  // Jobs state
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  
  // Selected job details
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const setApiKey = useCallback((key: string) => {
    setApiKeyState(key);
    if (key) {
      sessionStorage.setItem(API_KEY_STORAGE_KEY, key);
    } else {
      sessionStorage.removeItem(API_KEY_STORAGE_KEY);
    }
  }, []);

  const loadTemplate = useCallback((templateKey: string) => {
    const template = promptTemplates[templateKey];
    if (template) {
      setTaskDescription(template.task);
      setOutputFormat(template.format);
      setOutputStructure(template.structure || '');
    } else if (templateKey === '') {
      // Clear fields when selecting empty option
      setTaskDescription('');
      setOutputStructure('');
      setOutputFormat('json');
    }
    setSelectedTemplate(templateKey);
  }, []);

  const fetchWithAuth = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    if (!apiKey) {
      throw new Error('API Key is required. Please enter it above and click "Save Key".');
    }

    const headers: HeadersInit = {
      'x-api-key': apiKey,
      'Accept': 'application/json',
      ...options.headers,
    };

    // Don't set Content-Type for FormData
    if (!(options.body instanceof FormData)) {
      (headers as Record<string, string>)['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorDetail = `HTTP error ${response.status}: ${response.statusText}`;
      try {
        const errorJson = await response.json();
        errorDetail = errorJson.detail || JSON.stringify(errorJson);
      } catch {
        // Response wasn't JSON
      }
      throw new Error(errorDetail);
    }

    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return response.json();
    }
    return { status: response.status, ok: response.ok };
  }, [apiKey]);

  const fetchJobs = useCallback(async () => {
    setIsLoadingJobs(true);
    try {
      const result = await fetchWithAuth(`/jobs/active?limit=50&session_id=${encodeURIComponent(sessionId)}`);
      setJobs(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      setJobs([]);
    } finally {
      setIsLoadingJobs(false);
    }
  }, [fetchWithAuth, sessionId]);

  const fetchJobDetails = useCallback(async (jobId: string) => {
    setIsLoadingDetails(true);
    try {
      const result = await fetchWithAuth(`/jobs/${jobId}`);
      setSelectedJob(result);
    } catch (error) {
      console.error('Failed to fetch job details:', error);
      setSelectedJob(null);
    } finally {
      setIsLoadingDetails(false);
    }
  }, [fetchWithAuth]);

  const clearSelectedJob = useCallback(() => {
    setSelectedJob(null);
  }, []);

  const constructPrompt = useCallback(() => {
    const task = taskDescription.trim();
    const structure = outputStructure.trim();
    
    let prompt = `<document_analysis>\n`;
    prompt += `  <system>\n    You are a highly precise document analysis AI. Your task is to analyze the provided document page image and execute the user's request accurately.\n  </system>\n`;
    prompt += `  <input>\n    <image_data>Content of Page {page_number}</image_data>\n`;
    prompt += `    <task>${escapeHtml(task) || "/* User task description was empty */"}</task>\n`;
    prompt += `  </input>\n`;
    prompt += `  <output_specification>\n`;
    prompt += `    <format>${outputFormat === 'json' ? 'JSON' : 'Plain Text'}</format>\n`;
    
    if (outputFormat === 'json') {
      prompt += '    <description>The output MUST be a single, valid JSON object conforming to the structure below.</description>\n';
      if (structure) {
        prompt += `    <structure description="Adhere strictly to this JSON structure. Field descriptions provide semantic guidance.">\n${escapeHtml(structure)}\n    </structure>\n`;
      } else {
        prompt += `    <structure description="No specific structure provided. Generate a logical JSON structure based on the task."/>\n`;
      }
    } else {
      prompt += `    <description>The output MUST be plain text, containing only the direct result of the task.</description>\n`;
    }
    
    prompt += `    <constraints>\n`;
    if (outputFormat === 'json') {
      prompt += `      <constraint priority="1">Output MUST be valid JSON, enclosed in triple backticks (\`\`\`json ... \`\`\`).</constraint>\n`;
      prompt += `      <constraint priority="2">Do NOT include any explanatory text, apologies, or introductory phrases before or after the JSON object.</constraint>\n`;
      if (structure) {
        prompt += `      <constraint priority="3">The JSON structure MUST strictly follow the example provided in the <structure> tag. Use the exact field names and data types implied by the example.</constraint>\n`;
        prompt += `      <constraint priority="4">Use the semantic descriptions within the structure comments (/* ... */) to guide data extraction and content generation.</constraint>\n`;
      }
      prompt += `      <constraint>If specific information requested in the structure cannot be found on the page, use \`null\` for the corresponding JSON field value.</constraint>\n`;
    } else {
      prompt += `      <constraint priority="1">Output MUST be plain text only.</constraint>\n`;
      prompt += `      <constraint priority="2">Do NOT include any formatting (like markdown), explanations, or introductory phrases.</constraint>\n`;
    }
    prompt += `      <constraint>Base the response SOLELY on the content visible on the provided page image.</constraint>\n`;
    prompt += `    </constraints>\n`;
    prompt += `  </output_specification>\n`;
    prompt += `</document_analysis>`;
    
    return prompt;
  }, [taskDescription, outputFormat, outputStructure]);

  const submitDocument = useCallback(async (file: File) => {
    if (!taskDescription.trim()) {
      return { success: false, error: 'Please provide a task description.' };
    }
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_prompt', constructPrompt());
    formData.append('output_format', outputFormat);
    formData.append('use_meta_intelligence', useMetaIntelligence ? 'true' : 'false');
    formData.append('session_id', sessionId);

    try {
      const result = await fetchWithAuth('/scan', {
        method: 'POST',
        body: formData,
      });
      
      // Refresh job queue after submission
      await fetchJobs();
      
      if (result && result.job_id) {
        // Auto-select the new job
        fetchJobDetails(result.job_id);
        return { success: true, jobId: result.job_id };
      }
      
      return { success: false, error: 'Upload successful but no job ID returned.' };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }, [fetchWithAuth, constructPrompt, fetchJobs, fetchJobDetails, outputFormat, useMetaIntelligence, sessionId, taskDescription]);

  const downloadJobJson = useCallback(() => {
    if (!selectedJob || !selectedJob.results) {
      alert("No completed job data available to download.");
      return;
    }
    const jsonData = JSON.stringify(selectedJob.results, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedJob.job_id}_results.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [selectedJob]);

  const downloadJobCsv = useCallback(() => {
    if (!selectedJob?.results?.pages) {
      alert("No completed page data available to download as CSV.");
      return;
    }
    
    const pages = selectedJob.results.pages;
    let csvContent = "page_number,status,error_message";
    let headersSet = false;
    const pageDataRows: string[] = [];

    pages.forEach(page => {
      const baseRow = [
        page.page_number.toString(),
        page.status,
        `"${(page.error_message || '').replace(/"/g, '""')}"`
      ];
      
      if (page.data && typeof page.data === 'object') {
        if (!headersSet) {
          Object.keys(page.data as Record<string, unknown>).forEach(key => csvContent += `,${key}`);
          csvContent += "\n";
          headersSet = true;
        }
        const dataValues = Object.keys(page.data as Record<string, unknown>).map(key => {
          const value = (page.data as Record<string, unknown>)[key];
          const formattedValue = (typeof value === 'object' && value !== null)
            ? JSON.stringify(value).replace(/"/g, '""')
            : ((value as string) || '').toString().replace(/"/g, '""');
          return `"${formattedValue}"`;
        });
        pageDataRows.push(baseRow.concat(dataValues).join(','));
      } else if (page.data && typeof page.data === 'string') {
        if (!headersSet) {
          csvContent += ",result_text\n";
          headersSet = true;
        }
        pageDataRows.push(baseRow.concat([`"${page.data.replace(/"/g, '""')}"`]).join(','));
      } else {
        if (!headersSet) { csvContent += "\n"; headersSet = true; }
        pageDataRows.push(baseRow.join(','));
      }
    });

    csvContent += pageDataRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedJob.job_id}_results.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [selectedJob]);

  return (
    <AppContext.Provider value={{
      apiKey,
      setApiKey,
      sessionId,
      taskDescription,
      setTaskDescription,
      outputFormat,
      setOutputFormat,
      outputStructure,
      setOutputStructure,
      useMetaIntelligence,
      setUseMetaIntelligence,
      selectedTemplate,
      setSelectedTemplate,
      loadTemplate,
      jobs,
      isLoadingJobs,
      fetchJobs,
      selectedJob,
      isLoadingDetails,
      fetchJobDetails,
      clearSelectedJob,
      submitDocument,
      downloadJobJson,
      downloadJobCsv,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
