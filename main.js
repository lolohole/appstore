/*document.getElementById('signup-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // إرسال بيانات المستخدم إلى الخادم
  fetch('http://127.0.0.1:5500/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
});*/

import express from "express";
import bcrypt from 'bcrypt';

const express = require("express");
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;
const users = [];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// rest of your code

app.post('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'sign up.html'));
});

app.post('/register', async (req, res) => {
  try {
    const { email , password } = req.body;
    const findUser = users.find((data) => email == data.email)
    if (findUser) {
      res.status(400).send('wrong email or password ');
    }
    const hashedPassword =  await bcrypt.hash(password, 10);
    users.push({ email, password: hashedPassword });
    console.log(users);
    res.status(201).send("registered successfully");
  }
    catch (err){

    res.status(500).send("Invalid registration information")

  };

}); 

app.post("/login" , async (req , res) => {
  try {
    const { email , password } = req.body;
    const findUser = users.find((data) => email == data.email)
    if (!findUser) {
      res.status(400).send('wrong email or password ');
    }
    if (await bcrypt.compare(password, findUser.password)) {
      res.status(200).send("logged in successfully");
    } else {
      res.status(400).send("wrong email or password ");
    }

  } catch (err) {
    res.status(500).send("Invalid registration information")

  }






}

)

// Add the following in your server code


app.listen(port , () => {
  console.log('Server is running on http://127.0.0.1:5500');
})

