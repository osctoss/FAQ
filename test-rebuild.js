import http from 'http';

const body = JSON.stringify({ collection: 'faq', repair: false });
const req = http.request({
  hostname: '127.0.0.1',
  port: 5000,
  path: '/api/vector/rebuild',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body)
  }
}, res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data.slice(0, 500));
    process.exit(0);
  });
});

req.on('error', e => {
  console.log('Request error:', e.message);
  process.exit(1);
});

req.write(body);
req.end();