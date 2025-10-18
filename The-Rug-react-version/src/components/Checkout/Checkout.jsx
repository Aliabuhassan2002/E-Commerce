// import React from 'react'

// export default function Checkout() {
//   return (
//     <div class="font-[sans-serif] bg-white m-40">
//       <div class="max-lg:max-w-xl mx-auto w-full">
//         <div class="grid lg:grid-cols-3 gap-6">
//           <div class="lg:col-span-2 max-lg:order-1 p-6 !pr-0 max-w-4xl mx-auto w-full">
//             <div class="text-center max-lg:hidden">
//               <h2 class="text-3xl font-bold text-gray-800 inline-block border-b-2 border-gray-800 pb-1">Checkout</h2>
//             </div>

//             <form class="lg:mt-16">
//               <div>
//                 <h2 class="text-xl font-bold text-gray-800">Shipping info</h2>

//                 <div class="grid sm:grid-cols-2 gap-8 mt-8">
//                   <div>
//                     <input type="text" placeholder="Name"
//                       class="px-2 pb-2 bg-white text-gray-800 w-full text-sm border-b focus:border-blue-600 outline-none" />
//                   </div>
//                   <div>
//                     <input type="email" placeholder="Email address"
//                       class="px-2 pb-2 bg-white text-gray-800 w-full text-sm border-b focus:border-blue-600 outline-none" />
//                   </div>
//                   <div>
//                     <input type="text" placeholder="Street address"
//                       class="px-2 pb-2 bg-white text-gray-800 w-full text-sm border-b focus:border-blue-600 outline-none" />
//                   </div>
//                   <div>
//                     <input type="text" placeholder="City"
//                       class="px-2 pb-2 bg-white text-gray-800 w-full text-sm border-b focus:border-blue-600 outline-none" />
//                   </div>
//                   <div>
//                     <input type="text" placeholder="State"
//                       class="px-2 pb-2 bg-white text-gray-800 w-full text-sm border-b focus:border-blue-600 outline-none" />
//                   </div>
//                   <div>
//                     <input type="number" placeholder="Postal code"
//                       class="px-2 pb-2 bg-white text-gray-800 w-full text-sm border-b focus:border-blue-600 outline-none" />
//                   </div>
//                 </div>
//               </div>

//               <div class="mt-16">
//                 <h2 class="text-xl font-bold text-gray-800">Payment method</h2>

//                 <div class="grid gap-4 sm:grid-cols-2 mt-4">
//                   <div class="flex items-center">
//                     <input type="radio" class="w-5 h-5 cursor-pointer" id="card" checked />
//                     <label for="card" class="ml-4 flex gap-2 cursor-pointer">
//                       <img src="https://readymadeui.com/images/visa.webp" class="w-12" alt="card1" />
//                       <img src="https://readymadeui.com/images/american-express.webp" class="w-12" alt="card2" />
//                       <img src="https://readymadeui.com/images/master.webp" class="w-12" alt="card3" />
//                     </label>
//                   </div>

//                   <div class="flex items-center">
//                     <input type="radio" class="w-5 h-5 cursor-pointer" id="paypal" />
//                     <label for="paypal" class="ml-4 flex gap-2 cursor-pointer">
//                       <img src="https://readymadeui.com/images/paypal.webp" class="w-20" alt="paypalCard" />
//                     </label>
//                   </div>
//                 </div>

//                 <div class="grid gap-8 mt-8">
//                   <div>
//                     <input type="text" placeholder="Cardholder's Name"
//                       class="px-2 pb-2 bg-white text-gray-800 w-full text-sm border-b focus:border-blue-600 outline-none" />
//                   </div>

//                   <div class="flex bg-white border-b focus-within:border-blue-600 overflow-hidden">
//                     <svg xmlns="http://www.w3.org/2000/svg" class="w-12 ml-3" viewBox="0 0 291.764 291.764">
//                       <path fill="#2394bc" d="m119.259 100.23-14.643 91.122h23.405l14.634-91.122h-23.396zm70.598 37.118c-8.179-4.039-13.193-6.765-13.193-10.896.1-3.756 4.24-7.604 13.485-7.604 7.604-.191 13.193 1.596 17.433 3.374l2.124.948 3.182-19.065c-4.623-1.787-11.953-3.756-21.007-3.756-23.113 0-39.388 12.017-39.489 29.204-.191 12.683 11.652 19.721 20.515 23.943 9.054 4.331 12.136 7.139 12.136 10.987-.1 5.908-7.321 8.634-14.059 8.634-9.336 0-14.351-1.404-21.964-4.696l-3.082-1.404-3.273 19.813c5.498 2.444 15.609 4.595 26.104 4.705 24.563 0 40.546-11.835 40.747-30.152.08-10.048-6.165-17.744-19.659-24.035zm83.034-36.836h-18.108c-5.58 0-9.82 1.605-12.236 7.331l-34.766 83.509h24.563l6.765-18.08h27.481l3.51 18.153h21.664l-18.873-90.913zm-26.97 54.514c.474.046 9.428-29.514 9.428-29.514l7.13 29.514h-16.558zM85.059 100.23l-22.931 61.909-2.498-12.209c-4.24-14.087-17.533-29.395-32.368-36.999l20.998 78.33h24.764l36.799-91.021H85.059v-.01z" data-original="#2394bc" />
//                       <path fill="#efc75e" d="M51.916 111.982c-1.787-6.948-7.486-11.634-15.226-11.734H.374L0 101.934c28.329 6.984 52.107 28.474 59.821 48.688l-7.905-38.64z" data-original="#efc75e" />
//                     </svg>
//                     <input type="number" placeholder="Card Number"
//                       class="px-2 pb-2 bg-white text-gray-800 w-full text-sm outline-none" />
//                   </div>

//                   <div class="grid grid-cols-2 gap-6">
//                     <div>
//                       <input type="number" placeholder="EXP."
//                         class="px-2 pb-2 bg-white text-gray-800 w-full text-sm border-b focus:border-blue-600 outline-none" />
//                     </div>
//                     <div>
//                       <input type="number" placeholder="CVV"
//                         class="px-2 pb-2 bg-white text-gray-800 w-full text-sm border-b focus:border-blue-600 outline-none" />
//                     </div>
//                   </div>

//                   <div class="flex items-center">
//                     <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
//                     <label for="remember-me" class="ml-3 block text-sm">
//                       I accept the <a href="javascript:void(0);" class="text-blue-600 font-semibold hover:underline ml-1">Terms and Conditions</a>
//                     </label>
//                   </div>
//                 </div>
//               </div>

//               <div class="flex flex-wrap gap-4 mt-8">
//                 <button type="button" class="min-w-[150px] px-6 py-3.5 text-sm bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Back</button>
//                 <button type="button" class="min-w-[150px] px-6 py-3.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Confirm payment $240</button>
//               </div>
//             </form>
//           </div>

//           <div class="bg-gray-100 lg:h-screen lg:sticky lg:top-0 lg:max-w-[430px] w-full lg:ml-auto">
//             <div class="relative h-full">
//               <div class="p-6 overflow-auto max-lg:max-h-[450px] lg:h-[calc(100vh-50px)]">
//                 <h2 class="text-xl font-bold text-gray-800">Order Summary</h2>

//                 <div class="space-y-6 mt-8">
//                   <div class="flex gap-4">
//                     <div class="w-[124px] h-[100px] flex items-center justify-center p-4 shrink-0 bg-gray-200 rounded-lg">
//                       <img src='https://readymadeui.com/images/product10.webp' class="w-full object-contain" />
//                     </div>

//                     <div class="w-full">
//                       <h3 class="text-sm text-gray-800 font-bold">Naruto: Split Sneakers</h3>
//                       <ul class="text-xs text-gray-800 space-y-1 mt-2">
//                         <li class="flex flex-wrap gap-4">Size <span class="ml-auto">37</span></li>
//                         <li class="flex flex-wrap gap-4">Quantity <span class="ml-auto">2</span></li>
//                         <li class="flex flex-wrap gap-4">Total Price <span class="ml-auto">$40</span></li>
//                       </ul>
//                     </div>
//                   </div>

//                   <div class="flex gap-4">
//                     <div class="w-[124px] h-[100px] flex items-center justify-center p-4 shrink-0 bg-gray-200 rounded-lg">
//                       <img src='https://readymadeui.com/images/product11.webp' class="w-full object-contain" />
//                     </div>

//                     <div class="w-full">
//                       <h3 class="text-sm text-gray-800 font-bold">VelvetGlide Boots</h3>
//                       <ul class="text-xs text-gray-800 space-y-1 mt-2">
//                         <li>Size <span class="float-right">37</span></li>
//                         <li>Quantity <span class="float-right">2</span></li>
//                         <li>Total Price <span class="float-right">$40</span></li>
//                       </ul>
//                     </div>
//                   </div>

//                   <div class="flex gap-4">
//                     <div class="w-[124px] h-[100px] flex items-center justify-center p-4 shrink-0 bg-gray-200 rounded-lg">
//                       <img src='https://readymadeui.com/images/product14.webp' class="w-full object-contain" />
//                     </div>

//                     <div class="w-full">
//                       <h3 class="text-sm text-gray-800 font-bold">Echo Elegance</h3>
//                       <ul class="text-xs text-gray-800 space-y-1 mt-2">
//                         <li>Size <span class="float-right">37</span></li>
//                         <li>Quantity <span class="float-right">2</span></li>
//                         <li>Total Price <span class="float-right">$40</span></li>
//                       </ul>
//                     </div>
//                   </div>

//                   <div class="flex gap-4">
//                     <div class="w-[124px] h-[100px] flex items-center justify-center p-4 shrink-0 bg-gray-200 rounded-lg">
//                       <img src='https://readymadeui.com/images/product12.webp' class="w-full object-contain" />
//                     </div>

//                     <div class="w-full">
//                       <h3 class="text-sm text-gray-800 font-bold">Naruto: Split Sneakers</h3>
//                       <ul class="text-xs text-gray-800 space-y-1 mt-2">
//                         <li class="flex flex-wrap gap-4">Size <span class="ml-auto">37</span></li>
//                         <li class="flex flex-wrap gap-4">Quantity <span class="ml-auto">2</span></li>
//                         <li class="flex flex-wrap gap-4">Total Price <span class="ml-auto">$40</span></li>
//                       </ul>
//                     </div>
//                   </div>

//                   <div class="flex gap-4">
//                     <div class="w-[124px] h-[100px] flex items-center justify-center p-4 shrink-0 bg-gray-200 rounded-lg">
//                       <img src='https://readymadeui.com/images/product9.webp' class="w-full object-contain" />
//                     </div>

//                     <div class="w-full">
//                       <h3 class="text-sm text-gray-800 font-bold">VelvetGlide Boots</h3>
//                       <ul class="text-xs text-gray-800 space-y-1 mt-2">
//                         <li>Size <span class="float-right">37</span></li>
//                         <li>Quantity <span class="float-right">2</span></li>
//                         <li>Total Price <span class="float-right">$40</span></li>
//                       </ul>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div class="lg:absolute lg:left-0 lg:bottom-0 bg-gray-200 w-full p-4">
//                 <h4 class="flex flex-wrap gap-4 text-sm text-gray-800 font-bold">Total <span class="ml-auto">$240.00</span></h4>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Elements,
//   CardElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
// import axios from "axios";

// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK);

// const CheckoutForm = ({ cart, total, onSuccess }) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [loading, setLoading] = useState(false);
//   const [shippingInfo, setShippingInfo] = useState({
//     name: "",
//     email: "",
//     street: "",
//     city: "",
//     state: "",
//     postalCode: "",
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // Create order
//       const orderResponse = await axios.post(
//         "/api/orders",
//         {
//           shippingAddress: shippingInfo,
//           paymentMethod: "stripe",
//         },
//         { withCredentials: true }
//       );

//       // Handle Stripe payment
//       const { error } = await stripe.confirmCardPayment(
//         orderResponse.data.paymentIntent.clientSecret,
//         {
//           payment_method: {
//             card: elements.getElement(CardElement),
//             billing_details: {
//               name: shippingInfo.name,
//               email: shippingInfo.email,
//               address: {
//                 line1: shippingInfo.street,
//                 city: shippingInfo.city,
//                 state: shippingInfo.state,
//                 postal_code: shippingInfo.postalCode,
//               },
//             },
//           },
//         }
//       );

//       if (error) throw error;

//       onSuccess(orderResponse.data);
//     } catch (error) {
//       console.error("Payment error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       {/* Shipping Address Fields */}
//       <div className="grid grid-cols-2 gap-4 mb-8">
//         <input
//           placeholder="Full Name"
//           value={shippingInfo.name}
//           onChange={(e) =>
//             setShippingInfo({ ...shippingInfo, name: e.target.value })
//           }
//           required
//         />
//         {/* Add other address fields similarly */}
//       </div>

//       {/* Payment Section */}
//       <div className="mb-8">
//         <h3 className="text-xl font-bold mb-4">Payment Method</h3>
//         <div className="border rounded-lg p-4">
//           <CardElement options={{ hidePostalCode: true }} />
//         </div>
//       </div>

//       <button
//         type="submit"
//         disabled={loading}
//         className="bg-[#d4a373] text-white p-4 rounded-lg w-full"
//       >
//         {loading ? "Processing..." : `Pay ${total} JOD`}
//       </button>
//     </form>
//   );
// };

// const Checkout = () => {
//   const [cart, setCart] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchCart = async () => {
//       try {
//         const { data } = await axios.get("/api/cart", {
//           withCredentials: true,
//         });
//         setCart(data.items);
//       } catch (error) {
//         console.error("Error fetching cart:", error);
//       }
//     };
//     fetchCart();
//   }, []);

//   const handleOrderSuccess = (order) => {
//     navigate(`/order-confirmation/${order._id}`);
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-8">Checkout</h1>
//       <Elements stripe={stripePromise}>
//         <CheckoutForm
//           cart={cart}
//           total={(cart.total * 1.07).toFixed(2)}
//           onSuccess={handleOrderSuccess}
//         />
//       </Elements>
//     </div>
//   );
// };

// export default Checkout;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Use import.meta.env instead of process.env
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ cartItems, total, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    email: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    phone: "",
  });
  const [user, setUser] = useState(null);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError(null);

  //   try {
  //     const orderData = {
  //       products: cartItems.map((item) => ({
  //         product: item.product._id,
  //         quantity: item.quantity,
  //         price: item.product.price,
  //         color: item.color,
  //         size: item.size,
  //       })),
  //       shippingAddress: shippingInfo,
  //       paymentMethod,
  //       totalAmount: total * 1.07, // Including 7% tax
  //     };

  //     if (paymentMethod === "card") {
  //       if (!stripe || !elements) {
  //         throw new Error("Stripe.js has not loaded yet.");
  //       }

  //       // Create payment intent
  //       const { data } = await axios.post(
  //         "http://localhost:5000/api/orders/create-payment-intent",
  //         { amount: total * 1.07 },
  //         { withCredentials: true }
  //       );

  //       const { error: stripeError, paymentIntent } =
  //         await stripe.confirmCardPayment(data.clientSecret, {
  //           payment_method: {
  //             card: elements.getElement(CardElement),
  //             billing_details: {
  //               name: shippingInfo.name,
  //               email: shippingInfo.email,
  //               address: {
  //                 line1: shippingInfo.street,
  //                 city: shippingInfo.city,
  //                 state: shippingInfo.state,
  //                 postal_code: shippingInfo.postalCode,
  //               },
  //             },
  //           },
  //         });

  //       if (stripeError) throw stripeError;
  //       orderData.transactionId = paymentIntent.id;
  //     }

  //     // Create order
  //     const { data: order } = await axios.post(
  //       "http://localhost:5000/api/orders",
  //       orderData,
  //       {
  //         withCredentials: true,
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     onSuccess(order);
  //   } catch (err) {
  //     console.error("Checkout error:", err);
  //     setError(err.message || "Checkout failed. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  useEffect(() => {
    // Fetch user details
    axios
      .get("http://localhost:5000/api/users/user", { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch((err) => console.error(err));
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const orderData = {
        products: cartItems.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
          color: item.color,
          size: item.size,
        })),
        shippingAddress: shippingInfo,
        paymentMethod,
        totalAmount: total * 1.07,
      };

      if (paymentMethod === "credit_card") {
        // 1. Verify Stripe is loaded
        if (!window.Stripe || !stripe || !elements) {
          throw new Error("Payment system is still loading. Please wait.");
        }

        // 2. Create payment intent
        const { data } = await axios.post(
          "http://localhost:5000/api/orders/create-payment-intent",
          { amount: Math.round(total * 1.07 * 100) }, // Amount in cents
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!data.clientSecret) {
          throw new Error("Failed to initialize payment");
        }

        // 3. Confirm payment
        const { error: stripeError, paymentIntent } =
          await stripe.confirmCardPayment(data.clientSecret, {
            payment_method: {
              card: elements.getElement(CardElement),
              billing_details: {
                name: shippingInfo.name,
                email: shippingInfo.email,
                address: {
                  line1: shippingInfo.street,
                  city: shippingInfo.city,
                  state: shippingInfo.state,
                  postal_code: shippingInfo.postalCode,
                },
              },
            },
          });

        if (stripeError) {
          console.error("Stripe payment error:", stripeError);
          throw new Error(stripeError.message || "Payment failed");
        }

        if (!paymentIntent || paymentIntent.status !== "succeeded") {
          throw new Error("Payment verification failed");
        }

        orderData.transactionId = paymentIntent.id;
        orderData.paymentStatus = "paid";
      }

      // 4. Create order
      const { data: order } = await axios.post(
        "http://localhost:5000/api/orders",
        orderData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      onSuccess(order);
    } catch (err) {
      console.error("Full checkout error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Checkout failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {console.log(user)}
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Shipping Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={shippingInfo.name}
              onChange={handleInputChange}
              required
              className="p-2 border rounded w-full"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={shippingInfo.email}
              onChange={handleInputChange}
              required
              className="p-2 border rounded w-full"
            />
            <input
              type="text"
              name="street"
              placeholder="Street Address"
              value={shippingInfo.street}
              onChange={handleInputChange}
              required
              className="p-2 border rounded w-full"
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={shippingInfo.city}
              onChange={handleInputChange}
              required
              className="p-2 border rounded w-full"
            />
            <input
              type="text"
              name="state"
              placeholder="State/Province"
              value={shippingInfo.state}
              onChange={handleInputChange}
              required
              className="p-2 border rounded w-full"
            />
            <input
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              value={shippingInfo.postalCode}
              onChange={handleInputChange}
              required
              className="p-2 border rounded w-full"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={shippingInfo.phone}
              onChange={handleInputChange}
              required
              className="p-2 border rounded w-full"
            />
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
                className="h-5 w-5"
              />
              <span>Cash on Delivery</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="paymentMethod"
                value="credit_card"
                checked={paymentMethod === "credit_card"}
                onChange={() => setPaymentMethod("credit_card")}
                className="h-5 w-5"
              />
              <span>Credit/Debit Card</span>
            </label>

            {paymentMethod === "credit_card" && (
              <div className="mt-4 p-4 border rounded">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#424770",
                        "::placeholder": {
                          color: "#aab7c4",
                        },
                      },
                      invalid: {
                        color: "#9e2146",
                      },
                    },
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{total.toFixed(2)} JD</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (7%):</span>
              <span>{(total * 0.07).toFixed(2)} JD</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total:</span>
              <span>{(total * 1.07).toFixed(2)} JD</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="text-red-600 p-4 bg-red-50 rounded-lg">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#d4a373] text-white py-3 rounded-lg font-bold hover:bg-[#ab815c] transition disabled:opacity-50"
        >
          {loading ? "Processing..." : "Place Order"}
        </button>
      </form>
    </div>
  );
};

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/cart", {
        withCredentials: true,
      });
      setCartItems(data.items);
      setTotal(data.total);
    } catch (error) {
      console.error("Error fetching cart:", error);
      navigate("/cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleOrderSuccess = (order) => {
    navigate(`/order-confirmation/${order._id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate("/shop")}
            className="px-4 py-2 bg-[#d4a373] text-white rounded"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-25">
      <Elements stripe={stripePromise}>
        <CheckoutForm
          cartItems={cartItems}
          total={total}
          onSuccess={handleOrderSuccess}
        />
      </Elements>
    </div>
  );
};

export default Checkout;
