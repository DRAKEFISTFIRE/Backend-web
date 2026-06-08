import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,

  // Fuerza IPv4 (evita el problema IPv6 que aparece en tus logs)
  family: 4,

  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  },

  pool: true,
  maxConnections: 1,
  maxMessages: 5,

  connectionTimeout: 30000,
  socketTimeout: 30000,
  greetingTimeout: 15000,

  requireTLS: true,

  tls: {
    rejectUnauthorized: false
  }
});

// Debug SMTP
transporter.verify((error) => {
  if (error) {
    console.error("❌ SMTP ERROR:", error);
  } else {
    console.log("✅ SMTP READY");
  }
});

export const sendMail = async ({ subject, html }) => {
  try {
    const result = await Promise.race([
      transporter.sendMail({
        from: `"Portfolio Contact" <${process.env.MAIL_USER}>`,
        to: process.env.MAIL_TO,
        subject,
        html
      }),

      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("SMTP HARD TIMEOUT")),
          25000
        )
      )
    ]);

    console.log("✅ EMAIL SENT:", result.messageId);

    return result;
  } catch (err) {
    console.error("❌ SEND MAIL ERROR:", err);
    throw err;
  }
};