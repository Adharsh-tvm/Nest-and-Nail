"use client";

import { logoutAction } from "@/app/actions/logout-actions";
import React from "react";

type Props = {};

function ClientHeader({}: Props) {
  return (
    <div>
      <header className="absolute top-0 left-0 right-0 z-10 p-4">
        <div className="container mx-auto flex justify-between items-center">
          {/* Updated Logo color to match the Hero highlight */}
          <h1 className="text-2xl font-bold text-emerald-400">MENDWAY</h1>
          
          <nav className="hidden md:flex items-center space-x-6 text-gray-200">
            <a href="#" className="hover:text-emerald-400 transition-colors font-medium">
              Services
            </a>
            <a href="#" className="hover:text-emerald-400 transition-colors font-medium">
              Workers
            </a>
            <a
              href="/client/profile"
              className="hover:text-emerald-400 transition-colors font-medium"
            >
              Pricing
            </a>
            <a href="#" className="hover:text-emerald-400 transition-colors font-medium">
              Contact
            </a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                logoutAction();
              }}
              disabled={false}
              // Updated button to emerald-500 for visibility on dark background
              className="bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default ClientHeader;