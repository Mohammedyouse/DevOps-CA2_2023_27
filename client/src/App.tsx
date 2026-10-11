import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Assessment from "@/pages/Assessment";
import AssessmentIntro from "@/pages/AssessmentIntro";
import AssessmentQuestion from "@/pages/AssessmentQuestion";
import AssessmentResults from "@/pages/AssessmentResults";
import Chat from "@/pages/Chat";
import Resources from "@/pages/Resources";
import Profile from "@/pages/Profile";
import CrisisSupport from "@/pages/CrisisSupport";
import AuthPage from "@/pages/auth-page";

import Navigation from "@/components/Navigation";
import MobileNavigation from "@/components/MobileNavigation";

function AuthenticatedApp() {
  return (
    <>
      <Navigation />
      <main className="pt-16 pb-20 md:pb-8 min-h-screen">
        <Switch>
          {/* Root redirect to home */}
          <Route path="/">
            <Redirect to="/home" />
          </Route>

          {/* Authentication Page */}
          <Route path="/auth" component={AuthPage} />

          {/* Protected routes */}
          <ProtectedRoute path="/home" component={Home} />
          <ProtectedRoute path="/assessment" component={Assessment} />
          <ProtectedRoute path="/assessment/intro" component={AssessmentIntro} />
          <ProtectedRoute path="/assessment/question/:id" component={AssessmentQuestion} />
          <ProtectedRoute path="/assessment/results" component={AssessmentResults} />
          <ProtectedRoute path="/chat" component={Chat} />
          <ProtectedRoute path="/resources" component={Resources} />
          <ProtectedRoute path="/profile" component={Profile} />
          <ProtectedRoute path="/crisis" component={CrisisSupport} />

          {/* 404 fallback */}
          <Route component={NotFound} />
        </Switch>
      </main>
      <MobileNavigation />
    </>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
              <AuthenticatedApp />
            </div>
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;