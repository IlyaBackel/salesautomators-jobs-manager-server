const nodemailer = require("nodemailer");

const EMAIL = process.env.EMAIL;
const EMAIL_PASS = process.env.EMAIL_PASS;

async function sendCompletionEmail(job) {
  if (!job.email) {
    console.log("No client email provided, skipping email notification.");
    return;
  }

  console.log('📧 About to send completion email for job', EMAIL, EMAIL_PASS);

  if (!EMAIL || !EMAIL_PASS) {
    console.log("Email credentials missing. Would send to:", job.email);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.mail.ru",
    port: 465,
    secure: true,
    auth: { user: EMAIL, pass: EMAIL_PASS },
  });


  const mailOptions = {
    from: `"YMC Plumbing" <${EMAIL}>`,
    to: job.email,
    subject: `Your plumbing job #${job.id} is completed`,
    text: `Dear ${job.firstName} ${job.lastName},\n\nWe have completed your ${job.jobType} job scheduled on ${job.startDate} at ${job.startTime}.\n\nIf you have any questions, please contact us.\n\nThank you for choosing YMC Plumbing.`,
    html: `<p>Dear ${job.firstName} ${job.lastName},</p>
           <p>We have completed your <strong>${job.jobType}</strong> job scheduled on <strong>${job.startDate}</strong> at <strong>${job.startTime}</strong>.</p>
           <p>If you have any questions, please contact us.</p>
           <p>Thank you for choosing YMC Plumbing.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(process.env.EMAIL, process.env.EMAIL_PASS);
    console.log(`Completion email sent to ${job.email}`);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

module.exports = { sendCompletionEmail };
