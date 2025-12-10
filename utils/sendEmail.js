import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return info;
  } catch (error) {
    console.error("Email send error:", error);
    throw error;
  }
};





// import { Resend } from "resend";

// if (!process.env.RESEND_API_KEY) {
//   throw new Error("RESEND_API_KEY missing in .env");
// }

// const resend = new Resend(process.env.RESEND_API_KEY);

// export const sendEmail = async ({ to, subject, html }) => {
//   console.log("to",to)
//   try {
//     const response = await resend.emails.send({
//       from: "Acme <onboarding@resend.dev>",
//       to,
//       subject,
//       html,
//     });
//     console.log("Email sent:", response);
//     return response.data;
//   } catch (err) {
//     console.error("Email sending error:", err);
//     throw err;
//   }
// };
