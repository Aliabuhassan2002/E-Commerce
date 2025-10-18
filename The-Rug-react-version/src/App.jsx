// import Navbar from "./components/Navbar/Navbar";
// import About from "./components/AboutUs/About";
// import Contact from "./components/Contact/Contact";
// import Accessories from "./components/Accessories/Accessories";
// import Shop from "./components/Shop/Shop";
// import Home from "./components/Home/Home";
// import Footer from "./components/Footer/Footer";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Dashboard from "./components/Dashboard/Dashboard";
// import Register from "./components/Register/Register";
// import ProductDeatails from "./components/ProductDetails/ProductDetails";
// import Cart from "./components/Cart/Cart";
// import Checkout from "./components/Checkout/Checkout";

// import BecomeProvider from "./components/BecomeProvider/BecomeProvider";
// import Login from "./components/Login/Login";
// import ProviderProfile from "./components/ProviderProfile/Profile";
// import Users from "./components/Dashboard/Users";
// import Products from "./components/Dashboard/Products";
// import Feedback from "./components/Dashboard/Feedback";
// import OrderConfirmation from "./components/Checkout/OrderConfirmation";
// import Analytics from "./components/Dashboard/Analytics";
// import Profile from "./components/UserProfile/Profile";
// import Orders from "./components/Dashboard/Orders";

// function App() {
//   return (
//     <>
//       <Router>
//         <Navbar />
//         <Routes>
//           <Route path="/dashboard/*" element={<Dashboard />}>
//             <Route path="users" element={<Users />} />
//             <Route path="products" element={<Products />} />
//             <Route path="feedback" element={<Feedback />} />
//             <Route path="analytics" element={<Analytics />} />
//             <Route path="orders" element={<Orders />} />
//           </Route>
//           <Route path="/" index element={<Home />}></Route>
//           <Route path="/about" element={<About />}></Route>
//           <Route path="/contact" element={<Contact />}></Route>
//           <Route path="/shop" element={<Shop />}></Route>
//           <Route path="/accessories" element={<Accessories />}></Route>
//           <Route path="/user-profile" element={<Profile />}></Route>

//           <Route path="/register" element={<Register />}></Route>
//           <Route path="/login" element={<Login />}></Route>
//           <Route
//             path="/details/:productId"
//             element={<ProductDeatails />}
//           ></Route>
//           <Route
//             path="/order-confirmation/:orderId"
//             element={<OrderConfirmation />}
//           />
//           <Route path="/cart" element={<Cart />}></Route>
//           <Route path="/provider-profile" element={<ProviderProfile />} />

//           <Route path="/checkout" element={<Checkout />}></Route>
//           <Route path="/become-provider" element={<BecomeProvider />} />
//         </Routes>
//         <Footer />
//       </Router>
//     </>
//   );
// }

// export default App;
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import About from "./components/AboutUs/About";
import Contact from "./components/Contact/Contact";
import Accessories from "./components/Accessories/Accessories";
import Shop from "./components/Shop/Shop";
import Home from "./components/Home/Home";
import Footer from "./components/Footer/Footer";
import Dashboard from "./components/Dashboard/Dashboard";
import Register from "./components/Register/Register";
import ProductDetails from "./components/ProductDetails/ProductDetails";
import Cart from "./components/Cart/Cart";
import Checkout from "./components/Checkout/Checkout";
import BecomeProvider from "./components/BecomeProvider/BecomeProvider";
import Login from "./components/Login/Login";
import ProviderProfile from "./components/ProviderProfile/Profile";
import Users from "./components/Dashboard/Users";
import Products from "./components/Dashboard/Products";
import Feedback from "./components/Dashboard/Feedback";
import OrderConfirmation from "./components/Checkout/OrderConfirmation";
import Analytics from "./components/Dashboard/Analytics";
import Profile from "./components/UserProfile/Profile";
import Orders from "./components/Dashboard/Orders";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  // Define paths where Navbar and Footer should NOT be displayed
  const hideNavAndFooterPaths = ["/register", "/login"];

  const shouldHideNavAndFooter = hideNavAndFooterPaths.includes(
    location.pathname
  );

  return (
    <>
      {!shouldHideNavAndFooter && <Navbar />}
      <Routes>
        <Route path="/dashboard/*" element={<Dashboard />}>
          <Route path="users" element={<Users />} />
          <Route path="products" element={<Products />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="orders" element={<Orders />} />
        </Route>
        <Route path="/" index element={<Home />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/contact" element={<Contact />}></Route>
        <Route path="/shop" element={<Shop />}></Route>
        <Route path="/accessories" element={<Accessories />}></Route>
        <Route path="/user-profile" element={<Profile />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/details/:productId" element={<ProductDetails />}></Route>
        <Route
          path="/order-confirmation/:orderId"
          element={<OrderConfirmation />}
        />
        <Route path="/cart" element={<Cart />}></Route>
        <Route path="/provider-profile" element={<ProviderProfile />} />
        <Route path="/checkout" element={<Checkout />}></Route>
        <Route path="/become-provider" element={<BecomeProvider />} />
      </Routes>
      {!shouldHideNavAndFooter && <Footer />}
    </>
  );
}

export default App;
