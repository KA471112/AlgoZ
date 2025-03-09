import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
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
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", "Uchtam")
        .eq("is_admin", true);

      if (error) throw error;
      setAdminExists(data && data.length > 0);
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
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-admin-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create admin user");
      }

      setSuccess(data.message || "Admin user created successfully");
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
                  <strong>Email:</strong> UCHTAMSINGH@gmail.com
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
