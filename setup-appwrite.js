import { Client, Databases, Storage, ID, Permission, Role } from 'node-appwrite';
import * as readline from 'readline';

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupAppwrite() {
    console.log('\n🚀 Appwrite Portfolio Setup Script\n');
    console.log('This script will create the database, collections, and storage bucket for your portfolio.\n');

    // Get API key from user
    const apiKey = await question('Enter your Appwrite API Key (from https://cloud.appwrite.io/console/project-68dd1de00019a323085a/settings): ');
    
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

    const databases = new Databases(client);
    const storage = new Storage(client);

    try {
        // Step 1: Create Database
        console.log('\n📦 Creating database...');
        let database;
        try {
            database = await databases.create(
                ID.unique(),
                'portfolio-db'
            );
            console.log('✅ Database created successfully!');
            console.log(`   Database ID: ${database.$id}`);
        } catch (error) {
            if (error.code === 409) {
                console.log('⚠️  Database already exists, using existing database');
                const databasesList = await databases.list();
                database = databasesList.databases.find(db => db.name === 'portfolio-db');
                if (!database) {
                    throw new Error('Database exists but could not be found');
                }
            } else {
                throw error;
            }
        }

        const databaseId = database.$id;

        // Step 2: Create GPT Profiles Collection
        console.log('\n📋 Creating GPT Profiles collection...');
        let gptCollection;
        try {
            gptCollection = await databases.createCollection(
                databaseId,
                ID.unique(),
                'gpt-profiles'
            );
            console.log('✅ GPT Profiles collection created!');
            console.log(`   Collection ID: ${gptCollection.$id}`);
        } catch (error) {
            if (error.code === 409) {
                console.log('⚠️  GPT Profiles collection already exists');
                const collections = await databases.listCollections(databaseId);
                gptCollection = collections.collections.find(col => col.name === 'gpt-profiles');
            } else {
                throw error;
            }
        }

        // Create attributes for GPT Profiles
        console.log('   Creating attributes...');
        try {
            await databases.createStringAttribute(databaseId, gptCollection.$id, 'name', 255, true);
            console.log('   ✓ name attribute created');
        } catch (e) {
            if (e.code !== 409) throw e;
            console.log('   ⚠️  name attribute already exists');
        }

        try {
            await databases.createStringAttribute(databaseId, gptCollection.$id, 'description', 5000, true);
            console.log('   ✓ description attribute created');
        } catch (e) {
            if (e.code !== 409) throw e;
            console.log('   ⚠️  description attribute already exists');
        }

        try {
            await databases.createStringAttribute(databaseId, gptCollection.$id, 'photo', 500, true);
            console.log('   ✓ photo attribute created');
        } catch (e) {
            if (e.code !== 409) throw e;
            console.log('   ⚠️  photo attribute already exists');
        }

        try {
            await databases.createStringAttribute(databaseId, gptCollection.$id, 'specialties', 100, false, undefined, true);
            console.log('   ✓ specialties attribute created');
        } catch (e) {
            if (e.code !== 409) throw e;
            console.log('   ⚠️  specialties attribute already exists');
        }

        // Set permissions for GPT Profiles
        console.log('   Setting permissions...');
        try {
            await databases.updateCollection(
                databaseId,
                gptCollection.$id,
                'gpt-profiles',
                [
                    Permission.read(Role.any()),
                    Permission.create(Role.any()),
                    Permission.update(Role.any()),
                    Permission.delete(Role.any())
                ]
            );
            console.log('   ✓ Permissions set');
        } catch (e) {
            console.log('   ⚠️  Could not update permissions:', e.message);
        }

        // Step 3: Create Library Images Collection
        console.log('\n🖼️  Creating Library Images collection...');
        let libraryCollection;
        try {
            libraryCollection = await databases.createCollection(
                databaseId,
                ID.unique(),
                'library-images'
            );
            console.log('✅ Library Images collection created!');
            console.log(`   Collection ID: ${libraryCollection.$id}`);
        } catch (error) {
            if (error.code === 409) {
                console.log('⚠️  Library Images collection already exists');
                const collections = await databases.listCollections(databaseId);
                libraryCollection = collections.collections.find(col => col.name === 'library-images');
            } else {
                throw error;
            }
        }

        // Create attributes for Library Images
        console.log('   Creating attributes...');
        try {
            await databases.createStringAttribute(databaseId, libraryCollection.$id, 'src', 500, true);
            console.log('   ✓ src attribute created');
        } catch (e) {
            if (e.code !== 409) throw e;
            console.log('   ⚠️  src attribute already exists');
        }

        try {
            await databases.createStringAttribute(databaseId, libraryCollection.$id, 'alt', 255, true);
            console.log('   ✓ alt attribute created');
        } catch (e) {
            if (e.code !== 409) throw e;
            console.log('   ⚠️  alt attribute already exists');
        }

        // Set permissions for Library Images
        console.log('   Setting permissions...');
        try {
            await databases.updateCollection(
                databaseId,
                libraryCollection.$id,
                'library-images',
                [
                    Permission.read(Role.any()),
                    Permission.create(Role.any()),
                    Permission.update(Role.any()),
                    Permission.delete(Role.any())
                ]
            );
            console.log('   ✓ Permissions set');
        } catch (e) {
            console.log('   ⚠️  Could not update permissions:', e.message);
        }

        // Step 4: Create Storage Bucket
        console.log('\n💾 Creating storage bucket...');
        let bucket;
        try {
            bucket = await storage.createBucket(
                ID.unique(),
                'portfolio-images',
                [
                    Permission.read(Role.any()),
                    Permission.create(Role.any()),
                    Permission.update(Role.any()),
                    Permission.delete(Role.any())
                ],
                false, // compression
                false, // encryption
                10485760, // 10MB max file size
                ['jpg', 'jpeg', 'png', 'webp', 'gif'], // allowed extensions
                undefined, // compression algorithm
                false, // antivirus
                true // enabled
            );
            console.log('✅ Storage bucket created!');
            console.log(`   Bucket ID: ${bucket.$id}`);
        } catch (error) {
            if (error.code === 409) {
                console.log('⚠️  Storage bucket already exists');
                const buckets = await storage.listBuckets();
                bucket = buckets.buckets.find(b => b.name === 'portfolio-images');
            } else {
                throw error;
            }
        }

        // Step 5: Create .env file
        console.log('\n📝 Creating .env file...');
        const envContent = `VITE_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=68dd1de00019a323085a
VITE_APPWRITE_DATABASE_ID=${databaseId}
VITE_APPWRITE_GPT_COLLECTION_ID=${gptCollection.$id}
VITE_APPWRITE_LIBRARY_COLLECTION_ID=${libraryCollection.$id}
VITE_APPWRITE_STORAGE_BUCKET_ID=${bucket.$id}`;

        const fs = await import('fs');
        fs.writeFileSync('.env', envContent);
        console.log('✅ .env file created with all IDs!');

        // Summary
        console.log('\n' + '='.repeat(60));
        console.log('✨ Setup Complete! ✨');
        console.log('='.repeat(60));
        console.log('\n📋 Summary:');
        console.log(`   Database ID: ${databaseId}`);
        console.log(`   GPT Profiles Collection ID: ${gptCollection.$id}`);
        console.log(`   Library Images Collection ID: ${libraryCollection.$id}`);
        console.log(`   Storage Bucket ID: ${bucket.$id}`);
        console.log('\n📝 These IDs have been saved to your .env file');
        console.log('\n🚀 Next Steps:');
        console.log('   1. Run: npm run dev');
        console.log('   2. Go to the admin panel to add GPT profiles and images');
        console.log('   3. Your data will now be stored in Appwrite cloud!\n');

    } catch (error) {
        console.error('\n❌ Error during setup:', error.message);
        console.error('\nPlease check:');
        console.error('1. Your API key is correct');
        console.error('2. You have proper permissions in Appwrite console');
        console.error('3. Your internet connection is stable\n');
    } finally {
        rl.close();
    }
}

// Run the setup
setupAppwrite();