import { supabase } from '@/lib/supabase';

export class StorageService {
  static async uploadImage(file: File, bucket: string = 'blog-images', folder: string = 'posts'): Promise<string> {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      console.log('📤 Uploading image to Storage:', { fileName, filePath, bucket, folder });

      // First, ensure the bucket exists
      await this.ensureBucketExists(bucket);

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('❌ Storage upload error:', error);
        console.error('❌ Error details:', {
          message: error.message
        });
        throw new Error(`Failed to upload image: ${error.message}`);
      }

      console.log('✅ Image uploaded successfully:', data);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;
      console.log('🔗 Public URL generated:', publicUrl);

      return publicUrl;
    } catch (error) {
      console.error('❌ Storage service error:', error);
      throw error;
    }
  }

  // Specific method for blog post images
  static async uploadBlogImage(file: File): Promise<string> {
    return this.uploadImage(file, 'blog-images', 'posts');
  }

  // Specific method for author avatars
  static async uploadAvatar(file: File): Promise<string> {
    return this.uploadImage(file, 'blog-images', 'avatars');
  }

  // Specific method for other content images
  static async uploadContentImage(file: File): Promise<string> {
    return this.uploadImage(file, 'blog-images', 'content');
  }

  static async ensureBucketExists(bucketName: string): Promise<void> {
    try {
      // Check if bucket exists
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.error('❌ Error listing buckets:', listError);
        return;
      }

      const bucketExists = buckets?.some(bucket => bucket.id === bucketName);
      
      if (!bucketExists) {
        console.log('📦 Creating storage bucket:', bucketName);
        
        // Create bucket
        const { data, error } = await supabase.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: 52428800, // 50MB
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
        });

        if (error) {
          console.error('❌ Error creating bucket:', error);
          throw new Error(`Failed to create storage bucket: ${error.message}`);
        }

        console.log('✅ Storage bucket created:', data);
      } else {
        console.log('✅ Storage bucket already exists:', bucketName);
      }
    } catch (error) {
      console.error('❌ Bucket creation error:', error);
      // Don't throw here, let the upload attempt continue
    }
  }

  static async deleteImage(filePath: string, bucket: string = 'blog-images'): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) {
        console.error('❌ Storage delete error:', error);
        throw new Error(`Failed to delete image: ${error.message}`);
      }

      console.log('✅ Image deleted successfully');
    } catch (error) {
      console.error('❌ Storage delete service error:', error);
      throw error;
    }
  }
}
