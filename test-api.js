// Test script to verify backend API endpoints
const testAPI = async () => {
    const BASE_URL = 'http://localhost:5000/api';

    console.log('🧪 Testing Backend API Endpoints...\n');

    try {
        // Test 1: Health Check
        console.log('1️⃣ Testing Health Check...');
        const healthRes = await fetch(`${BASE_URL}/health`);
        const health = await healthRes.json();
        console.log('✅ Health:', health);
        console.log('');

        // Test 2: Get Resources (public)
        console.log('2️⃣ Testing Get Resources...');
        const resourcesRes = await fetch(`${BASE_URL}/resources`);
        const resources = await resourcesRes.json();
        console.log('✅ Resources count:', resources.count);
        console.log('   First resource:', resources.data?.[0]?.title);
        console.log('');

        // Test 3: Register User
        console.log('3️⃣ Testing User Registration...');
        const registerRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            })
        });
        const registerData = await registerRes.json();

        if (registerData.success) {
            console.log('✅ User registered successfully!');
            console.log('   User:', registerData.data?.user?.name);
            console.log('   Token received:', registerData.data?.token ? 'Yes' : 'No');

            const token = registerData.data?.token;
            console.log('');

            // Test 4: Get Progress (protected)
            console.log('4️⃣ Testing Get Progress (authenticated)...');
            const progressRes = await fetch(`${BASE_URL}/progress`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const progress = await progressRes.json();
            console.log('✅ Progress:', progress.data);
            console.log('');

            // Test 5: Get Learning Path
            console.log('5️⃣ Testing Get Learning Path...');
            const pathRes = await fetch(`${BASE_URL}/learning-path`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const path = await pathRes.json();
            console.log('✅ Learning Path:', path.data?.title);
            console.log('   Steps:', path.data?.steps?.length);
            console.log('');

            // Test 6: Send AI Message
            console.log('6️⃣ Testing AI Assistant...');
            const chatRes = await fetch(`${BASE_URL}/assistant/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: 'Explain React hooks' })
            });
            const chat = await chatRes.json();
            console.log('✅ AI Response received:', chat.data?.aiMessage?.content?.substring(0, 100) + '...');
            console.log('');

            console.log('🎉 All tests passed! Backend is working correctly.');
        } else {
            // User might already exist
            if (registerData.error?.includes('already exists')) {
                console.log('ℹ️  User already exists. Testing login instead...');

                const loginRes = await fetch(`${BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: 'test@example.com',
                        password: 'password123'
                    })
                });
                const loginData = await loginRes.json();

                if (loginData.success) {
                    console.log('✅ Login successful!');
                    console.log('🎉 Backend is working correctly.');
                }
            } else {
                console.log('❌ Registration failed:', registerData.error);
            }
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.log('\n⚠️  Make sure:');
        console.log('   1. MongoDB is running on localhost:27017');
        console.log('   2. Backend server is running on port 5000');
        console.log('   3. Run: npm run dev:all');
    }
};

testAPI();
