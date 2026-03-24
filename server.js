const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// تهيئة Firebase Admin SDK بالطريقة الصحيحة
const serviceAccount = require('./firebase-key.json');

// تأكد من أن serviceAccount يحتوي على private_key
if (!serviceAccount.private_key) {
    console.error('❌ المفتاح الخاص غير موجود في firebase-key.json');
    process.exit(1);
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// API لجلب الحجوزات
app.get('/api/reservations/:service', async (req, res) => {
    const servicePath = req.params.service;
    
    // إضافة CORS headers
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).send();
    }
    
    try {
        console.log(`📁 جلب حجوزات: ${servicePath}`);
        
        const serviceRef = db
            .collection('Al-Jawhara Bank')
            .doc('Al-Jawhara Bank DATABASE')
            .collection('Reservations')
            .doc(servicePath);
        
        // التحقق من وجود المستند
        const doc = await serviceRef.get();
        if (!doc.exists) {
            console.log(`📭 المستند غير موجود: ${servicePath}`);
            return res.json({ success: true, reservations: [] });
        }
        
        const collections = await serviceRef.listCollections();
        const allReservations = [];
        
        for (const userColl of collections) {
            const snapshot = await userColl.get();
            snapshot.forEach(doc => {
                allReservations.push({
                    id: doc.id,
                    username: userColl.id,
                    ...doc.data()
                });
            });
        }
        
        console.log(`✅ تم جلب ${allReservations.length} حجز للخدمة: ${servicePath}`);
        res.json({ success: true, reservations: allReservations });
        
    } catch (error) {
        console.error(`❌ خطأ في ${servicePath}:`, error);
        res.json({ success: false, error: error.message });
    }
});

// صفحة ترحيبية بسيطة للرابط الرئيسي
app.get('/', (req, res) => {
    res.send('AJB Reservations API is running. Use /api/reservations/{service} to get reservations.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
