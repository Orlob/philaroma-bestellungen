import Link from "next/link";
import ButtonPasswordLogin from "@/components/ButtonPasswordLogin";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Hintergrundbild mit Blur */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("/images/strawberries.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(8px) brightness(0.9)',
        }}
      />
      
      {/* Overlay für bessere Lesbarkeit */}
      <div className="absolute inset-0 bg-white/80 z-10" />

      <header className="p-4 flex justify-end max-w-7xl mx-auto relative z-20">
        {/* Login Button wurde entfernt, da er im Layout vorhanden ist */}
      </header>
      
      <main className="flex-grow flex items-center justify-center relative z-20">
        <section className="text-center px-8">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Philaroma 🍓
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Ihr Spezialist für frisches Obst- und Gemüse 🥬
          </p>
          <ButtonPasswordLogin text="Jetzt bestellen 🛒" />
        </section>
      </main>

      <footer className="border-t border-gray-200 py-6 relative z-20">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-600">
          <p>Kontakt: info@philaroma.de 📧</p>
          <p>Tel: +49 (0) 123 456789 📞</p>
          <p>www.philaroma.de 🌐</p>
        </div>
      </footer>
    </div>
  );
}
