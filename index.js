const express = require("express");
const bp = require('body-parser')
const app = express();
const ejs = require('ejs');
const bcrypt = require('bcrypt');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const session = require("express-session");
var serviceAccount = require("./key.json");
app.use(session({
  secret: 'your-secret-key',
  resave: true,
  saveUninitialized: true,
}));
initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

app.set('view engine', 'ejs');
app.use(bp.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('csp1.ejs');
    
});
app.get('/csp2.ejs',(req,res)=>{
  res.render('csp2.ejs');
});
app.get('/csp3.ejs',(req,res)=>{
  res.render('csp3.ejs',{temp23:null});
});
app.get('/chinese.ejs',(req,res)=>{
  res.render('chinese.ejs');
});
app.get('/italian.ejs',(req,res)=>{
  res.render('italian.ejs');
});
app.get('/russian.ejs',(req,res)=>{
  res.render('russian.ejs');
});
app.get('/north.ejs',(req,res)=>{
  res.render('north.ejs');
});
app.get('/south.ejs',(req,res)=>{
  res.render('south.ejs');
});
app.get('/payment.ejs',(req,res)=>{
  res.render('payment.ejs');
});
app.get('/signup.ejs',(req,res)=>{
  res.render('signup.ejs',{temp:null});
});
app.get('/bill.ejs',(req,res)=>{
  res.render('bill.ejs',{temp_name:null,temp_bill:null});
});
app.get('/admin.ejs',(req,res)=>{
  res.render('admin.ejs');
});
app.get('/demo1.ejs',(req,res)=>{
  res.render('demo1.ejs');
})
app.get('/dashboard.ejs',(req,res)=>{
  res.render('dashboard.ejs',{details:null});
});
app.get('/succ.ejs',(req,res)=>{
  res.render("succ.ejs");
})



app.post('/chinese.ejs', (req, res) => {
  const price = req.body.res;
  req.session.x=price;
  res.render('csp3.ejs',{temp23:price});
});

app.post('/north.ejs', (req, res) => {
  const price = req.body.res;
  req.session.x=price;
  res.render('csp3.ejs',{temp23:price});
});

app.post('/south.ejs', (req, res) => {
  const price = req.body.res;
  req.session.x=price;
  res.render('csp3.ejs',{temp23:price});
});
 
app.post('/italian.ejs', (req, res) => {
  const price = req.body.res;
  req.session.x=price;
  res.render('csp3.ejs',{temp23:price});
});

app.post('/russian.ejs', (req, res) => {
  const price = req.body.res;
  req.session.x=price;
  res.render('csp3.ejs',{temp23:price});
});


app.post('/signup.ejs', async (req, res) => {
  const name = req.body.username;
  req.session.y = name;
  const email = req.body.email;
  const password = req.body.pswd; 
  const pri = req.session.x || 0; 
  try {
   
    const querySnapshot = await db.collection('details').where('Email', '==', email).get();

    if (!querySnapshot.empty) {
      
      res.render('signup.ejs', { temp: 'Email is already registered' });
    } else {
    
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

     
      const data = {
        Name: name,
        Email: email,
        Password: hashedPassword, 
        Bill_Price: pri,
      };

   
      await db.collection('details').add(data);

      res.render('csp3.ejs');
    }
  } catch (error) {
    console.error('Error adding document: ', error);
    res.status(500).send('Error adding document to Firestore.');
  }
});


  

app.post('/csp3.ejs', async (req, res) => {
  const email = req.body.email1;
  const password = req.body.pswd1;

  try {
   
    const querySnapshot = await db.collection('details').where('Email', '==', email).get();

    if (!querySnapshot.empty) {
      const user = querySnapshot.docs[0].data();
      const hashedPassword = user.Password;

   
      const passwordMatch = await bcrypt.compare(password, hashedPassword);

      if (passwordMatch) {
   
        res.render('bill.ejs', { temp_bill: req.session.x, temp_name: req.session.y });
      } else {
      
        res.send('Incorrect password.');
      }
    } else {
      res.send('User not found.');
    }
  } catch (error) {
    console.error('Error: ', error);
    res.status(500).send('Error during login.');
  }
});




app.post('/admin.ejs', (req, res) => {
  const email = req.body.email_admin;
  const password = req.body.pswd_admin;
  db.collection('admin')
  .where("Email","==",email)
  .where("Password","==",password)
  .get()
  .then((docs)=>{
    if(docs.size>0)
    {
      res.render("demo1.ejs");
    }
    else{
      res.send("Unsuccessful Login");
    }
  });
});

app.post('/demo1.ejs', async (req, res) => {
  try {
    const snapshot = await db.collection('details').get();
    const data = []; 
    snapshot.forEach(doc => {
      data.push(doc.data());
    });
    res.render('dashboard.ejs', { details: data });
  } catch (error) {
    console.error('Error getting data:', error);
    res.status(500).send('Error getting data from Firestore.');
  }
});

app.post("/bill.ejs",(req,res)=>{
  res.render("payment.ejs");
});
app.post("/payment.ejs",(req,res)=>{
  res.render("succ.ejs");
});



app.listen(3000, () => {
    console.log("server start");
});
