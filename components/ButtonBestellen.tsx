"use client";
import { useState } from "react";
import BetterIcon from "./BetterIcon";
import CartModal from "./CartModal";

interface ButtonBestellenProps {
  itemCount: number;
  items: Array<{
    name: string;
    quantity: number;
    emoji: string;
  }>;
  onOrder: () => void;
}

export default function ButtonBestellen({ itemCount, items, onOrder }: ButtonBestellenProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-3 left-0 right-0 mx-3 btn bg-orange-500 hover:bg-orange-600 text-white border-none shadow-lg h-12"
      >
        <div className="flex items-center justify-between w-full px-2">
          <div className="relative">
            <BetterIcon>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
            </BetterIcon>
            <div className="absolute -top-2 -right-2 bg-white rounded-full w-5 h-5 flex items-center justify-center">
              <span className="text-sm font-bold text-neutral-800">{itemCount}</span>
            </div>
          </div>
          <span className="text-lg font-semibold ml-auto">Warenkorb anzeigen</span>
        </div>
      </button>

      <CartModal
        isOpen={isCartOpen}
        setIsOpen={setIsCartOpen}
        items={items}
        onBack={() => setIsCartOpen(false)}
        onOrder={() => {
          setIsCartOpen(false);
          onOrder();
        }}
      />
    </>
  );
} 