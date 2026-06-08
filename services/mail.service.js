import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  },

  // 🔥 estabilidad real en cloud
  pool: true,
  maxConnections: 1,
  maxMessages: 10,

  connectionTimeout: 20000,
  socketTimeout: 20000,
});

// 🔥 SOLO DEBUG (no rompe deploy)
transporter.verify((error) => {
  if (error) {
    console.error("❌ SMTP ERROR:", error);
  } else {
    console.log("✅ SMTP READY");
  }
});

export const sendMail = async ({ subject, html }) => {
  try {
    return await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_TO,
      subject,
      html
    });
  } catch (err) {
    console.error("❌ SEND MAIL ERROR:", err);
    throw err;
  }
};