require('dotenv').config();
const keys = require('./config/keys');
const express = require('express');
const stripe = require('stripe')(keys.stripeSecretKey);
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');

// INITIALIZE EXPRESS
const app = express();

// VIEW ENGINE SETUP
// HANDLEBARS

// THE LAYOUT THAT WRAPS AROUND ALL OUR VIEWS IS CALLED MAIN.HANDLEBARS
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// MIDDLEWARE

// BODYPARSER
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// STATIC FOLDER
app.use(express.static(path.join(__dirname, 'public')));

// INDEX ROUTE
app.get('/', (req, res) => {
  res.render('index', {
    stripePublishableKey: keys.stripePublishableKey
  });
});

// CHARGE ROUTE
app.post('/charge', (req, res) => {
  const amount = 2500; // $25

  const { stripeToken, stripeTokenType, stripeEmail } = req.body;

  // CREATE THE CUSTOMER
  stripe.customers
    .create({
      email: stripeEmail,
      source: stripeToken
    })
    .then(customer =>
      stripe.charges.create({
        amount,
        description: 'Web Development Ebook',
        currency: 'usd',
        customer: customer.id
      })
    )
    .then(charge => res.render('success'));
});

// START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
