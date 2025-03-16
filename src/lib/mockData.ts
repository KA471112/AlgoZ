// Mock data for the application

// Initialize local storage with mock data if it doesn't exist
export const initializeMockData = () => {
  // Initialize users
  if (!localStorage.getItem("algoz_users")) {
    const users = [
      {
        id: "admin-id",
        email: "uchtamsingh@gmail.com",
        password: "@Aa0000Zz", // In a real app, this would be hashed
        username: "Uchtam",
        clientId: "01",
        isAdmin: true,
        zCoins: 1000000,
        phoneNumber: "+1234567890",
      },
    ];
    localStorage.setItem("algoz_users", JSON.stringify(users));
  }

  // Initialize API connections
  if (!localStorage.getItem("savedApis")) {
    const apis = [
      {
        id: "api1",
        appName: "TradingView App",
        broker: "Zerodha",
        isActive: true,
      },
      {
        id: "api2",
        appName: "Scalping Tool",
        broker: "Upstox",
        isActive: false,
      },
    ];
    localStorage.setItem("savedApis", JSON.stringify(apis));
  }

  // Initialize Z Coins balance
  if (!localStorage.getItem("zCoinsBalance")) {
    localStorage.setItem("zCoinsBalance", "100000");
  }

  // Initialize Z Coins transaction history
  if (!localStorage.getItem("zCoinsHistory")) {
    const history = [
      {
        id: Date.now() - 1000000,
        type: "purchase",
        amount: 50000,
        description: "Purchased Basic Plan - 50000 Z Coins",
        date: new Date(Date.now() - 1000000).toISOString(),
      },
      {
        id: Date.now() - 500000,
        type: "deduction",
        amount: 1200,
        description: "TradingView Integration - Monthly Subscription",
        date: new Date(Date.now() - 500000).toISOString(),
      },
    ];
    localStorage.setItem("zCoinsHistory", JSON.stringify(history));
  }

  // Initialize subscriptions
  if (!localStorage.getItem("subscriptions")) {
    const now = new Date();
    const expiryDate = new Date(now.setDate(now.getDate() + 29));
    expiryDate.setHours(23, 59, 59, 999);

    const subscriptions = {
      tradingview: {
        api1: {
          startDate: new Date().toISOString(),
          expiryDate: expiryDate.toISOString(),
        },
      },
    };
    localStorage.setItem("subscriptions", JSON.stringify(subscriptions));
  }
};

// Call this function to initialize mock data
initializeMockData();

// Force re-initialization of admin user
const users = JSON.parse(localStorage.getItem("algoz_users") || "[]");
const adminIndex = users.findIndex((u) => u.email === "uchtamsingh@gmail.com");
if (adminIndex >= 0) {
  users[adminIndex].password = "@Aa0000Zz";
  localStorage.setItem("algoz_users", JSON.stringify(users));
}
