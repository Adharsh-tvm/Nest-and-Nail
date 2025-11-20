"use client"

import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  X, 
  LogOut, 
  Shield, 
  User, 
  Briefcase,
  Loader2,
  AlertCircle,
  LucideIcon,
  FileBadge
} from 'lucide-react';

// --- Types ---

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning';
}

interface FileData {
  name: string;
  size: string;
  status: string;
}

interface FilesState {
  idProof: FileData | null;
  photo: FileData | null;
  experienceCert: FileData | null; // Renamed from workPermit
}

type FileType = keyof FilesState;

// --- Mock UI Components (Simulating shadcn/ui) ---

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  disabled, 
  onClick, 
  type = 'button',
  ...props 
}) => {
  const baseStyle = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2";
  
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-emerald-600 text-zinc-50 shadow hover:bg-emerald-700",
    secondary: "bg-zinc-800 text-zinc-100 shadow-sm hover:bg-zinc-700 border border-zinc-700",
    ghost: "hover:bg-zinc-800 text-zinc-300 hover:text-white",
    destructive: "bg-red-900 text-red-100 hover:bg-red-800",
    outline: "border border-zinc-700 bg-transparent shadow-sm hover:bg-zinc-800 text-zinc-100"
  };

  return (
    <button 
      type={type}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`rounded-xl border border-zinc-800 bg-zinc-900/50 text-zinc-100 shadow ${className}`}>
    {children}
  </div>
);

const CardHeader: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle: React.FC<CardProps> = ({ children, className = '' }) => (
  <h3 className={`font-semibold leading-none tracking-tight text-emerald-500 ${className}`}>
    {children}
  </h3>
);

const CardDescription: React.FC<CardProps> = ({ children, className = '' }) => (
  <p className={`text-sm text-zinc-400 ${className}`}>
    {children}
  </p>
);

const CardContent: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

const CardFooter: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`flex items-center p-6 pt-0 ${className}`}>
    {children}
  </div>
);

// --- Main Application ---

export default function WorkerDocumentsPage() {
  const [files, setFiles] = useState<FilesState>({
    idProof: null,
    photo: null,
    experienceCert: null
  });
  const [experienceText, setExperienceText] = useState('');
  
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Simulating file input handling
  const handleFileChange = (type: FileType, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles(prev => ({
        ...prev,
        [type]: {
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
          status: 'ready'
        }
      }));
    }
  };

  const removeFile = (type: FileType) => {
    setFiles(prev => ({
      ...prev,
      [type]: null
    }));
  };

  const handleSubmit = async () => {
    setUploading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setUploading(false);
    setSuccess(true);
  };

  // Form is complete if ID and Photo are present, and Experience Text is filled. 
  // Experience Certificate is OPTIONAL.
  const isFormComplete = Boolean(files.idProof && files.photo && experienceText.trim().length > 0);

  // Calculate completion percentage based on required fields (3 items)
  const requiredFieldsCount = 3;
  const completedFields = [
    files.idProof, 
    files.photo, 
    experienceText.trim().length > 0
  ].filter(Boolean).length;
  
  const completionPercentage = (completedFields / requiredFieldsCount) * 100;

  // Upload Dropzone Component
  interface FileUploadZoneProps {
    label: string;
    subLabel?: string;
    type: FileType;
    icon: LucideIcon;
    currentFile: FileData | null;
    isOptional?: boolean;
  }

  const FileUploadZone: React.FC<FileUploadZoneProps> = ({ label, subLabel, type, icon: Icon, currentFile, isOptional }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-baseline">
          <label className="text-sm font-medium text-zinc-200 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
          {isOptional && <span className="text-xs text-zinc-500 uppercase tracking-wider">Optional</span>}
        </div>
        
        {!currentFile ? (
          <div 
            onClick={() => inputRef.current?.click()}
            className="group relative flex flex-col items-center justify-center w-full h-32 rounded-lg border-2 border-dashed border-zinc-700 hover:border-emerald-500/50 hover:bg-emerald-900/5 transition-all cursor-pointer bg-zinc-900/50"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <div className="p-2 rounded-full bg-zinc-800 group-hover:bg-emerald-900/20 transition-colors mb-3">
                <Icon className="w-6 h-6 text-zinc-400 group-hover:text-emerald-500" />
              </div>
              <p className="mb-1 text-sm text-zinc-400">
                <span className="font-semibold text-emerald-500">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-zinc-500">{subLabel || "SVG, PNG, JPG or PDF (MAX. 5MB)"}</p>
            </div>
            <input 
              ref={inputRef}
              type="file" 
              className="hidden" 
              onChange={(e) => handleFileChange(type, e)}
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-700 bg-zinc-900">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-emerald-900/20 text-emerald-500">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-200 truncate max-w-[200px]">{currentFile.name}</p>
                <p className="text-xs text-zinc-500">{currentFile.size}</p>
              </div>
            </div>
            <button 
              onClick={() => removeFile(type)}
              className="p-1 hover:bg-red-900/30 text-zinc-400 hover:text-red-400 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  };

  if (success) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-emerald-900/50 bg-zinc-900/80">
            <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-900/30 flex items-center justify-center mb-2">
                <CheckCircle className="w-10 h-10 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold text-white">Submission Received</h2>
              <p className="text-zinc-400">
                Your profile and documents have been successfully submitted. We will notify you once your worker profile is approved.
              </p>
              <Button className="w-full mt-4" variant="outline" onClick={() => setSuccess(false)}>
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500/30">
      <Header />

      <main className="flex-1 container mx-auto max-w-4xl px-4 py-8 md:py-12">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold text-white tracking-tight">Complete Profile</h1>
          <p className="text-zinc-400 text-lg">
            Upload required documents and add your experience to start accepting jobs.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column: Upload Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Card 1: Identity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Identity Verification
                </CardTitle>
                <CardDescription>
                  Official government issued ID and verification documents.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FileUploadZone 
                  label="Government ID / Passport" 
                  type="idProof" 
                  icon={Shield}
                  currentFile={files.idProof}
                />
                <div className="h-px bg-zinc-800 my-4" />
                <FileUploadZone 
                  label="Profile Photo" 
                  type="photo" 
                  icon={User}
                  currentFile={files.photo}
                />
              </CardContent>
            </Card>

            {/* Card 2: Professional Details (Modified) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Professional Experience
                </CardTitle>
                <CardDescription>
                  Describe your experience and provide optional certification.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Experience Typing Field */}
                <div className="space-y-2">
                  <label htmlFor="experience" className="text-sm font-medium text-zinc-200 leading-none">
                    Work Experience Details
                  </label>
                  <textarea
                    id="experience"
                    placeholder="Briefly describe your past work experience, years in the field, and key skills..."
                    value={experienceText}
                    onChange={(e) => setExperienceText(e.target.value)}
                    className="flex min-h-[120px] w-full rounded-md border border-zinc-700 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  />
                  <p className="text-xs text-zinc-500">Please include years of experience and areas of expertise.</p>
                </div>

                <div className="h-px bg-zinc-800 my-4" />

                {/* Optional Certificate Upload */}
                <FileUploadZone 
                  label="Experience Certificate" 
                  subLabel="Optional: Upload previous work certs or references"
                  type="experienceCert" 
                  icon={FileBadge}
                  currentFile={files.experienceCert}
                  isOptional={true}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4 pt-4">
              <Button variant="ghost">Save Draft</Button>
              <Button 
                onClick={handleSubmit} 
                disabled={!isFormComplete || uploading}
                className="w-full sm:w-auto min-w-[150px]"
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    Submit for Review
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Right Column: Status & Help */}
          <div className="space-y-6">
            <Card className="bg-zinc-900/30">
              <CardHeader>
                <CardTitle className="text-base text-white">Submission Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-400">Profile Completion</span>
                  <span className="text-sm font-medium text-emerald-500">
                    {completedFields}/{requiredFieldsCount}
                  </span>
                </div>
                {/* Progress Bar */}
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-600 transition-all duration-500 ease-out"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
                
                <div className="space-y-2 pt-2">
                  <StatusItem label="Government ID" done={!!files.idProof} />
                  <StatusItem label="Profile Photo" done={!!files.photo} />
                  <StatusItem label="Experience Details" done={experienceText.trim().length > 0} />
                  <StatusItem label="Certificate (Optional)" done={!!files.experienceCert} />
                </div>
              </CardContent>
            </Card>

            <div className="rounded-lg border border-amber-900/50 bg-amber-900/10 p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-amber-500">Important Note</h4>
                  <p className="text-sm text-amber-200/70">
                    While the experience certificate is optional, providing it may increase your chances of getting hired.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- Sub-components ---

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-white tracking-tight">
            <span className="text-emerald-500">Mend</span> On
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 mr-2">
            <div className="text-right">
              <p className="text-sm font-medium text-white">Alex Walker</p>
              <p className="text-xs text-zinc-500">Electrician Pending</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
              <User className="h-5 w-5 text-zinc-400" />
            </div>
          </div>
          <div className="h-6 w-px bg-zinc-800 hidden md:block" />
          <Button className="gap-2 text-xs md:text-sm bg-emerald-500 hover:bg-emerald-600">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}

interface StatusItemProps {
  label: string;
  done: boolean;
}

const StatusItem: React.FC<StatusItemProps> = ({ label, done }) => {
  return (
    <div className="flex items-center gap-2">
      {done ? (
        <CheckCircle className="h-4 w-4 text-emerald-500" />
      ) : (
        <div className="h-4 w-4 rounded-full border border-zinc-600" />
      )}
      <span className={`text-sm ${done ? 'text-zinc-300' : 'text-zinc-500'}`}>
        {label}
      </span>
    </div>
  );
}