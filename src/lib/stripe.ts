import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '')

export async function redirectToCheckout(url: string) {
  window.location.href = url
}

export async function redirectToPortal(portalUrl: string) {
  window.location.href = portalUrl
}

export { stripePromise }
