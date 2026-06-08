import { sendMail } from "../services/mail.service.js";

export const sendContactRequest = async (
  req,
  res
) => {

  try {

    const {
      service,
      client,
      project
    } = req.body;

    const configurationHtml =
      Object.entries(
        project.configuration || {}
      )
      .map(([key, value]) => {

        const content =
          Array.isArray(value)
            ? value.join(", ")
            : value;

        return `
          <tr>
            <td style="padding:8px;font-weight:bold">
              ${key}
            </td>

            <td style="padding:8px">
              ${content}
            </td>
          </tr>
        `;

      })
      .join("");

    const html = `
      <div style="font-family:Arial">

        <h1>🚀 New Project Request</h1>

        <h2>Service</h2>

        <p>
          <strong>${service}</strong>
        </p>

        <h2>Client Information</h2>

        <ul>
          <li><strong>Name:</strong> ${client.name}</li>
          <li><strong>Email:</strong> ${client.email}</li>
          <li><strong>Type:</strong> ${client.type}</li>
          <li><strong>Company:</strong> ${client.company || "-"}</li>
          <li><strong>Country:</strong> ${client.country}</li>
        </ul>

        <h2>Project</h2>

        <ul>
          <li>
            <strong>Deadline:</strong>
            ${project.deadline || "Not specified"}
          </li>
        </ul>

        <p>
          <strong>Description</strong>
        </p>

        <p>
          ${project.description}
        </p>

        <h2>Configuration</h2>

        <table
          border="1"
          cellspacing="0"
          cellpadding="0"
          width="100%"
        >
          ${configurationHtml}
        </table>

      </div>
    `;

    await sendMail({
      subject: `New ${service} project request`,
      html
    });

    res.status(200).json({
      success: true,
      message: "Email sent"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to send email"
    });

  }

};