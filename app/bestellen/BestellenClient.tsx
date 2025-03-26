"use client";

import ButtonPasswordAccount from "@/components/ButtonPasswordAccount";
import ButtonBestellen from "@/components/ButtonBestellen";
import { useState } from "react";
import { useSession } from "next-auth/react";

interface Product {
  name: string;
  gtin: string;
  category: string;
  emoji: string;
}

interface Customer {
  name: string;
  password: string;
  gln: string;
}

interface BestellenClientProps {
  products: Product[];
}

export default function BestellenClient({ products }: BestellenClientProps) {
  const { data: session } = useSession();
  const customerName = session?.user?.name || "Unbekannt";
  const customerGln = session?.user?.gln || "Keine GLN";

  // State für die ausgewählte Kategorie
  const [selectedCategory, setSelectedCategory] = useState<string>("Alle");
  
  // State für die Mengen im Warenkorb
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  // Funktion zum Erstellen der CSV-Datei
  const generateCSV = (items: Array<{ name: string; quantity: number; gtin: string }>) => {
    const orderNumber = Math.random().toString(36).substring(2, 8).toUpperCase();
    const deliveryDate = new Date().toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const sellerGln = '1234567800004';

    // Header
    let csv = `HEAD;${orderNumber};${deliveryDate};${customerGln};${customerGln};${sellerGln};;\n`;

    // Items
    items.forEach((item, index) => {
      csv += `LINE;${index + 1};0;${item.gtin};${item.quantity.toFixed(3)};\n`;
    });

    return csv;
  };

  // Funktion zum Erstellen des HTML-E-Mail-Inhalts
  const generateEmailHTML = (items: Array<{ name: string; quantity: number; emoji: string }>) => {
    return `
      <h1>Neue Bestellung für Philaroma von ${customerName}</h1>
      <p style="color: #666; margin-bottom: 20px;">GLN: ${customerGln}</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb;">Produkt</th>
            <th style="padding: 12px; text-align: right; border-bottom: 1px solid #e5e7eb;">Menge</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
                ${item.emoji} ${item.name}
              </td>
              <td style="padding: 12px; text-align: right; border-bottom: 1px solid #e5e7eb;">
                ${item.quantity}x
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  };

  // Funktion zum Ändern der Menge eines Produkts
  const updateQuantity = (gtin: string, change: number) => {
    setQuantities(prev => {
      const currentQuantity = prev[gtin] || 0;
      const newQuantity = Math.max(0, currentQuantity + change); // Verhindert negative Mengen
      return {
        ...prev,
        [gtin]: newQuantity
      };
    });
  };

  // Gefilterte Produkte basierend auf der ausgewählten Kategorie
  const filteredProducts = selectedCategory === "Alle"
    ? products
    : products.filter(product => product.category === selectedCategory);

  // Alle verfügbaren Kategorien aus den Produkten extrahieren
  const categories = ["Alle", ...Array.from(new Set(products.map(p => p.category)))];

  // Berechne die Gesamtanzahl der Produkte im Warenkorb
  const totalItems = Object.values(quantities).reduce((sum, quantity) => sum + quantity, 0);

  // Erstelle die Warenkorbdaten für das Modal
  const cartItems = products
    .filter(product => quantities[product.gtin] > 0)
    .map(product => ({
      name: product.name,
      quantity: quantities[product.gtin],
      emoji: product.emoji
    }));

  // Funktion zum Verarbeiten der Bestellung
  const handleOrder = async () => {
    try {
      // Warenkorbdaten mit GTIN für CSV erstellen
      const cartItemsWithGtin = products
        .filter(product => quantities[product.gtin] > 0)
        .map(product => ({
          name: product.name,
          quantity: quantities[product.gtin],
          emoji: product.emoji,
          gtin: product.gtin
        }));

      // CSV-Datei generieren
      const csvContent = generateCSV(cartItemsWithGtin);
      
      // Aktuelles Datum und Zeit für Dateinamen
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
      const filename = `bestellung_${dateStr}_${timeStr}.csv`;
      
      // Request-Body als JSON erstellen
      const requestBody = {
        to: ["simonorlob@gmail.com", "philaroma.mk@googlemail.com"],
        subject: `Neue Bestellung für Philaroma von ${customerName}`,
        html: generateEmailHTML(cartItemsWithGtin),
        attachment: csvContent,
        filename: filename
      };

      // API-Request senden
      const response = await fetch('https://simonorlob.dev.saas.do/flux/13/bb6c47c66b5d3da17087f591cf1805b8', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error('Fehler beim Senden der E-Mail');
      }

      // Erfolgsmeldung anzeigen
      alert('Bestellung wurde erfolgreich aufgegeben!');
      
      // Warenkorb zurücksetzen
      setQuantities({});
    } catch (error) {
      console.error('Fehler beim Bestellen:', error);
      alert('Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-neutral-800 text-white py-3 px-4 shadow-md rounded-b-lg">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold">Philaroma 🍓</h1>
          <ButtonPasswordAccount />
        </div>
      </header>
      
      <main className="max-w-3xl mx-auto px-3 py-4">
        <div className="flex flex-col space-y-3">
          <h1 className="text-2xl font-bold text-neutral-800">Bestellung</h1>

          {/* Kategorien-Filter mit horizontalem Scroll */}
          <div className="relative">
            <div className="overflow-x-auto pb-2 hide-scrollbar">
              <div className="tabs tabs-boxed bg-neutral-100 p-1 inline-flex whitespace-nowrap">
                {categories.map(category => (
                  <button
                    key={category}
                    className={`tab tab-sm min-w-fit ${
                      selectedCategory === category 
                        ? 'bg-neutral-700 text-white' 
                        : 'text-neutral-600 hover:bg-neutral-200'
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-2 mt-4 pb-24">
          {filteredProducts.map((product) => (
            <div key={product.gtin} className="card bg-white shadow-sm hover:shadow-md transition-shadow border border-neutral-200">
              <div className="card-body p-3">
                <div className="flex justify-between items-center gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">{product.emoji}</span>
                    <div className="flex flex-col">
                      <h2 className="font-semibold text-neutral-700">{product.name}</h2>
                      <div className="badge badge-sm bg-neutral-100 text-neutral-600 border-neutral-200">
                        {product.category}
                      </div>
                    </div>
                  </div>
                  
                  <div className="join join-vertical">
                    <button 
                      className="join-item btn btn-sm bg-neutral-50 hover:bg-neutral-100 border-neutral-200"
                      onClick={() => updateQuantity(product.gtin, 1)}
                    >
                      +
                    </button>
                    <button className="join-item btn btn-sm bg-neutral-50 border-neutral-200 min-w-[2.5rem]">
                      {quantities[product.gtin] || 0}
                    </button>
                    <button 
                      className="join-item btn btn-sm bg-neutral-50 hover:bg-neutral-100 border-neutral-200"
                      onClick={() => updateQuantity(product.gtin, -1)}
                    >
                      -
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <ButtonBestellen 
        itemCount={totalItems} 
        items={cartItems}
        onOrder={handleOrder}
      />
    </div>
  );
} 