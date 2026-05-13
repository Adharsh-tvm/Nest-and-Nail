"use client";

import React, { useEffect, useState } from "react";
import { getActiveWorkerServiceAction, completeWorkerServiceAction } from "@/app/actions/worker/service-actions";
import { ServiceResponseDTO, SlotType, PaymentStatus } from "@/shared/types/serviceTypes";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, Clock, CreditCard, Tag, AlertCircle, Loader2,
  Mail, Phone, MapPin, FileText, Briefcase, Hash,
  CheckCircle2, Zap, ExternalLink, Sun, Sunset, AlarmClock,
  CheckCheck, X
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

/* ────────────────────────────────────────────────────── */
/*  Helper: slot label + icon                            */
/* ────────────────────────────────────────────────────── */
function slotMeta(slotType: SlotType): { label: string; icon: React.ReactNode; color: string; bg: string; border: string } {
  switch (slotType) {
    case SlotType.MORNING_HALF:
      return { label: "Morning Shift", icon: <Sun size={13} />, color: "#92400e", bg: "#fef3c7", border: "#fde68a" };
    case SlotType.EVENING_HALF:
      return { label: "Evening Shift", icon: <Sunset size={13} />, color: "#7c3aed", bg: "#ede9fe", border: "#ddd6fe" };
    case SlotType.FULL_DAY:
      return { label: "Full Day", icon: <AlarmClock size={13} />, color: "#065f46", bg: "#d1fae5", border: "#a7f3d0" };
    default:
      return { label: slotType, icon: <Clock size={13} />, color: "#334155", bg: "#f1f5f9", border: "#e2e8f0" };
  }
}

function formatDate(d: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short", year: "numeric", month: "short", day: "numeric",
  }).format(new Date(d));
}

function formatShortDate(d: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(d));
}

/* ────────────────────────────────────────────────────── */
/*  Fade-in card wrapper                                  */
/* ────────────────────────────────────────────────────── */
function Card({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
      style={{
        background: "white",
        borderRadius: "22px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 20px rgba(0,0,0,0.055)",
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "10px",
      padding: "18px 22px",
      borderBottom: "1px solid #f1f5f9",
    }}>
      <div style={{
        width: "32px", height: "32px", borderRadius: "9px",
        background: "linear-gradient(135deg,#ecfdf5,#d1fae5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#059669", flexShrink: 0,
      }}>{icon}</div>
      <span style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a", letterSpacing: "-0.2px" }}>{title}</span>
    </div>
  );
}

/* ────────────────────────────────────────────────────── */
/*  Main Page                                             */
/* ────────────────────────────────────────────────────── */
export default function OngoingServicePage() {
  const [service, setService] = useState<ServiceResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await getActiveWorkerServiceAction();
        if (res.success && res.data) setService(res.data);
      } catch {
        toast.error("Failed to load active service.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleComplete() {
    if (!service) return;
    setCompleting(true);
    setShowConfirm(false);
    try {
      const res = await completeWorkerServiceAction(service.serviceId);
      if (res.success) {
        toast.success("Service marked as completed! 🎉");
        router.push("/worker/services");
      } else {
        toast.error(res.error || "Failed to complete service.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setCompleting(false);
    }
  }

  /* ── Loading ── */
  if (loading) {
    return (
      <div style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px" }}>
        <div style={{
          width: "52px", height: "52px", borderRadius: "50%",
          background: "linear-gradient(135deg,#ecfdf5,#d1fae5)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Loader2 size={26} style={{ color: "#059669", animation: "spin 1s linear infinite" }} />
        </div>
        <p style={{ color: "#64748b", fontWeight: 600, fontSize: "14px" }}>Fetching active assignment…</p>
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  /* ── Empty ── */
  if (!service) {
    return (
      <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: "white", borderRadius: "28px",
            border: "1.5px dashed #cbd5e1",
            padding: "56px 40px", textAlign: "center",
            maxWidth: "460px", width: "100%",
            boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{
            width: "72px", height: "72px", borderRadius: "50%",
            background: "linear-gradient(135deg,#f8fafc,#f1f5f9)",
            border: "1px solid #e2e8f0",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px",
          }}>
            <AlertCircle size={32} style={{ color: "#cbd5e1" }} />
          </div>
          <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a", marginBottom: "10px" }}>No Active Assignment</h3>
          <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.7, marginBottom: "28px" }}>
            {"You don't have any ongoing service right now."}<br />
            Head to your services list to pick up an assignment.
          </p>
          <Link href="/worker/services" style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "linear-gradient(135deg,#059669,#10b981)",
            color: "white", padding: "12px 24px", borderRadius: "12px",
            fontWeight: 700, fontSize: "14px", textDecoration: "none",
            boxShadow: "0 6px 20px rgba(5,150,105,0.25)",
          }}>
            <Briefcase size={15} /> View All Services
          </Link>
        </motion.div>
      </div>
    );
  }

  /* ── Derived ── */
  const refId = service.serviceId.substring(0, 8).toUpperCase();
  const totalDays = service.numberOfDays || 1;
  const addressText = service.address
    ? [service.address.street, service.address.city, service.address.state, service.address.country]
        .filter(Boolean).join(", ")
    : null;
  const clientInitial = (service.client?.name?.charAt(0) || "C").toUpperCase();

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>

      {/* ── Hero banner ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          background: "linear-gradient(135deg,#064e3b 0%,#065f46 50%,#047857 100%)",
          padding: "36px 24px 88px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glows */}
        <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "360px", height: "360px", borderRadius: "50%", background: "rgba(16,185,129,0.18)", filter: "blur(70px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-40px", left: "5%", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(52,211,153,0.12)", filter: "blur(50px)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1060px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* Top row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "28px" }}>
            <Link href="/worker/services" style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              color: "rgba(255,255,255,0.75)", textDecoration: "none", fontSize: "13px", fontWeight: 600,
              padding: "7px 14px", borderRadius: "10px",
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
            }}>
              ← Services
            </Link>
            {/* Live badge */}
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "7px",
              padding: "6px 14px", borderRadius: "20px",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "white", fontSize: "12px", fontWeight: 700,
              backdropFilter: "blur(8px)",
            }}>
              <span style={{
                width: "8px", height: "8px", borderRadius: "50%",
                background: "#34d399",
                boxShadow: "0 0 0 3px rgba(52,211,153,0.35)",
                animation: "pulse 2s infinite",
              }} />
              IN PROGRESS
            </span>
          </div>

          {/* Title block */}
          <div>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "6px" }}>
              Active Assignment
            </p>
            <h1 style={{ fontSize: "28px", fontWeight: 900, color: "white", letterSpacing: "-0.5px", marginBottom: "6px" }}>
              {service.title || `${service.category} Service`}
            </h1>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", fontFamily: "monospace" }}>
              Ref: #{refId}
            </p>
          </div>

        </div>

        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}`}</style>
      </motion.div>

      {/* ── Content ── */}
      <div style={{ maxWidth: "1060px", margin: "0 auto", padding: "0 20px 64px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) minmax(0,2fr)",
          gap: "22px",
          marginTop: "-60px",
          position: "relative",
          zIndex: 10,
          alignItems: "start",
        }}
          className="ongoing-grid"
        >

          {/* ══════════════════════════════
               LEFT COLUMN
          ══════════════════════════════ */}
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

            {/* Client Profile */}
            <Card delay={0.05}>
              <div style={{
                height: "56px",
                background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
              }} />
              <div style={{ padding: "0 20px 22px", textAlign: "center" }}>
                <div style={{
                  width: "72px", height: "72px", borderRadius: "50%",
                  border: "4px solid white",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
                  overflow: "hidden",
                  background: "linear-gradient(135deg,#e0e7ff,#ede9fe)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "-36px auto 12px",
                  fontSize: "26px", fontWeight: 800, color: "#4f46e5",
                  position: "relative",
                }}>
                  {service.client?.profilePictureUrl ? (
                    <Image src={service.client.profilePictureUrl} alt={service.client.name || "Client"} fill unoptimized style={{ objectFit: "cover" }} />
                  ) : clientInitial}
                </div>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Client</p>
                <h2 style={{ fontSize: "17px", fontWeight: 800, color: "#0f172a", marginBottom: "14px" }}>
                  {service.client?.name || "Client"}
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px", borderTop: "1px solid #f1f5f9", paddingTop: "14px" }}>
                  {service.client?.email && (
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
                      <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "#f0f9ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Mail size={13} style={{ color: "#0284c7" }} />
                      </div>
                      <span style={{ color: "#475569", wordBreak: "break-all", textAlign: "left" }}>{service.client.email}</span>
                    </div>
                  )}
                  {service.client?.phone && (
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
                      <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Phone size={13} style={{ color: "#059669" }} />
                      </div>
                      <span style={{ color: "#475569" }}>{service.client.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card delay={0.1}>
              <SectionHeader icon={<Zap size={15} />} title="Quick Stats" />
              <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: "14px" }}>
                {[
                  { label: "Category", value: service.category, icon: <Tag size={14} style={{ color: "#059669" }} />, bg: "#ecfdf5" },
                  { label: "Duration", value: `${totalDays} ${totalDays === 1 ? "Day" : "Days"}`, icon: <Clock size={14} style={{ color: "#0284c7" }} />, bg: "#f0f9ff" },
                  { label: "Booked On", value: formatDate(service.createdAt), icon: <Calendar size={14} style={{ color: "#7c3aed" }} />, bg: "#f5f3ff" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {item.icon}
                    </div>
                    <div>
                      <p style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>{item.label}</p>
                      <p style={{ fontSize: "13px", fontWeight: 700, color: "#1e293b" }}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Payment */}
            <Card delay={0.15}>
              <SectionHeader icon={<CreditCard size={15} />} title="Payment" />
              <div style={{ padding: "18px 20px" }}>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "14px 16px", borderRadius: "12px",
                  background: service.paymentStatus === PaymentStatus.COMPLETED ? "#ecfdf5" : "#fffbeb",
                  border: `1px solid ${service.paymentStatus === PaymentStatus.COMPLETED ? "#a7f3d0" : "#fde68a"}`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{
                      width: "9px", height: "9px", borderRadius: "50%",
                      background: service.paymentStatus === PaymentStatus.COMPLETED ? "#10b981" : "#f59e0b",
                    }} />
                    <span style={{
                      fontSize: "13px", fontWeight: 700,
                      color: service.paymentStatus === PaymentStatus.COMPLETED ? "#065f46" : "#92400e",
                    }}>
                      {service.paymentStatus}
                    </span>
                  </div>
                  {service.paymentStatus === PaymentStatus.COMPLETED && (
                    <CheckCircle2 size={16} style={{ color: "#10b981" }} />
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* ══════════════════════════════
               RIGHT COLUMN
          ══════════════════════════════ */}
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

            {/* Service Details */}
            <Card delay={0.08}>
              <SectionHeader icon={<FileText size={15} />} title="Service Details" />
              <div style={{ padding: "22px 24px" }}>
                {/* Title & category pill */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "18px", flexWrap: "wrap" }}>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: "5px",
                    padding: "5px 12px", borderRadius: "20px",
                    background: "linear-gradient(135deg,#ecfdf5,#d1fae5)",
                    border: "1px solid #a7f3d0",
                    color: "#065f46", fontSize: "12px", fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    <Tag size={11} /> {service.category}
                  </span>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: "5px",
                    padding: "5px 12px", borderRadius: "20px",
                    background: "#f0f9ff", border: "1px solid #bae6fd",
                    color: "#0369a1", fontSize: "12px", fontWeight: 700,
                  }}>
                    <Hash size={11} /> {refId}
                  </span>
                </div>

                <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.4px", marginBottom: "14px" }}>
                  {service.title || `${service.category} Assignment`}
                </h2>

                <div style={{
                  background: "#f8fafc", borderRadius: "14px",
                  border: "1px solid #e2e8f0", padding: "16px 18px",
                  marginBottom: "22px",
                }}>
                  <p style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "8px" }}>Description</p>
                  <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.75, whiteSpace: "pre-line" }}>
                    {service.description || "No description provided for this service."}
                  </p>
                </div>

                {/* Scheduled Date */}
                <div style={{
                  display: "flex", alignItems: "center", gap: "14px",
                  padding: "16px 18px",
                  borderRadius: "14px",
                  background: "linear-gradient(135deg,#f0fdf4,#ecfdf5)",
                  border: "1px solid #a7f3d0",
                }}>
                  <div style={{
                    width: "44px", height: "44px", borderRadius: "12px",
                    background: "white", border: "1px solid #d1fae5",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: "0 2px 8px rgba(5,150,105,0.1)",
                  }}>
                    <Calendar size={20} style={{ color: "#059669" }} />
                  </div>
                  <div>
                    <p style={{ fontSize: "11px", fontWeight: 700, color: "#6ee7b7", textTransform: "uppercase", letterSpacing: "0.8px" }}>Scheduled For</p>
                    <p style={{ fontSize: "16px", fontWeight: 800, color: "#064e3b" }}>{formatDate(service.scheduledDate)}</p>
                  </div>
                </div>

                {/* Complete Work Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowConfirm(true)}
                  disabled={completing}
                  style={{
                    marginTop: "22px",
                    width: "100%",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                    padding: "15px 24px",
                    borderRadius: "14px",
                    background: completing
                      ? "#f1f5f9"
                      : "linear-gradient(135deg,#059669,#10b981)",
                    border: completing ? "1.5px solid #e2e8f0" : "none",
                    color: completing ? "#94a3b8" : "white",
                    fontWeight: 800,
                    fontSize: "15px",
                    cursor: completing ? "not-allowed" : "pointer",
                    boxShadow: completing ? "none" : "0 8px 24px rgba(5,150,105,0.3)",
                    letterSpacing: "-0.2px",
                  }}
                >
                  {completing ? (
                    <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Completing…</>
                  ) : (
                    <><CheckCheck size={18} /> Mark as Complete</>
                  )}
                </motion.button>
              </div>
            </Card>

            {/* Slots Timeline */}
            <Card delay={0.12}>
              <SectionHeader icon={<Clock size={15} />} title="Schedule & Slots" />
              <div style={{ padding: "20px 24px" }}>
                {service.selectedSlots && service.selectedSlots.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {service.selectedSlots.map((slot, idx) => {
                      const meta = slotMeta(slot.slotType);
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 + idx * 0.05 }}
                          style={{
                            display: "flex", alignItems: "center", gap: "14px",
                            padding: "13px 16px", borderRadius: "12px",
                            background: meta.bg, border: `1px solid ${meta.border}`,
                          }}
                        >
                          <div style={{
                            width: "34px", height: "34px", borderRadius: "9px",
                            background: "white", border: `1px solid ${meta.border}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: meta.color, flexShrink: 0,
                          }}>
                            {meta.icon}
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: "12px", fontWeight: 700, color: meta.color }}>{meta.label}</p>
                            <p style={{ fontSize: "13px", fontWeight: 600, color: "#334155", marginTop: "1px" }}>
                              {formatShortDate(slot.date)}
                            </p>
                          </div>
                          <span style={{
                            fontSize: "11px", fontWeight: 700, color: meta.color,
                            padding: "3px 9px", borderRadius: "20px",
                            background: "white", border: `1px solid ${meta.border}`,
                          }}>
                            Day {idx + 1}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <p style={{ color: "#94a3b8", fontSize: "14px", fontStyle: "italic", textAlign: "center", padding: "16px 0" }}>
                    No slots scheduled.
                  </p>
                )}
              </div>
            </Card>

            {/* Location */}
            <Card delay={0.16}>
              <SectionHeader icon={<MapPin size={15} />} title="Service Location" />
              <div style={{ padding: "20px 24px" }}>
                {(addressText || service.location?.coordinates) ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {addressText && (
                      <div style={{
                        display: "flex", gap: "12px", alignItems: "flex-start",
                        padding: "14px 16px", borderRadius: "12px",
                        background: "#f8fafc", border: "1px solid #e2e8f0",
                      }}>
                        <MapPin size={16} style={{ color: "#059669", marginTop: "1px", flexShrink: 0 }} />
                        <p style={{ fontSize: "14px", fontWeight: 600, color: "#1e293b", lineHeight: 1.5 }}>{addressText}</p>
                      </div>
                    )}

                    {service.location?.coordinates && (
                      <div style={{
                        padding: "14px 16px", borderRadius: "12px",
                        background: "#ecfdf5", border: "1px solid #a7f3d0",
                        display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
                      }}>
                        <div>
                          <p style={{ fontSize: "11px", fontWeight: 700, color: "#6ee7b7", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "4px" }}>GPS Coordinates</p>
                          <p style={{ fontSize: "12px", fontFamily: "monospace", color: "#065f46", fontWeight: 600 }}>
                            {service.location.coordinates[1]?.toFixed(6)}, {service.location.coordinates[0]?.toFixed(6)}
                          </p>
                        </div>
                        <a
                          href={`https://maps.google.com/?q=${service.location.coordinates[1]},${service.location.coordinates[0]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "inline-flex", alignItems: "center", gap: "5px",
                            padding: "8px 14px", borderRadius: "9px",
                            background: "white", border: "1px solid #a7f3d0",
                            color: "#065f46", fontSize: "12px", fontWeight: 700,
                            textDecoration: "none", flexShrink: 0,
                            boxShadow: "0 2px 8px rgba(5,150,105,0.1)",
                          }}
                        >
                          <ExternalLink size={12} /> Maps
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <p style={{ color: "#94a3b8", fontSize: "14px", fontStyle: "italic", textAlign: "center", padding: "16px 0" }}>
                    No location details provided.
                  </p>
                )}
              </div>
            </Card>

          </div>
        </div>
      </div>

      {/* Responsive stacking */}
      <style>{`
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @media (max-width: 768px) {
          .ongoing-grid {
            grid-template-columns: 1fr !important;
            margin-top: -48px !important;
          }
        }
      `}</style>

      {/* ── Confirmation Modal ── */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0,
              background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(6px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              zIndex: 1000,
              padding: "24px",
            }}
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 340, damping: 30 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: "white",
                borderRadius: "24px",
                padding: "36px 32px",
                maxWidth: "420px",
                width: "100%",
                boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
                textAlign: "center",
              }}
            >
              {/* Icon */}
              <div style={{
                width: "68px", height: "68px", borderRadius: "50%",
                background: "linear-gradient(135deg,#ecfdf5,#d1fae5)",
                border: "1px solid #a7f3d0",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px",
              }}>
                <CheckCheck size={30} style={{ color: "#059669" }} />
              </div>

              <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a", marginBottom: "10px" }}>
                Complete this service?
              </h2>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.7, marginBottom: "28px" }}>
                This will mark the service as <strong>COMPLETED</strong> and cannot be undone.
                Make sure all work is finished before proceeding.
              </p>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={() => setShowConfirm(false)}
                  style={{
                    flex: 1, padding: "12px", borderRadius: "12px",
                    border: "1.5px solid #e2e8f0",
                    background: "white", color: "#475569",
                    fontWeight: 700, fontSize: "14px", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                  }}
                >
                  <X size={15} /> Cancel
                </button>
                <button
                  onClick={handleComplete}
                  style={{
                    flex: 1, padding: "12px", borderRadius: "12px",
                    border: "none",
                    background: "linear-gradient(135deg,#059669,#10b981)",
                    color: "white",
                    fontWeight: 800, fontSize: "14px", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                    boxShadow: "0 6px 20px rgba(5,150,105,0.3)",
                  }}
                >
                  <CheckCheck size={15} /> Yes, Complete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}