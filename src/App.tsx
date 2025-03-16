import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import SignUpForm from "./components/auth/SignUpForm";
import LoginForm from "./components/auth/LoginForm";
import Dashboard from "./components/dashboard/Dashboard";
import BrokerAuth from "./components/auth/BrokerAuth";
import MyApis from "./components/auth/MyApis";
import WebhookUrl from "./components/tradingview/WebhookUrl";
import TradeLogs from "./components/tradingview/TradeLogs";
import ManageTradingView from "./components/tradingview/ManageTradingView";
import ManageScalping from "./components/scalping/ManageScalping";
import ManageCopyTrading from "./components/copytrading/ManageCopyTrading";
import PricingHistory from "./components/dashboard/PricingHistory";
import ScalpingTradePage from "./components/scalping/ScalpingTradePage";
import AdminDashboard from "./components/admin/AdminDashboard";
import AuthGuard from "./components/auth/AuthGuard";
import InitializeAdmin from "./components/auth/InitializeAdmin";
import routes from "tempo-routes";
import { ThemeProvider } from "./components/theme-provider";
import { AuthProvider } from "./lib/mockAuth";

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <AuthProvider>
        <Suspense fallback={<p>Loading...</p>}>
          <>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/init-admin" element={<InitializeAdmin />} />

              {/* Auth routes - redirect to dashboard if already logged in */}
              <Route
                element={
                  <AuthGuard requireAuth={false} redirectTo="/dashboard" />
                }
              >
                <Route path="/signup" element={<SignUpForm />} />
                <Route path="/login" element={<LoginForm />} />
              </Route>

              {/* Protected routes - require authentication */}
              <Route
                element={<AuthGuard requireAuth={true} redirectTo="/login" />}
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/my-apis" element={<MyApis />} />
                <Route
                  path="/connect/tradingview"
                  element={<BrokerAuth type="tradingview" />}
                />
                <Route
                  path="/connect/scalping"
                  element={<BrokerAuth type="scalping" />}
                />
                <Route
                  path="/connect/copytrading"
                  element={<BrokerAuth type="copytrading" />}
                />
                <Route path="/webhook-url" element={<WebhookUrl />} />
                <Route path="/trade-logs" element={<TradeLogs />} />
                <Route
                  path="/manage-tradingview"
                  element={<ManageTradingView />}
                />
                <Route path="/manage-scalping" element={<ManageScalping />} />
                <Route
                  path="/manage-copytrading"
                  element={<ManageCopyTrading />}
                />
                <Route path="/pricing-history" element={<PricingHistory />} />
                <Route
                  path="/scalping-trade-page"
                  element={<ScalpingTradePage />}
                />
              </Route>

              {/* Admin routes - require admin privileges */}
              <Route
                element={
                  <AuthGuard
                    requireAuth={true}
                    requireAdmin={true}
                    redirectTo="/dashboard"
                  />
                }
              >
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>
            </Routes>
            {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
          </>
        </Suspense>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
