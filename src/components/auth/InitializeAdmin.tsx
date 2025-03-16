import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InitializeAdmin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [adminExists, setAdminExists] = useState(false);

  useEffect(() => {
    checkAdminExists();
  }, []);

  const checkAdminExists = async () => {
    try {
      // Check local storage for admin user
      const users = JSON.parse(localStorage.getItem("algoz_users") || "[]");
      const adminExists = users.some(
        (user: any) => user.username === "Uchtam" && user.isAdmin === true,
      );
      setAdminExists(adminExists);
    } catch (err: any) {
      console.error("Error checking admin:", err);
      setError(err.message);
    }
  };

  const createAdminUser = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Create admin user in local storage
      const adminUser = {
        id: "admin-id",
        email: "UCHTAMSINGH@gmail.com",
        password: "@Aa0000Zz", // In a real app, this would be hashed
        username: "Uchtam",
        clientId: "01",
        isAdmin: true,
        zCoins: 1000000,
        phoneNumber: "+1234567890",
      };

      const users = JSON.parse(localStorage.getItem("algoz_users") || "[]");
      users.push(adminUser);
      localStorage.setItem("algoz_users", JSON.stringify(users));

      setSuccess("Admin user created successfully");
      setAdminExists(true);
    } catch (err: any) {
      console.error("Error creating admin:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Admin Initialization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {adminExists ? (
            <div className="text-center text-green-500">
              Admin user already exists. You can log in with the admin
              credentials.
            </div>
          ) : (
            <>
              <p className="text-center">
                Create the admin user with the following credentials:
              </p>
              <div className="bg-accent/50 p-4 rounded-md">
                <p>
                  <strong>Login ID:</strong> Uchtam
                </p>
                <p>
                  <strong>Email:</strong> uchtamsingh@gmail.com
                </p>
                <p>
                  <strong>Password:</strong> @Aa0000Zz
                </p>
                <p>
                  <strong>Client ID:</strong> 01
                </p>
              </div>

              {error && <div className="text-red-500 text-center">{error}</div>}
              {success && (
                <div className="text-green-500 text-center">{success}</div>
              )}

              <Button
                className="w-full"
                onClick={createAdminUser}
                disabled={loading}
              >
                {loading ? "Creating Admin..." : "Create Admin User"}
              </Button>
            </>
          )}

          <div className="text-center mt-4">
            <a href="/login" className="text-primary hover:underline">
              Go to Login
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
