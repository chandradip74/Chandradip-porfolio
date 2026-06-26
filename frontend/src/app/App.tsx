import { RouterProvider } from "react-router";
import { router } from "./routes";
import { useEffect, useState, useCallback } from "react";
import { API_BASE } from "./lib/api";
import MaintenancePage from "./pages/Maintenance";

interface SiteSettings {
  maintenanceMode: boolean;
  maintenanceMessage: string;
}

const POLL_INTERVAL_MS = 20_000; // check every 20 seconds

export default function App() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(() => {
    fetch(`${API_BASE}/settings`)
      .then((res) => res.json())
      .then((data: SiteSettings) => setSettings(data))
      .catch(() => {
        // On error, don't override existing settings — keep whatever we had
        setSettings((prev) => prev ?? { maintenanceMode: false, maintenanceMessage: "" });
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchSettings();

    // Poll every 20 seconds so maintenance mode flips without a page refresh
    const timer = setInterval(fetchSettings, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [fetchSettings]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (settings?.maintenanceMode) {
    return <MaintenancePage message={settings.maintenanceMessage} />;
  }

  return <RouterProvider router={router} />;
}
