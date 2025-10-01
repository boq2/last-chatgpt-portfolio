import { Client, Storage, Permission, Role, ID } from 'node-appwrite';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function fixAppwriteSetup() {
    console.log('\n🔧 Appwrite Storage Fix Script\n');
    console.log('This script will check and fix your storage bucket configuration.\n');

    // Get API key from user
    const apiKey = await question('Enter your Appwrite API Key: ');
    
    if (!apiKey.trim()) {
        console.error('❌ API Key is required!');
        rl.close();
        return;
    }

    // Initialize Appwrite client
    const client = new Client();
    client
        .setEndpoint('https://fra.cloud.appwrite.io/v1')
        .setProject('68dd1de00019a323085a')
        .setKey(apiKey.trim());

    const storage = new Storage(client);

    try {
        console.log('\n🔍 Checking existing storage buckets...');
        
        // List all buckets
        const buckets = await storage.listBuckets();
        console.log(`Found ${buckets.buckets.length} existing buckets:`);
        
        let portfolioBucket = null;
        buckets.buckets.forEach(bucket => {
            console.log(`   - ${bucket.name} (ID: ${bucket.$id})`);
            if (bucket.name === 'portfolio-images' || bucket.name.includes('portfolio')) {
                portfolioBucket = bucket;
            }
        });

        if (portfolioBucket) {
            console.log(`\n✅ Found existing portfolio bucket: ${portfolioBucket.$id}`);
        } else {
            console.log('\n📦 Creating new storage bucket...');
            try {
                portfolioBucket = await storage.createBucket({
                    bucketId: ID.unique(),
                    name: 'portfolio-images',
                    permissions: [
                        Permission.read(Role.any()),
                        Permission.create(Role.any()),
                        Permission.update(Role.any()),
                        Permission.delete(Role.any())
                    ],
                    fileSecurity: false,
                    enabled: true,
                    maximumFileSize: 10485760, // 10MB max file size
                    allowedFileExtensions: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
                    compression: 'none',
                    encryption: false,
                    antivirus: false
                });
                console.log(`✅ Storage bucket created: ${portfolioBucket.$id}`);
            } catch (error) {
                console.error('❌ Error creating bucket:', error.message);
                rl.close();
                return;
            }
        }

        // Update .env file
        console.log('\n📝 Updating .env file...');
        const envContent = `VITE_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=68dd1de00019a323085a
VITE_APPWRITE_DATABASE_ID=68dd201f0013ab296a14
VITE_APPWRITE_GPT_COLLECTION_ID=68dd202000121baf4b66
VITE_APPWRITE_LIBRARY_COLLECTION_ID=68dd202200310fc73902
VITE_APPWRITE_STORAGE_BUCKET_ID=${portfolioBucket.$id}`;

        const fs = await import('fs');
        fs.writeFileSync('.env', envContent);
        console.log('✅ .env file updated with correct bucket ID!');

        console.log('\n' + '='.repeat(50));
        console.log('✨ Storage Fix Complete! ✨');
        console.log('='.repeat(50));
        console.log(`\n📋 Correct Storage Bucket ID: ${portfolioBucket.$id}`);
        console.log('\n🚀 Next Steps:');
        console.log('   1. Restart your development server: npm run dev');
        console.log('   2. Try uploading a photo in the admin panel');
        console.log('   3. Your images will now be stored in Appwrite cloud!\n');

    } catch (error) {
        console.error('\n❌ Error during fix:', error.message);
        console.error('\nPlease check:');
        console.error('1. Your API key is correct');
        console.error('2. You have proper permissions in Appwrite console');
        console.error('3. Your internet connection is stable\n');
    } finally {
        rl.close();
    }
}

fixAppwriteSetup();