const { createClient } = require('@supabase/supabase-js');
const sb = createClient(
  'https://unadwdulqstzwnudpqgp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuYWR3ZHVscXN0endudWRwcWdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MzMzODYsImV4cCI6MjA5MzMwOTM4Nn0.6ivBUDKBJLCyYZnkT-JjY874yGnTCYdiCuKnNPt6Zg8'
);

async function setup() {
  // 1. Create public storage bucket
  const { data, error } = await sb.storage.createBucket('images', {
    public: true,
    fileSizeLimit: 5242880, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  });
  console.log('bucket create:', error ? error.message : 'OK');

  // 2. Test upload
  const testBlob = new Blob(['test'], { type: 'text/plain' });
  const { error: upErr } = await sb.storage.from('images').upload('test.txt', testBlob);
  console.log('test upload:', upErr ? upErr.message : 'OK');
  if (!upErr) await sb.storage.from('images').remove(['test.txt']);

  console.log('DONE');
}
setup();
