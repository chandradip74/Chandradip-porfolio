async function run() {
  const form = new FormData();
  form.append('name', 'Test User');
  form.append('description', 'Test Description');
  
  // create a dummy image
  const buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
  const blob = new Blob([buffer], { type: 'image/png' });
  form.append('profileImage', blob, 'test.png');

  try {
    const res = await fetch('http://localhost:5000/api/profile', {
      method: 'PUT',
      body: form
    });
    const data = await res.json();
    console.log("Response:", res.status, data);
  } catch(e) {
    console.error("Error:", e);
  }
}

run();
