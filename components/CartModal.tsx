"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

interface CartItem {
  name: string;
  quantity: number;
  emoji: string;
}

interface CartModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  items: CartItem[];
  onBack: () => void;
  onOrder: () => void;
}

export default function CartModal({ isOpen, setIsOpen, items, onBack, onOrder }: CartModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  Warenkorb
                </Dialog.Title>

                <div className="mt-2 space-y-3">
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{item.emoji}</span>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <span className="text-sm font-semibold bg-gray-100 px-2 py-1 rounded">
                        {item.quantity}x
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="btn btn-outline w-full"
                    onClick={onBack}
                  >
                    Zurück
                  </button>
                  <button
                    type="button"
                    className="btn bg-orange-500 hover:bg-orange-600 text-white border-none w-full"
                    onClick={onOrder}
                  >
                    Bestellen
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 