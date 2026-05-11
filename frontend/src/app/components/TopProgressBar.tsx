import { useEffect, useState } from "react";
import { useNavigation } from "react-router";
import { Loader2 } from "lucide-react";
import { onApiLoadingChange } from "../lib/api";

/**
 * Premium progress loader that activates during both Router navigation
 * and any API fetching from the database/cloud.
 */
export function TopProgressBar() {
  const navigation = useNavigation();
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);

  // Listen to API requests
  useEffect(() => {
    const unsubscribe = onApiLoadingChange((loading) => {
      setIsApiLoading(loading);
    });
    return unsubscribe;
  }, []);

  const isLoading = navigation.state === "loading" || isApiLoading;

  useEffect(() => {
    if (isLoading) {
      setVisible(true);
      setWidth(0);
      // Animate to ~80% quickly, then hold until loading completes
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setWidth(75));
      });
    } else {
      if (visible) {
        setWidth(100);
        const t = setTimeout(() => {
          setVisible(false);
          setWidth(0);
        }, 400);
        return () => clearTimeout(t);
      }
    }
  }, [isLoading, visible]);

  if (!visible) return null;

  return (
    <>
      {/* Top glowing progress bar */}
      <div
        className="fixed top-0 left-0 right-0 z-[9999] h-[2px] pointer-events-none"
        role="progressbar"
        aria-label="Global loading"
      >
        <div
          className="h-full bg-red-600 shadow-[0_0_10px_2px] shadow-red-600/50 rounded-r-full transition-all ease-out"
          style={{ width: `${width}%`, transitionDuration: width === 100 ? "200ms" : "800ms" }}
        />
      </div>

      {/* Floating elegant spinner in bottom-right for extra visual feedback */}
      <div className="fixed bottom-6 right-6 z-[9999] pointer-events-none animate-in fade-in zoom-in duration-300">
        <div className="bg-background border border-border/50 shadow-xl p-3 rounded-full">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
        </div>
      </div>
    </>
  );
}
