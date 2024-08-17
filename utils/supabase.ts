import { createClient } from "@supabase/supabase-js";

const bucket = "Main Bucket";

const url = process.env?.SUPABASE_URL as string;
const key = process.env?.SUPABASE_KEY as string;

export const client = createClient(url, key);

export const uploadImage = async (image: File) => {
  const time = Date.now();
  const newName = `${time.toString()}-${image.name}`;

  const { data } = await client.storage
    .from(bucket)
    .upload(newName, image, { cacheControl: "3600" });

  if (!data) throw new Error("Image upload failed");

  return client.storage.from(bucket).getPublicUrl(newName).data.publicUrl;
};

export const deleteImage = (url: string) => {
  const imageName = url.split("/").pop();

  if(!imageName) throw new Error("Invalid URL")

    return client.storage.from(bucket).remove([imageName])
};
