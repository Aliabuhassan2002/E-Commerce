import React, { useState } from "react";
import axios from "axios";
import "../Navbar/Navbar.css";

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    street: "",
    phone: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!validateForm()) return;

  //   setIsSubmitting(true);
  //   setSubmitStatus(null);

  //   try {
  //     const response = await axios.post("http://localhost:5000/api/contact", {
  //       name: formData.name,
  //       email: formData.email,
  //       message: formData.message,
  //       // Include other fields if your backend needs them
  //       phone: formData.phone,
  //       address: formData.street,
  //     });

  //     setSubmitStatus({
  //       success: true,
  //       message: "Thank you! Your message has been sent.",
  //     });
  //     // Reset form
  //     setFormData({
  //       name: "",
  //       street: "",
  //       phone: "",
  //       email: "",
  //       message: "",
  //     });
  //   } catch (error) {
  //     console.error("Error submitting form:", error);
  //     setSubmitStatus({
  //       success: false,
  //       message: "Something went wrong. Please try again later.",
  //     });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await axios.post("http://localhost:5000/api/contact", {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        phone: formData.phone,
        address: formData.street,
      });

      setSubmitStatus({
        success: true,
        message:
          response.data.message || "Thank you! Your message has been sent.",
      });

      // Reset form
      setFormData({
        name: "",
        street: "",
        phone: "",
        email: "",
        message: "",
      });
    } catch (error) {
      let errorMsg = "Something went wrong. Please try again later.";

      if (error.response) {
        // Handle validation errors from server
        if (error.response.data.errors) {
          const serverErrors = {};
          error.response.data.errors.forEach((err) => {
            serverErrors[err.param] = err.msg;
          });
          setErrors(serverErrors);
          errorMsg = "Please fix the errors in the form.";
        } else if (error.response.data.message) {
          errorMsg = error.response.data.message;
        }
      }

      setSubmitStatus({
        success: false,
        message: errorMsg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="grid md:grid-cols-3 items-start gap-4 max-md:gap-12 max-w-6xl mx-auto py-6 bg-white font-[sans-serif] pt-40">
      <div className="px-4">
        <h2 className="text-gray-800 text-xl font-semibold">
          Contact Information
        </h2>

        <div className="space-y-8 mt-8">
          <div className="flex">
            <div className="w-8 h-8 flex items-center shrink-0 rounded border p-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-full"
                viewBox="0 0 32 32"
              >
                <path
                  d="M8 30a1.001 1.001 0 0 1-1-1v-5H4c-1.654 0-3-1.346-3-3V5c0-1.654 1.346-3 3-3h24c1.654 0 3 1.346 3 3v16c0 1.654-1.346 3-3 3H15.851l-7.226 5.781A.998.998 0 0 1 8 30zM4 4c-.552 0-1 .449-1 1v16c0 .551.448 1 1 1h4a1 1 0 0 1 1 1v3.92l5.875-4.701A1 1 0 0 1 15.5 22H28c.552 0 1-.449 1-1V5c0-.551-.448-1-1-1z"
                  data-original="#000000"
                />
                <path
                  d="M24 12H8a1 1 0 1 1 0-2h16a1 1 0 1 1 0 2zm-8 4H8a1 1 0 1 1 0-2h8a1 1 0 1 1 0 2z"
                  data-original="#000000"
                />
              </svg>
            </div>

            <div className="ml-4">
              <h4 className="text-gray-800 text-base font-semibold">
                Chat to us
              </h4>
              <p className="text-xs mt-1 text-gray-500">
                Chat with our team to help.
              </p>
              <p className="text-sm mt-4">Ali@gmail.com</p>
            </div>
          </div>

          <div className="flex">
            <div className="w-8 h-8 flex items-center shrink-0 rounded border p-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-full"
                viewBox="0 0 512 512"
              >
                <path
                  d="M341.476 338.285c54.483-85.493 47.634-74.827 49.204-77.056C410.516 233.251 421 200.322 421 166 421 74.98 347.139 0 256 0 165.158 0 91 74.832 91 166c0 34.3 10.704 68.091 31.19 96.446l48.332 75.84C118.847 346.227 31 369.892 31 422c0 18.995 12.398 46.065 71.462 67.159C143.704 503.888 198.231 512 256 512c108.025 0 225-30.472 225-90 0-52.117-87.744-75.757-139.524-83.715zm-194.227-92.34a15.57 15.57 0 0 0-.517-.758C129.685 221.735 121 193.941 121 166c0-75.018 60.406-136 135-136 74.439 0 135 61.009 135 136 0 27.986-8.521 54.837-24.646 77.671-1.445 1.906 6.094-9.806-110.354 172.918L147.249 245.945zM256 482c-117.994 0-195-34.683-195-60 0-17.016 39.568-44.995 127.248-55.901l55.102 86.463a14.998 14.998 0 0 0 25.298 0l55.101-86.463C411.431 377.005 451 404.984 451 422c0 25.102-76.313 60-195 60z"
                  data-original="#000000"
                />
                <path
                  d="M256 91c-41.355 0-75 33.645-75 75s33.645 75 75 75 75-33.645 75-75-33.645-75-75-75zm0 120c-24.813 0-45-20.187-45-45s20.187-45 45-45 45 20.187 45 45-20.187 45-45 45z"
                  data-original="#000000"
                />
              </svg>
            </div>

            <div className="ml-4">
              <h4 className="text-gray-800 text-base font-semibold">
                Visit us
              </h4>
              <p className="text-xs mt-1 text-gray-500">Visit our office HQ.</p>
              <p className="text-sm mt-4">26st. New Zarqa</p>
            </div>
          </div>

          <div className="flex">
            <div className="w-8 h-8 flex items-center shrink-0 rounded border p-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-full"
                viewBox="0 0 473.806 473.806"
              >
                <path
                  d="M374.456 293.506c-9.7-10.1-21.4-15.5-33.8-15.5-12.3 0-24.1 5.3-34.2 15.4l-31.6 31.5c-2.6-1.4-5.2-2.7-7.7-4-3.6-1.8-7-3.5-9.9-5.3-29.6-18.8-56.5-43.3-82.3-75-12.5-15.8-20.9-29.1-27-42.6 8.2-7.5 15.8-15.3 23.2-22.8 2.8-2.8 5.6-5.7 8.4-8.5 21-21 21-48.2 0-69.2l-27.3-27.3c-3.1-3.1-6.3-6.3-9.3-9.5-6-6.2-12.3-12.6-18.8-18.6-9.7-9.6-21.3-14.7-33.5-14.7s-24 5.1-34 14.7l-.2.2-34 34.3c-12.8 12.8-20.1 28.4-21.7 46.5-2.4 29.2 6.2 56.4 12.8 74.2 16.2 43.7 40.4 84.2 76.5 127.6 43.8 52.3 96.5 93.6 156.7 122.7 23 10.9 53.7 23.8 88 26 2.1.1 4.3.2 6.3.2 23.1 0 42.5-8.3 57.7-24.8.1-.2.3-.3.4-.5 5.2-6.3 11.2-12 17.5-18.1 4.3-4.1 8.7-8.4 13-12.9 9.9-10.3 15.1-22.3 15.1-34.6 0-12.4-5.3-24.3-15.4-34.3l-54.9-55.1zm35.8 105.3c-.1 0-.1.1 0 0-3.9 4.2-7.9 8-12.2 12.2-6.5 6.2-13.1 12.7-19.3 20-10.1 10.8-22 15.9-37.6 15.9-1.5 0-3.1 0-4.6-.1-29.7-1.9-57.3-13.5-78-23.4-56.6-27.4-106.3-66.3-147.6-115.6-34.1-41.1-56.9-79.1-72-119.9-9.3-24.9-12.7-44.3-11.2-62.6 1-11.7 5.5-21.4 13.8-29.7l34.1-34.1c4.9-4.6 10.1-7.1 15.2-7.1 6.3 0 11.4 3.8 14.6 7l.3.3c6.1 5.7 11.9 11.6 18 17.9 3.1 3.2 6.3 6.4 9.5 9.7l27.3 27.3c10.6 10.6 10.6 20.4 0 31-2.9 2.9-5.7 5.8-8.6 8.6-8.4 8.6-16.4 16.6-25.1 24.4-.2.2-.4.3-.5.5-8.6 8.6-7 17-5.2 22.7l.3.9c7.1 17.2 17.1 33.4 32.3 52.7l.1.1c27.6 34 56.7 60.5 88.8 80.8 4.1 2.6 8.3 4.7 12.3 6.7 3.6 1.8 7 3.5 9.9 5.3.4.2.8.5 1.2.7 3.4 1.7 6.6 2.5 9.9 2.5 8.3 0 13.5-5.2 15.2-6.9l34.2-34.2c3.4-3.4 8.8-7.5 15.1-7.5 6.2 0 11.3 3.9 14.4 7.3l.2.2 55.1 55.1c10.3 10.2 10.3 20.7.1 31.3zm-154.2-286.1c26.2 4.4 50 16.8 69 35.8s31.3 42.8 35.8 69c1.1 6.6 6.8 11.2 13.3 11.2.8 0 1.5-.1 2.3-.2 7.4-1.2 12.3-8.2 11.1-15.6-5.4-31.7-20.4-60.6-43.3-83.5s-51.8-37.9-83.5-43.3c-7.4-1.2-14.3 3.7-15.6 11s3.5 14.4 10.9 15.6zm217.2 96.3c-8.9-52.2-33.5-99.7-71.3-137.5s-85.3-62.4-137.5-71.3c-7.3-1.3-14.2 3.7-15.5 11-1.2 7.4 3.7 14.3 11.1 15.6 46.6 7.9 89.1 30 122.9 63.7 33.8 33.8 55.8 76.3 63.7 122.9 1.1 6.6 6.8 11.2 13.3 11.2.8 0 1.5-.1 2.3-.2 7.3-1.1 12.3-8.1 11-15.4z"
                  data-original="#000000"
                />
              </svg>
            </div>

            <div className="ml-4">
              <h4 className="text-gray-800 text-base font-semibold">Call us</h4>
              <p className="text-xs mt-1 text-gray-500">24/7</p>
              <p className="text-sm mt-4">+962787507215</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-3xl md:col-span-2 p-8">
        <h2 className="text-xl text-yellow-300 font-semibold">
          Product or Service Inquiry
        </h2>
        <p className="text-sm text-gray-400 mt-2 leading-relaxed">
          Have some big issue and need help? Then reach out we'd love to hear
          about your problem and provide help.
        </p>

        {submitStatus && (
          <div
            className={`mt-4 p-3 rounded ${
              submitStatus.success
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {submitStatus.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mt-8">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className={`px-2 py-3 bg-transparent text-gray-200 font-medium w-full text-sm border-b ${
                  errors.name ? "border-red-500" : "border-gray-400"
                } focus:border-yellow-300 outline-none`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                name="street"
                placeholder="Street"
                value={formData.street}
                onChange={handleChange}
                className="px-2 py-3 bg-transparent text-gray-200 font-medium w-full text-sm border-b border-gray-400 focus:border-yellow-300 outline-none"
              />
            </div>

            <div>
              <input
                type="number"
                name="phone"
                placeholder="Phone No."
                value={formData.phone}
                onChange={handleChange}
                className="px-2 py-3 bg-transparent text-gray-200 font-medium w-full text-sm border-b border-gray-400 focus:border-yellow-300 outline-none"
              />
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className={`px-2 py-3 bg-transparent text-gray-200 font-medium w-full text-sm border-b ${
                  errors.email ? "border-red-500" : "border-gray-400"
                } focus:border-yellow-300 outline-none`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <textarea
                name="message"
                placeholder="Write Message"
                value={formData.message}
                onChange={handleChange}
                className={`px-2 pt-3 bg-transparent text-gray-200 font-medium w-full text-sm border-b ${
                  errors.message ? "border-red-500" : "border-gray-400"
                } focus:border-yellow-300 outline-none`}
                rows="4"
              ></textarea>
              {errors.message && (
                <p className="text-red-500 text-xs mt-1">{errors.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`mt-8 flex items-center justify-center text-sm rounded-md px-4 py-2.5 text-gray-800 ${
              isSubmitting
                ? "bg-yellow-500"
                : "bg-yellow-400 hover:bg-yellow-500"
            } transition-colors`}
          >
            {isSubmitting ? (
              "Sending..."
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16px"
                  height="16px"
                  fill="currentColor"
                  className="mr-3"
                  viewBox="0 0 548.244 548.244"
                >
                  <path
                    fillRule="evenodd"
                    d="M392.19 156.054 211.268 281.667 22.032 218.58C8.823 214.168-.076 201.775 0 187.852c.077-13.923 9.078-26.24 22.338-30.498L506.15 1.549c11.5-3.697 24.123-.663 32.666 7.88 8.542 8.543 11.577 21.165 7.879 32.666L390.89 525.906c-4.258 13.26-16.575 22.261-30.498 22.338-13.923.076-26.316-8.823-30.728-22.032l-63.393-190.153z"
                    clipRule="evenodd"
                    data-original="#000000"
                  />
                </svg>
                Send Message
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
