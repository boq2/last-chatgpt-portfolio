import { Client, Storage } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('68dd1de00019a323085a')
    .setKey('standard_b0665f2a6f243626415cb2c0c75dd45df9e58ed36cd64da0d17d7e4c5442e478970f9da79699f93026717dd4e83af5fbb8e3f55e6ae787eff2aadb1d80c8b0b281e951fde53d82d928fdcda3a1ceb8aede4fa1703e28e09c09b43175a57d86adb82cb1377056a504e6461854397b224223bb8dae78c40f0bcb4adc54cb6e1b18'); // works in node-appwrite only

const storage = new Storage(client);

async function createBucket() {
    try {
        console.log('🔍 Checking if bucket exists...');
        
        try {
            const existing = await storage.getBucket('68dd20240013d5212930');
            console.log('✅ Bucket already exists:', existing.name);
            return;
        } catch (error) {
            console.log('📝 Bucket not found, creating new one...');
        }

        const bucket = await storage.createBucket(
            '68dd20240013d5212930',
            'portfolio-images',
            ['role:all'], // correct permission format
            ['role:all'],
            true,
            false,
            10485760,
            ['jpg', 'jpeg', 'png', 'webp', 'gif']
        );

        console.log('✅ Bucket created successfully!', bucket.$id);
    } catch (error) {
        console.error('❌ Failed to create bucket:', error.message);
    }
}

createBucket();
