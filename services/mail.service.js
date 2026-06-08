import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

export const sendMail = async ({ subject, html }) => {
  await transporter.sendMail({
    from: `"Portfolio Contact" <${process.env.MAIL_USER}>`,
    to: process.env.MAIL_TO,
    subject,
    html
  });
};