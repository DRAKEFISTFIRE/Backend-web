import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,        // ← TRUE amb port 465
  family: 4,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  },
  connectionTimeout: 30000,
  socketTimeout: 30000,
  greetingTimeout: 15000,
  tls: {
    rejectUnauthorized: false
  }
});

transporter.verify((error) => {
  if (error) {
    console.error("❌ SMTP ERROR:", error);
  } else {
    console.log("✅ SMTP READY");
  }
});

export const sendMail = async ({ subject, html }) => {
  const result = await transporter.sendMail({
    from: `"Portfolio Contact" <${process.env.MAIL_USER}>`,
    to: process.env.MAIL_TO,
    subject,
    html
  });

  console.log("✅ EMAIL SENT:", result.messageId);
  return result;
};