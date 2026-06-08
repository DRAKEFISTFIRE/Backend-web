import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: false,
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

// services/mail.service.js
export const sendMail = async ({ subject, html }) => {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "Portfolio <onboarding@resend.dev>",  // Domini per defecte de Resend (gratuït)
      to: [process.env.MAIL_TO],
      subject,
      html
    })
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Resend API error");
  }

  return await res.json();
};