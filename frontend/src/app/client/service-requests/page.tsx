"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Plus,
  MapPin,
  Calendar,
  DollarSign,
  Image as ImageIcon,
  X,
  UploadCloud,
  Loader2,
  Search,
  ArrowUpRight,
  IndianRupee,
} from "lucide-react";
import { useUserStore } from "@/store/userStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Category } from "@/shared/types/categoryTypes";
import { CreateServiceRequestDTO } from "@/shared/types/serviceTypes";
import toast from "react-hot-toast";
import { releaseServiceRequestAction } from "@/app/actions/serviceRequest/common/serviceRequestActions";
import {
  createServiceRequestAction,
  getMyServiceRequestsAction,
} from "@/app/actions/serviceRequest/client/clientServiceRequest.actions";
import { getAllCategoriesAction } from "@/app/actions/admin/category-actions";
import { ServiceRequestResponse } from "@/shared/types/ServiceRequestResponse";
import { getMediaUploadUrlAction } from "@/app/actions/media/mediaUpload.actions";
import { uploadToS3 } from "@/lib/uploadToS3";

// --- Multi-File Uploader Component ---
interface FileUploaderProps {
  label: string;
  onFilesSelect: (files: File[]) => void;
  files: File[];
  className?: string;
  maxFiles?: number;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  label,
  onFilesSelect,
  files,
  className,
  maxFiles = 5,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setIsDragging(true);
    else setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) {
      const newFiles = Array.from(e.dataTransfer.files);
      addFiles(newFiles);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const newFiles = Array.from(e.target.files);
      addFiles(newFiles);
    }
  };

  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter((file) =>
      file.type.startsWith("image/"),
    );
    if (validFiles.length !== newFiles.length) {
      toast.error("Only image files are allowed");
    }
    const combinedFiles = [...files, ...validFiles].slice(0, maxFiles);
    onFilesSelect(combinedFiles);
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    onFilesSelect(updated);
  };

  return (
    <div className={className}>
      <Label className="mb-2 block text-sm font-medium text-gray-700">
        {label}{" "}
        <span className="text-xs font-normal text-muted-foreground">
          (Max {maxFiles})
        </span>
      </Label>

      <div className="space-y-3">
        {files.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
            {files.map((file, idx) => (
              <div
                key={idx}
                className="relative group overflow-hidden rounded-lg border border-gray-200 bg-gray-50 aspect-video flex items-center justify-center"
              >
                <div className="flex flex-col items-center gap-1 p-2">
                  <ImageIcon size={20} className="text-gray-400" />
                  <p className="text-[10px] text-gray-500 truncate w-full px-2 text-center">
                    {file.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="absolute top-1 right-1 p-1 bg-white/80 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {files.length < maxFiles && (
          <div
            className={`group border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 p-6 text-center
                ${isDragging ? "border-green-500 bg-green-50/50" : "border-gray-200 hover:border-green-500 hover:bg-gray-50"}
                `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-50 text-green-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <UploadCloud size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Click to upload photos
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  SVG, PNG, JPG (Max 10MB)
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Service Status Badge ---
const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    pending:
      "bg-yellow-50 text-yellow-700 border-yellow-200 ring-yellow-500/10",
    accepted: "bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/10",
    in_progress:
      "bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-500/10",
    completed: "bg-green-50 text-green-700 border-green-200 ring-green-500/10",
    cancelled: "bg-red-50 text-red-700 border-red-200 ring-red-500/10",
  } as const;

  const style =
    styles[status as keyof typeof styles] ||
    "bg-gray-50 text-gray-700 border-gray-200 ring-gray-500/10";

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ring-1 ${style}`}
    >
      {status.replace("_", " ")}
    </span>
  );
};

// --- Main Page Component ---

export default function ServicesPage() {
  const { user } = useUserStore();
  const [requests, setRequests] = useState<ServiceRequestResponse[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Form State
  const [formData, setFormData] = useState<Partial<CreateServiceRequestDTO>>({
    title: "",
    description: "",
    category: "",
    location: { lat: 0, lng: 0 },
    budget: undefined,
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedAddressIndex, setSelectedAddressIndex] =
    useState<string>("custom");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const reqRes = await getMyServiceRequestsAction();
      if (!reqRes.success) {
        toast.error(reqRes.message);
        return;
      }
      setRequests(reqRes.payload);

      const catRes = await getAllCategoriesAction();
      if (!catRes.success) {
        toast.error(catRes.message);
        return;
      }

      const activeCategories = catRes.payload.filter(
        (cat) => cat.isActive === true,
      );

      setCategories(activeCategories);
    } catch (error) {
      toast.error("Failed to load data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRelease = async (requestId: string) => {
    try {
      const res = await releaseServiceRequestAction(requestId);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success("Service request cancelled");

      loadData();
    } catch (err) {
      toast.error("Failed to cancel service request");
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      location: { lat: 0, lng: 0 },
      budget: undefined,
    });
    setSelectedImages([]);
    setSelectedAddressIndex("custom");
  };

  const handleCreate = async () => {
    if (!formData.title || !formData.description || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (
      !formData.location ||
      (formData.location.lat === 0 && formData.location.lng === 0)
    ) {
      toast.error("Please select a valid location");
      return;
    }

    try {
      setSubmitting(true);

      let uploadedPhotos: string[] = [];

      if (selectedImages.length > 0) {
        const uploadPromises = selectedImages.map(async (file) => {
          const res = await getMediaUploadUrlAction(file.name, file.type);
          if (!res.success) {
            throw new Error(res.message || "Failed to get upload URL");
          }
          const { uploadUrl, fileUrl } = res.payload;
          const success = await uploadToS3(file, uploadUrl);
          if (!success) {
            throw new Error("Failed to upload to S3");
          }
          return fileUrl;
        });

        try {
          uploadedPhotos = await Promise.all(uploadPromises);
        } catch (error: any) {
          toast.error(error.message);
          return;
        }
      }

      const res = await createServiceRequestAction({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        budget: formData.budget,
        servicePhotos: uploadedPhotos,
      });

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success("Service request created successfully");

      resetForm();
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      toast.error("Something went wrong while creating request");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddressSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedAddressIndex(val);

    if (val === "custom" || val === "current") {
      if (val === "current") handleGetCurrentLocation();
      return;
    }

    const index = parseInt(val);
    const address = user?.address?.[index];
    if (address) {
      setFormData((prev) => ({
        ...prev,
        location: { lat: address.lat, lng: address.lng },
      }));
      toast.success("Address selected");
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getAllCategoriesAction();

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      setCategories(res.payload);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          }));
          setSelectedAddressIndex("current");
          toast.success("Current location detected");
        },
        (error) => {
          console.error("Error detecting location", error);
          toast.error("Could not detect location");
        },
      );
    } else {
      toast.error("Geolocation not supported");
    }
  };

  // --- Filtering Logic ---
  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getCategoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name || "Service";

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-10 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-4xl font-extrabold text-[#1B4332] tracking-tight">
              Service Requests
            </h1>
          </div>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#1B4332] hover:bg-[#153426] text-white px-6 py-6 rounded-xl shadow-xl shadow-green-900/10 transition-all hover:scale-105 active:scale-95 text-base font-semibold gap-2">
                <Plus size={20} /> Post New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0 bg-white rounded-2xl border-0 shadow-2xl">
              <DialogHeader className="px-8 py-6 bg-gray-50/80 border-b border-gray-100">
                <DialogTitle className="text-2xl font-bold text-[#1B4332]">
                  Create Service Request
                </DialogTitle>
                <DialogDescription className="text-gray-500">
                  Provide details to help professionals understand your needs.
                </DialogDescription>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto px-8 py-6">
                <div className="grid gap-6">
                  {/* Section: Basic Info */}
                  <div className="space-y-4">
                    <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Project Details
                    </Label>
                    <div className="grid gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-gray-900">
                          Title <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          placeholder="e.g., Fix Leaking Kitchen Sink"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                          className="h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-gray-900">
                          Category <span className="text-red-500">*</span>
                        </Label>
                        <select
                          className="w-full h-11 px-3 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:border-transparent transition-all"
                          value={formData.category}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              category: e.target.value,
                            })
                          }
                        >
                          <option value="" disabled>
                            Select Category
                          </option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-gray-900">
                          Description <span className="text-red-500">*</span>
                        </Label>
                        <textarea
                          className="w-full min-h-[100px] p-3 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:border-transparent transition-all resize-y"
                          placeholder="Describe the issue, specific requirements, or preferred timing..."
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-gray-100" />

                  {/* Section: Logistics */}
                  <div className="space-y-4">
                    <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Logistics
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-gray-900">
                          Estimated Budget
                        </Label>
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <Input
                            type="number"
                            placeholder="0.00"
                            className="pl-10 h-11 bg-gray-50 border-gray-200"
                            value={
                              formData.budget === undefined
                                ? ""
                                : formData.budget
                            }
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                budget: e.target.value
                                  ? parseFloat(e.target.value)
                                  : undefined,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-gray-900">
                          Location <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex flex-col gap-2">
                          {user?.address && user.address.length > 0 && (
                            <select
                              className="w-full h-11 px-3 rounded-md border border-gray-200 bg-gray-50 text-sm"
                              value={selectedAddressIndex}
                              onChange={handleAddressSelection}
                            >
                              <option value="custom">
                                Select Saved Address...
                              </option>
                              {user.address.map((addr, idx) => (
                                <option key={idx} value={idx}>
                                  {addr.label} - {addr.street}
                                </option>
                              ))}
                              <option value="current">
                                📍 Current Location
                              </option>
                            </select>
                          )}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleGetCurrentLocation}
                            className={`h-11 justify-start font-normal ${formData.location?.lat !== 0 ? "border-green-200 bg-green-50 text-green-700" : "text-gray-500"}`}
                          >
                            <MapPin size={16} className="mr-2" />
                            {formData.location?.lat !== 0
                              ? "Location Selected"
                              : "Or detect current location"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-gray-100" />

                  {/* Section: Media */}
                  <div className="space-y-4">
                    <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Media
                    </Label>
                    <FileUploader
                      label="Project Photos"
                      files={selectedImages}
                      onFilesSelect={setSelectedImages}
                    />
                  </div>
                </div>
              </div>

              <DialogFooter className="px-8 py-5 border-t border-gray-100 bg-gray-50/50">
                <Button
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                  className="font-medium text-gray-500 hover:text-gray-900"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={submitting}
                  className="bg-[#1B4332] hover:bg-[#153426] text-white px-8 rounded-lg shadow-lg shadow-green-900/10"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Publishing...
                    </>
                  ) : (
                    "Publish Request"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters Bar */}
        {/* <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between sticky top-4 z-10 backdrop-blur-md ">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 border-gray-200 bg-gray-50 focus:bg-white rounded-xl transition-all"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
            <Filter size={16} className="text-gray-400 mr-1" />
            {["all", "pending", "accepted", "completed"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-all
                            ${statusFilter === status
                    ? "bg-[#1B4332] text-white shadow-md shadow-green-900/10"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }
                        `}
              >
                {status.replace("_", " ")}
              </button>
            ))}
          </div>
        </div> */}

        {/* Content Grid */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-60 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-[#1B4332]" />
            <p className="text-gray-500 font-medium animate-pulse">
              Loading your requests...
            </p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-gray-300">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              No requests found
            </h3>
            <p className="text-gray-500 mt-2 text-center max-w-sm">
              {searchQuery
                ? "Try adjusting your search terms or filters."
                : "Start by creating your first service request to connect with professionals."}
            </p>
            {!searchQuery && (
              <Button
                variant="link"
                className="mt-4 text-[#1B4332] font-semibold"
                onClick={() => setIsModalOpen(true)}
              >
                Create Request
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map((request) => (
              <Card
                key={request.requestId}
                className="group flex flex-col h-full overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-white rounded-2xl ring-1 ring-gray-100 hover:ring-green-100/50"
              >
                <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                  {request.servicePhotos?.[0] ? (
                    <img
                      src={request.servicePhotos[0]}
                      alt={request.title}
                      className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-50 text-gray-300">
                      <ImageIcon size={40} />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 z-10">
                    <StatusBadge status={request.status} />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                    <span className="text-white text-xs font-medium px-2 py-1 bg-black/30 backdrop-blur-md rounded-md border border-white/10">
                      {getCategoryName(request.category)}
                    </span>
                  </div>
                </div>

                <CardContent className="flex-1 p-5 pt-6 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-lg font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-[#1B4332] transition-colors">
                      {request.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">
                    {request.description}
                  </p>

                  <div className="flex items-center flex-wrap gap-4 pt-4 mt-auto border-t border-gray-50">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <Calendar size={14} className="text-gray-400" />
                      <span>
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {request.budget && (
                      <div className="flex items-center gap-1.5 text-green-700 bg-green-50 px-2.5 py-1 rounded-md text-xs font-bold ml-auto">
                        <IndianRupee size={12} />
                        <span>{request.budget}</span>
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="p-4 bg-gray-50/50">
                  <div className="flex justify-end gap-2 w-full">
                    <Link
                      href={`/client/service-requests/${request.requestId}`}
                    >
                      <Button variant="outline" size="sm">
                        View Details
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
