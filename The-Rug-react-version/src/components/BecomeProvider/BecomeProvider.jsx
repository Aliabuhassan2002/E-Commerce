import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";

const BecomeProvider = () => {
  const { register, handleSubmit, watch } = useForm();
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [previewImage, setPreviewImage] = useState(null);
  const [documentImage, setDocumentImage] = useState(null);

  const profileImageFile = watch("profileImage");
  const documentFile = watch("identityDocument");

  useEffect(() => {
    // Fetch user details
    axios
      .get("http://localhost:5000/api/users/user", { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (profileImageFile && profileImageFile[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(profileImageFile[0]);
    }
  }, [profileImageFile]);

  useEffect(() => {
    if (documentFile && documentFile[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocumentImage(reader.result);
      };
      reader.readAsDataURL(documentFile[0]);
    }
  }, [documentFile]);

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("profileImage", data.profileImage[0]);
    formData.append("identityDocument", data.identityDocument[0]);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/provider/request",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setMessage(
        "Your request has been submitted and is pending admin approval."
      );
      setStep(3);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.5 },
    },
  };

  const stepVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
    exit: {
      x: -50,
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ backgroundColor: "#FAF7F0" }}
    >
      <motion.div
        className="relative w-full max-w-4xl mx-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-10">
          <motion.div
            className="bg-white rounded-full p-4 shadow-2xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-center">
              <div className="flex justify-center space-x-6">
                <div
                  className={`w-4 h-4 rounded-full ${
                    step >= 1 ? "#4A4947" : "#D8D2C2"
                  }`}
                  style={{ backgroundColor: step >= 1 ? "#4A4947" : "#D8D2C2" }}
                ></div>
                <div
                  className={`w-4 h-4 rounded-full ${
                    step >= 2 ? "#4A4947" : "#D8D2C2"
                  }`}
                  style={{ backgroundColor: step >= 2 ? "#4A4947" : "#D8D2C2" }}
                ></div>
                <div
                  className={`w-4 h-4 rounded-full ${
                    step >= 3 ? "#4A4947" : "#D8D2C2"
                  }`}
                  style={{ backgroundColor: step >= 3 ? "#4A4947" : "#D8D2C2" }}
                ></div>
              </div>
              <p
                className="text-xs font-semibold mt-1"
                style={{ color: "#4A4947" }}
              >
                Step {step} of 3
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-100"
          style={{ borderRadius: "1.5rem" }}
          whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
        >
          <div className="relative h-48" style={{ backgroundColor: "#4A4947" }}>
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D8D2C2' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                backgroundSize: "30px 30px",
              }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-4xl font-bold text-white z-10 text-center">
                Become a Provider
              </h2>
            </div>
          </div>

          <div className="p-10">
            {step === 1 && (
              <motion.div
                key="step1"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <h3
                  className="text-2xl font-semibold mb-8"
                  style={{ color: "#4A4947" }}
                >
                  Personal Information
                </h3>
                {user && (
                  <div
                    className="mb-10 p-6 rounded-lg"
                    style={{ backgroundColor: "#D8D2C2" }}
                  >
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p
                          className="text-sm"
                          style={{ color: "#4A4947", opacity: 0.7 }}
                        >
                          Name
                        </p>
                        <p
                          className="font-semibold text-lg"
                          style={{ color: "#4A4947" }}
                        >
                          {user.name}
                        </p>
                      </div>
                      <div>
                        <p
                          className="text-sm"
                          style={{ color: "#4A4947", opacity: 0.7 }}
                        >
                          Email
                        </p>
                        <p
                          className="font-semibold text-lg"
                          style={{ color: "#4A4947" }}
                        >
                          {user.email}
                        </p>
                      </div>
                      <div>
                        <p
                          className="text-sm"
                          style={{ color: "#4A4947", opacity: 0.7 }}
                        >
                          Phone
                        </p>
                        <p
                          className="font-semibold text-lg"
                          style={{ color: "#4A4947" }}
                        >
                          {user.phone}
                        </p>
                      </div>
                      <div>
                        <p
                          className="text-sm"
                          style={{ color: "#4A4947", opacity: 0.7 }}
                        >
                          Address
                        </p>
                        <p
                          className="font-semibold text-lg"
                          style={{ color: "#4A4947" }}
                        >
                          {user.address}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <motion.button
                  onClick={() => setStep(2)}
                  className="w-full py-4 rounded-lg font-semibold text-white text-lg"
                  style={{ backgroundColor: "#4A4947" }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Continue to Document Upload
                </motion.button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <h3
                  className="text-2xl font-semibold mb-8"
                  style={{ color: "#4A4947" }}
                >
                  Upload Documents
                </h3>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-8">
                    <label
                      className="block mb-3 text-base font-medium"
                      style={{ color: "#4A4947" }}
                    >
                      Profile Image
                    </label>
                    <div className="flex items-center space-x-6">
                      <motion.div
                        className="w-32 h-32 rounded-full flex items-center justify-center overflow-hidden"
                        whileHover={{ scale: 1.05 }}
                        style={{ backgroundColor: "#D8D2C2" }}
                      >
                        {previewImage ? (
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <svg
                            className="w-12 h-12"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            style={{ color: "#4A4947" }}
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </motion.div>
                      <div className="flex-1">
                        <motion.div
                          className="relative border-2 border-dashed rounded-lg p-6 text-center"
                          whileHover={{ borderColor: "#4A4947" }}
                          style={{ borderColor: "#D8D2C2" }}
                        >
                          <input
                            type="file"
                            {...register("profileImage")}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <p className="text-base" style={{ color: "#4A4947" }}>
                            Drop your image here or click to browse
                          </p>
                          <p
                            className="text-sm mt-2"
                            style={{ color: "#4A4947", opacity: 0.7 }}
                          >
                            JPG, PNG or GIF (max 2MB)
                          </p>
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <label
                      className="block mb-3 text-base font-medium"
                      style={{ color: "#4A4947" }}
                    >
                      Identity Document
                    </label>
                    <motion.div
                      className="relative border-2 border-dashed rounded-lg p-6 text-center h-40"
                      whileHover={{ borderColor: "#4A4947" }}
                      style={{ borderColor: "#D8D2C2" }}
                    >
                      <input
                        type="file"
                        {...register("identityDocument")}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {documentImage ? (
                        <div className="flex items-center justify-center h-full">
                          <p
                            className="text-base font-medium"
                            style={{ color: "#4A4947" }}
                          >
                            Document uploaded
                          </p>
                          <span className="ml-2" style={{ color: "#4A4947" }}>
                            ✓
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full">
                          <svg
                            className="w-12 h-12 mb-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            style={{ color: "#4A4947", opacity: 0.7 }}
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <p className="text-base" style={{ color: "#4A4947" }}>
                            Upload your identity document
                          </p>
                          <p
                            className="text-sm mt-2"
                            style={{ color: "#4A4947", opacity: 0.7 }}
                          >
                            PDF, JPG or PNG (max 5MB)
                          </p>
                        </div>
                      )}
                    </motion.div>
                  </div>

                  <div className="flex space-x-4">
                    <motion.button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 py-4 rounded-lg font-semibold text-lg"
                      style={{ backgroundColor: "#D8D2C2", color: "#4A4947" }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Back
                    </motion.button>
                    <motion.button
                      type="submit"
                      className="flex-1 py-4 rounded-lg font-semibold text-white text-lg flex items-center justify-center"
                      style={{ backgroundColor: "#4A4947" }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={loading}
                    >
                      {loading ? (
                        <div
                          className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
                          style={{
                            borderColor: "#FAF7F0",
                            borderTopColor: "transparent",
                          }}
                        ></div>
                      ) : (
                        "Submit Application"
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="text-center py-10"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className="w-28 h-28 rounded-full mx-auto flex items-center justify-center mb-6"
                  style={{ backgroundColor: "#D8D2C2" }}
                >
                  <svg
                    className="w-14 h-14"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ color: "#4A4947" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
                <h3
                  className="text-2xl font-bold mb-3"
                  style={{ color: "#4A4947" }}
                >
                  Application Submitted!
                </h3>
                <p
                  className="text-lg mb-8"
                  style={{ color: "#4A4947", opacity: 0.8 }}
                >
                  {message ||
                    "Your application has been received. We'll review it soon."}
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <motion.div
            className="bg-white rounded-full p-4 shadow-lg"
            whileHover={{ y: -2 }}
          >
            <p className="text-sm font-medium" style={{ color: "#4A4947" }}>
              Need help? Contact support
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default BecomeProvider;
