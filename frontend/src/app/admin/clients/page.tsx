"use client";

import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Wrench, 
  CreditCard, 
  MessageSquare, 
  ShieldCheck, 
  Wallet, 
  Menu, 
  User, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  MoreHorizontal,
  Search,
  Star,
  Phone,
  Mail,
  Filter,
  CheckCircle,
  X,
  ChevronDown
} from 'lucide-react';

// --- Types ---

interface ServiceCategory {
  name: string;
  value: number;
  color: string;
}

interface Worker {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  specialties: string[];
  rating: number;
  servicesCompleted: number;
  status: 'Active' | 'Suspended' | 'Inactive';
  verificationStatus: 'Approved' | 'Pending' | 'Rejected';
  earnings: string;
  avatarColor: string;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  services: number;
  totalPaid: string;
  status: 'Active' | 'Blocked';
  joinDate: string;
  avatarColor: string;
}

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
}

interface HeaderProps {
  title: string;
  subtitle: string;
  onMenuClick: () => void;
}

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
}

// --- Mock Data ---

const serviceCategories: ServiceCategory[] = [
  { name: 'Cleaning', value: 85, color: 'bg-blue-800' },
  { name: 'Plumbing', value: 65, color: 'bg-blue-800' },
  { name: 'Electrical', value: 55, color: 'bg-blue-800' },
  { name: 'Gardening', value: 45, color: 'bg-blue-800' },
  { name: 'Painting', value: 30, color: 'bg-blue-800' },
];

const workersData: Worker[] = [
  { 
    id: 1, 
    name: 'John Smith', 
    email: 'john.smith@worker.com',
    phone: '+1 (555) 123-4567',
    role: 'Plumber', 
    specialties: ['Plumbing', 'Electrical'],
    rating: 4.9, 
    servicesCompleted: 156, 
    status: 'Active',
    verificationStatus: 'Approved',
    earnings: '$8,940',
    avatarColor: 'bg-blue-600'
  },
  { 
    id: 2, 
    name: 'Sarah Johnson', 
    email: 'sarah.johnson@worker.com',
    phone: '+1 (555) 234-5678',
    role: 'Cleaner', 
    specialties: ['Cleaning', 'Gardening'],
    rating: 4.8, 
    servicesCompleted: 142, 
    status: 'Active',
    verificationStatus: 'Approved',
    earnings: '$8,320',
    avatarColor: 'bg-emerald-600'
  },
  { 
    id: 3, 
    name: 'Mike Wilson', 
    email: 'mike.wilson@worker.com',
    phone: '+1 (555) 345-6789',
    role: 'Painter', 
    specialties: ['Painting', 'Repairs'],
    rating: 4.7, 
    servicesCompleted: 128, 
    status: 'Suspended',
    verificationStatus: 'Approved',
    earnings: '$7,680',
    avatarColor: 'bg-indigo-600'
  },
];

const customersData: Customer[] = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice.johnson@email.com",
    phone: "+1 (555) 123-4567",
    services: 23,
    totalPaid: "$2,340",
    status: "Active",
    joinDate: "1/15/2024",
    avatarColor: "bg-blue-900"
  },
  {
    id: 2,
    name: "Robert Smith",
    email: "robert.smith@email.com",
    phone: "+1 (555) 234-5678",
    services: 45,
    totalPaid: "$5,670",
    status: "Active",
    joinDate: "11/22/2023",
    avatarColor: "bg-blue-800"
  },
  {
    id: 3,
    name: "Emma Davis",
    email: "emma.davis@email.com",
    phone: "+1 (555) 345-6789",
    services: 12,
    totalPaid: "$1,890",
    status: "Blocked",
    joinDate: "2/8/2024",
    avatarColor: "bg-blue-700"
  },
  {
    id: 4,
    name: "Michael Wilson",
    email: "michael.wilson@email.com",
    phone: "+1 (555) 456-7890",
    services: 67,
    totalPaid: "$8,920",
    status: "Active",
    joinDate: "9/14/2023",
    avatarColor: "bg-blue-900"
  }
];


// --- Sub-Components (Nav & Sidebar) ---

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, isMobileOpen, setIsMobileOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'workers', label: 'Workers', icon: Briefcase },
    { id: 'services', label: 'Services', icon: Wrench },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'complaints', label: 'Complaints', icon: MessageSquare },
    { id: 'verification', label: 'Verification', icon: ShieldCheck },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-[#0f172a] text-slate-300 
        transition-transform duration-300 ease-in-out flex flex-col
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Area */}
        <div className="p-6 flex items-center justify-between border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <ShieldCheck className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-none">ServicePro</h1>
              <span className="text-xs text-slate-400">Admin Portal</span>
            </div>
          </div>
          {/* Close Button (Mobile Only) */}
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMobileOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
                  ${isActive 
                    ? 'bg-[#f97316] text-white shadow-md shadow-orange-500/20 font-medium' 
                    : 'hover:bg-slate-800 hover:text-white'
                  }
                `}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-slate-700/50">
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            System Operational
          </div>
        </div>
      </aside>
    </>
  );
};

const Header: React.FC<HeaderProps> = ({ title, subtitle, onMenuClick }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4 flex justify-between items-center shadow-sm lg:shadow-none">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-slate-100 rounded-md text-slate-600 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          <p className="text-sm text-slate-500 hidden sm:block">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors">
          <User className="w-4 h-4" />
          <span className="text-sm font-medium">Profile</span>
        </button>
        <button className="sm:hidden p-2 bg-slate-100 rounded-full">
          <User className="w-5 h-5 text-slate-600" />
        </button>
      </div>
    </header>
  );
};

// --- Dashboard View Components ---

const StatCard = ({ title, value, change, isPositive, icon: Icon, iconColor, iconBg }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${iconBg}`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
    </div>
    <div className="flex items-center text-xs font-medium">
      <span className={`flex items-center gap-1 ${isPositive ? 'text-emerald-600' : 'text-rose-500'}`}>
        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {change}
      </span>
      <span className="text-slate-400 ml-2">from last month</span>
    </div>
  </div>
);

const ChartsSection = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
      <div className="mb-2">
        <h3 className="text-lg font-bold text-slate-800">Revenue Trends</h3>
        <p className="text-sm text-slate-500">Monthly revenue vs payouts comparison</p>
      </div>
      <div className="relative h-64 w-full mt-4">
        <div className="absolute inset-0 flex flex-col justify-between text-xs text-slate-400">
          {[80000, 60000, 40000, 20000, 0].map((val, i) => (
            <div key={i} className="flex items-center w-full">
              <span className="w-10 text-right mr-2">{val}</span>
              <div className="flex-1 border-t border-dashed border-slate-200"></div>
            </div>
          ))}
        </div>
        <svg className="absolute inset-0 h-full w-full ml-12 pr-4 pt-2 pb-6" preserveAspectRatio="none">
          <path d="M0,100 C50,80 100,90 150,60 C200,30 250,50 300,40 C350,30 400,10 450,20 L500,10" fill="none" stroke="#1e40af" strokeWidth="3" vectorEffect="non-scaling-stroke" />
          <path d="M0,130 C50,120 100,125 150,100 C200,75 250,90 300,85 C350,80 400,60 450,70 L500,50" fill="none" stroke="#f97316" strokeWidth="3" vectorEffect="non-scaling-stroke" />
          <circle cx="150" cy="60" r="4" fill="#1e40af" />
          <circle cx="300" cy="40" r="4" fill="#1e40af" />
          <circle cx="150" cy="100" r="4" fill="#f97316" />
          <circle cx="300" cy="85" r="4" fill="#f97316" />
        </svg>
        <div className="absolute bottom-0 left-12 right-0 flex justify-between text-xs text-slate-500 pt-2">
          <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
        </div>
      </div>
    </div>
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
      <div className="mb-2">
        <h3 className="text-lg font-bold text-slate-800">Service Categories</h3>
        <p className="text-sm text-slate-500">Distribution of services by category</p>
      </div>
      <div className="h-64 w-full mt-4 flex items-end justify-between px-2 gap-2">
        {serviceCategories.map((cat, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
            <div className="relative w-full bg-slate-100 rounded-t-md h-56 flex items-end overflow-hidden">
              <div className={`w-full ${cat.color} hover:bg-blue-600 transition-all duration-500 rounded-t-md relative`} style={{ height: `${cat.value}%` }}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {cat.value} jobs
                </div>
              </div>
            </div>
            <span className="text-xs text-slate-500 font-medium truncate w-full text-center">{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const DashboardTable = () => (
  <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
      <div>
        <h3 className="text-lg font-bold text-slate-800">Top Performing Workers</h3>
        <p className="text-sm text-slate-500">Based on rating, services completed, and earnings</p>
      </div>
      <button className="text-sm font-medium text-slate-600 hover:text-blue-600 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
        View All
      </button>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="bg-slate-50 text-slate-800 font-semibold">
          <tr>
            <th className="p-4">Worker Name</th>
            <th className="p-4">Role</th>
            <th className="p-4">Rating</th>
            <th className="p-4">Jobs Done</th>
            <th className="p-4">Earnings</th>
            <th className="p-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {workersData.map((worker) => (
            <tr key={worker.id} className="hover:bg-slate-50 transition-colors">
              <td className="p-4 font-medium text-slate-800">{worker.name}</td>
              <td className="p-4">
                <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
                  {worker.role}
                </span>
              </td>
              <td className="p-4 flex items-center gap-1">
                <span className="font-bold text-slate-800">{worker.rating}</span>
                <span className="text-yellow-400">★</span>
              </td>
              <td className="p-4">{worker.servicesCompleted}</td>
              <td className="p-4 font-medium text-emerald-600">{worker.earnings}</td>
              <td className="p-4 text-right">
                <button className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// --- CUSTOMERS PAGE COMPONENT (New) ---

const CustomersView = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6 pt-4">
      
      {/* Top Stats - Specific to Customers Page */}
      <div className="flex justify-end gap-4 mb-2">
        <div className="bg-white px-6 py-3 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
             <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Customers</p>
            <p className="text-lg font-bold text-slate-800">5</p>
          </div>
        </div>
      </div>

      {/* Filters & Search Section */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          
          {/* Search Bar */}
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-600"
            />
          </div>

          {/* Filter Toggles */}
          <div className="flex flex-wrap gap-4 w-full lg:w-auto">
            <div className="flex items-center bg-slate-100 p-1 rounded-lg">
              <button className="px-4 py-1.5 text-xs font-medium bg-blue-900 text-white rounded-md shadow-sm">All</button>
              <button className="px-4 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900">Active</button>
              <button className="px-4 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900">Blocked</button>
            </div>
          </div>
        </div>
      </div>

      {/* Customer List Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-800">Customer List</h3>
          {/* <p className="text-sm text-slate-500">View and manage customer accounts and activity</p> */}
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-800 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-5 min-w-[200px]">Customer</th>
                <th className="p-5 min-w-[250px]">Contact</th>
                <th className="p-5">Services</th>
                <th className="p-5">Total Paid</th>
                <th className="p-5">Status</th>
                <th className="p-5">Join Date</th>
                <th className="p-5 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customersData.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50 transition-colors group">
                  {/* Customer Column */}
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${customer.avatarColor} text-white flex items-center justify-center font-bold text-sm`}>
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{customer.name}</p>
                        <p className="text-xs text-slate-400">ID: {customer.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="p-5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Mail className="w-3 h-3" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Phone className="w-3 h-3" />
                        {customer.phone}
                      </div>
                    </div>
                  </td>

                  {/* Services */}
                  <td className="p-5">
                    <span className="font-medium text-slate-700">{customer.services}</span>
                  </td>

                  {/* Total Paid */}
                  <td className="p-5 font-semibold text-slate-700">{customer.totalPaid}</td>

                  {/* Status */}
                  <td className="p-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      customer.status === 'Active' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-white text-rose-600 border-rose-200'
                    }`}>
                      {customer.status}
                    </span>
                  </td>

                   {/* Join Date */}
                   <td className="p-5 text-slate-500">
                    {customer.joinDate}
                  </td>

                  {/* Actions */}
                  <td className="p-5 text-right">
                    <button className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


export default CustomersView;