import type { SupabaseClient, User } from "@supabase/supabase-js";

export async function getCurrentUser(supabase: SupabaseClient): Promise<User | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}

export async function getCurrentUserId(supabase: SupabaseClient): Promise<string | null> {
  const user = await getCurrentUser(supabase);
  return user?.id ?? null;
}

export async function getSharedDataProfileId(supabase: SupabaseClient): Promise<string | null> {
  const user = await getCurrentUser(supabase);
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("id")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  return data?.id ?? user.id;
}

export async function ensureCurrentUserProfile(supabase: SupabaseClient, user: User): Promise<void> {
  await supabase.from("profiles").upsert({
    id: user.id,
    email: user.email || "",
    name: user.user_metadata?.name || user.email || "",
  }, { onConflict: "id" });
}
