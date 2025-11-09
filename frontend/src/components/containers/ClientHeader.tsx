"use client";

import {  useAuth } from "@/contexts/AuthContext";
import React from "react";

type Props = {};

function ClientHeader({}: Props) {

  const {logout, isLoading} = useAuth()

  return (
    <div>
      <header className="absolute top-0 left-0 right-0 z-10 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-yellow-400">MENDWAY</h1>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="hover:text-yellow-400 transition-colors">
              Services
            </a>
            <a href="#" className="hover:text-yellow-400 transition-colors">
              Workers
            </a>
            <a href="#" className="hover:text-yellow-400 transition-colors">
              Pricing
            </a>
            <a href="#" className="hover:text-yellow-400 transition-colors">
              Contact
            </a>
          </nav>
          <div className="flex items-center space-x-4">
            <button
              onClick={logout}
              disabled={isLoading}
              className="bg-yellow-400 text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-yellow-500 transition-colors"
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
