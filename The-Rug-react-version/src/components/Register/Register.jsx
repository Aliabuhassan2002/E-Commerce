import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeInput, setActiveInput] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  // Animation effect on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFocus = (inputName) => {
    setActiveInput(inputName);
  };

  const handleBlur = () => {
    setActiveInput(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name: formData.name,
          email: formData.email,
          address: formData.address,
          phone: formData.phone,
          password: formData.password,
        },
        { withCredentials: true }
      );

      Cookies.set("token", data.token, { expires: 7 });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-[#D8D2C2] to-white flex flex-col justify-center items-center relative">
      {/* Rug pattern background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Rug pattern overlay */}
        <div
          className="absolute inset-0 bg-repeat opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234A4947' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        {/* Decorative rug borders */}
        <div className="absolute top-0 left-0 w-full h-6 bg-[url('data:image/svg+xml,%3Csvg width='20' height='12' viewBox='0 0 20 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 6 L5 0 L10 6 L15 0 L20 6 L15 12 L10 6 L5 12 Z' fill='%234A4947' fill-opacity='0.1'/%3E%3C/svg%3E')] bg-repeat-x"></div>
        <div className="absolute bottom-0 left-0 w-full h-6 bg-[url('data:image/svg+xml,%3Csvg width='20' height='12' viewBox='0 0 20 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 6 L5 0 L10 6 L15 0 L20 6 L15 12 L10 6 L5 12 Z' fill='%234A4947' fill-opacity='0.1'/%3E%3C/svg%3E')] bg-repeat-x"></div>

        {/* Rug-inspired curved elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d="M0,30 Q30,10 50,30 T100,30 V100 H0 Z"
              fill="#4A4947"
              fillOpacity="0.03"
              className="transform origin-center animate-[wave_15s_ease-in-out_infinite]"
            />
            <path
              d="M0,50 Q40,30 70,50 T100,50 V100 H0 Z"
              fill="#4A4947"
              fillOpacity="0.03"
              className="transform origin-center animate-[wave_12s_ease-in-out_infinite]"
              style={{ animationDelay: "0.5s" }}
            />
          </svg>
        </div>
      </div>

      {/* Main content */}
      <div
        className={`w-full max-w-3xl transition-all duration-1000 transform ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <div className="p-2">
          <div className="bg-white bg-opacity-70 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden relative border border-[#D8D2C2] border-opacity-40">
            {/* Rug-patterned header */}
            <div className="bg-[#4A4947] p-6 relative overflow-hidden">
              <div className="absolute inset-0 overflow-hidden opacity-20">
                {/* Rug pattern in header */}
                <svg
                  width="100%"
                  height="100%"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <pattern
                    id="rugPattern"
                    patternUnits="userSpaceOnUse"
                    width="20"
                    height="20"
                    patternTransform="rotate(45)"
                  >
                    <rect width="20" height="20" fill="none" />
                    <path
                      d="M0,0 L20,0 L20,20 L0,20 Z"
                      fill="none"
                      stroke="#D8D2C2"
                      stroke-width="0.5"
                    />
                    <circle cx="10" cy="10" r="3" fill="#D8D2C2" />
                    <path
                      d="M0,10 L20,10 M10,0 L10,20"
                      stroke="#D8D2C2"
                      stroke-width="0.5"
                    />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#rugPattern)" />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-white relative z-10">
                Create Your Account
              </h2>
              <p className="text-[#D8D2C2] mt-1 relative z-10">
                Join our artisan rug collection
              </p>
            </div>

            <div className="p-8">
              {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-100 border-l-4 border-red-500 text-red-700 flex items-start animate-[fadeIn_0.5s_ease-in-out]">
                  <svg
                    className="w-5 h-5 mr-2 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      name: "name",
                      label: "Full Name",
                      type: "text",
                      icon: "👤",
                      col: "md:col-span-1",
                    },
                    {
                      name: "email",
                      label: "Email Address",
                      type: "email",
                      icon: "✉️",
                      col: "md:col-span-1",
                    },
                    {
                      name: "address",
                      label: "Address",
                      type: "text",
                      icon: "🏠",
                      col: "md:col-span-2",
                    },
                    {
                      name: "phone",
                      label: "Phone Number",
                      type: "tel",
                      icon: "📱",
                      col: "md:col-span-2",
                    },
                    {
                      name: "password",
                      label: "Password",
                      type: "password",
                      icon: "🔒",
                      col: "md:col-span-1",
                    },
                    {
                      name: "confirmPassword",
                      label: "Confirm Password",
                      type: "password",
                      icon: "🔒",
                      col: "md:col-span-1",
                    },
                  ].map((field, index) => (
                    <div
                      key={field.name}
                      className={`transition-all duration-300 transform ${
                        field.col
                      } ${
                        isVisible
                          ? "translate-y-0 opacity-100"
                          : "translate-y-10 opacity-0"
                      }`}
                      style={{
                        transitionDelay: `${index * 100 + 300}ms`,
                        transform:
                          activeInput === field.name
                            ? "scale(1.02)"
                            : "scale(1)",
                      }}
                    >
                      <div
                        className={`group relative bg-white bg-opacity-70 rounded-lg border overflow-hidden transition-all ${
                          activeInput === field.name
                            ? "border-[#4A4947] shadow-md"
                            : "border-[#D8D2C2]"
                        }`}
                      >
                        <div className="flex items-center">
                          <div
                            className={`pl-4 text-lg transition-colors ${
                              activeInput === field.name
                                ? "text-[#4A4947]"
                                : "text-gray-400"
                            }`}
                          >
                            {field.icon}
                          </div>
                          <input
                            type={field.type}
                            name={field.name}
                            placeholder={field.label}
                            value={formData[field.name]}
                            onChange={handleChange}
                            onFocus={() => handleFocus(field.name)}
                            onBlur={handleBlur}
                            className="w-full px-3 py-3 bg-transparent text-[#4A4947] focus:outline-none"
                            required
                          />
                        </div>
                        <div
                          className={`absolute bottom-0 left-0 h-0.5 bg-[#4A4947] transition-all duration-300 ${
                            activeInput === field.name ? "w-full" : "w-0"
                          }`}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className={`mt-6 transition-all duration-300 transform ${
                    isVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-10 opacity-0"
                  }`}
                  style={{ transitionDelay: "900ms" }}
                >
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative w-full py-3 bg-[#4A4947] text-white font-medium rounded-lg overflow-hidden group transition-all hover:shadow-lg active:scale-95"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin mr-2 h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Creating Account...
                        </>
                      ) : (
                        "Register Now"
                      )}
                    </span>
                    {/* Decorative rug pattern animation for button */}
                    <div className="absolute inset-0 w-full h-full opacity-10">
                      <div
                        className="absolute inset-0 bg-repeat"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,0 L5,0 L10,5 L5,10 L0,5 Z M10,10 L15,5 L20,10 L15,15 L10,10 Z' fill='%23ffffff' fill-opacity='0.5'/%3E%3C/svg%3E")`,
                          backgroundSize: "10px 10px",
                        }}
                      ></div>
                    </div>
                    <div className="absolute inset-0 w-3 bg-white bg-opacity-30 transform -skew-x-20 -translate-x-full transition-transform group-hover:translate-x-full duration-1000"></div>
                  </button>
                </div>

                <div
                  className={`text-center mt-4 transition-all duration-300 transform ${
                    isVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-10 opacity-0"
                  }`}
                  style={{ transitionDelay: "1000ms" }}
                >
                  <p className="text-sm text-[#4A4947]/70">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-[#4A4947] font-medium relative group"
                    >
                      Sign In
                      <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[#4A4947] transition-all group-hover:w-full"></span>
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>

          <div
            className={`mt-6 text-center text-xs text-[#4A4947]/60 transition-all duration-300 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
            style={{ transitionDelay: "1100ms" }}
          >
            By creating an account, you agree to our{" "}
            <a
              href="#"
              className="underline hover:text-[#4A4947]/80 transition-colors"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="underline hover:text-[#4A4947]/80 transition-colors"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
