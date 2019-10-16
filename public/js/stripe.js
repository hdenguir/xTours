/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async tourId => {
  try {
    const stripe = Stripe(
      'pk_test_LufmhvPFMvNt6LTFyvoBOz2r00sg64QpZL',
    );
    // 1) Get checkout session from API
    const session = await axios(
      `/api/v1/bookings/checkout-session/${tourId}`,
    );

    // 2) Create checkout form + chanre credit card

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert('error', err);
  }
};
