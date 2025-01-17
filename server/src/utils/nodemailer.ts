import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "notime.noreply@gmail.com",
    pass: "pbnh ijgn ophq jytv",
  },
});

export const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    console.log("Sending email to:", to);
    await transporter.sendMail({
      from: "notime.noreply@gmail.com",
      to,
      subject,
      text,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email sending failed");
  }
};
