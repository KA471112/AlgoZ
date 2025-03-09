import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ApiConnection {
  id: string;
  appName: string;
  broker: string;
  isActive: boolean;
}

export default function MyApis() {
  const [apiConnections, setApiConnections] = useState<ApiConnection[]>(() => {
    // Load from localStorage for demo purposes
    const savedApis = JSON.parse(localStorage.getItem("savedApis") || "[]");
    return savedApis;
  });

  const [deleteApiId, setDeleteApiId] = useState<string | null>(null);

  const handleToggleStatus = (id: string) => {
    const updatedApis = apiConnections.map((api) =>
      api.id === id ? { ...api, isActive: !api.isActive } : api,
    );
    setApiConnections(updatedApis);
    // Update localStorage
    localStorage.setItem("savedApis", JSON.stringify(updatedApis));
  };

  const handleDeleteApi = (id: string) => {
    const updatedApis = apiConnections.filter((api) => api.id !== id);
    setApiConnections(updatedApis);
    // Update localStorage
    localStorage.setItem("savedApis", JSON.stringify(updatedApis));
    setDeleteApiId(null);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My APIs</h1>
        <Button onClick={() => (window.location.href = "/connect/tradingview")}>
          Add New API
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Connected API Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          {apiConnections.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No API connections found. Add your first API connection.
            </div>
          ) : (
            <div className="space-y-4">
              {apiConnections.map((api) => (
                <div
                  key={api.id}
                  className="flex items-center justify-between p-4 bg-accent/50 rounded-md"
                >
                  <div>
                    <div className="font-medium">{api.appName}</div>
                    <div className="text-sm text-muted-foreground">
                      {api.broker}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={api.isActive}
                        onCheckedChange={() => handleToggleStatus(api.id)}
                        id={`switch-${api.id}`}
                      />
                      <span
                        className={`text-xs ${api.isActive ? "text-green-500" : "text-yellow-500"}`}
                      >
                        {api.isActive ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteApiId(api.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-100/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={!!deleteApiId}
        onOpenChange={() => setDeleteApiId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this API connection. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteApiId && handleDeleteApi(deleteApiId)}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
