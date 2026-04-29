"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  FileText,
  CreditCard,
  CheckCircle2,
  Briefcase,
  Play,
  Navigation,
  Loader2,
  AlertTriangle,
  X,
} from "lucide-react";
import { ServiceResponseDTO, ServiceStatus, PaymentStatus } from "@/shared/types/serviceTypes";
import { getWorkerServiceDetailsAction, startWorkerServiceAction } from "@/app/actions/worker/service-actions";
import clsx from "clsx";
import toast from "react-hot-toast";
import RaiseConcernButton from "@/app/components/containers/services/RaiseConcernButton";

/* ─────────────────────────────────────────────────────────────── */
/*  Types                                                          */
/* ─────────────────────────────────────────────────────────────── */
type LocationState =
  | { status: "idle" }
  | { status: "fetching" }
  | { status: "ready"; lat: number; lng: number }
  | { status: "error"; message: string };

/* ─────────────────────────────────────────────────────────────── */
/*  Start Service Confirmation Modal                              */
/* ─────────────────────────────────────────────────────────────── */
interface StartServiceModalProps {
  open: boolean;
  location: LocationState;
  starting: boolean;
  onFetchLocation: () => void;
  onConfirm: () => void;
  onClose: () => void;
}

function StartServiceModal({
  open,
  location,
  starting,
  onFetchLocation,
  onConfirm,
  onClose,
}: StartServiceModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={!starting ? onClose : undefined}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 24 }}
            transition={{ type: "spring", stiffness: 340, damping: 26 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
              {/* Modal header */}
              <div className="relative bg-gradient-to-br from-emerald-600 to-emerald-700 p-6 pb-8">
                <button
                  onClick={!starting ? onClose : undefined}
                  disabled={starting}
                  className="absolute top-4 right-4 p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-40"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                  <Play className="w-6 h-6 text-white fill-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Start Service</h2>
                <p className="text-sm text-indigo-100 mt-1">
                  We need your current location to verify you're at the service site.
                </p>
              </div>

              {/* Modal body */}
              <div className="p-6 space-y-5">
                {/* Location status */}
                <div
                  className={clsx(
                    "rounded-xl border p-4 flex items-start gap-3 transition-all",
                    location.status === "idle" && "bg-gray-50 border-gray-200",
                    location.status === "fetching" && "bg-blue-50 border-blue-200",
                    location.status === "ready" && "bg-emerald-50 border-emerald-200",
                    location.status === "error" && "bg-red-50 border-red-200"
                  )}
                >
                  {location.status === "idle" && (
                    <Navigation className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                  )}
                  {location.status === "fetching" && (
                    <Loader2 className="w-5 h-5 text-blue-500 mt-0.5 shrink-0 animate-spin" />
                  )}
                  {location.status === "ready" && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                  )}
                  {location.status === "error" && (
                    <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                  )}

                  <div className="flex-1 min-w-0">
                    {location.status === "idle" && (
                      <p className="text-sm text-gray-600">
                        Your location has not been fetched yet. Click below to get it.
                      </p>
                    )}
                    {location.status === "fetching" && (
                      <p className="text-sm text-blue-700 font-medium">
                        Fetching your location…
                      </p>
                    )}
                    {location.status === "ready" && (
                      <>
                        <p className="text-sm font-semibold text-emerald-700">
                          Location captured ✓
                        </p>
                        <p className="text-xs font-mono text-emerald-600 mt-0.5">
                          {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                        </p>
                      </>
                    )}
                    {location.status === "error" && (
                      <>
                        <p className="text-sm font-semibold text-red-700">
                          Location error
                        </p>
                        <p className="text-xs text-red-600 mt-0.5">{location.message}</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Fetch location button */}
                {location.status !== "ready" && (
                  <button
                    onClick={onFetchLocation}
                    disabled={location.status === "fetching" || starting}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border-2 border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {location.status === "fetching" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Navigation className="w-4 h-4" />
                    )}
                    {location.status === "error" ? "Retry Location" : "Get My Location"}
                  </button>
                )}

                {location.status === "ready" && (
                  <button
                    onClick={onFetchLocation}
                    disabled={starting}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-40"
                  >
                    <Navigation className="w-4 h-4" />
                    Refresh location
                  </button>
                )}

                {/* Confirm / Cancel */}
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={!starting ? onClose : undefined}
                    disabled={starting}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-40"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onConfirm}
                    disabled={location.status !== "ready" || starting}
                    className={clsx(
                      "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-all",
                      location.status === "ready" && !starting
                        ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-md hover:shadow-lg"
                        : "bg-gray-300 cursor-not-allowed"
                    )}
                  >
                    {starting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Starting…
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white" />
                        Confirm Start
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-center text-gray-400">
                  The backend verifies you must be within 150 m of the service location.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  Main Page Component                                           */
/* ─────────────────────────────────────────────────────────────── */
export default function WorkerServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params?.serviceId as string;

  const [service, setService] = useState<ServiceResponseDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  /* Modal / start-service state */
  const [modalOpen, setModalOpen] = useState(false);
  const [location, setLocation] = useState<LocationState>({ status: "idle" });
  const [starting, setStarting] = useState(false);

  /* ── Fetch service details ── */
  useEffect(() => {
    const fetchDetailedService = async () => {
      if (!serviceId) return;
      try {
        setLoading(true);
        const response = await getWorkerServiceDetailsAction(serviceId);
        if (response.success && response.data) {
          setService(response.data);
        } else {
          toast.error(response.error || "Failed to load service details.");
        }
      } catch {
        toast.error("An unexpected error occurred while fetching details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetailedService();
  }, [serviceId]);

  /* ── Geolocation helper ── */
  const fetchLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocation({ status: "error", message: "Geolocation is not supported by your browser." });
      return;
    }
    setLocation({ status: "fetching" });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          status: "ready",
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        let msg = "Unable to retrieve your location.";
        if (err.code === err.PERMISSION_DENIED) msg = "Location permission denied. Please allow access in your browser settings.";
        else if (err.code === err.POSITION_UNAVAILABLE) msg = "Location information is unavailable.";
        else if (err.code === err.TIMEOUT) msg = "Location request timed out.";
        setLocation({ status: "error", message: msg });
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  }, []);

  /* ── Open modal: reset location state each time ── */
  const openModal = () => {
    setLocation({ status: "idle" });
    setModalOpen(true);
  };

  const closeModal = () => {
    if (starting) return;
    setModalOpen(false);
    setLocation({ status: "idle" });
  };

  /* ── Confirm start ── */
  const handleConfirmStart = async () => {
    if (location.status !== "ready") return;
    setStarting(true);
    try {
      const result = await startWorkerServiceAction(serviceId, location.lat, location.lng);
      if (result.success && result.data) {
        setService(result.data);
        toast.success("Service started successfully! It is now In Progress.");
        setModalOpen(false);
      } else {
        toast.error(result.error || "Failed to start the service.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setStarting(false);
    }
  };

  /* ── Status helpers ── */
  const getStatusColor = (status: ServiceStatus) => {
    switch (status) {
      case ServiceStatus.COMPLETED:   return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case ServiceStatus.IN_PROGRESS: return "bg-blue-100 text-blue-800 border-blue-200";
      case ServiceStatus.CANCELLED:
      case ServiceStatus.CANCELLED_BY_CLIENT:
      case ServiceStatus.CANCELLED_BY_WORKER: return "bg-red-100 text-red-800 border-red-200";
      case ServiceStatus.PENDING:     return "bg-amber-100 text-amber-800 border-amber-200";
      case ServiceStatus.CONFIRMED:   return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:                        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const canStart = service?.status === ServiceStatus.CONFIRMED;

  /* ── Loading / not found states ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin shadow-md" />
        <p className="text-gray-500 font-medium">Loading service details…</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full border border-gray-100">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Service Not Found</h2>
          <p className="text-gray-500 mb-6">We couldn't locate the details for this service assignment.</p>
          <button
            onClick={() => router.back()}
            className="w-full inline-flex justify-center items-center py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
          </button>
        </div>
      </div>
    );
  }

  /* ── Main render ── */
  return (
    <>
      {/* Start Service Modal */}
      <StartServiceModal
        open={modalOpen}
        location={location}
        starting={starting}
        onFetchLocation={fetchLocation}
        onConfirm={handleConfirmStart}
        onClose={closeModal}
      />

      <div className="min-h-[calc(100vh-4rem)] bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Header & Navigation */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between gap-3 flex-wrap"
          >
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 bg-white/50 px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm transition-all hover:bg-white"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Services
            </button>

            <div className="flex items-center gap-3">
              <span
                className={clsx(
                  "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border",
                  getStatusColor(service.status)
                )}
              >
                {service.status.replace(/_/g, " ")}
              </span>


            </div>
          </motion.div>

          {/* IN_PROGRESS banner */}
          <AnimatePresence>
            {service.status === ServiceStatus.IN_PROGRESS && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shrink-0" />
                <p className="text-sm font-semibold">
                  Service is currently <span className="text-blue-700">In Progress</span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Left Column: Client Profile & Location */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="md:col-span-1 space-y-6"
            >
              {/* Client Profile Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-16" />
                <div className="p-5 flex flex-col items-center relative">
                  <div className="w-20 h-20 bg-white rounded-full border-4 border-white shadow-md flex items-center justify-center -mt-14 mb-3 overflow-hidden">
                    {service.client?.profilePictureUrl ? (
                      <img
                        src={service.client.profilePictureUrl}
                        alt={service.client.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-2xl">
                        {service.client?.name?.charAt(0).toUpperCase() || "C"}
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 text-center">
                    {service.client?.name || "Client Details Not Provided"}
                  </h3>
                  <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-4">Client</p>

                  <div className="w-full space-y-3 pt-4 border-t border-gray-100">
                    {service.client?.email && (
                      <div className="flex items-start space-x-3 text-sm">
                        <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                        <span className="text-gray-600 break-all">{service.client.email}</span>
                      </div>
                    )}
                    {service.client?.phone && (
                      <div className="flex items-center space-x-3 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{service.client.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Location Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
                <div className="flex items-center space-x-2 text-gray-900 font-semibold mb-2">
                  <MapPin className="w-5 h-5 text-indigo-500" />
                  <h3>Service Location</h3>
                </div>
                {service.location?.coordinates ? (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
                    <p className="text-sm font-mono text-gray-600">
                      Lat: {service.location.coordinates[1]?.toFixed(6)}
                    </p>
                    <p className="text-sm font-mono text-gray-600">
                      Lng: {service.location.coordinates[0]?.toFixed(6)}
                    </p>
                    <a
                      href={`https://maps.google.com/?q=${service.location.coordinates[1]},${service.location.coordinates[0]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      Open in Google Maps →
                    </a>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic text-center py-4">No coordinates provided.</p>
                )}
              </div>
            </motion.div>

            {/* Right Column: Service Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="md:col-span-2 space-y-6"
            >
              {/* Primary Details Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase rounded-md border border-emerald-100">
                        {service.category}
                      </span>
                      {service.paymentStatus === PaymentStatus.SUCCESS && (
                        <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Paid
                        </span>
                      )}
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                      {service.title || `Service Assignment: ${service.category}`}
                    </h1>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 mb-6 space-y-1">
                  <div className="flex items-center text-sm font-semibold text-gray-900 mb-2">
                    <FileText className="w-4 h-4 mr-2 text-emerald-500" />
                    Description
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                    {service.description || "No description provided for this service."}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3 p-4 rounded-xl border border-gray-100 hover:border-emerald-100 transition-colors bg-white">
                    <div className="p-2 bg-emerald-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-0.5">Scheduled For</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(service.scheduledDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 rounded-xl border border-gray-100 hover:border-teal-100 transition-colors bg-white">
                    <div className="p-2 bg-teal-50 rounded-lg">
                      <Clock className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-0.5">Duration</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {service.numberOfDays || 1} {service.numberOfDays === 1 ? "Day" : "Days"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 rounded-xl border border-gray-100 hover:border-emerald-100 transition-colors bg-white sm:col-span-2">
                    <div className="p-2 bg-emerald-50 rounded-lg">
                      <Briefcase className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 uppercase mb-2">Selected Slots</p>
                      <div className="flex flex-wrap gap-2">
                        {service.selectedSlots?.map((slot, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200"
                          >
                            {new Date(slot.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}{" "}
                            &bull; {slot.slotType.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing Breakdown */}
                <div className="mt-6 bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-600" /> Payment Summary
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Rate (Per worker/day)</span>
                      <span className="font-medium">₹{service.pricePerWorker || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Workers × Days</span>
                      <span className="font-medium">{service.numberOfWorkers || 1} × {service.numberOfDays || 1}</span>
                    </div>
                    <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-200">
                      <span>Total Amount Paid</span>
                      <span className="text-emerald-600">₹{service.totalAmount}</span>
                    </div>
                  </div>
                </div>

                {/* ── Start Service button inside card ── */}
                {canStart && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-6 pt-6 border-t border-gray-100"
                  >
                    <motion.button
                      id="start-service-btn"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={openModal}
                      className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all"
                    >
                      <Play className="w-5 h-5 fill-white" />
                      Start Service
                    </motion.button>
                    <p className="text-xs text-center text-gray-400 mt-2">
                      Your location will be verified before the service begins
                    </p>
                  </motion.div>
                )}

                {/* ── Raise Concern — only after completion ── */}
                {service.status === ServiceStatus.COMPLETED && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <RaiseConcernButton serviceId={serviceId} />
                  </div>
                )}
              </div>

              {/* Footer card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100 pb-4">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <CreditCard className="w-5 h-5 text-gray-400" />
                    <span>
                      Payment Status:{" "}
                      <strong
                        className={
                          service.paymentStatus === PaymentStatus.SUCCESS
                            ? "text-emerald-600"
                            : "text-amber-600"
                        }
                      >
                        {service.paymentStatus}
                      </strong>
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <p className="text-gray-400 uppercase font-semibold mb-1 tracking-wider">Created</p>
                    <p className="font-medium text-gray-800">
                      {new Date(service.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  {service.startedAt && (
                    <div>
                      <p className="text-gray-400 uppercase font-semibold mb-1 tracking-wider">Started</p>
                      <p className="font-medium text-gray-800">
                        {new Date(service.startedAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  )}
                  {service.completedAt && (
                    <div>
                      <p className="text-gray-400 uppercase font-semibold mb-1 tracking-wider">Completed</p>
                      <p className="font-medium text-gray-800">
                        {new Date(service.completedAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  )}
                  {service.updatedAt && (
                    <div>
                      <p className="text-gray-400 uppercase font-semibold mb-1 tracking-wider">Updated</p>
                      <p className="font-medium text-gray-800">
                        {new Date(service.updatedAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  )}
                </div>
              </div>


            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
