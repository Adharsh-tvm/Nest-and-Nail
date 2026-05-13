import React from 'react';
import { getWorkerDetailAction } from '@/app/actions/client/view-worker-actions';
import {
    MapPin, Star, Briefcase, CheckCircle2, XCircle,
    ChevronLeft, Phone, Calendar, Zap, Award, Clock,
    ShieldCheck, ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default async function WorkerDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const paramsObj = await params;
    const { success, data: worker, error } = await getWorkerDetailAction(paramsObj.id);

    if (error || !success || !worker) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdf4 100%)' }}>
                <div style={{
                    background: 'white',
                    borderRadius: '24px',
                    padding: '48px',
                    maxWidth: '440px',
                    width: '100%',
                    textAlign: 'center',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.08)',
                    border: '1px solid #f1f5f9'
                }}>
                    <div style={{
                        width: '72px', height: '72px',
                        background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 20px'
                    }}>
                        <XCircle style={{ width: '32px', height: '32px', color: '#ef4444' }} />
                    </div>
                    <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>Worker Not Found</h2>
                    <p style={{ color: '#6b7280', marginBottom: '28px', lineHeight: 1.6 }}>
                        {error || "The worker profile you're looking for doesn't exist or is unavailable."}
                    </p>
                    <Link href="/client/workers" style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        background: 'linear-gradient(135deg, #059669, #10b981)',
                        color: 'white', padding: '12px 24px', borderRadius: '12px',
                        fontWeight: 700, textDecoration: 'none', fontSize: '14px'
                    }}>
                        <ChevronLeft size={16} /> Back to workers
                    </Link>
                </div>
            </div>
        );
    }

    const initials = worker.name.substring(0, 2).toUpperCase();
    const primaryRole = worker.categories && worker.categories.length > 0
        ? worker.categories[0]
        : (worker.skills && worker.skills.length > 0 ? worker.skills[0] : 'Professional Worker');

    const profileImageSrc = (() => {
        const url = worker.profileImageUrl || worker.profilePictureUrl;
        if (!url) return null;
        if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) return url;
        if (!url.startsWith('/')) return `https://nestnail-storage-2026.s3.ap-south-1.amazonaws.com/${url}`;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        return `${baseUrl}/${url.replace(/^\//, '')}`;
    })();

    const memberSince = worker.createdAt
        ? new Date(worker.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : 'Recently';

    const addressText = worker.address && worker.address.length > 0
        ? `${worker.address[0].street ? worker.address[0].street + ', ' : ''}${worker.address[0].city}${worker.address[0].state ? ', ' + worker.address[0].state : ''}`
        : 'Location details hidden';

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc' }}>

            {/* ── Hero Banner ── */}
            <div style={{
                background: 'linear-gradient(135deg, #064e3b 0%, #065f46 40%, #047857 100%)',
                position: 'relative',
                overflow: 'hidden',
                paddingTop: '28px',
                paddingBottom: '100px',
            }}>
                {/* Decorative blobs */}
                <div style={{
                    position: 'absolute', top: '-60px', right: '-60px',
                    width: '320px', height: '320px', borderRadius: '50%',
                    background: 'rgba(16,185,129,0.15)', filter: 'blur(60px)'
                }} />
                <div style={{
                    position: 'absolute', bottom: '-40px', left: '10%',
                    width: '200px', height: '200px', borderRadius: '50%',
                    background: 'rgba(52,211,153,0.12)', filter: 'blur(50px)'
                }} />

                <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
                    <Link href="/client/workers" style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        color: 'rgba(255,255,255,0.75)', textDecoration: 'none',
                        fontSize: '14px', fontWeight: 600,
                        padding: '8px 16px', borderRadius: '10px',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(8px)',
                        transition: 'all 0.2s',
                        marginBottom: '32px',
                    }}>
                        <ChevronLeft size={16} /> Back to Workers
                    </Link>
                </div>
            </div>

            {/* ── Content ── */}
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 64px' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '28px',
                    marginTop: '-72px',
                    position: 'relative',
                    zIndex: 10,
                    alignItems: 'start',
                }}>

                    {/* ════ LEFT PANEL ════ */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* Profile Card */}
                        <div style={{
                            background: 'white',
                            borderRadius: '28px',
                            padding: '36px 28px 28px',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                            border: '1px solid #e2e8f0',
                            textAlign: 'center',
                            position: 'relative',
                            overflow: 'hidden',
                        }}>
                            {/* Card accent top strip */}
                            <div style={{
                                position: 'absolute', top: 0, left: 0, right: 0, height: '5px',
                                background: worker.isOnline
                                    ? 'linear-gradient(90deg, #10b981, #34d399)'
                                    : 'linear-gradient(90deg, #94a3b8, #cbd5e1)'
                            }} />

                            {/* Online badge */}
                            <div style={{ position: 'absolute', top: '18px', right: '18px' }}>
                                {worker.isOnline ? (
                                    <span style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                                        padding: '5px 12px', borderRadius: '20px',
                                        background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
                                        color: '#065f46', fontSize: '12px', fontWeight: 700,
                                        border: '1px solid #6ee7b7',
                                    }}>
                                        <span style={{
                                            width: '7px', height: '7px', borderRadius: '50%',
                                            background: '#10b981',
                                            boxShadow: '0 0 0 3px rgba(16,185,129,0.25)',
                                            animation: 'pulse 2s infinite'
                                        }} />
                                        Online
                                    </span>
                                ) : (
                                    <span style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                                        padding: '5px 12px', borderRadius: '20px',
                                        background: '#f1f5f9', color: '#64748b',
                                        fontSize: '12px', fontWeight: 700,
                                        border: '1px solid #e2e8f0',
                                    }}>
                                        <span style={{
                                            width: '7px', height: '7px', borderRadius: '50%',
                                            background: '#94a3b8'
                                        }} />
                                        Offline
                                    </span>
                                )}
                            </div>

                            {/* Avatar */}
                            <div style={{
                                width: '110px', height: '110px',
                                borderRadius: '50%',
                                margin: '0 auto 16px',
                                position: 'relative',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <div style={{
                                    position: 'absolute', inset: '-4px', borderRadius: '50%',
                                    background: worker.isOnline
                                        ? 'linear-gradient(135deg, #10b981, #34d399)'
                                        : 'linear-gradient(135deg, #94a3b8, #cbd5e1)',
                                    zIndex: 0,
                                }} />
                                <div style={{
                                    width: '110px', height: '110px', borderRadius: '50%',
                                    overflow: 'hidden',
                                    background: 'linear-gradient(135deg, #e2e8f0, #f1f5f9)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    position: 'relative', zIndex: 1,
                                    border: '3px solid white',
                                }}>
                                    {profileImageSrc ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={profileImageSrc} alt={worker.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <span style={{ fontSize: '36px', fontWeight: 800, color: '#94a3b8', letterSpacing: '-1px' }}>{initials}</span>
                                    )}
                                </div>
                            </div>

                            {/* Name + role */}
                            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '4px', letterSpacing: '-0.5px' }}>
                                {worker.name}
                            </h1>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '14px' }}>
                                <Briefcase size={14} style={{ color: '#10b981' }} />
                                <span style={{ fontSize: '14px', fontWeight: 600, color: '#475569' }}>{primaryRole}</span>
                            </div>

                            {/* Rating row */}
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
                                padding: '8px 18px', borderRadius: '12px',
                                border: '1px solid #fde68a', marginBottom: '20px',
                            }}>
                                <Star size={15} style={{ fill: '#f59e0b', color: '#f59e0b' }} />
                                <span style={{ fontSize: '15px', fontWeight: 800, color: '#92400e' }}>
                                    {worker.rating ? worker.rating.toFixed(1) : 'New'}
                                </span>
                                <span style={{ fontSize: '13px', color: '#a16207', fontWeight: 500 }}>
                                    ({worker.totalRatings || 0} reviews)
                                </span>
                            </div>

                            {/* Distance */}
                            {worker.distance !== undefined && (
                                <div style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                                    fontSize: '13px', fontWeight: 600, color: '#064e3b',
                                    background: '#d1fae5', padding: '5px 12px',
                                    borderRadius: '8px', border: '1px solid #a7f3d0',
                                    marginBottom: '20px', marginLeft: '8px',
                                }}>
                                    <MapPin size={13} />
                                    {worker.distance < 1000
                                        ? `${Math.round(worker.distance)} m away`
                                        : `${(worker.distance / 1000).toFixed(1)} km away`}
                                </div>
                            )}

                            {/* CTA */}
                            <div style={{ marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {worker.isOnline ? (
                                    <>
                                        <Link href={`/client/workers/${paramsObj.id}/book`} style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                            width: '100%',
                                            background: 'linear-gradient(135deg, #059669, #10b981)',
                                            color: 'white', fontWeight: 700, fontSize: '15px',
                                            padding: '14px 20px', borderRadius: '14px',
                                            textDecoration: 'none',
                                            boxShadow: '0 8px 24px rgba(5,150,105,0.3)',
                                            transition: 'all 0.2s',
                                        }}>
                                            Book a Service <ArrowRight size={16} />
                                        </Link>
                                        <Link href={`/client/workers/${paramsObj.id}/meeting`} style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                            width: '100%',
                                            background: 'white',
                                            color: '#059669', fontWeight: 700, fontSize: '15px',
                                            padding: '12px 20px', borderRadius: '14px',
                                            border: '2px solid #10b981',
                                            textDecoration: 'none',
                                            transition: 'all 0.2s',
                                        }}>
                                            Schedule a Meeting <Calendar size={16} />
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <button disabled title="Worker is currently offline" style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                            width: '100%', border: 'none',
                                            background: '#f1f5f9', color: '#94a3b8',
                                            fontWeight: 700, fontSize: '15px',
                                            padding: '14px 20px', borderRadius: '14px',
                                            cursor: 'not-allowed',
                                        }}>
                                            Book a Service
                                            <span style={{ fontSize: '12px', fontWeight: 500, color: '#b0bfcf' }}>· Unavailable</span>
                                        </button>
                                        <button disabled title="Worker is currently offline" style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                            width: '100%', border: '2px solid #e2e8f0',
                                            background: 'transparent', color: '#94a3b8',
                                            fontWeight: 700, fontSize: '15px',
                                            padding: '12px 20px', borderRadius: '14px',
                                            cursor: 'not-allowed',
                                        }}>
                                            Schedule a Meeting
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Stats row */}
                        <div style={{
                            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px',
                        }}>
                            {[
                                { icon: <Calendar size={18} style={{ color: '#7c3aed' }} />, label: 'Member Since', value: memberSince, bg: '#f5f3ff', border: '#ede9fe' },
                                { icon: <Zap size={18} style={{ color: '#d97706' }} />, label: 'Weekly Jobs', value: String(worker.weeklyJobCount || 0), bg: '#fffbeb', border: '#fde68a' },
                            ].map((stat, i) => (
                                <div key={i} style={{
                                    background: stat.bg, border: `1px solid ${stat.border}`,
                                    borderRadius: '18px', padding: '18px 14px', textAlign: 'center',
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>{stat.icon}</div>
                                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '3px' }}>{stat.value}</div>
                                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Contact & Info Card */}
                        <div style={{
                            background: 'white', borderRadius: '22px',
                            padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                            border: '1px solid #e2e8f0',
                        }}>
                            <h3 style={{
                                fontSize: '13px', fontWeight: 700, color: '#94a3b8',
                                textTransform: 'uppercase', letterSpacing: '1px',
                                marginBottom: '18px', paddingBottom: '12px',
                                borderBottom: '1px solid #f1f5f9'
                            }}>
                                Contact & Location
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                {/* Address */}
                                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                                    <div style={{
                                        width: '38px', height: '38px', borderRadius: '10px',
                                        background: '#ecfdf5', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                    }}>
                                        <MapPin size={17} style={{ color: '#059669' }} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Service Area</p>
                                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{addressText}</p>
                                    </div>
                                </div>

                                {/* Phone */}
                                {worker.phone_number && (
                                    <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                                        <div style={{
                                            width: '38px', height: '38px', borderRadius: '10px',
                                            background: '#f0fdf4', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                        }}>
                                            <Phone size={17} style={{ color: '#059669' }} />
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone</p>
                                            <p style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{worker.phone_number}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Verification */}
                                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                                    <div style={{
                                        width: '38px', height: '38px', borderRadius: '10px',
                                        background: '#f0fdf4', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                    }}>
                                        <ShieldCheck size={17} style={{ color: '#059669' }} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Verification</p>
                                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', textTransform: 'capitalize' }}>{worker.isVerified.toLowerCase()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ════ RIGHT PANEL ════ */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* Expertise Banner */}
                        <div style={{
                            background: 'white', borderRadius: '28px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                            border: '1px solid #e2e8f0', overflow: 'hidden',
                        }}>
                            {/* Section header */}
                            <div style={{
                                padding: '24px 28px 20px',
                                borderBottom: '1px solid #f1f5f9',
                                display: 'flex', alignItems: 'center', gap: '10px',
                            }}>
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '10px',
                                    background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Award size={18} style={{ color: '#059669' }} />
                                </div>
                                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px' }}>
                                    Expertise & Skills
                                </h2>
                            </div>

                            <div style={{ padding: '24px 28px' }}>
                                {/* Categories */}
                                <div style={{ marginBottom: '24px' }}>
                                    <p style={{
                                        fontSize: '11px', fontWeight: 700, color: '#94a3b8',
                                        textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px'
                                    }}>Service Categories</p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {worker.categories && worker.categories.length > 0 ? (
                                            worker.categories.map((cat, idx) => (
                                                <span key={idx} style={{
                                                    padding: '7px 16px',
                                                    background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
                                                    color: '#065f46', fontWeight: 700, fontSize: '13px',
                                                    borderRadius: '20px', border: '1px solid #a7f3d0',
                                                }}>
                                                    {cat}
                                                </span>
                                            ))
                                        ) : (
                                            <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '14px' }}>No categories listed.</span>
                                        )}
                                    </div>
                                </div>

                                {/* Skills */}
                                <div>
                                    <p style={{
                                        fontSize: '11px', fontWeight: 700, color: '#94a3b8',
                                        textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px'
                                    }}>Specialized Skills</p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {worker.skills && worker.skills.length > 0 ? (
                                            worker.skills.map((skill, idx) => (
                                                <span key={idx} style={{
                                                    padding: '7px 16px',
                                                    background: '#f8fafc', color: '#334155',
                                                    fontWeight: 600, fontSize: '13px',
                                                    borderRadius: '20px', border: '1px solid #e2e8f0',
                                                }}>
                                                    {skill}
                                                </span>
                                            ))
                                        ) : (
                                            <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '14px' }}>No skills listed.</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Work Portfolio */}
                        {worker.workPhotos && worker.workPhotos.length > 0 && (
                            <div style={{
                                background: 'white', borderRadius: '28px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                border: '1px solid #e2e8f0', overflow: 'hidden',
                            }}>
                                <div style={{
                                    padding: '24px 28px 20px',
                                    borderBottom: '1px solid #f1f5f9',
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                }}>
                                    <div style={{
                                        width: '36px', height: '36px', borderRadius: '10px',
                                        background: 'linear-gradient(135deg, #ede9fe, #ddd6fe)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <Briefcase size={18} style={{ color: '#7c3aed' }} />
                                    </div>
                                    <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px' }}>
                                        Work Portfolio
                                    </h2>
                                    <span style={{
                                        marginLeft: 'auto', background: '#ede9fe',
                                        color: '#7c3aed', fontWeight: 700, fontSize: '12px',
                                        padding: '3px 10px', borderRadius: '20px'
                                    }}>
                                        {worker.workPhotos.length} photos
                                    </span>
                                </div>
                                <div style={{ padding: '24px 28px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                                        {worker.workPhotos.map((photo: string, idx: number) => {
                                            const src = photo.startsWith('http') || photo.startsWith('blob:') || photo.startsWith('data:')
                                                ? photo
                                                : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/${photo.startsWith('/') ? photo.slice(1) : photo}`;
                                            return (
                                                <div key={idx} style={{
                                                    aspectRatio: '1',
                                                    borderRadius: '14px', overflow: 'hidden',
                                                    background: '#f1f5f9',
                                                    border: '1px solid #e2e8f0',
                                                    position: 'relative',
                                                }}>
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={src}
                                                        alt={`Work example ${idx + 1}`}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Ratings & Reviews */}
                        <div style={{
                            background: 'white', borderRadius: '28px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                            border: '1px solid #e2e8f0', overflow: 'hidden',
                        }}>
                            <div style={{
                                padding: '24px 28px 20px',
                                borderBottom: '1px solid #f1f5f9',
                                display: 'flex', alignItems: 'center', gap: '10px',
                            }}>
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '10px',
                                    background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Star size={18} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
                                </div>
                                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px' }}>
                                    Ratings & Reviews
                                </h2>
                                <span style={{
                                    marginLeft: 'auto', background: '#fffbeb',
                                    color: '#92400e', fontWeight: 700, fontSize: '12px',
                                    padding: '3px 10px', borderRadius: '20px', border: '1px solid #fef3c7'
                                }}>
                                    {worker.totalRatings || 0} reviews
                                </span>
                            </div>

                            <div style={{ padding: '24px 28px' }}>
                                {worker.reviews && worker.reviews.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                        {worker.reviews.map((rev, idx) => (
                                            <div key={idx} style={{ 
                                                borderBottom: idx === worker.reviews!.length - 1 ? 'none' : '1px solid #f1f5f9',
                                                paddingBottom: idx === worker.reviews!.length - 1 ? 0 : '24px'
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <div style={{ 
                                                            width: '32px', height: '32px', borderRadius: '50%', 
                                                            background: '#f1f5f9', display: 'flex', alignItems: 'center', 
                                                            justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#64748b'
                                                        }}>
                                                            {rev.clientName?.substring(0, 1).toUpperCase()}
                                                        </div>
                                                        <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '14px' }}>{rev.clientName}</span>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '2px' }}>
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} size={14} style={{ 
                                                                color: i < rev.rating ? '#f59e0b' : '#e2e8f0', 
                                                                fill: i < rev.rating ? '#f59e0b' : '#e2e8f0' 
                                                            }} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, margin: '0 0 8px 42px' }}>
                                                    {rev.review || "No comment provided."}
                                                </p>
                                                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500, marginLeft: '42px' }}>
                                                    {new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '32px 0', color: '#94a3b8' }}>
                                        <div style={{ marginBottom: '12px' }}>
                                            <Star size={32} style={{ color: '#e2e8f0', margin: '0 auto' }} />
                                        </div>
                                        <p style={{ fontSize: '14px', fontWeight: 500 }}>No reviews yet for this worker.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bottom info strip */}
                        <div style={{
                            background: 'white', borderRadius: '18px',
                            padding: '18px 24px', border: '1px solid #e2e8f0',
                            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Clock size={15} style={{ color: '#94a3b8' }} />
                                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
                                    Member since <strong style={{ color: '#334155' }}>{memberSince}</strong>
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <CheckCircle2 size={15} style={{ color: '#10b981' }} />
                                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
                                    Verification: <strong style={{ color: '#065f46', textTransform: 'capitalize' }}>{worker.isVerified.toLowerCase()}</strong>
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}