import { createClient } from "@/lib/supabase/client";

/**
 * Supabase Storage에 이미지 업로드 후 public URL 반환
 */
export async function uploadImage(file: File, path: string): Promise<string | null> {
  const supabase = createClient();
  const ext = file.name.split(".").pop() || "jpg";
  const filePath = `${path}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage.from("images").upload(filePath, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    console.error("uploadImage error:", error);
    return null;
  }

  const { data } = supabase.storage.from("images").getPublicUrl(filePath);
  return data.publicUrl;
}
