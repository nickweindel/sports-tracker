CREATE POLICY "Allow uploads for authenticated users"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'photos' AND auth.uid() IS NOT NULL);