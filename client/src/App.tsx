import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import Home from "@/pages/home";
import Landing from "@/pages/landing";
import Welcome from "@/pages/welcome";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Show welcome page for 3 seconds after first login
    if (isAuthenticated && user) {
      const hasSeenWelcome = localStorage.getItem(`welcome_seen_${user.id}`);
      if (!hasSeenWelcome) {
        setShowWelcome(true);
        localStorage.setItem(`welcome_seen_${user.id}`, 'true');
        const timer = setTimeout(() => setShowWelcome(false), 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-[#FF1493] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (showWelcome) {
    return <Welcome />;
  }

  return (
    <Switch>
      {isAuthenticated ? (
        <Route path="/" component={Home} />
      ) : (
        <Route path="/" component={Landing} />
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-black text-white">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
