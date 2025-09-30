import { useState, useEffect } from "react";
import SeanceManager from "./MainSeancesPanel";

export default function SeancesPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // This prevents server-side rendering of browser-specific code
  if (!isClient) {
    return <div>Loading...</div>;
  }

  return <SeanceManager />;
}