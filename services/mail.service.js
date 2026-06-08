import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // 🔥 importante (SSL directo, más estable que 587)

  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  },

  // 🔥 estabilidad extra en cloud
  pool: true,
  maxConnections: 1,
  maxMessages: 5,

  connectionTimeout: 30000,
  socketTimeout: 30000,
  greetingTimeout: 15000,

  tls: {
    rejectUnauthorized: false
  }
});

// 🔥 debug seguro (NO bloquea deploy)
transporter.verify((error) => {
  if (error) {
    console.error("❌ SMTP ERROR:", error);
  } else {
    console.log("✅ SMTP READY");
  }
});

export const sendMail = async ({ subject, html }) => {
  try {
    return await Promise.race([
      transporter.sendMail({
        from: `"Portfolio Contact" <${process.env.MAIL_USER}>`,
        to: process.env.MAIL_TO,
        subject,
        html
      }),

      // 🔥 evita que Render se quede colgado
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("SMTP HARD TIMEOUT")), 25000)
      )
    ]);
  } catch (err) {
    console.error("❌ SEND MAIL ERROR:", err);
    throw err;
  }
};