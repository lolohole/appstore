app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    // تأكد من وجود المستخدم وتأكد من صحة كلمة المرور
    const user = await User.findOne({ username });
    if (!user || !(await user.isPasswordMatch(password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
  
    // إنشاء ملف تعريف جديد وتخزينه في المستعرض
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '60 days',
    });
  
    res.cookie('token', token, {
      expires: new Date(Date.now() + 60 * 24 * 60 * 1000),
      httpOnly: true,
    });
  
    // توجيه المستخدم إلى صفحة ملف تعريفه
    res.status(200).redirect('/profile');
  });
  app.get('/profile', async (req, res) => {
    try {
      const token = req.cookies.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({ _id: decoded._id });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).render('profile', { user });
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  });