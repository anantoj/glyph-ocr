import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

const API_BASE_URL = 'https://everypage-pure.onrender.com';

export interface Job {
  job_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  filename?: string;
  created_at?: string;
  updated_at?: string;
  error_message?: string;
}

export interface PageResult {
  page_number: number;
  status: string;
  data?: unknown;
  error_message?: string;
  raw_response?: string;
}

export interface JobResult {
  job_id: string;
  processing_summary: {
    total_pages: number;
    successful_pages: number;
    failed_pages: number;
  };
  pages: PageResult[];
}

interface AppContextType {
  // API Key
  apiKey: string;
  setApiKey: (key: string) => void;
  
  // Task Config
  taskDescription: string;
  setTaskDescription: (task: string) => void;
  outputStructure: string;
  setOutputStructure: (structure: string) => void;
  
  // Jobs
  jobs: Job[];
  isLoadingJobs: boolean;
  fetchJobs: () => Promise<void>;
  
  // Selected Job Details
  selectedJob: JobResult | null;
  isLoadingDetails: boolean;
  fetchJobDetails: (jobId: string) => Promise<void>;
  clearSelectedJob: () => void;
  
  // Upload
  submitDocument: (file: File) => Promise<{ success: boolean; jobId?: string; error?: string }>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  // API Key state
  const [apiKey, setApiKeyState] = useState(() => {
    return sessionStorage.getItem('everypage_api_key') || 'demo-api-key-12345';
  });
  
  // Task config state
  const [taskDescription, setTaskDescription] = useState(
    'Extract all text content from each page and organize it into structured sections.'
  );
  const [outputStructure, setOutputStructure] = useState(
    '{"title": "...", "content": "...", "sections": ["..."]}'
  );
  
  // Jobs state
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  
  // Selected job details
  const [selectedJob, setSelectedJob] = useState<JobResult | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const setApiKey = useCallback((key: string) => {
    setApiKeyState(key);
    if (key) {
      sessionStorage.setItem('everypage_api_key', key);
    } else {
      sessionStorage.removeItem('everypage_api_key');
    }
  }, []);

  const fetchWithAuth = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    if (!apiKey) {
      throw new Error('API Key is required');
    }

    const headers: HeadersInit = {
      'x-resetdata-key': apiKey,
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
      const result = await fetchWithAuth('/jobs/active?limit=20');
      setJobs(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      setJobs([]);
    } finally {
      setIsLoadingJobs(false);
    }
  }, [fetchWithAuth]);

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
    let prompt = `<document_analysis>\n`;
    prompt += `  <system>\n    You are an advanced document analysis AI. Analyze the provided page image.\n  </system>\n`;
    prompt += `  <input>\n    <image_data>Current page image</image_data>\n`;
    prompt += `    <task>${taskDescription}</task>\n`;
    prompt += `  </input>\n`;
    prompt += `  <output_format>\n`;
    prompt += `    <format>JSON</format>\n`;
    if (outputStructure) {
      prompt += `    <structure>\n${outputStructure}\n    </structure>\n`;
    }
    prompt += `    <constraints>\n`;
    prompt += `      <constraint>Return ONLY valid JSON, starting with '{' and ending with '}'.</constraint>\n`;
    prompt += `      <constraint>Do not include any text, explanations, or markdown formatting before or after the JSON object.</constraint>\n`;
    if (outputStructure) {
      prompt += `      <constraint>The JSON structure MUST follow the example provided in the structure tag.</constraint>\n`;
    }
    prompt += `    </constraints>\n`;
    prompt += `  </output_format>\n`;
    prompt += `</document_analysis>`;
    return prompt;
  }, [taskDescription, outputStructure]);

  const submitDocument = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_prompt', constructPrompt());
    formData.append('output_format', 'json');

    try {
      const result = await fetchWithAuth('/scan', {
        method: 'POST',
        body: formData,
      });
      
      // Refresh job queue after submission
      await fetchJobs();
      
      return { success: true, jobId: result.job_id };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }, [fetchWithAuth, constructPrompt, fetchJobs]);

  return (
    <AppContext.Provider value={{
      apiKey,
      setApiKey,
      taskDescription,
      setTaskDescription,
      outputStructure,
      setOutputStructure,
      jobs,
      isLoadingJobs,
      fetchJobs,
      selectedJob,
      isLoadingDetails,
      fetchJobDetails,
      clearSelectedJob,
      submitDocument,
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
