
async function testIpApi() {
    const ips = ['::1', '127.0.0.1', '8.8.8.8'];

    for (const ip of ips) {
        try {
            console.log(`Testing IP: ${ip}`);
            const response = await fetch(`https://ipapi.co/${ip}/json/`);
            const data = await response.json();
            console.log(`Response for ${ip}:`, JSON.stringify(data, null, 2));
        } catch (err) {
            console.error(`Error for ${ip}:`, err.message);
        }
        console.log('---');
    }
}

testIpApi();
