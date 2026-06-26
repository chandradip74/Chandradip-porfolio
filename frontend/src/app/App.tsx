import { RouterProvider } from "react-router";
import { router } from "./routes";
import { useEffect, useState } from "react";
import { API_BASE } from "./lib/api";
import MaintenancePage from "./pages/Maintenance";

interface SiteSettings {
  maintenanceMode: boolean;
  maintenanceMessage: string;
}

export default function App() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/settings`)
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch(() => setSettings({ maintenanceMode: false, maintenanceMessage: "" }))
      .finally(() => setLoading(false));
  }, []);

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
