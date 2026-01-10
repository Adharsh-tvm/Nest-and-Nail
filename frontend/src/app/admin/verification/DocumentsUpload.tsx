"use client";

import React, {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  DragEvent,
  MouseEvent as ReactMouseEvent,
} from "react";
import {
  UploadCloud,
  X,
  CheckCircle2,
  FileText,
  ShieldCheck,
  User,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Image as ImageIcon,
  Lock,
} from "lucide-react";
import { useUserStore } from "@/store/userStore";
import {
  updateUserProfileAction,
  uploadDocumentAction,
} from "@/app/actions/users/user-profile-actions";
import { VerificationStatus } from "@/shared/enums/authEnums";

type ErrorState = {
  idDocument?: string;
  certDocument?: string;
};

type FileUploaderProps = {
  label: string;
  subLabel?: string;
  accept: string;
  onFileSelect: (file: File | null) => void;
  file: File | null;
  error?: string;
};

type WorkerVerificationFlowProps = {
  isOpen: boolean;
  onClose: () => void;
};

/** File uploader with drag & drop + fake progress */
const FileUploader: React.FC<FileUploaderProps> = ({
  label,
  subLabel,
  accept,
  onFileSelect,
  file,
  error,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(
    () => () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    },
    []
  );

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (selectedFile: File) => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    setUploadProgress(0);
    let progress = 0;

    intervalRef.current = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);

      if (progress >= 100) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        onFileSelect(selectedFile);
      }
    }, 100);
  };

  const removeFile = (e: ReactMouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onFileSelect(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-bold text-[#1B4332] mb-2">
        {label} <span className="text-red-500">*</span>
      </label>

      <div
        className={`relative border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer group
        ${error ? "border-red-300 bg-red-50" : ""}
        ${
          isDragging
            ? "border-[#DC2626] bg-red-50/50"
            : "border-gray-200 hover:border-[#1B4332] hover:bg-gray-50"
        }
        ${file ? "bg-green-50 border-green-200 border-solid" : "bg-white"}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !file && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleChange}
        />

        <div className="p-8 flex flex-col items-center justify-center text-center min-h-[160px]">
          {file ? (
            <div className="w-full animate-in zoom-in duration-300">
              <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-green-100">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-700 flex-shrink-0">
                    {file.type.includes("pdf") ? (
                      <FileText size={20} />
                    ) : (
                      <ImageIcon size={20} />
                    )}
                  </div>
                  <div className="text-left overflow-hidden">
                    <p className="text-sm font-bold text-gray-900 truncate max-w-[180px] sm:max-w-xs">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • Completed
                    </p>
                  </div>
                </div>
                <button
                  onClick={removeFile}
                  className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="w-full bg-green-200 h-1 mt-2 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full w-full" />
              </div>
            </div>
          ) : (
            <>
              <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <UploadCloud size={24} className="text-[#1B4332]" />
              </div>

              {uploadProgress > 0 && uploadProgress < 100 ? (
                <div className="w-full max-w-xs">
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#DC2626] h-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm font-bold text-gray-900">
                    <span className="text-[#DC2626]">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-2 max-w-xs mx-auto leading-relaxed">
                    {subLabel || "SVG, PNG, JPG or PDF (max. 10MB)"}
                  </p>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-xs mt-2 flex items-center gap-1 font-medium animate-in slide-in-from-left-1">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
};

const WorkerVerificationFlow: React.FC<WorkerVerificationFlowProps> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [certDocument, setCertDocument] = useState<File | null>(null);
  const [errors, setErrors] = useState<ErrorState>({});

  const { user: currentUser, setUser } = useUserStore();

  const resetForm = () => {
    setStep(1);
    setIdDocument(null);
    setCertDocument(null);
    setErrors({});
    setIsSubmitting(false);
  };

  const validateStep = (currentStep: number) => {
    const newErrors: ErrorState = {};
    let isValid = true;

    if (currentStep === 1) {
      if (!idDocument) {
        newErrors.idDocument = "Government ID is required for verification.";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) return;
    if (!currentUser?.id) return;

    setIsSubmitting(true);
    const userId = currentUser.id;

    try {
      if (idDocument) {
        const idUrl = await uploadDocumentAction(userId, idDocument);
        await updateUserProfileAction(userId, { documents: [idUrl] });
      }

      if (certDocument) {
        const certUrl = await uploadDocumentAction(userId, certDocument);
        await updateUserProfileAction(userId, { certificates: [certUrl] });
      }

      setUser({
        ...currentUser,
        isVerified: VerificationStatus.PENDING,
      });

      setStep(3);
    } catch (err) {
      console.error("Profile update failed", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const renderStep1 = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#1B4332]">
          <User size={32} />
        </div>
        <h2 className="text-2xl font-extrabold text-[#1B4332]">
          Verify Identity
        </h2>
        <p className="text-gray-500 mt-2">
          Upload a clear photo of your government-issued ID.
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 mb-6 flex gap-3">
        <ShieldCheck className="text-yellow-600 flex-shrink-0" size={20} />
        <div className="text-sm text-yellow-800">
          <span className="font-bold block mb-1">Your data is encrypted</span>
          We use bank-level security to protect your personal information. It is
          only used for verification purposes.
        </div>
      </div>

      <FileUploader
        label="Government ID / Driver's License"
        subLabel="Front side only. clear, readable text."
        accept="image/*,application/pdf"
        file={idDocument}
        onFileSelect={setIdDocument}
        error={errors.idDocument}
      />
    </div>
  );

  const renderStep2 = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#DC2626]">
          <ShieldCheck size={32} />
        </div>
        <h2 className="text-2xl font-extrabold text-[#1B4332]">
          Certifications
        </h2>
        <p className="text-gray-500 mt-2">
          Upload licenses or insurance to get the &quot;Verified Pro&quot;
          badge.
        </p>
      </div>

      <FileUploader
        label="Trade License / Insurance (Optional)"
        subLabel="PDF or Image. Increases approval rate by 40%."
        accept="image/*,application/pdf"
        file={certDocument}
        onFileSelect={setCertDocument}
      />

      <div className="mt-8 p-4 rounded-xl border border-gray-100 bg-gray-50 flex items-start gap-4">
        <div className="p-2 bg-white rounded-lg shadow-sm text-[#1B4332]">
          <Lock size={20} />
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-sm">
            Why do we need this?
          </h4>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Homeowners trust verified professionals. Adding these documents
            helps you rank higher in search results.
          </p>
        </div>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center py-10 animate-in zoom-in duration-500">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 size={48} className="text-green-600" />
      </div>
      <h2 className="text-3xl font-extrabold text-[#1B4332] mb-4">
        Application Sent!
      </h2>
      <p className="text-gray-500 max-w-sm mx-auto mb-8 text-lg">
        Our team is reviewing your documents. You will receive an email
        confirmation within 24 hours.
      </p>
      <button
        type="button"
        onClick={handleClose}
        className="bg-[#1B4332] text-white font-bold py-4 px-12 rounded-xl hover:bg-[#143225] transition-all shadow-xl shadow-green-900/20 w-full md:w-auto"
      >
        Return to Dashboard
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-[#0f291e]/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
      />
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {step < 3 && (
          <div className="bg-white px-8 pt-8 pb-4 border-b border-gray-100 flex-shrink-0 z-10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-400 text-xs uppercase tracking-widest">
                Step {step} of 2
              </h3>
              <button
                type="button"
                onClick={handleClose}
                className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden flex">
              <div
                className={`h-full transition-all duration-500 ease-out ${
                  step >= 1 ? "bg-[#DC2626] w-1/2" : "bg-transparent w-1/2"
                }`}
              />
              <div
                className={`h-full transition-all duration-500 ease-out ${
                  step >= 2 ? "bg-[#DC2626] w-1/2" : "bg-transparent w-1/2"
                }`}
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-8 bg-white">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderSuccess()}
        </div>

        {step < 3 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center flex-shrink-0">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => prev - 1)}
                className="text-gray-500 font-bold hover:text-[#1B4332] px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                disabled={isSubmitting}
              >
                <ArrowLeft size={18} /> Back
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={step === 2 ? handleSubmit : handleNext}
              disabled={isSubmitting}
              className={`
                font-bold py-3 px-8 rounded-xl transition-all shadow-md flex items-center gap-2
                ${
                  isSubmitting
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#1B4332] text-white hover:bg-[#143225] shadow-green-900/20 hover:shadow-lg"
                }
              `}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> Processing...
                </>
              ) : step === 2 ? (
                <>
                  Submit Application <CheckCircle2 size={20} />
                </>
              ) : (
                <>
                  Next Step <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerVerificationFlow;
