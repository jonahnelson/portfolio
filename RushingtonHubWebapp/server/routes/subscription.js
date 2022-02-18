const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { QueryTypes } = require('sequelize');

const stripe = require('stripe')(process.env.REACT_APP_STRIPE_SK);

router.post('/freeTrial', async (req, res) => {
    const data = req.body;
    console.log('Creating free trial for customer', data.customer_id + '...');
    const subscription = await stripe.subscriptions.create({
        customer: data.customer_id,
        items: [
          {
            price: process.env.REACT_APP_PRICE_ID,
          },
        ],
        trial_period_days: 14,
    });
    var info={info:subscription};
    console.log('Successfully created free trial:', subscription);
    res.send(info);
});

router.post('/createCustomer', async (req, res) => {
    const data = req.body;
    console.log('Creating customer with email', data.Email + '...');
    const customer =  await stripe.customers.create({
        email: data.Email,
        name: data.Name
    });
    console.log('Successfully created customer with email', data.Email + ':', customer);
    res.send(customer);
});
router.post('/attachCard', async (req, res) => {
    const data = req.body;
    console.log("Attaching card with ID", data.paymentMethod_id, "to customer with ID", data.customer_id + '...');
    const payment = await stripe.paymentMethods.attach(
        data.paymentMethod_id,
        {customer: data.customer_id}
    ).catch(function(err){
        console.log("Failed to attach card with ID", data.paymentMethod_id, 'to customer with ID', data.customer_id, 'with error:', err);
        res.send(err);
    })
    if(payment){
        console.log('Updating customer with ID', data.customer_id, 'to payment method with ID', payment.id + '...');
        const update = await stripe.customers.update(
            data.customer_id,
            {invoice_settings: {default_payment_method: payment.id}}
        ).catch(function(err){
            console.log("Failed to update customer with ID", data.customer_id, 'to payment method with ID', payment.id, 'with error:', err);
            res.send(err);
        })
        res.send(update);
        console.log('Updating customer with ID', data.customer_id, 'to payment method with ID', payment.id, 'done')
    }
});
router.post('/createSubscription', async (req, res) => {
    const data = req.body
    console.log('Creating subscription for customer with ID', data.customer_id + '...');
    const subscription = await stripe.subscriptions.create({
        customer: data.customer_id,
        items: [
          {price: process.env.REACT_APP_PRICE_ID},
        ],
        expand: ['latest_invoice.payment_intent'],
    });
    var json = {
        info:subscription
    }
    console.log('Successfully created subscription for customer with ID', data.customer_id + ':', subscription);
    res.send(json);
});
router.post('/getPaymentIntent', async (req, res) => {
    const data = req.body
    console.log('Retrieving payment intent for subscription with ID', data.subscription_id + '...');
    const subscription = await stripe.subscriptions.retrieve(
        data.subscription_id
      );
    const invoice = await stripe.invoices.retrieve(
        subscription.latest_invoice,
        
    );

    if(invoice.payment_intent != null){
        const paymentIntent = await stripe.paymentIntents.retrieve(
            invoice.payment_intent
        );
        var json = {
            info: paymentIntent
        }
        console.log('Successfully retrieved payment intent for subscription with ID', data.subscription_id + ':', paymentIntent);
        res.send(json);
    }
});

router.post('/cancelSubscription', async (req, res) => {
    const data = req.body
    db.query(`DELETE FROM tblSubscription WHERE CONVERT(VARCHAR, CustomerId)= '${data.customer_id}';`)
    .then(result => {
        console.log('Successfully deleted subscription from table for customer with ID', data.customer_id);
    }).catch(err => console.log('Failed to cancel subscription for customer with ID', data.customer_id, 'with error:', err))
    const deleted = await stripe.subscriptions.del(
        data.subscription_id
        );
    const customer = await stripe.customers.del(
        data.customer_id
        );
    console.log('Successfully deleted subscription with ID', data.subscription_id, 'for customer with ID', data.customer_id);
    res.status(200).send(deleted);
});

router.post('/updateSubscriptionInfo', async (req, res) => {
    const data = req.body;
    db.query(`INSERT INTO tblSubscription (CustomerId, SubscriptionId, PriceId, Email, CompanyId)
    VALUES ('${data.customer_id}', '${data.subscription_id}', '${process.env.REACT_APP_PRICE_ID}', '${data.Email}', ${data.CompanyId});`)
    .then(data => {
        console.log('Successfully updated subscription information in table with data:', data)
        res.status(200).send(data);
    }).catch(err => console.log('Failed to update subscription information in table with data:', data, 'with error:', err))
});

router.post('/updateFreeTrialInfo', async (req, res) => {
    const data = req.body;
    db.query(`INSERT INTO tblFreeTrial (CustomerId, SubscriptionId, Email, CompanyId)
    VALUES ('${data.customer_id}', '${data.subscription_id}', '${data.Email}', ${data.CompanyId});`)
    .then(data => {
        console.log('Successfully updated free trial information with data:', data);
        res.status(200).send(data);
    }).catch(err => console.log('Failed to update free trial information in table with data:', data, 'with error:', err))
});

router.get('/getSubscriptionInfo', async (req, res) => {
    db.query(`SELECT * FROM tblSubscription WHERE CompanyId = ${req.query.CompanyId};`)
    .then(data =>  {
        console.log('Successfully retrieved subscription information from table for company with ID', req.query.CompanyId + ':', data);
        if(data[1] != 0){
            retriveSubscription(data[0][0].SubscriptionId, data[0][0].CustomerId,res);
        } else {res.send(null)}
    }).catch(err => console.log('Failed to retrieve subscription information for company with ID', req.query.CompanyId, 'with error:', err))
});

router.get('/getFreeTrialInfo', async (req, res) => {
    db.query(`SELECT * FROM tblFreeTrial WHERE CompanyId = ${req.query.CompanyId};`)
    .then(data =>  {
        console.log("Successfully retrieved free trial information from table for company with ID", req.query.CompanyId + ':', data)
        if(data[1] != 0){
            res.send(data);
        }
        else{res.send(null)}; 
    }).catch(err => console.log('Failed to retrieve free trial information from table for company with ID', req.query.CompanyId, 'with error:', err))
});

router.get('/getCardInfo', async (req, res) => {
    const customer = await stripe.customers.retrieve(
        req.query.customerId
    );
    const paymentMethod = await stripe.paymentMethods.retrieve(
        customer.invoice_settings.default_payment_method
    );
    var json = {
        info: paymentMethod
    }
    console.log('Successfully retrieved card with ID', paymentMethod.id)
    res.send(json);
});

router.get('/getProductInfo', async (req, res) => {
    const subscription = await stripe.subscriptions.retrieve(
        req.query.subscription_id
      );
    const product = await stripe.products.retrieve(
        subscription.plan.product
    );
    const price = await stripe.prices.retrieve(
        subscription.plan.id
    );
    var json = {
        productInfo: product,
        priceInfo: price
    }
    console.log('Successfully retrieved product with ID', product.id, 'and price with ID', price.id);
    res.send(json);
});

router.get('/checkUserSubscribed', async (req, res) => {
    console.log('Called /subscription/checkUserSubscribed. Checking if company with ID', req.query.CompanyId, 'is subscribed or on free trial...')
    db.query(`SELECT * FROM tblSubscription WHERE CompanyId = ${req.query.CompanyId};`)
    .then(data =>  {
        console.log('Successfully retrieved subscription data from table for company with ID', req.query.CompanyId);
        if(data[1] == 0){
            console.log('No subscription found for company with ID', req.query.CompanyId + '.', 'Checking for free trial...')
            db.query(`SELECT * FROM tblFreeTrial WHERE CompanyId = ${req.query.CompanyId};`)
                .then(data =>  {
                    console.log('Successfully retrieved free trial data from table for company with ID', req.query.CompanyId)
                    if(data[1] == 0){
                        console.log('No free trial found for company with ID', req.query.CompanyId);
                        res.send("user not found");
                    }
                    else{
                        var info = data[0][0];
                        console.log('Free trial found for company with ID', req.query.CompanyId + ':', info);
                        retriveSubscription(info.SubscriptionId, info.CustomerId, res);
                    } 
                }).catch(err => console.log('Failed to retrieve free trial data from table for company with ID', req.query.CompanyId, 'with error:', err))
        }
        else{
            var info = data[0][0];
            console.log('Subscription found for company with ID', req.query.CompanyId + ':', info)
            retriveSubscription(info.SubscriptionId, info.CustomerId, res);
        } 
    }).catch(err => console.log('Failed to retrieve subscription data from table for company with ID', req.query.CompanyId, 'with error:', err))
});

async function retriveSubscription(subscriptionId, customerId, res){
    const subscription = await stripe.subscriptions.retrieve(
        subscriptionId
    );
    var json = {
        info: subscription,
        customerId: customerId
    }
    console.log('Successfully retrieved subscription with ID', subscriptionId, 'from Stripe for customer with ID', customerId);
    res.status(200).send(json);
}



module.exports = router;