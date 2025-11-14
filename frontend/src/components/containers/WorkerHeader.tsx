import {
  Home,
  Briefcase,
  Calendar,
  CreditCard,
  Users,
  User,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";

const Header: React.FC = () => {
  type NavItemProps = {
    icon: React.ElementType;
    label: string;
    href: string;
    active?: boolean;
  };

  const NavItem: React.FC<NavItemProps> = ({
    icon: Icon,
    label,
    href,
    active,
  }) => (
    <a
      href={href}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
        active
          ? "bg-green-600 text-white"
          : "text-neutral-300 hover:bg-neutral-700 hover:text-white"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </a>
  );

  const [isOnline, setIsOnline] = useState(true);

  return (
    <header className="bg-neutral-900 text-white p-4 flex flex-col md:flex-row items-center justify-between border-b border-neutral-800">
      <div className="flex items-center justify-between w-full md:w-auto">
        <h1 className="text-2xl font-bold text-green-400">ServiceHub</h1>
        {/* Mobile menu button (placeholder) */}
        <button className="md:hidden text-neutral-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex items-center space-x-2 mt-4 md:mt-0">
        <NavItem icon={Home} label="Home" href="#" active />
        <NavItem icon={Briefcase} label="Jobs" href="#" />
        <NavItem icon={Calendar} label="Bookings" href="#" />
        <NavItem icon={CreditCard} label="Payments" href="#" />
        <NavItem icon={Users} label="Meetings" href="#" />
        <NavItem icon={User} label="Profile" href="#" />
      </nav>

      {/* User Status & Profile */}
      <div className="hidden md:flex items-center space-x-4 mt-4 md:mt-0">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-neutral-400">Status:</span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              isOnline
                ? "bg-green-800 text-green-200"
                : "bg-neutral-700 text-neutral-300"
            }`}
          >
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>
        <button className="text-neutral-300 hover:text-white">
          <MessageCircle className="w-6 h-6" />
        </button>
        <img
          src="https://placehold.co/40x40/334155/e2e8f0?text=U"
          alt="User Avatar"
          className="w-10 h-10 rounded-full border-2 border-neutral-700"
        />
      </div>
    </header>
  );
};

export default Header;
