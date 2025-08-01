import nodemailer from "nodemailer";
import { EMAIL_PASS, EMAIL_USER } from "../config/index.js";

const createEmailTransporter = () => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    // requireTLS: true,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });
  return transporter;
};

const createEmailOptions = (email, otp, msgType, type, data) => {
  let subject, html;
  if (type === "approve") {
    subject = "DIU Transport Service Renewal Request Approved";
    html = `    
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
      <h2 style="color: #ff9900;">DIU Transport Service Renewal Request Approved</h2>
      <p style="color: #555; margin-top: 10px;">
        Dear <strong>${data.name},</strong>
      </p>
      <p>Congratulations!</p>
      <p>Welcome to DIU's Transport Service Portal.</p>
      <p>Your DIU Transport Renewal Application Form Serial No. is <strong>${
        data.id
      }</strong></p>
      <p>Your transport service renewal application has been accepted (Daffodil International University).</p>

      <div style="border: 1px solid #ff9900; background-color: #ffffe0; padding: 10px; margin-top: 15px; font-weight: bold;">
        Renewal Semester Name: ${data.semester ? data.semester : "Fall 2024"}
      </div>

      <div style="border-top: 1px solid #ccc; padding-top: 15px; margin-top: 15px;">
        <p><strong>Transport Details:</strong></p>
        <p>Route Name: <strong>${
          data.routeName ? data.routeName : "Mirpur 10"
        }</strong></p>
        <p>Payment amount*: <strong>${
          data.paymentAmount ? data.paymentAmount : "5000"
        }</strong> (*in terms of online payment only)</p>
      </div>

      <p style="color: red; margin-top: 20px; font-weight: bold;">
        ( Please ignore this Payment amount message if you have paid except online method & Preserve all of your Payment receipt (information) for future reference )
      </p>

      <p style="font-size: 12px; color: #777; margin-top: 20px;">
        Note*: {/* Add any additional note information here */}
      </p>
    </div>`;
  } else if (type === "reject") {
    subject = "DIU Transport Service Renewal Request Rejected";
    html = `
  <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
    <h2 style="color: #d9534f;">DIU Transport Service Renewal Request Rejected</h2>
    <p style="color: #555; margin-top: 10px;">
      Dear <strong>${data.name},</strong>
    </p>
    <p>We regret to inform you that your application for the renewal of DIU Transport Service has not been approved.</p>
    <p>Your DIU Transport Renewal Application Form Serial No. is <strong>${
      data.id
    }</strong>.</p>

    <div style="border: 1px solid #d9534f; background-color: #f9d6d5; padding: 10px; margin-top: 15px; font-weight: bold;">
      Renewal Semester Name: ${data.semester ? data.semester : "Fall 2024"}
    </div>

    <p style="color: #333; margin-top: 15px;">
      If you have any questions or believe this decision to be in error, please feel free to contact the relevant department for clarification.
    </p>

    <div style="border-top: 1px solid #ccc; padding-top: 15px; margin-top: 15px;">
      <p><strong>Contact Information:</strong></p>
      <p>Email: <strong>support@diu.edu</strong></p>
      <p>Phone: <strong>+880 1234 567 890</strong></p>
    </div>

    <p style="font-size: 12px; color: #777; margin-top: 20px;">
      Note*: {/* Add any additional note information here */}
    </p>
  </div>`;
  } else {
    subject = "Transport user Sign up otp";
    html = `
        <p>Hi there,</p>
        <p>We received a request to Sign up in transport service.</p>
        <p>Here is your one-time password (OTP) to complete the ${msgType} process:</p>
        <p style="font-size:30px"><b>${otp}</b></p>
        <p>This OTP is valid for 1 minute. Please do not share it with anyone.</p>
        <p>If you did not request a ${msgType} , please ignore this email.</p>
        <p>Thanks,</p>
        <p>Transport team ~ DIU</p>
      `;
  }
  // const text = `
  //     <p>Hi there,</p>
  //     <p>We received a request to Sign up in transport service.</p>
  //     <p>Here is your one-time password (OTP) to complete the ${msgType} process:</p>
  //     <p style="font-size:30px"><b>${otp}</b></p>
  //     <p>This OTP is valid for 1 minute. Please do not share it with anyone.</p>
  //     <p>If you did not request a ${msgType} , please ignore this email.</p>
  //     <p>Thanks,</p>
  //     <p>Transport team ~ DIU</p>
  //   `;

  return {
    from: "Transport-Diu <do-not-reply@diutransport.com>",
    to: email,
    subject: subject,
    html: html,
  };
};

export { createEmailOptions, createEmailTransporter };