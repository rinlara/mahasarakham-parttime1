-- Create job-images bucket for job image uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('job-images', 'job-images', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

-- Create RLS policies for job-images bucket
CREATE POLICY "Allow authenticated users to upload job images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'job-images' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Allow public read access to job images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'job-images');

CREATE POLICY "Allow users to update their own job images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'job-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Allow users to delete their own job images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'job-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);