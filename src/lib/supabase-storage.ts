import { createClient, SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "products";

let _client: SupabaseClient | null = null;

function getClient() {
  if (!_client) {
    _client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return _client;
}

export async function uploadImage(
  file: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  const safeName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
  const path = `products/${Date.now()}-${safeName}`;

  const { data, error } = await getClient().storage
    .from(BUCKET)
    .upload(path, file, { contentType, upsert: false });

  if (error) throw error;

  const { data: urlData } = getClient().storage
    .from(BUCKET)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

export async function deleteImage(url: string): Promise<void> {
  const bucketUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`;
  const path = url.replace(bucketUrl, "");
  if (path && path !== url) {
    await getClient().storage.from(BUCKET).remove([path]);
  }
}
