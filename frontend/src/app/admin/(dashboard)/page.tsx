// import React from "react";
// import {
//   DollarSign,
//   User,
//   Briefcase,
//   Clock,
//   TrendingUp,
//   TrendingDown,
//   MoreHorizontal,
// } from "lucide-react";

// interface StatCardProps {
//   title: string;
//   value: string;
//   change: string;
//   isPositive: boolean;
//   icon: React.ComponentType<any>;
//   iconColor: string;
//   iconBg: string;
// }

// interface ServiceCategory {
//   name: string;
//   value: number;
//   color: string;
// }

// interface Worker {
//   id: number;
//   name: string;
//   role: string;
//   rating: number;
//   jobs: number;
//   earnings: string;
// }

// const serviceCategories: ServiceCategory[] = [
//   { name: "Cleaning", value: 85, color: "bg-blue-800" },
//   { name: "Plumbing", value: 65, color: "bg-blue-800" },
//   { name: "Electrical", value: 55, color: "bg-blue-800" },
//   { name: "Gardening", value: 45, color: "bg-blue-800" },
//   { name: "Painting", value: 30, color: "bg-blue-800" },
// ];

// const workers: Worker[] = [
//   {
//     id: 1,
//     name: "Sarah Johnson",
//     role: "Cleaner",
//     rating: 4.9,
//     jobs: 124,
//     earnings: "$4,200",
//   },
//   {
//     id: 2,
//     name: "Mike Chen",
//     role: "Plumber",
//     rating: 4.8,
//     jobs: 98,
//     earnings: "$5,600",
//   },
//   {
//     id: 3,
//     name: "Jessica Davis",
//     role: "Electrician",
//     rating: 5.0,
//     jobs: 85,
//     earnings: "$6,100",
//   },
// ];

// const StatCard: React.FC<StatCardProps> = ({
//   title,
//   value,
//   change,
//   isPositive,
//   icon: Icon,
//   iconColor,
//   iconBg,
// }) => (
//   <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
//     <div className="flex justify-between items-start mb-4">
//       <div>
//         <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
//         <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
//       </div>
//       <div className={`p-3 rounded-lg ${iconBg}`}>
//         <Icon className={`w-5 h-5 ${iconColor}`} />
//       </div>
//     </div>
//     <div className="flex items-center text-xs font-medium">
//       <span
//         className={`flex items-center gap-1 ${
//           isPositive ? "text-emerald-600" : "text-rose-500"
//         }`}
//       >
//         {isPositive ? (
//           <TrendingUp className="w-3 h-3" />
//         ) : (
//           <TrendingDown className="w-3 h-3" />
//         )}
//         {change}
//       </span>
//       <span className="text-slate-400 ml-2">from last month</span>
//     </div>
//   </div>
// );

// const LineChartMock: React.FC = () => (
//   <div className="relative h-64 w-full mt-4">
//     <div className="absolute inset-0 flex flex-col justify-between text-xs text-slate-400">
//       {[80000, 60000, 40000, 20000, 0].map((val, i) => (
//         <div key={i} className="flex items-center w-full">
//           <span className="w-10 text-right mr-2">{val}</span>
//           <div className="flex-1 border-t border-dashed border-slate-200" />
//         </div>
//       ))}
//     </div>

//     <svg
//       className="absolute inset-0 h-full w-full ml-12 pr-4 pt-2 pb-6"
//       preserveAspectRatio="none"
//       aria-hidden
//     >
//       <path
//         d="M0,100 C50,80 100,90 150,60 C200,30 250,50 300,40 C350,30 400,10 450,20 L500,10"
//         fill="none"
//         stroke="#1e40af"
//         strokeWidth="3"
//         vectorEffect="non-scaling-stroke"
//       />
//       <path
//         d="M0,130 C50,120 100,125 150,100 C200,75 250,90 300,85 C350,80 400,60 450,70 L500,50"
//         fill="none"
//         stroke="#f97316"
//         strokeWidth="3"
//         vectorEffect="non-scaling-stroke"
//       />
//       <circle cx="150" cy="60" r="4" fill="#1e40af" />
//       <circle cx="300" cy="40" r="4" fill="#1e40af" />
//       <circle cx="150" cy="100" r="4" fill="#f97316" />
//       <circle cx="300" cy="85" r="4" fill="#f97316" />
//     </svg>

//     <div className="absolute bottom-0 left-12 right-0 flex justify-between text-xs text-slate-500 pt-2">
//       <span>Jan</span>
//       <span>Feb</span>
//       <span>Mar</span>
//       <span>Apr</span>
//       <span>May</span>
//       <span>Jun</span>
//     </div>
//   </div>
// );

// const BarChartMock: React.FC = () => (
//   <div className="h-64 w-full mt-4 flex items-end justify-between px-2 gap-2">
//     {serviceCategories.map((cat, idx) => (
//       <div
//         key={idx}
//         className="flex flex-col items-center gap-2 flex-1 group cursor-pointer"
//       >
//         <div className="relative w-full bg-slate-100 rounded-t-md h-56 flex items-end overflow-hidden">
//           <div
//             className={`w-full ${cat.color} hover:bg-blue-600 transition-all duration-500 rounded-t-md relative`}
//             style={{ height: `${cat.value}%` }}
//           >
//             <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
//               {cat.value} jobs
//             </div>
//           </div>
//         </div>
//         <span className="text-xs text-slate-500 font-medium truncate w-full text-center">
//           {cat.name}
//         </span>
//       </div>
//     ))}
//   </div>
// );

// export default function DashboardPage() {
//   return (
//     <div className="p-6 max-w-7xl mx-auto space-y-6">
//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatCard
//           title="Total Revenue"
//           value="$328,000"
//           change="+12.5%"
//           isPositive={true}
//           icon={DollarSign}
//           iconBg="bg-emerald-50"
//           iconColor="text-emerald-600"
//         />
//         <StatCard
//           title="Total Payouts"
//           value="$232,000"
//           change="+8.2%"
//           isPositive={true}
//           icon={User}
//           iconBg="bg-orange-50"
//           iconColor="text-orange-600"
//         />
//         <StatCard
//           title="Services Completed"
//           value="3,962"
//           change="+15.3%"
//           isPositive={true}
//           icon={Briefcase}
//           iconBg="bg-blue-50"
//           iconColor="text-blue-600"
//         />
//         <StatCard
//           title="Active Services"
//           value="127"
//           change="-2.1%"
//           isPositive={false}
//           icon={Clock}
//           iconBg="bg-yellow-50"
//           iconColor="text-yellow-600"
//         />
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
//           <div className="mb-2">
//             <h3 className="text-lg font-bold text-slate-800">Revenue Trends</h3>
//             <p className="text-sm text-slate-500">
//               Monthly revenue vs payouts comparison
//             </p>
//           </div>
//           <LineChartMock />
//         </div>

//         <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
//           <div className="mb-2">
//             <h3 className="text-lg font-bold text-slate-800">
//               Service Categories
//             </h3>
//             <p className="text-sm text-slate-500">
//               Distribution of services by category
//             </p>
//           </div>
//           <BarChartMock />
//         </div>
//       </div>

//       {/* Workers Table */}
//       <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
//         <div className="p-6 border-b border-slate-100 flex justify-between items-center">
//           <div>
//             <h3 className="text-lg font-bold text-slate-800">
//               Top Performing Workers
//             </h3>
//             <p className="text-sm text-slate-500">
//               Based on rating, services completed, and earnings
//             </p>
//           </div>
//           <button className="text-sm font-medium text-slate-600 hover:text-blue-600 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
//             View All
//           </button>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-sm text-slate-600">
//             <thead className="bg-slate-50 text-slate-800 font-semibold">
//               <tr>
//                 <th className="p-4">Worker Name</th>
//                 <th className="p-4">Role</th>
//                 <th className="p-4">Rating</th>
//                 <th className="p-4">Jobs Done</th>
//                 <th className="p-4">Earnings</th>
//                 <th className="p-4 text-right">Action</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {workers.map((worker) => (
//                 <tr
//                   key={worker.id}
//                   className="hover:bg-slate-50 transition-colors"
//                 >
//                   <td className="p-4 font-medium text-slate-800">
//                     {worker.name}
//                   </td>
//                   <td className="p-4">
//                     <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
//                       {worker.role}
//                     </span>
//                   </td>
//                   <td className="p-4 flex items-center gap-1">
//                     <span className="font-bold text-slate-800">
//                       {worker.rating}
//                     </span>
//                     <span className="text-yellow-400">★</span>
//                   </td>
//                   <td className="p-4">{worker.jobs}</td>
//                   <td className="p-4 font-medium text-emerald-600">
//                     {worker.earnings}
//                   </td>
//                   <td className="p-4 text-right">
//                     <button className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600">
//                       <MoreHorizontal className="w-4 h-4" />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }


import React from 'react'

type Props = {}

function AdminDashboard({}: Props) {
  return (
    <div>AdminDashboard</div>
  )
}

export default AdminDashboard