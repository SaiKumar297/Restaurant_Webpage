const express = require("express");
const bp = require('body-parser')
const app = express();
const ejs = require('ejs')
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
var serviceAccount = require("./key.json");

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
  res.render('csp3.ejs',{temp13:null,temp23:null});
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
  res.render('signup.ejs',{temp:price});
});

app.post('/north.ejs', (req, res) => {
  const price = req.body.res;
  res.render('signup.ejs',{temp:price});
});

app.post('/south.ejs', (req, res) => {
  const price = req.body.res;
  res.render('signup.ejs',{temp:price});
});
 
app.post('/italian.ejs', (req, res) => {
  const price = req.body.res;
  res.render('signup.ejs',{temp:price});
});

app.post('/russian.ejs', (req, res) => {
  const price = req.body.res;
  res.render('signup.ejs',{temp:price});
});


app.post('/signup.ejs', (req, res) => {
  const name = req.body.username;
  const email=req.body.email;
  const pwd=req.body.pswd;
  const pri=req.body.res1;


  // Create an object with the data to be added
  const data = {
    Name: name,
    Email: email,
    Password: pwd,
    Bill_Price: pri
  };
console.log(data);
  // Add the data to the Firestore collection
  db.collection('details').add(data)
    .then(() => {
      res.render("csp3.ejs",{temp13:name,temp23:pri});
    })
    .catch(error => {
      console.error("Error adding document: ", error);
      res.status(500).send("Error adding document to Firestore.");
    });
});
app.post('/csp3.ejs', (req, res) => {
  const email = req.body.email1;
  const password = req.body.pswd1;
  const name1=req.body.res13;
  const pri1=req.body.res23;
  db.collection('details')
  .where("Email","==",email)
  .where("Password","==",password)
  .get()
  .then((docs)=>{
    if(docs.size>0)
    {
      res.render("bill.ejs",{temp_name:name1,temp_bill:pri1});
    }
    else{
      res.send("Unsuccessful Login");
    }
  });
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
