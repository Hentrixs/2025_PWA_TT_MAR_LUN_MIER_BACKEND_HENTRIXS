import fs from 'fs';

async function testFetch() {
    console.log("Testing fetch");

    // Login
    const loginRes = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'ramireztobias987@gmail.com', password: 'Joel5000' })
    });
    const loginData = await loginRes.json();
    const token = loginData.data?.auth_token;

    if (!token) {
        console.error("Login failed:", loginData);
        return;
    }

    const P_WORKSPACE_ID = '69e9423700b26a3d80655757';
    const P_CHANNEL_ID = '69e9423700b26a3d80655759'; // Provided by user

    console.log("Sending first message...");
    const req1 = await fetch(`http://localhost:8080/api/workspace/${P_WORKSPACE_ID}/channel/${P_CHANNEL_ID}/message`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            fk_id_channel: P_CHANNEL_ID,
            fk_id_member: '69eb95ad8da38d464b60d25c', // Wait, I need a valid member ID. I can fetch member list!
            content: "Test message 1"
        })
    });

    const data1 = await req1.json();
    console.log("Req 1:", data1);

    console.log("Sending second message...");
    const req2 = await fetch(`http://localhost:8080/api/workspace/${P_WORKSPACE_ID}/channel/${P_CHANNEL_ID}/message`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            fk_id_channel: P_CHANNEL_ID,
            fk_id_member: '69eb95ad8da38d464b60d25c', // We'll patch this later if wrong
            content: "Test message 2"
        })
    });
    const data2 = await req2.json();
    console.log("Req 2:", data2);
}

testFetch();
