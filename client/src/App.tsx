import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { useSiteSettings } from "@/hooks/use-site-settings";
import HomePage from "@/pages/HomePage";
import ForoPage from "@/pages/ForoPage";
import SoportePage from "@/pages/SoportePage";
import { PlayerPanel } from "@/pages/PlayerPanel";
import LoginPage from "@/pages/LoginPage";
import NotFound from "@/pages/not-found";

function Router() {
  // Initialize site settings to apply them dynamically
  useSiteSettings();
  
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/foro" component={ForoPage} />
      <Route path="/soporte" component={SoportePage} />
      <Route path="/panel" component={PlayerPanel} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
