"use client";

import ClientHeader from "@/components/containers/ClientHeader";
import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner"

const Icon = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`flex-shrink-0 w-12 h-12 bg-yellow-400/10 text-yellow-400 rounded-lg flex items-center justify-center ${className}`}
  >
    {children}
  </div>
);

const SearchIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const MapPinIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const StarIcon = ({
  className,
  isFilled = false,
}: {
  className?: string;
  isFilled?: boolean;
}) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={isFilled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const BadgeCheckIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3.85 8.62a4 4 0 0 1 4.78-4.78l1.21 1.21a1 1 0 0 0 1.42 0l1.21-1.21a4 4 0 0 1 4.78 4.78l-1.21 1.21a1 1 0 0 0 0 1.42l1.21 1.21a4 4 0 0 1-4.78 4.78l-1.21-1.21a1 1 0 0 0-1.42 0l-1.21 1.21a4 4 0 0 1-4.78-4.78l1.21-1.21a1 1 0 0 0 0-1.42z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const CalendarClockIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5" />
    <path d="M16 2v4" />
    <path d="M8 2v4" />
    <path d="M3 10h5" />
    <path d="M17.5 17.5 16 16.25V14" />
    <path d="M22 16a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z" />
  </svg>
);

const QualityIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    <path d="m12 2-3.09 6.26L2 9.27l5 4.87-1.18 6.88L12 17.77l6.18 3.25L17 14.14l5-4.87-6.91-1.01L12 2z" />
  </svg>
);

const PaintBrushIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
);
const BroomIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19.4 11.6 18.1 21m-2.6-9.4L14.2 21m-2.6-9.4L10.3 21m-2.6-9.4L6.4 21m13-14.2-9.2 9.2c-1.2 1.2-3.1 1.2-4.2 0L2.3 8.3c-1.2-1.2-1.2-3.1 0-4.2L6.1 2c1.2-1.2 3.1-1.2 4.2 0l9.1 9.2Z" />
    <path d="M13.5 6.5 18 2" />
  </svg>
);
const WrenchIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);
const ShieldCheckIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

// --- Data Structures ---
const popularServices = [
  {
    icon: <PaintBrushIcon className="w-6 h-6" />,
    title: "Home Painting Services",
    rating: 4.9,
    reviews: 87,
    price: 50,
  },
  {
    icon: <BroomIcon className="w-6 h-6" />,
    title: "Deep Cleaning Services",
    rating: 4.8,
    reviews: 124,
    price: 30,
  },
  {
    icon: <WrenchIcon className="w-6 h-6" />,
    title: "Handyman & Repair Work",
    rating: 4.9,
    reviews: 95,
    price: 75,
  },
  {
    icon: <ShieldCheckIcon className="w-6 h-6" />,
    title: "Maintenance Management",
    rating: 4.7,
    reviews: 63,
    price: 40,
  },
];

const whyChooseUsItems = [
  {
    icon: <BadgeCheckIcon className="w-8 h-8" />,
    title: "Verified Professionals",
    description:
      "All our workers are background-checked, vetted, and verified professionals you can trust.",
  },
  {
    icon: <CalendarClockIcon className="w-8 h-8" />,
    title: "Quick Booking",
    description:
      "Book services in minutes with our streamlined and efficient booking process.",
  },
  {
    icon: <QualityIcon className="w-8 h-8" />,
    title: "Quality Guaranteed",
    description:
      "We ensure high-quality service with our satisfaction guarantee on every job.",
  },
];

const howItWorksSteps = [
  {
    number: "01",
    title: "Describe the Problem",
    description: "Describe the service you need from us.",
  },
  {
    number: "02",
    title: "Choose Professional",
    description: "Browse profiles, reviews, and select the perfect worker.",
  },
  {
    number: "03",
    title: "Book & Meet",
    description: "Schedule a time and connect via our collaboration tools.",
  },
  {
    number: "04",
    title: "Pay Securely",
    description: "Pay hassle-free via our platform after service completion.",
  },
];

// --- Main Page Component ---
const HomePage: NextPage = () => {
  const router = useRouter();

  return (
    <div className="bg-gray-900 text-gray-200 font-sans">
      {/* Header */}

      <ClientHeader />

      <main>
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center pt-20">
          <div className="absolute inset-0 bg-black/60 z-0"></div>
          <div
            className="absolute inset-0 z-[-1] bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2069&auto=format&fit=crop')",
            }}
          ></div>
          <div className="container mx-auto text-center z-10 px-4">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
              Find Trusted{" "}
              <span className="text-yellow-400">Professionals</span> Near You
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Connect with vetted professionals for all your home and office
              needs. Fast, reliable, and secure.
            </p>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl max-w-3xl mx-auto">
              <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="What service do you need?"
                    className="w-full bg-gray-800 text-white rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-gray-700"
                  />
                </div>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter your location"
                    className="w-full bg-gray-800 text-white rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-gray-700"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-yellow-400 text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105"
                >
                  Search
                </button>
              </form>
            </div>
            <p className="mt-4 text-sm text-gray-400">
              1.5M+ services booked via WorkLink in your city
            </p>
          </div>
        </section>

        {/* Popular Services Section */}
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Popular Services
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-12">
              Browse our most requested services and find the perfect
              professional for your needs.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {popularServices.map((service, index) => (
                <div
                  key={index}
                  className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-yellow-400/20 transform hover:-translate-y-2 transition-all duration-300"
                >
                  <Icon>{service.icon}</Icon>
                  <h3 className="font-bold text-xl mt-4 mb-2">
                    {service.title}
                  </h3>
                  <div className="flex items-center justify-center text-sm text-gray-400 mb-4">
                    <StarIcon
                      className="w-4 h-4 text-yellow-400 mr-1"
                      isFilled={true}
                    />
                    <span>
                      {service.rating} ({service.reviews} reviews)
                    </span>
                  </div>
                  <div className="text-lg font-bold mb-4">
                    Starting from{" "}
                    <span className="text-yellow-400">${service.price}</span>
                  </div>
                  <button className="w-full bg-gray-700 hover:bg-yellow-400 hover:text-gray-900 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    Book Now
                  </button>
                </div>
              ))}
            </div>
            <button className="mt-12 border border-yellow-400 text-yellow-400 font-bold py-3 px-8 rounded-lg hover:bg-yellow-400 hover:text-gray-900 transition-colors">
              View All Services
            </button>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 bg-black">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose WorkLink?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-12">
              We make it easy to find and book trusted professionals for any
              job.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {whyChooseUsItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-900 p-8 rounded-xl border border-gray-800"
                >
                  <Icon className="mx-auto">
                    <div className="w-8 h-8">{item.icon}</div>
                  </Icon>
                  <h3 className="font-bold text-2xl mt-6 mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How It Works
              </h2>
            </div>
            <div className="relative">
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-yellow-700 -translate-y-1/2"></div>
              {/* <div className="hidden md:block absolute top-1/2 left-0 w-1/4 h-0.5 bg-yellow-400 -translate-y-1/2"></div> */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                {howItWorksSteps.map((step, index) => (
                  <div
                    key={index}
                    className="text-center bg-gray-900 p-4 rounded-lg"
                  >
                    <div className="relative mb-4 flex justify-center">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl text-gray-900 bg-yellow-400 border-4 border-gray-900">
                        {step.number}
                      </div>
                    </div>
                    <h3 className="font-bold text-xl mb-2">{step.title}</h3>
                    <p className="text-gray-400 px-2">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black py-10">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} WorkLink. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
