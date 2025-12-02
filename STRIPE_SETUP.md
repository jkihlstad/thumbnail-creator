# Stripe Setup Guide

This guide will help you set up Stripe for your thumbnail generator app with three subscription tiers.

## Prerequisites

- A Stripe account ([Sign up here](https://dashboard.stripe.com/register))
- Access to Stripe Dashboard
- Stripe CLI installed (optional, for testing webhooks locally)

## Step 1: Create Products and Prices

### 1.1 Navigate to Products

1. Log in to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Go to **Products** → **+ Add Product**

### 1.2 Create Standard Tier

1. **Product Name**: Standard Plan
2. **Description**: 100 image generations and downloads per month
3. **Pricing**:
   - Click **+ Add another price**
   - **Monthly Price**: $9.99 USD, Recurring, Monthly
   - Click **Save price**
   - Click **+ Add another price** again
   - **Yearly Price**: $95.90 USD (20% discount), Recurring, Yearly
   - Click **Save price**
4. Click **Save product**
5. **Copy the Price IDs**:
   - Copy the monthly price ID (starts with `price_...`)
   - Save as `STRIPE_STANDARD_MONTHLY_PRICE_ID`
   - Copy the yearly price ID
   - Save as `STRIPE_STANDARD_YEARLY_PRICE_ID`

### 1.3 Create Pro Tier

1. Click **+ Add Product**
2. **Product Name**: Pro Plan
3. **Description**: 300 image generations and downloads per month
4. **Pricing**:
   - **Monthly Price**: $19.99 USD, Recurring, Monthly
   - **Yearly Price**: $191.90 USD (20% discount), Recurring, Yearly
5. **Copy the Price IDs**:
   - Save monthly as `STRIPE_PRO_MONTHLY_PRICE_ID`
   - Save yearly as `STRIPE_PRO_YEARLY_PRICE_ID`

## Step 2: Get API Keys

### 2.1 Get Secret Key

1. Go to **Developers** → **API keys**
2. Find your **Secret key** (starts with `sk_test_...` for test mode)
3. Click **Reveal test key**
4. Copy and save as `STRIPE_SECRET_KEY`

### 2.2 Get Publishable Key

1. On the same page, find your **Publishable key** (starts with `pk_test_...`)
2. Copy and save as `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

## Step 3: Configure Environment Variables

Add these to your `.env.local` file:

```env
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# Stripe Price IDs
STRIPE_STANDARD_MONTHLY_PRICE_ID=price_xxx
STRIPE_STANDARD_YEARLY_PRICE_ID=price_xxx
STRIPE_PRO_MONTHLY_PRICE_ID=price_xxx
STRIPE_PRO_YEARLY_PRICE_ID=price_xxx
```

## Step 4: Enable Customer Portal

The customer portal allows users to manage their subscriptions.

1. Go to **Settings** → **Billing** → **Customer portal**
2. Click **Activate** or **Customize portal**
3. Configure portal settings:
   - ✅ Allow customers to update subscriptions
   - ✅ Allow customers to cancel subscriptions
   - ✅ Invoice history
   - ✅ Update payment methods
4. Click **Save**

## Step 5: Set Up Webhooks (Optional for Local Development)

Webhooks notify your app when events happen in Stripe (e.g., subscription created, payment failed).

### For Local Development

1. Install Stripe CLI:
```bash
brew install stripe/stripe-cli/stripe
# or
npm install -g stripe
```

2. Login to Stripe:
```bash
stripe login
```

3. Forward webhooks to local server:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

4. Copy the webhook signing secret (starts with `whsec_...`)
5. Add to `.env.local`:
```env
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### For Production

1. Go to **Developers** → **Webhooks** → **+ Add endpoint**
2. **Endpoint URL**: `https://your-domain.com/api/webhooks/stripe`
3. **Events to send**:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Click **Add endpoint**
5. Copy the **Signing secret**
6. Add to Vercel environment variables:
```env
STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret
```

## Step 6: Test the Integration

### Test Card Numbers

Use these test card numbers in test mode:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

**CVV**: Any 3 digits
**Expiry**: Any future date
**Postal Code**: Any 5 digits

### Test Flow

1. Go to `/pricing` in your app
2. Click **Subscribe Now** on Standard or Pro plan
3. Fill in test card details
4. Complete checkout
5. Verify redirect to `/settings?success=true`
6. Check Stripe Dashboard → **Payments** to see the test payment
7. Check Stripe Dashboard → **Customers** to see the new customer

## Step 7: Switch to Live Mode

Once you're ready to accept real payments:

1. **Get Live API Keys**:
   - Go to **Developers** → **API keys**
   - Toggle from **Test mode** to **Live mode** (top right)
   - Copy your live `sk_live_...` and `pk_live_...` keys

2. **Create Live Products**:
   - Repeat Step 1 in Live mode
   - Copy the live price IDs

3. **Update Production Environment Variables**:
   - Update Vercel environment variables with live keys
   - Use live price IDs

4. **Set Up Live Webhooks**:
   - Create webhook endpoint in Live mode
   - Update `STRIPE_WEBHOOK_SECRET` with live secret

## Pricing Tier Summary

| Tier | Monthly | Yearly | Generations | Downloads |
|------|---------|--------|-------------|-----------|
| Free | $0 | $0 | 3 | 3 |
| Standard | $9.99 | $95.90/yr ($7.99/mo) | 100 | 100 |
| Pro | $19.99 | $191.90/yr ($15.99/mo) | 300 | 300 |

## Important Security Notes

- **Never commit** `.env.local` to git (already in .gitignore)
- **Never expose** your secret key (`sk_...`) in client-side code
- **Always validate** webhook signatures
- **Use HTTPS** in production
- **Rotate keys** regularly

## Troubleshooting

### "No such price" Error

- Verify price IDs are correct in `.env.local`
- Make sure you're using test price IDs in test mode
- Check that prices are active in Stripe Dashboard

### Checkout Session Not Working

- Verify `STRIPE_SECRET_KEY` is set correctly
- Check `NEXT_PUBLIC_SITE_URL` is set (defaults to localhost:3000)
- Review server logs for detailed error messages

### Customer Portal Not Loading

- Ensure customer portal is activated in Stripe Dashboard
- Verify customer ID exists in your database
- Check that the return URL is correct

### Webhooks Not Firing

- For local development, make sure Stripe CLI is running
- For production, verify webhook endpoint URL is correct
- Check webhook signature matches your secret

## Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe Customer Portal](https://stripe.com/docs/billing/subscriptions/customer-portal)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe Testing](https://stripe.com/docs/testing)

## Support

Need help? Contact:
- [Stripe Support](https://support.stripe.com/)
- Check the [Stripe Community](https://community.stripe.com/)
