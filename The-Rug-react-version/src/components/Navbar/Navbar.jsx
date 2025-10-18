// Navbar.js (updated)
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  LogOut,
  Menu,
  X,
  Search,
  ShoppingCart,
  User,
  ChevronDown,
} from "lucide-react";
import axios from "axios";
import {
  translate,
  setLanguage,
  getLanguage,
  subscribe,
} from "../../services/languageService";

function Navbar() {
  const [language, setCurrentLanguage] = useState(getLanguage());
  const count = useSelector((state) => state.product.count);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setCurrentLanguage(getLanguage());
    });
    return unsubscribe;
  }, []);

  // ... rest of your existing useEffect hooks ...
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/user", {
          withCredentials: true,
        });
        setUser(res.data);
        if (res.data.role === "provider") {
          setCartCount(res.data.cart?.length || 0);
        }
      } catch (error) {
        if (error.response?.status !== 401) {
          console.error("Error fetching user data:", error);
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    // Add scroll event listener
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Disable body scroll when mobile menu is open
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
      window.location.href = "/login";
    } catch (error) {
      console.error("Failed to logout");
    }
  };

  // Don't render anything while loading to prevent flickering
  if (loading) {
    return null;
  }

  // Combine main links with user-specific links

  const toggleLanguage = () => {
    const newLang = getLanguage() === "en" ? "ar" : "en";
    setLanguage(newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
  };

  // Update mainNavLinks to use translations
  const mainNavLinks = [
    { title: translate("navbar.home"), path: "/" },
    { title: translate("navbar.shop"), path: "/shop" },
    { title: translate("navbar.about"), path: "/about" },
    { title: translate("navbar.contact"), path: "/contact" },
  ];

  const userSpecificLinks = {
    "end-user": [
      { title: translate("navbar.becomeProvider"), path: "/become-provider" },
    ],
    admin: [{ title: translate("navbar.manage"), path: "/dashboard" }],
    provider: [
      { title: translate("navbar.providerProfile"), path: "/provider-profile" },
    ],
  };

  // Combine main links with user-specific links
  const allNavLinks = [
    ...mainNavLinks,
    ...(user && userSpecificLinks[user.role]
      ? userSpecificLinks[user.role]
      : []),
  ];

  // Add RTL support for Arabic
  const isRTL = language === "ar";

  // Don't render anything while loading to prevent flickering
  if (loading) {
    return null;
  }

  return (
    <>
      <nav
        className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${
          scrolled ? "py-2 shadow-lg bg-[#4A4947]" : "py-4 bg-[#4A4947]"
        }`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex-shrink-0">
              <Link to="/" className="block">
                <img
                  src="src/assets/10075827.jpg"
                  alt="logo"
                  className={`transition-all duration-300 rounded ${
                    scrolled ? "h-10 w-auto" : "h-12 w-auto"
                  }`}
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {allNavLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="relative px-5 py-2 text-[#D8D2C2] font-medium tracking-wide hover:text-white transition-all duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#D8D2C2] hover:after:w-full after:transition-all after:duration-300"
                >
                  {link.title}
                </Link>
              ))}
            </div>

            {/* Right Actions Section */}
            <div className="flex items-center space-x-4">
              {/* Language Toggle Button */}
              <button
                onClick={toggleLanguage}
                className="px-3 py-1 bg-[#D8D2C2] text-[#4A4947] rounded-md text-sm font-medium"
              >
                {language === "en" ? "العربية" : "English"}
              </button>

              {/* Search Toggle Button */}
              {/* <button
                className="relative text-[#D8D2C2] hover:text-white transition-colors duration-300"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search"
              >
                <Search
                  className={`w-5 h-5 ${
                    searchOpen ? "opacity-0" : "opacity-100"
                  } transition-opacity duration-300`}
                />
                <X
                  className={`w-5 h-5 absolute top-0 left-0 ${
                    searchOpen ? "opacity-100" : "opacity-0"
                  } transition-opacity duration-300`}
                />
              </button> */}

              {/* ... rest of your navbar code ... */}
              {/* Cart - Only for end-users */}
              {user?.role === "end-user" && (
                <Link
                  to="/cart"
                  className="hidden sm:block relative text-[#D8D2C2] hover:text-white transition-colors duration-300"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {/* <span className="absolute -top-2 -right-2 bg-[#D8D2C2] text-[#4A4947] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span> */}
                </Link>
              )}

              {/* Auth Button */}
              {user ? (
                <div className="relative group hidden sm:block">
                  <button className="flex items-center px-4 py-2 rounded-full bg-[#D8D2C2] text-[#4A4947] font-medium hover:bg-white transition-colors duration-300">
                    <User className="w-4 h-4 mr-2" />
                    <span className="mr-1">{user?.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-lg shadow-xl transform scale-0 group-hover:scale-100 origin-top transition-transform duration-150 ease-in-out z-50">
                    {user?.role === "end-user" && (
                      <Link
                        to="/user-profile"
                        className="block px-4 py-2 text-[#4A4947] hover:bg-[#D8D2C2] transition-colors duration-150"
                      >
                        Profile
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-150 flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {translate("navbar.logOut")}
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:flex items-center px-4 py-2 rounded-full bg-[#D8D2C2] text-[#4A4947] font-medium hover:bg-white transition-colors duration-300"
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Link>
              )}

              {/* Mobile menu button */}
              <button
                className="lg:hidden text-[#D8D2C2] hover:text-white transition-colors duration-300 focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar - Expandable */}
        <div
          className={`absolute left-0 right-0 px-4 py-3 bg-[#4A4947] border-t border-[#D8D2C2]/20 transition-all duration-300 ${
            searchOpen
              ? "top-full opacity-100"
              : "-top-20 opacity-0 pointer-events-none"
          }`}
        >
          <div className="container mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder={translate("navbar.searchPlaceholder")}
                className="w-full py-2 pl-4 pr-10 rounded-full bg-[#3A3938] text-[#D8D2C2] placeholder-[#D8D2C2]/70 border-2 border-[#D8D2C2]/20 focus:border-[#D8D2C2] outline-none transition-all duration-300"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#D8D2C2]">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ... rest of your navbar code ... */}
      <div
        className={`${scrolled ? "h-16" : "h-20"} transition-all duration-300`}
      ></div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-50 lg:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      ></div>

      {/* Mobile Menu Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-[#4A4947] z-50 transform transition-transform duration-300 ease-in-out shadow-xl lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Mobile Menu Header */}
          <div className="p-4 border-b border-[#D8D2C2]/20 flex items-center justify-between">
            <img
              src="src/assets/10075827.jpg"
              alt="logo"
              className="h-10 w-auto rounded"
            />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#D8D2C2] hover:text-white p-1"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Mobile Menu Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Mobile Search */}
            <div className="mb-6 relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full py-2 pl-4 pr-10 rounded-full bg-[#3A3938] text-[#D8D2C2] placeholder-[#D8D2C2]/70 border-2 border-[#D8D2C2]/20 focus:border-[#D8D2C2] outline-none"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#D8D2C2]">
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <div className="space-y-1 mb-6">
              {allNavLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="flex items-center py-3 px-2 text-[#D8D2C2] hover:bg-[#3A3938] rounded-lg transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="font-medium">{link.title}</span>
                </Link>
              ))}
            </div>

            {/* User Actions (Mobile) */}
            {user?.role === "end-user" && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* <Link
                  to="/wishlist"
                  className="flex items-center justify-center py-3 px-4 bg-[#3A3938] text-[#D8D2C2] rounded-lg hover:bg-[#D8D2C2] hover:text-[#4A4947] transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Heart className="w-5 h-5 mr-2" />
                  <span>Wishlist</span>
                </Link> */}
                <Link
                  to="/cart"
                  className="flex items-center justify-center py-3 px-4 bg-[#3A3938] text-[#D8D2C2] rounded-lg hover:bg-[#D8D2C2] hover:text-[#4A4947] transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  <span>Cart ({cartCount})</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Footer with Auth */}
          <div className="p-4 border-t border-[#D8D2C2]/20">
            {user ? (
              <div className="space-y-3">
                {user.role === "end-user" && (
                  <Link
                    to="/profile"
                    className="block w-full py-3 px-4 bg-[#D8D2C2] text-[#4A4947] font-medium rounded-lg text-center hover:bg-white transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center w-full py-3 px-4 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors duration-200"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="block w-full py-3 px-4 bg-[#D8D2C2] text-[#4A4947] font-medium rounded-lg text-center hover:bg-white transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="block w-full py-3 px-4 border-2 border-[#D8D2C2] text-[#D8D2C2] font-medium rounded-lg text-center hover:bg-[#D8D2C2] hover:text-[#4A4947] transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
