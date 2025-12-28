# 🚀 Quick Start Guide

Get up and running with LastMile SDK in under 5 minutes!

## Step 1: Get Your API Key

Sign up at [lastmile.dev](https://lastmile.dev) to get your API key.

For testing, you can use: `demo_api_key_12345`

---

## Step 2: Install

### Option A: Via Script Tag (Easiest)

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.lastmile.dev/sdk/v1/lastmile.min.js"></script>
</head>
<body>
  <script>
    const lastMile = new LastMile({
      apiKey: 'your_api_key_here'
    });
  </script>
</body>
</html>
```

### Option B: Via NPM

```bash
npm install @lastmile/deployment-sdk
```

```javascript
const LastMile = require('@lastmile/deployment-sdk');

const lastMile = new LastMile({
  apiKey: 'your_api_key_here'
});
```

---

## Step 3: Deploy Your First App

```javascript
lastMile.deploy({
  projectName: 'my-first-app',
  framework: 'react',
  code: `
    import React from 'react';
    
    function App() {
      return <h1>Hello, LastMile!</h1>;
    }
    
    export default App;
  `
})
.then(result => {
  console.log('🎉 Deployed!');
  console.log('URL:', result.url);
  console.log('ID:', result.deploymentId);
})
.catch(error => {
  console.error('❌ Failed:', error.message);
});
```

---

## Step 4: Check Status

```javascript
// Get deployment status
lastMile.getStatus('dep_abc123')
  .then(status => {
    console.log('Status:', status.status);
  });

// Or poll until complete
lastMile.pollStatus('dep_abc123')
  .then(finalStatus => {
    console.log('✅ Complete!');
    console.log('URL:', finalStatus.url);
  });
```

---

## Step 5: Listen to Events (Optional)

```javascript
lastMile.on('deployStart', data => {
  console.log('🚀 Starting deployment...');
});

lastMile.on('deploySuccess', data => {
  console.log('✅ Success!', data.url);
});

lastMile.on('deployError', data => {
  console.log('❌ Error:', data.error);
});
```

---

## Complete Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>LastMile Quick Start</title>
  <script src="lastmile.js"></script>
</head>
<body>
  <h1>LastMile SDK - Quick Start</h1>
  <button id="deployBtn">Deploy App</button>
  <div id="output"></div>

  <script>
    // Initialize SDK
    const lastMile = new LastMile({
      apiKey: 'demo_api_key_12345',
      debug: true
    });

    // Listen to events
    lastMile.on('deploySuccess', data => {
      document.getElementById('output').innerHTML = 
        `✅ Deployed to: <a href="${data.url}">${data.url}</a>`;
    });

    // Deploy on button click
    document.getElementById('deployBtn').addEventListener('click', () => {
      lastMile.deploy({
        projectName: 'quick-start-app',
        code: 'console.log("Hello from LastMile!");'
      });
    });
  </script>
</body>
</html>
```

---

## Running the Example

1. Clone the repository:
```bash
git clone https://github.com/navin3756/lastmile-deployment-platform.git
cd lastmile-deployment-platform
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open the example:
```bash
npm run serve
# Visit http://localhost:8080
```

---

## Next Steps

- 📖 Read the [full documentation](README.md)
- 🎨 Check out [framework examples](README.md#framework-examples)
- 🔧 Learn about [configuration options](README.md#constructor)
- 📊 Explore [deployment status values](README.md#deployment-status-values)
- 🎯 See the [complete API reference](README.md#complete-api-reference)

---

## Common Issues

### "API key is required"
Make sure you're passing the API key in the config:
```javascript
const lastMile = new LastMile({
  apiKey: 'your_key_here' // Don't forget this!
});
```

### "CORS error"
If you're running locally, make sure the API server is running and CORS is configured properly.

### "Deployment failed"
Check the error message for details. Common causes:
- Invalid code syntax
- Missing required fields
- Network connectivity issues

---

## Support

- 📧 Email: support@lastmile.dev
- 💬 Discord: [Join our community](https://discord.gg/lastmile)
- 🐛 Issues: [GitHub Issues](https://github.com/navin3756/lastmile-deployment-platform/issues)

---

**Ready to deploy? Let's go! 🚀**
