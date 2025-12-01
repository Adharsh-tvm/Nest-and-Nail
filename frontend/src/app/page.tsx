import {
  ArrowRight,
  Wrench,
  Home,
  Star,
  Search,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import type { NextPage } from "next";
import Link from "next/link";

const LandingPage: NextPage = () => {
  return (
    <>
      {/* In Next.js 13+ with the App Router, the <Head> component from 'next/head' is replaced.
        You should manage metadata in your layout.tsx or page.tsx file by exporting a 'metadata' object.
        For this component, we'll remove the <Head> tag as it's typically handled in a root layout.
      */}

      {/* Main container with a dark grey background */}
      <div className="bg-gray-900 text-gray-200 font-sans">
        {/* Header with a black background for a distinct, top-level feel */}
        <header className="bg-black/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="text-2xl font-bold text-yellow-400 flex items-center">
              <Wrench className="mr-2" />
              Nest & Nail
            </div>
            <nav className="hidden md:flex items-center space-x-6 text-gray-300">
              <a
                href="#services"
                className="hover:text-yellow-400 transition-colors"
              >
                Services
              </a>
              <a
                href="#how-it-works"
                className="hover:text-yellow-400 transition-colors"
              >
                How It Works
              </a>
              <a
                href="#testimonials"
                className="hover:text-yellow-400 transition-colors"
              >
                Testimonials
              </a>
              <Link href={"/login"}>
                <button className="bg-gray-800 px-4 py-2 rounded-md hover:bg-gray-700 text-white transition-colors">
                  Log In
                </button>
              </Link>
            </nav>
          </div>
        </header>

        <main>
          {/* Hero Section - black for maximum impact */}
          <section className="bg-black text-white text-center py-24 px-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
            <div className="container mx-auto relative z-10">
              <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
                Your Home, <span className="text-yellow-400">Fixed Right.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
                Connect instantly with verified, local maintenance professionals
                for any job, big or small.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#services"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105 inline-flex items-center justify-center"
                >
                  Find a Worker <ArrowRight className="ml-2 h-5 w-5" />
                </a>
                <a
                  href="#join"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105 inline-flex items-center justify-center"
                >
                  Join as a Pro
                </a>
              </div>
            </div>
          </section>

          {/* How It Works Section - on the main dark grey background */}
          <section id="how-it-works" className="py-20">
            <div className="container mx-auto px-6 text-center">
              <h2 className="text-3xl font-bold mb-4 text-white">
                How It Works
              </h2>
              <p className="text-gray-400 mb-12">
                Get help in three simple steps.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Cards are a slightly lighter grey to stand out */}
                <div className="flex flex-col items-center p-8 rounded-lg bg-gray-800 shadow-lg">
                  <div className="bg-yellow-400 text-black rounded-full p-5 mb-4">
                    <Search className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    1. Search Your Need
                  </h3>
                  <p className="text-gray-400">
                    Tell us what you need help with, from plumbing to painting.
                  </p>
                </div>
                <div className="flex flex-col items-center p-8 rounded-lg bg-gray-800 shadow-lg">
                  <div className="bg-orange-400 text-black rounded-full p-5 mb-4">
                    <ShieldCheck className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    2. Choose a Pro
                  </h3>
                  <p className="text-gray-400">
                    Browse profiles, read reviews, and select a verified
                    professional.
                  </p>
                </div>
                <div className="flex flex-col items-center p-8 rounded-lg bg-gray-800 shadow-lg">
                  <div className="bg-green-500 text-black rounded-full p-5 mb-4">
                    <Calendar className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    3. Book & Relax
                  </h3>
                  <p className="text-gray-400">
                    Schedule a time that works for you and get the job done.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Services Section - contrasting grey */}
          <section id="services" className="py-20 bg-black">
            <div className="container mx-auto px-6 text-center">
              <h2 className="text-3xl font-bold text-white mb-12">
                Find Help for Any Task
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {[
                  "Plumbing",
                  "Electrical",
                  "Carpentry",
                  "Painting",
                  "Cleaning",
                  "Gardening",
                  "Appliance Repair",
                  "Assembly",
                  "Moving",
                  "Roofing",
                ].map((service) => (
                  <div
                    key={service}
                    className="bg-gray-800 p-6 rounded-lg text-center hover:bg-yellow-500 hover:text-black cursor-pointer transition-all transform hover:-translate-y-1 shadow-md"
                  >
                    <p className="font-semibold text-lg text-gray-200">
                      {service}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section id="testimonials" className="py-20 bg-gray-900">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-center text-white mb-12">
                Trusted by Homeowners & Pros
              </h2>
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Testimonial Cards */}
                <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
                  <div className="flex items-center mb-4">
                    <Home className="h-8 w-8 text-orange-500 mr-4" />
                    <div>
                      <p className="font-bold text-white">
                        Sarah K. (Homeowner)
                      </p>
                      <div className="flex text-yellow-400">
                        <Star size={16} fill="currentColor" />{" "}
                        <Star size={16} fill="currentColor" />{" "}
                        <Star size={16} fill="currentColor" />{" "}
                        <Star size={16} fill="currentColor" />{" "}
                        <Star size={16} fill="currentColor" />
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-400 italic">
                    "Found a reliable plumber in minutes after my pipe burst.
                    Nest & Nail was a lifesaver! The process was so simple and
                    transparent."
                  </p>
                </div>
                <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
                  <div className="flex items-center mb-4">
                    <Wrench className="h-8 w-8 text-green-500 mr-4" />
                    <div>
                      <p className="font-bold text-white">
                        David L. (Electrician)
                      </p>
                      <div className="flex text-yellow-400">
                        <Star size={16} fill="currentColor" />{" "}
                        <Star size={16} fill="currentColor" />{" "}
                        <Star size={16} fill="currentColor" />{" "}
                        <Star size={16} fill="currentColor" />{" "}
                        <Star size={16} fill="currentColor" />
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-400 italic">
                    "As a professional, Nest & Nail helps me connect with
                    serious clients in my area. It has filled my schedule and
                    grown my business."
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA Section - bright accent color */}
          <section id="join" className="bg-amber-500 text-gray-900">
            <div className="container mx-auto px-6 py-16 text-center">
              <h2 className="text-3xl font-extrabold mb-4">
                Ready to Get Started?
              </h2>
              <p className="max-w-xl mx-auto mb-8 text-gray-800">
                Whether you need a quick fix or are a pro looking for work, join
                our community today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#"
                  className="bg-black hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105"
                >
                  Find a Pro
                </a>
                <a
                  href="#"
                  className="bg-gray-900/20 hover:bg-gray-900/30 text-black font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105"
                >
                  I'm a Pro
                </a>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-black text-gray-400 py-10">
          <div className="container mx-auto px-6 text-center">
            <p className="text-lg font-bold text-yellow-400 mb-2">
              Nest & Nail
            </p>
            <div className="space-x-6 mb-4">
              <a href="#" className="hover:text-white">
                About
              </a>
              <a href="#" className="hover:text-white">
                Contact
              </a>
              <a href="#" className="hover:text-white">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white">
                Terms of Service
              </a>
            </div>
            <p>
              &copy; {new Date().getFullYear()} Nest & Nail. All rights
              reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;
