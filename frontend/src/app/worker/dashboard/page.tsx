"use client"

import React, { useState } from 'react';
import { 
  DollarSign, 
  CheckCircle, 
  Star, 
  Clock, 
  MapPin, 
  Phone, 
  Navigation,
  Check,
  Map,
} from 'lucide-react';
import Header from '@/components/containers/WorkerHeader';

// Since this is a single file, we define all components here.

type StatCardProps = {
  icon: React.ElementType;
  title: string;
  value: string;
  iconColor: string;
};

// --- Dashboard Components ---

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, iconColor }) => (
  <div className="bg-neutral-900 p-5 rounded-xl shadow-lg flex items-center justify-between">
    <div>
      <p className="text-sm text-neutral-400 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-white">{value}</h3>
    </div>
    <div className={`p-3 rounded-full ${iconColor.replace('text-', 'bg-').replace('400', '900')}`}>
      <Icon className={`w-7 h-7 ${iconColor}`} />
    </div>
  </div>
);

const DashboardStats: React.FC = () => {
  const [isAvailable, setIsAvailable] = useState(true);

  return (
    <>
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard icon={DollarSign} title="Today's Earnings" value="₹2,400" iconColor="text-green-400" />
        <StatCard icon={CheckCircle} title="Jobs Completed" value="3" iconColor="text-green-400" />
        <StatCard icon={Star} title="Average Rating" value="4.8" iconColor="text-yellow-400" />
        <StatCard icon={Clock} title="Response Time" value="5 min" iconColor="text-blue-400" />
      </div>

      {/* Service Status Toggle Card */}
      <div className="bg-neutral-900 p-5 rounded-xl shadow-lg flex flex-col sm:flex-row items-center justify-between mb-6">
        <div>
          <h4 className="text-lg font-semibold text-white">Service Status</h4>
          <p className="text-sm text-neutral-400">Available for new jobs</p>
        </div>
        <div className="flex items-center space-x-3 mt-3 sm:mt-0">
          <span className={`text-sm font-medium ${isAvailable ? 'text-green-400' : 'text-neutral-500'}`}>
            {isAvailable ? 'Online' : 'Offline'}
          </span>
          {/* Custom Toggle Switch */}
          <button
            onClick={() => setIsAvailable(!isAvailable)}
            className={`relative inline-flex items-center h-7 w-12 rounded-full transition-colors duration-300 focus:outline-none ${
              isAvailable ? 'bg-green-600' : 'bg-neutral-700'
            }`}
          >
            <span
              className={`inline-block w-5 h-5 transform bg-white rounded-full transition-transform duration-300 ${
                isAvailable ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </>
  );
};

const ActiveServiceCard: React.FC = () => (
  <div className="bg-neutral-900 rounded-xl shadow-lg p-6 lg:col-span-2 h-full flex flex-col">
    {/* Card Header */}
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-xl font-semibold text-white">Current Active Service</h3>
      <span className="bg-green-800 text-green-200 text-xs font-medium px-3 py-1 rounded-full">
        In Progress
      </span>
    </div>

    {/* Customer Info */}
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <div className="bg-neutral-700 w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-xl">
          SJ
        </div>
        <div>
          <h4 className="text-lg font-semibold text-white">Sarah Johnson</h4>
          <p className="text-sm text-neutral-400">Home Cleaning</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xl font-bold text-green-400">₹1,200</p>
        <p className="text-sm text-neutral-500">Service Fee</p>
      </div>
    </div>

    {/* Details List */}
    <div className="space-y-4 mb-8">
      <div className="flex items-center text-neutral-300">
        <MapPin className="w-5 h-5 mr-3 text-neutral-500" />
        <span>123 Park Avenue, Sector 15, Mumbai</span>
      </div>
      <div className="flex items-center text-neutral-300">
        <Clock className="w-5 h-5 mr-3 text-neutral-500" />
        <span>2:00 PM - 4:00 PM</span>
      </div>
      <div className="flex items-center text-neutral-300">
        <Phone className="w-5 h-5 mr-3 text-neutral-500" />
        <span>+91 98765 43210</span>
      </div>
    </div>

    {/* Action Buttons */}
    <div className="mt-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
      <button className="flex items-center justify-center space-x-2 w-full bg-neutral-800 text-white py-3 px-4 rounded-lg hover:bg-neutral-700 transition-colors duration-200">
        <Phone className="w-5 h-5" />
        <span>Call Customer</span>
      </button>
      <button className="flex items-center justify-center space-x-2 w-full bg-neutral-800 text-white py-3 px-4 rounded-lg hover:bg-neutral-700 transition-colors duration-200">
        <Navigation className="w-5 h-5" />
        <span>Get Directions</span>
      </button>
      <button className="flex items-center justify-center space-x-2 w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold">
        <Check className="w-5 h-5" />
        <span>Complete Service</span>
      </button>
    </div>
  </div>
);

const LocationCard: React.FC = () => (
  <div className="bg-neutral-900 rounded-xl shadow-lg p-6 flex flex-col h-full">
    <h3 className="text-xl font-semibold text-white mb-4">Customer Location</h3>
    <p className="text-sm text-neutral-400 mb-4">Live tracking enabled</p>
    
    {/* Map Placeholder */}
    <div className="flex-grow bg-neutral-800 rounded-lg flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
      {/* Faded map background effect */}
      <Map className="w-48 h-48 text-neutral-700 absolute opacity-30" />
      
      <div className="relative z-10 flex flex-col items-center text-center p-4">
        <div className="p-3 bg-blue-600 rounded-full mb-3 shadow-lg">
          <MapPin className="w-6 h-6 text-white" />
        </div>
        <h5 className="font-semibold text-white mb-1">Interactive Map</h5>
        <p className="text-sm text-neutral-400">Click to view full map</p>
      </div>
    </div>
  </div>
);

// --- Main App Component ---

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans">
      <Header />
      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        {/* Dashboard Title */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white">Dashboard</h2>
          <p className="text-neutral-400">Manage your services and bookings</p>
        </div>

        {/* Dashboard Stats */}
        <DashboardStats />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ActiveServiceCard />
          <LocationCard />
        </div>
      </main>
    </div>
  );
}