export const sendMail = async ({ subject, html }) => {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "Portfolio <onboarding@resend.dev>",
      to: [process.env.MAIL_TO],
      subject,
      html
    })
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Resend error");
  }

  const data = await res.json();
  console.log("✅ EMAIL SENT:", data.id);
  return data;
};