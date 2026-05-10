"use client";

import React from "react";
import { Address } from "@/shared/types/addressType";
import { User } from "@/shared/types/userTypes";
import { MapPin, Plus, CheckCircle2 } from "lucide-react";

interface AddressSelectionStepProps {
  user: User | null;
  selectedAddress: Address | null;
  onSelectAddress: (address: Address) => void;
  onNext: () => void;
  onOpenAddModal?: () => void;
}

export function AddressSelectionStep({
  user,
  selectedAddress,
  onSelectAddress,
  onNext,
  onOpenAddModal,
}: AddressSelectionStepProps) {
  const addresses = user?.address || [];

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-2xl font-black text-gray-900 mb-6 text-center">
        Select Service Location
      </h2>

      <div className="bg-white rounded-[24px] border border-gray-100 p-8 shadow-sm">
        {addresses.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="text-gray-400 w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              No saved addresses found
            </h3>
            <p className="text-gray-500 mb-6">
              Please add a service location to proceed with the booking.
            </p>
            {onOpenAddModal && (
              <button
                onClick={onOpenAddModal}
                className="bg-[#1B4332] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#143326] transition-colors"
              >
                Add New Address
              </button>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {addresses.map((addr, index) => {
              const addressId = addr.addressId || (addr as unknown as { _id?: string })._id || index.toString();
              const isSelected = selectedAddress?.addressId === addressId || 
                                 (!selectedAddress?.addressId && selectedAddress?.street === addr.street);

              return (
                <div
                  key={addressId}
                  onClick={() => onSelectAddress(addr)}
                  className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-50/30"
                      : "border-gray-100 hover:border-emerald-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin
                        size={18}
                        className={isSelected ? "text-emerald-500" : "text-gray-400"}
                      />
                      <span className="font-bold text-gray-900">
                        {addr.label}
                      </span>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {addr.street}, {addr.city}, {addr.state} {addr.zip}
                  </p>
                </div>
              );
            })}
            
            {onOpenAddModal && (
              <div
                onClick={onOpenAddModal}
                className="p-5 rounded-2xl border-2 border-dashed border-gray-200 hover:border-emerald-500/50 hover:bg-emerald-50/10 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[120px]"
              >
                <Plus size={24} className="text-emerald-600 mb-2" />
                <span className="font-bold text-sm text-gray-700">Add Address</span>
              </div>
            )}
          </div>
        )}

        {addresses.length > 0 && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={onNext}
              disabled={!selectedAddress}
              className="bg-gray-900 hover:bg-black disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-md active:scale-95"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
