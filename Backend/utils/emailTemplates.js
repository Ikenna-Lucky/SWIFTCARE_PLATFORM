/**
 * HTML email templates for SwiftCare transactional emails.
 * All templates share the same base layout wrapper.
 */

const base = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>SwiftCare</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.06);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0f766e,#0d9488);padding:28px 32px;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.3px;">SwiftCare</h1>
              <p style="margin:4px 0 0;color:#99f6e4;font-size:13px;">Healthcare made simple</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #f1f5f9;background:#f8fafc;">
              <p style="margin:0;color:#94a3b8;font-size:12px;text-align:center;">
                &copy; ${new Date().getFullYear()} SwiftCare. All rights reserved.<br/>
                This is an automated email, please do not reply.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const appointmentConfirmationEmail = ({
  patientName,
  doctorName,
  speciality,
  slotDate,
  slotTime,
  fees,
}) =>
  base(`
    <h2 style="margin:0 0 8px;color:#0f172a;font-size:20px;font-weight:700;">Appointment Confirmed!</h2>
    <p style="margin:0 0 24px;color:#64748b;font-size:14px;line-height:1.6;">
      Hi ${patientName}, your appointment has been successfully booked. Here are the details:
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border-radius:10px;padding:20px;margin-bottom:24px;">
      <tr>
        <td style="padding:6px 0;">
          <span style="color:#64748b;font-size:13px;">Doctor</span><br/>
          <strong style="color:#0f172a;font-size:15px;">${doctorName}</strong>
          <span style="color:#0d9488;font-size:13px;margin-left:6px;">${speciality}</span>
        </td>
      </tr>
      <tr><td style="height:12px;"></td></tr>
      <tr>
        <td style="padding:6px 0;">
          <span style="color:#64748b;font-size:13px;">Date &amp; Time</span><br/>
          <strong style="color:#0f172a;font-size:15px;">${slotDate} at ${slotTime}</strong>
        </td>
      </tr>
      <tr><td style="height:12px;"></td></tr>
      <tr>
        <td style="padding:6px 0;">
          <span style="color:#64748b;font-size:13px;">Consultation Fee</span><br/>
          <strong style="color:#0f172a;font-size:15px;">$${fees}</strong>
        </td>
      </tr>
    </table>

    <p style="margin:0;color:#64748b;font-size:13px;line-height:1.6;">
      Please arrive 10 minutes early. If you need to cancel, you can do so from the SwiftCare app.
    </p>
  `);

export const appointmentCancellationEmail = ({
  patientName,
  doctorName,
  slotDate,
  slotTime,
  cancelledBy,
}) =>
  base(`
    <h2 style="margin:0 0 8px;color:#0f172a;font-size:20px;font-weight:700;">Appointment Cancelled</h2>
    <p style="margin:0 0 24px;color:#64748b;font-size:14px;line-height:1.6;">
      Hi ${patientName}, your appointment has been cancelled${cancelledBy === "doctor" ? " by your doctor" : ""}.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff1f2;border-radius:10px;padding:20px;margin-bottom:24px;">
      <tr>
        <td style="padding:6px 0;">
          <span style="color:#64748b;font-size:13px;">Doctor</span><br/>
          <strong style="color:#0f172a;font-size:15px;">${doctorName}</strong>
        </td>
      </tr>
      <tr><td style="height:12px;"></td></tr>
      <tr>
        <td style="padding:6px 0;">
          <span style="color:#64748b;font-size:13px;">Was scheduled for</span><br/>
          <strong style="color:#0f172a;font-size:15px;">${slotDate} at ${slotTime}</strong>
        </td>
      </tr>
    </table>

    <p style="margin:0;color:#64748b;font-size:13px;line-height:1.6;">
      You can book a new appointment anytime on SwiftCare.
    </p>
  `);

export const passwordResetEmail = ({ name, resetUrl }) =>
  base(`
    <h2 style="margin:0 0 8px;color:#0f172a;font-size:20px;font-weight:700;">Reset Your Password</h2>
    <p style="margin:0 0 24px;color:#64748b;font-size:14px;line-height:1.6;">
      Hi ${name}, we received a request to reset the password for your SwiftCare account.
      Click the button below to choose a new password.
    </p>

    <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td style="background:#0f766e;border-radius:8px;">
          <a href="${resetUrl}" style="display:inline-block;padding:12px 28px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;">
            Reset Password
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 12px;color:#64748b;font-size:13px;line-height:1.6;">
      This link expires in <strong>1 hour</strong>. If you did not request a password reset, you can safely ignore this email.
    </p>
    <p style="margin:0;color:#94a3b8;font-size:12px;word-break:break-all;">
      Or copy this link: ${resetUrl}
    </p>
  `);
