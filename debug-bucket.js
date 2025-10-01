import { Client, Storage } from 'appwrite';

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('68dd1de00019a323085a')
    .setKey('standard_b0665f2a6f243626415cb2c0c75dd45df9e58ed36cd64da0d17d7e4c5442e478970f9da79699f93026717dd4e83af5fbb8e3f55e6ae787eff2aadb1d80c8b0b281e951fde53d82d928fdcda3a1ceb8aede4fa1703e28e09c09b43175a57d86adb82cb1377056a504e6461854397b224223bb8dae78c40f0bcb4adc54cb6e1b18'); // Replace with your API key

const storage = new Storage(client);

async function checkBucket() {
    try {
        console.log('🔍 Checking bucket 68dd20240013d5212930...');
        const bucket = await storage.getBucket('68dd20240013d5212930');
        console.log('✅ Bucket found:', bucket);
    } catch (error) {
        console.log('❌ Bucket not found:', error.message);
        console.log('📝 Creating bucket...');
        
        try {
            const newBucket = await storage.createBucket(
                '68dd20240013d5212930',
                'portfolio-images'
            );
            console.log('✅ Bucket created:', newBucket);
        } catch (createError) {
            console.error('❌ Failed to create bucket:', createError);
        }
    }
}

checkBucket();