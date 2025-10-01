// src/services/appwriteService.js
import {
  databases,
  storage,
  account,
  ID,
  DATABASE_ID,
  GPT_PROFILES_COLLECTION_ID,
  LIBRARY_IMAGES_COLLECTION_ID,
  STORAGE_BUCKET_ID
} from '../config/appwrite';

class AppwriteService {
  // ----- Session -----
  async ensureValidSession() {
    try {
      const me = await account.get();
      console.log('✅ Authenticated user:', me.email || me.name || me.$id);
      return me;
    } catch {
      console.log('🔄 No active session, creating anonymous session...');
      const anon = await account.createAnonymousSession();
      console.log('✅ Anonymous session created:', anon.$id);
      return anon;
    }
  }

  // ----- Upload (Option A: File security OFF, bucket-level perms apply) -----
  async uploadImage(file) {
    console.log('🔄 Starting image upload...');
    console.log('📁 Storage Bucket ID:', STORAGE_BUCKET_ID);
    console.log('📄 File details:', {
      name: file?.name, type: file?.type, size: file ? `${(file.size/1024).toFixed(1)}KB` : 'n/a'
    });

    if (!STORAGE_BUCKET_ID) throw new Error('Missing STORAGE_BUCKET_ID');

    // Ensure a session (Anonymous is fine if bucket write is role:member)
    await this.ensureValidSession();

    // Validate file
    if (!file || !file.type) throw new Error('Invalid file provided');
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) throw new Error('File too large. Max 10MB.');
    const allowed = ['image/jpeg','image/jpg','image/png','image/webp','image/gif'];
    if (!allowed.includes(file.type)) {
      throw new Error(`Unsupported file type: ${file.type}. Use JPG/PNG/WebP/GIF.`);
    }

    // Upload (no per-file permissions; bucket-level perms must be effective)
    const fileId = ID.unique();
    console.log('📤 Uploading file with ID:', fileId);

    try {
      const uploaded = await storage.createFile(STORAGE_BUCKET_ID, fileId, file);
      console.log('✅ File uploaded:', uploaded.$id);

      const viewUrl = storage.getFileView(STORAGE_BUCKET_ID, uploaded.$id).toString();
      console.log('🔗 File URL:', viewUrl);
      return viewUrl;
    } catch (error) {
      console.error('❌ Upload failed:', { message: error?.message, code: error?.code, type: error?.type });

      // If you still get 404 here, it’s **not** your code. It means the bucket
      // is not visible at the endpoint/project the browser is using.
      if (error?.code === 404) {
        throw new Error(
          'Bucket not visible from client. Fix in Console: Storage → Bucket 68dd20240013d5212930 → ' +
          'File security OFF, Write: role:member (or role:all). Also ensure endpoint is https://cloud.appwrite.io/v1.'
        );
      }
      if (error?.code === 401 || error?.code === 403) {
        throw new Error(
          'Permission denied. Make sure user has a session and bucket Write allows role:member/role:all.'
        );
      }
      if (error?.code === 413) throw new Error('File too large. Max 10MB.');
      throw new Error(`Upload failed: ${error?.message || 'Unknown error'}`);
    }
  }

  // ----- GPT Profiles -----
  async getAllGPTProfiles() {
    try {
      const res = await databases.listDocuments(DATABASE_ID, GPT_PROFILES_COLLECTION_ID);
      return res.documents;
    } catch (e) {
      console.error('Error fetching GPT profiles:', e);
      throw new Error(`Failed to fetch GPT profiles: ${e.message}`);
    }
  }

  async createGPTProfile(profileData) {
    try {
      let photoUrl = '/gpt-profiles/default-avatar.svg';
      if (profileData.photoFile) photoUrl = await this.uploadImage(profileData.photoFile);

      const res = await databases.createDocument(
        DATABASE_ID,
        GPT_PROFILES_COLLECTION_ID,
        ID.unique(),
        {
          name: profileData.name,
          description: profileData.description,
          photo: photoUrl,
          specialties: profileData.specialties || []
        }
      );
      return res;
    } catch (e) {
      console.error('Error creating GPT profile:', e);
      throw new Error(`Failed to create GPT profile: ${e.message}`);
    }
  }

  async updateGPTProfile(profileId, profileData) {
    try {
      let photoUrl = profileData.photo;
      if (profileData.photoFile) photoUrl = await this.uploadImage(profileData.photoFile);

      const res = await databases.updateDocument(
        DATABASE_ID,
        GPT_PROFILES_COLLECTION_ID,
        profileId,
        {
          name: profileData.name,
          description: profileData.description,
          photo: photoUrl,
          specialties: profileData.specialties || []
        }
      );
      return res;
    } catch (e) {
      console.error('Error updating GPT profile:', e);
      throw new Error(`Failed to update GPT profile: ${e.message}`);
    }
  }

  async deleteGPTProfile(profileId) {
    try {
      await databases.deleteDocument(DATABASE_ID, GPT_PROFILES_COLLECTION_ID, profileId);
    } catch (e) {
      console.error('Error deleting GPT profile:', e);
      throw new Error(`Failed to delete GPT profile: ${e.message}`);
    }
  }

  // ----- Library -----
  async getAllLibraryImages() {
    try {
      const res = await databases.listDocuments(DATABASE_ID, LIBRARY_IMAGES_COLLECTION_ID);
      return res.documents;
    } catch (e) {
      console.error('Error fetching library images:', e);
      throw new Error(`Failed to fetch library images: ${e.message}`);
    }
  }

  async createLibraryImage(imageFile, alt = 'Personal Photo') {
    try {
      const src = await this.uploadImage(imageFile);
      const res = await databases.createDocument(
        DATABASE_ID,
        LIBRARY_IMAGES_COLLECTION_ID,
        ID.unique(),
        { src, alt }
      );
      return res;
    } catch (e) {
      console.error('Error creating library image:', e);
      throw new Error(`Failed to create library image: ${e.message}`);
    }
  }

  async deleteLibraryImage(imageId) {
    try {
      await databases.deleteDocument(DATABASE_ID, LIBRARY_IMAGES_COLLECTION_ID, imageId);
    } catch (e) {
      console.error('Error deleting library image:', e);
      throw new Error(`Failed to delete library image: ${e.message}`);
    }
  }
}

export default new AppwriteService();
