const { Contact } = require("../models");
const { validationResult } = require("express-validator");

// إرسال نموذج الاتصال
exports.submitContactForm = async (req, res) => {
  // التحقق من صحة البيانات
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, message, phone, address } = req.body;

  try {
    // إنشاء سجل جديد في جدول Contact
    const contact = await Contact.create({
      name,
      email,
      message,
      phone: phone || null, // حقل اختياري
      address: address || null, // حقل اختياري
    });

    res.status(201).json({
      success: true,
      data: contact,
      message: "Thank you for your message! We will get back to you soon.",
    });
  } catch (err) {
    console.error("Error submitting contact form:", err);
    res.status(500).json({
      success: false,
      message: "Failed to submit contact form. Please try again later.",
    });
  }
};

// جلب جميع رسائل الاتصال
exports.getContactSubmissions = async (req, res) => {
  try {
    const contacts = await Contact.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (err) {
    console.error("Error fetching contact submissions:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch contact submissions",
    });
  }
};
