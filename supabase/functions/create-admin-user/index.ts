import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

    // Check if admin user already exists
    const { data: existingUsers, error: checkError } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("username", "Uchtam");

    if (checkError) {
      throw new Error(
        `Error checking for existing admin: ${checkError.message}`,
      );
    }

    if (existingUsers && existingUsers.length > 0) {
      return new Response(
        JSON.stringify({ message: "Admin user already exists" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        },
      );
    }

    // Create admin user in auth.users
    const { data: authUser, error: createUserError } =
      await supabaseAdmin.auth.admin.createUser({
        email: "UCHTAMSINGH@gmail.com",
        password: "@Aa0000Zz",
        email_confirm: true,
      });

    if (createUserError) {
      throw new Error(`Error creating admin user: ${createUserError.message}`);
    }

    if (!authUser.user) {
      throw new Error("Failed to create admin user");
    }

    // Insert admin profile
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: authUser.user.id,
        username: "Uchtam",
        client_id: "01",
        email: "UCHTAMSINGH@gmail.com",
        phone: "+1234567890",
        is_admin: true,
      });

    if (profileError) {
      throw new Error(`Error creating admin profile: ${profileError.message}`);
    }

    // Initialize admin's Z Coins balance
    const { error: balanceError } = await supabaseAdmin
      .from("z_coins_balance")
      .insert({
        id: authUser.user.id,
        balance: 1000000, // 1 million Z Coins for admin
      });

    if (balanceError) {
      throw new Error(
        `Error initializing admin balance: ${balanceError.message}`,
      );
    }

    // Create webhook for admin
    const webhookUrl = `https://algoz.com/webhook/${crypto.randomUUID()}`;
    const { error: webhookError } = await supabaseAdmin
      .from("webhooks")
      .insert({
        user_id: authUser.user.id,
        webhook_url: webhookUrl,
      });

    if (webhookError) {
      throw new Error(`Error creating admin webhook: ${webhookError.message}`);
    }

    return new Response(
      JSON.stringify({
        message: "Admin user created successfully",
        user: {
          id: authUser.user.id,
          email: authUser.user.email,
          username: "Uchtam",
          client_id: "01",
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
