import { RouterProvider } from "react-router";
import { router } from "./routes";
import { useEffect, useState } from "react";
import { API_BASE } from "./lib/api";
import MaintenancePage from "./pages/Maintenance";

interface SiteSettings {
  maintenanceMode: boolean;
  maintenanceMessage: string;
}

const POLL_INTERVAL_MS = 30_000; // re-check every 30 seconds

async function fetchSettings(): Promise<SiteSettings> {
  const res = await fetch(`${API_BASE}/settings`);
  if (!res.ok) throw new Error("Failed to fetch settings");
  return res.json();
}

export default function App() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    fetchSettings()
      .then(setSettings)
      .catch(() => setSettings({ maintenanceMode: false, maintenanceMessage: "" }))
      .finally(() => setInitialLoading(false));

    // Poll every 30s — maintenance page appears automatically without a refresh
    const interval = setInterval(() => {
      fetchSettings()
        .then(setSettings)
        .catch(() => {}); // keep current state silently on error
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  if (initialLoading) {
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
