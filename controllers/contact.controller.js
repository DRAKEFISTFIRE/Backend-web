import { sendMail } from "../services/mail.service.js";

export const sendContactRequest = async (req, res) => {
  try {
    const { service, client, project } = req.body || {};

    // 🔥 VALIDACIÓN DEFENSIVA (evita crashes)
    if (!service || !client || !project) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const configuration = project.configuration || {};

    const configurationHtml = Object.entries(configuration)
      .map(([key, value]) => {
        const content = Array.isArray(value)
          ? value.join(", ")
          : value;

        return `
          <tr>
            <td style="padding:8px;font-weight:bold">
              ${key}
            </td>
            <td style="padding:8px">
              ${content || "-"}
            </td>
          </tr>
        `;
      })
      .join("");

    const html = `
      <div style="font-family:Arial;line-height:1.5">

        <h1>🚀 New Project Request</h1>

        <h2>Service</h2>
        <p><strong>${service}</strong></p>

        <h2>Client Information</h2>
        <ul>
          <li><strong>Name:</strong> ${client.name || "-"}</li>
          <li><strong>Email:</strong> ${client.email || "-"}</li>
          <li><strong>Type:</strong> ${client.type || "-"}</li>
          <li><strong>Company:</strong> ${client.company || "-"}</li>
          <li><strong>Country:</strong> ${client.country || "-"}</li>
        </ul>

        <h2>Project</h2>
        <ul>
          <li><strong>Deadline:</strong> ${project.deadline || "Not specified"}</li>
        </ul>

        <h2>Description</h2>
        <p>${project.description || "-"}</p>

        <h2>Configuration</h2>
        <table border="1" cellspacing="0" cellpadding="0" width="100%">
          ${configurationHtml || ""}
        </table>

      </div>
    `;

    // 🔥 TIMEOUT REAL (EVITA HANG EN RENDER)
    await Promise.race([
      sendMail({
        subject: `New ${service} project request`,
        html
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Email timeout")), 15000)
      )
    ]);

    return res.status(200).json({
      success: true,
      message: "Email sent successfully"
    });

  } catch (error) {
    console.error("❌ sendContactRequest error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to send email"
    });
  }
};