-- Add district field to jobs table
ALTER TABLE public.jobs 
ADD COLUMN district text;

-- Update existing jobs with a default district (can be updated later)
UPDATE public.jobs 
SET district = 'เมืองมหาสารคาม' 
WHERE district IS NULL;