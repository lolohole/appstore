// routes/timer.js
const router = express.Router(); 
const User = require('../models/User');

router.get('/startSession', async (req, res) => {
  const userId = req.session.userId;  // الافتراض هنا هو أنك تستخدم الجلسات (sessions)
  
  const user = await User.findById(userId);
  const startTime = Date.now();

  // قم بتخزين الوقت الذي بدأ فيه المستخدم الجلسة
  user.timeSpent = startTime;

  res.send('الجلسة بدأت');
});

router.get('/endSession', async (req, res) => {
  const userId = req.session.userId;  // افتراض أنك تخزن معرف المستخدم في الجلسة
  const user = await User.findById(userId);
  
  const endTime = Date.now();
  const sessionDuration = (endTime - user.timeSpent) / 1000 / 60;  // مدة الجلسة بالدقائق
  
  // إذا كان المستخدم قد قضى ساعة كاملة
  if (sessionDuration >= 60) {
    // أضف له الجائزة
    user.tiktokFollowers += 10000;
    await user.save();
    res.send("لقد ربحت 10000 متابع على تيك توك!");
  } else {
    res.send("لم تكمل الساعة بعد.");
  }
});
