import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/libs/auth";
import BestellenClient from "./BestellenClient";

// Produktdaten aus der Umgebungsvariable lesen
function getProducts() {
  if (!process.env.PRODUCTS) {
    console.error("Keine Produktdaten in der Umgebungsvariable gefunden");
    return [];
  }

  try {
    return JSON.parse(process.env.PRODUCTS);
  } catch (error) {
    console.error("Fehler beim Parsen der Produktdaten:", error);
    return [];
  }
}

export default async function BestellenPage() {
  const session = await getServerSession(authOptions);

  // Wenn nicht eingeloggt, zur Startseite weiterleiten
  if (!session) {
    redirect("/");
  }

  const products = getProducts();

  return <BestellenClient products={products} />;
} 