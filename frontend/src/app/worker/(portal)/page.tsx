"use client";

import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Navigation,
  CheckCircle,
  Clock,
  Menu,
  Bell,
  User,
  MoreVertical,
  Calendar,
  DollarSign,
  ChevronRight,
  Power,
} from "lucide-react";
import WorkerHeader from "@/components/containers/WorkerHeader";

// --- Shared UI Components (Consistent Theme) ---

const Button = ({
  children,
  variant = "primary",
  className = "",
  size = "default",
  ...props
}: any) => {
  const baseStyle =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50";

  const sizes = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-9 rounded-md px-3 text-xs",
    lg: "h-11 rounded-md px-8 text-base",
    icon: "h-10 w-10",
  };

  const variants = {
    primary: "bg-emerald-600 text-white shadow hover:bg-emerald-700",
    secondary:
      "bg-zinc-800 text-zinc-100 shadow-sm hover:bg-zinc-700 border border-zinc-700",
    ghost: "hover:bg-zinc-800 text-zinc-300 hover:text-white",
    destructive:
      "bg-red-900/50 text-red-200 hover:bg-red-900/70 border border-red-900",
    outline:
      "border border-zinc-700 bg-transparent shadow-sm hover:bg-zinc-800 text-zinc-100",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${
        sizes[size as keyof typeof sizes]
      } ${className}`}
      {...props}
    >
      {/* {children} */}
    </button>
  );
};

const Card = ({ children, className = "" }: any) => (
  <div
    className={`rounded-xl border border-zinc-800 bg-zinc-900/50 text-zinc-100 shadow-sm backdrop-blur-xl ${className}`}
  >
    {/* {children} */}
  </div>
);

const Badge = ({ children, variant = "default" }: any) => {
  const styles = {
    // default: "bg-zinc-800 text-zinc-300 border-zinc-700",
    // success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    // warning: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    // blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };

  return (
    <div
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${
        styles[variant as keyof typeof styles]
      }`}
    >
      {children}
    </div>
  );
};

// --- Mock Map Component ---

const MapView = () => (
  <div></div>
  // <div className="relative w-full h-64 bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700 group">
  //   {/* Mock Map Background Pattern */}
  //   <div
  //     className="absolute inset-0 opacity-20"
  //     style={{
  //       backgroundImage: "radial-gradient(#4b5563 1px, transparent 1px)",
  //       backgroundSize: "20px 20px",
  //     }}
  //   />

  //   {/* Mock Streets */}
  //   <div className="absolute top-0 left-1/3 w-4 h-full bg-zinc-700/50 transform -skew-x-12" />
  //   <div className="absolute top-1/2 left-0 w-full h-3 bg-zinc-700/50 transform rotate-3" />

  //   {/* Destination Pin */}
  //   <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
  //     <div className="relative">
  //       <div className="w-4 h-4 bg-emerald-500 rounded-full animate-ping absolute opacity-75" />
  //       <div className="w-4 h-4 bg-emerald-600 rounded-full border-2 border-zinc-900 z-10 relative shadow-lg shadow-emerald-900/50" />
  //     </div>
  //     <div className="mt-1 bg-zinc-900/90 px-2 py-1 rounded text-xs font-medium text-white border border-zinc-700 shadow-xl">
  //       Customer Location
  //     </div>
  //   </div>

  //   {/* Map Controls Overlay */}
  //   <div className="absolute bottom-4 right-4 flex gap-2">
  //     <Button
  //       size="sm"
  //       variant="secondary"
  //       className="shadow-lg bg-zinc-900/90"
  //     >
  //       <Navigation className="w-4 h-4 mr-2 text-emerald-500" />
  //       Open Maps
  //     </Button>
  //   </div>
  // </div>
);

// --- Main Page Component ---

export default function WorkerHomePage() {
  const [isOnline, setIsOnline] = useState(true);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans pb-20 md:pb-0">
      {/* Header */}

      <WorkerHeader />
      <main className="container mx-auto max-w-2xl px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="flex justify-between items-end">
          <div>
            <p className="text-zinc-400 text-sm">Good Afternoon,</p>
            <h1 className="text-2xl font-bold text-white">Alex Walker</h1>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-500 uppercase tracking-wider">
              Today's Earnings
            </p>
            <p className="text-xl font-mono font-semibold text-emerald-400">
              $145.00
            </p>
          </div>
        </div>
        {/* Current Active Job Card */}
        <section>
          <div className="flex items-center justify-between mb-3">
            {/* <h2 className="text-lg font-semibold flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              Current Job
            </h2> */}
            <Badge variant="success">In Progress</Badge>
          </div>

          <Card className="overflow-hidden">
            {/* Map Section */}
            <MapView />

            <div className="p-5 space-y-6">
              {/* Job Header Details */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Leaky Faucet Repair
                  </h3>
                  <p className="text-zinc-400 text-sm mt-1">
                    Job ID #8923 • Residential
                  </p>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center text-emerald-400 bg-emerald-950/30 px-2 py-1 rounded border border-emerald-900">
                    <Clock className="w-3 h-3 mr-1.5" />
                    <span className="text-xs font-mono">00:45:20</span>
                  </div>
                </div>
              </div>

              {/* Address & Contact */}
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                  <MapPin className="w-5 h-5 text-zinc-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-zinc-200 font-medium">
                      1245 Maple Avenue, Apt 4B
                    </p>
                    <p className="text-xs text-zinc-500">
                      Greenwood District, NY 10012
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1 gap-2" variant="secondary">
                    <Navigation className="w-4 h-4" />
                    Navigate
                  </Button>
                  <Button className="flex-1 gap-2" variant="secondary">
                    <Phone className="w-4 h-4" />
                    Call
                  </Button>
                </div>
              </div>

              <div className="h-px bg-zinc-800" />

              {/* Job Actions */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-zinc-400 uppercase tracking-wider ">
                  Job Actions
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-zinc-300 hover:text-white hover:border-zinc-600"
                  >
                    <MoreVertical className="w-4 h-4 mr-2" />
                    Add Notes
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-zinc-300 hover:text-white hover:border-zinc-600"
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Add Extra Cost
                  </Button>
                </div>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-6 text-lg shadow-lg shadow-emerald-900/20">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Complete Job
                </Button>
              </div>
            </div>
          </Card>
        </section>
        {/* Upcoming Queue (Simple List) */}
        <section>
          <h3 className="text-sm font-medium text-zinc-400 mb-3 uppercase tracking-wider">
            Up Next
          </h3>
          <Card className="divide-y divide-zinc-800">
            <div className="p-4 flex items-center justify-between hover:bg-zinc-900/80 transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:bg-zinc-800 group-hover:text-zinc-300 transition-colors">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-zinc-200">
                    Ceiling Fan Installation
                  </p>
                  <p className="text-xs text-zinc-500">3:30 PM • 5.2km away</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400" />
            </div>
            <div className="p-4 flex items-center justify-between hover:bg-zinc-900/80 transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:bg-zinc-800 group-hover:text-zinc-300 transition-colors">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-zinc-200">
                    Switchboard Repair
                  </p>
                  <p className="text-xs text-zinc-500">5:00 PM • 1.8km away</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400" />
            </div>
          </Card>
        </section>
        <div className="h-12 md:h-0" />{" "}
        {/* Spacer for mobile bottom nav if added later */}
      </main>
    </div>
  );
}
