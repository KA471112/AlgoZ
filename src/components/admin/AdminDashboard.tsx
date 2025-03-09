import React, { useState, useEffect } from "react";
import DashboardHeader from "../dashboard/DashboardHeader";
import Sidebar from "../dashboard/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Coins, Plus, Minus, Search } from "lucide-react";

interface User {
  id: string;
  username: string;
  client_id: string;
  email: string;
  phone: string;
  created_at: string;
  balance: number;
  api_count: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState(0);
  const [adjustmentType, setAdjustmentType] = useState<"add" | "deduct">("add");
  const [adjustmentDescription, setAdjustmentDescription] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Get all users except the current admin
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", user?.id || "");

      if (profilesError) throw profilesError;

      // Get balances for all users
      const { data: balances, error: balancesError } = await supabase
        .from("z_coins_balance")
        .select("*");

      if (balancesError) throw balancesError;

      // Get API connection counts
      const { data: apiCounts, error: apiCountsError } = await supabase
        .from("api_connections")
        .select("user_id, count")
        .group("user_id");

      if (apiCountsError) throw apiCountsError;

      // Combine the data
      const usersWithData = profiles.map((profile) => {
        const balanceRecord = balances.find((b) => b.id === profile.id);
        const apiCountRecord = apiCounts.find((a) => a.user_id === profile.id);

        return {
          ...profile,
          balance: balanceRecord?.balance || 0,
          api_count: apiCountRecord?.count || 0,
        };
      });

      setUsers(usersWithData);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustBalance = async () => {
    if (!selectedUser || adjustmentAmount <= 0) return;

    try {
      // Get current balance
      const { data: currentBalance, error: balanceError } = await supabase
        .from("z_coins_balance")
        .select("balance")
        .eq("id", selectedUser.id)
        .single();

      if (balanceError) throw balanceError;

      const newBalance =
        adjustmentType === "add"
          ? currentBalance.balance + adjustmentAmount
          : currentBalance.balance - adjustmentAmount;

      // Update balance
      const { error: updateError } = await supabase
        .from("z_coins_balance")
        .update({ balance: newBalance })
        .eq("id", selectedUser.id);

      if (updateError) throw updateError;

      // Record transaction
      const { error: transactionError } = await supabase
        .from("z_coins_transactions")
        .insert({
          user_id: selectedUser.id,
          amount: adjustmentAmount,
          transaction_type:
            adjustmentType === "add" ? "admin_adjustment" : "deduction",
          description:
            adjustmentDescription ||
            `Admin ${adjustmentType === "add" ? "added" : "deducted"} Z Coins`,
        });

      if (transactionError) throw transactionError;

      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === selectedUser.id
            ? {
                ...u,
                balance:
                  adjustmentType === "add"
                    ? u.balance + adjustmentAmount
                    : u.balance - adjustmentAmount,
              }
            : u,
        ),
      );

      // Reset form
      setAdjustmentAmount(0);
      setAdjustmentDescription("");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adjusting balance:", error);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.client_id.includes(searchTerm),
  );

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client ID</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>APIs Connected</TableHead>
                        <TableHead>Z Coins Balance</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.client_id}
                          </TableCell>
                          <TableCell>{user.username}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.phone || "--"}</TableCell>
                          <TableCell>{user.api_count}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Coins className="h-4 w-4 text-primary" />
                              {user.balance.toLocaleString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Dialog
                              open={
                                isDialogOpen && selectedUser?.id === user.id
                              }
                              onOpenChange={(open) => {
                                setIsDialogOpen(open);
                                if (!open) setSelectedUser(null);
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedUser(user)}
                                >
                                  Adjust Balance
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>
                                    Adjust Z Coins Balance for {user.username}
                                  </DialogTitle>
                                  <DialogDescription>
                                    Current balance:{" "}
                                    {user.balance.toLocaleString()} Z Coins
                                  </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-4 py-4">
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      variant={
                                        adjustmentType === "add"
                                          ? "default"
                                          : "outline"
                                      }
                                      size="sm"
                                      onClick={() => setAdjustmentType("add")}
                                    >
                                      <Plus className="h-4 w-4 mr-1" /> Add
                                    </Button>
                                    <Button
                                      variant={
                                        adjustmentType === "deduct"
                                          ? "default"
                                          : "outline"
                                      }
                                      size="sm"
                                      onClick={() =>
                                        setAdjustmentType("deduct")
                                      }
                                    >
                                      <Minus className="h-4 w-4 mr-1" /> Deduct
                                    </Button>
                                  </div>

                                  <div>
                                    <Label htmlFor="amount">Amount</Label>
                                    <Input
                                      id="amount"
                                      type="number"
                                      min="1"
                                      value={adjustmentAmount || ""}
                                      onChange={(e) =>
                                        setAdjustmentAmount(
                                          parseInt(e.target.value) || 0,
                                        )
                                      }
                                    />
                                  </div>

                                  <div>
                                    <Label htmlFor="description">
                                      Description (Optional)
                                    </Label>
                                    <Input
                                      id="description"
                                      value={adjustmentDescription}
                                      onChange={(e) =>
                                        setAdjustmentDescription(e.target.value)
                                      }
                                      placeholder="Reason for adjustment"
                                    />
                                  </div>
                                </div>

                                <DialogFooter>
                                  <Button
                                    onClick={handleAdjustBalance}
                                    disabled={adjustmentAmount <= 0}
                                  >
                                    Confirm
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
