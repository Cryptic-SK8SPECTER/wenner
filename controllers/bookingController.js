const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Obtenha o tour atualmente reservado
  const tour = await Tour.findById(req.params.tourId);
  // console.log(tour);

  // 2) Crie a sessão de checkout
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/my-tours/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price_data: {
          currency: 'usd', // Teste com 'usd' para validar se o erro está relacionado à moeda.
          product_data: {
            name: `${tour.name} Ponto Turístico`,
            description: tour.summary || 'Descrição não disponível.',
            images: tour.imageCover
              ? [`https://www.natours.dev/img/tours/${tour.imageCover}`]
              : []
          },
          unit_amount: tour.price ? tour.price * 100 : 5000 // Teste com valor fixo
        },
        quantity: 1
      }
    ]
  });

  // 3) Retorne a sessão como resposta
  res.status(200).json({
    status: 'success',
    session
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // This is only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) return next();
  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
});

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
