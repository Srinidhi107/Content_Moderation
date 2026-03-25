const https = require('https');
const fs = require('fs');

function testSignup(username, email) {
    return new Promise((resolve) => {
        const data = JSON.stringify({ username, email, password: 'password123' });
        const options = {
            hostname: 'content-moderation-b943.onrender.com',
            port: 443,
            path: '/api/auth/signup',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = https.request(options, res => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve(`HTTP ${res.statusCode}: ${body}`));
        });

        req.on('error', e => resolve(`Error: ${e.message}`));
        req.write(data);
        req.end();
    });
}

async function run() {
    let out = "";
    out += "Unique test: " + await testSignup('uniqueuser' + Date.now(), 'unique' + Date.now() + '@example.com') + "\n";
    out += "Chaitanya test: " + await testSignup('chaitanya', 'chaitu@gmail.com') + "\n";
    fs.writeFileSync('out.txt', out);
}
run();
