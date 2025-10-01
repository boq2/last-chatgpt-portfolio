// src/config/appwrite.js
import { Client, Databases, Storage, Account, ID } from 'appwrite';

const env = (v, fallback = '') => (v ?? fallback).toString().trim();

// **Force global endpoint** to avoid region mismatch headaches
const APPWRITE_ENDPOINT = env(import.meta.env.VITE_APPWRITE_ENDPOINT, 'https://cloud.appwrite.io/v1');
// Your real project id
const APPWRITE_PROJECT  = env(import.meta.env.VITE_APPWRITE_PROJECT_ID, '68dd1de00019a323085a');

console.log('🔧 Appwrite Configuration:');
console.log('📍 Endpoint:', APPWRITE_ENDPOINT);
console.log('🔑 Project ID:', APPWRITE_PROJECT);
console.log('🗄️  Database ID:', env(import.meta.env.VITE_APPWRITE_DATABASE_ID, '68dd201f0013ab296a14'));
console.log('📁 Storage Bucket ID:', env(import.meta.env.VITE_APPWRITE_STORAGE_BUCKET_ID, '68dd20240013d5212930'));

export const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT);

export const databases = new Databases(client);
export const storage   = new Storage(client);
export const account   = new Account(client);

export const DATABASE_ID = env(import.meta.env.VITE_APPWRITE_DATABASE_ID, '68dd201f0013ab296a14');
export const GPT_PROFILES_COLLECTION_ID   = env(import.meta.env.VITE_APPWRITE_GPT_COLLECTION_ID, '68dd202000121baf4b66');
export const LIBRARY_IMAGES_COLLECTION_ID = env(import.meta.env.VITE_APPWRITE_LIBRARY_COLLECTION_ID, '68dd202200310fc73902');
export const STORAGE_BUCKET_ID            = env(import.meta.env.VITE_APPWRITE_STORAGE_BUCKET_ID, '68dd20240013d5212930');

if (!DATABASE_ID)       console.error('❌ DATABASE_ID is not configured properly');
if (!STORAGE_BUCKET_ID) console.error('❌ STORAGE_BUCKET_ID is not configured properly');

console.log('🪣 Resolved Storage Bucket ID:', STORAGE_BUCKET_ID);

export { ID };
