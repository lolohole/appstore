import express from "express"
const app = express();

// Middleware لتحليل بيانات JSON
app.use(express.json());

app.post('/sign up', (req, res) => {
  // التحقق من وجود بيانات في req.body
  if (req.body && Object.keys(req.body).length > 0) {
    // معالجة البيانات المرسلة
    const { username, password } = req.body;
    console.log('Body:', req.body);

    // ... أي معالجة أخرى للبيانات مثل إدخالها في قاعدة البيانات

    res.status(200).json({ message: 'Sign up successful' });
  } else {
    // التعامل مع حالة البيانات الفارغة
    res.status(400).json({ error: 'Bad Request: No data received' });
  }
});

// تشغيل الخادم
app.listen(5500, () => {
  console.log('Server is running on http://localhost:5500');
});