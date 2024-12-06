export const forgotPasswordTemplate = (name, url) => {
  return `<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f4f4f4; margin: 0; padding: 0;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0">
  <tr>
      <td style="padding: 20px 0;">
          <table role="presentation" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                  <td style="background-color: #3498db; padding: 30px 20px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Password Reset Request</h1>
                  </td>
              </tr>
              <!-- Main Content -->
              <tr>
                  <td style="padding: 40px 30px;">
                      <p style="font-size: 16px; margin-bottom: 20px;">Hello ${
                        name || "Valued User"
                      },</p>
                      <p style="font-size: 16px; margin-bottom: 20px;">We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
                      <p style="font-size: 16px; margin-bottom: 30px;">To reset your password, click the button below:</p>
                      <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                          <tr>
                              <td style="border-radius: 4px; background-color: #3498db;">
                                  <a href="${url}" target="_blank" style="border: solid 1px #3498db; border-radius: 4px; color: #ffffff; padding: 12px 18px; text-decoration: none; display: inline-block; font-size: 16px; font-weight: bold;">Reset Your Password</a>
                              </td>
                          </tr>
                      </table>
                      <p style="font-size: 16px; margin-top: 30px;">This link will expire in 24 hours. If you need to request a new password reset, please visit our website.</p>
                      <p style="font-size: 16px; margin-top: 30px;">If you're having trouble clicking the button, copy and paste the URL below into your web browser:</p>
                      <p style="font-size: 14px; word-break: break-all; color: #3498db;">${url}</p>
                  </td>
              </tr>
              <!-- Footer -->
              <tr>
                  <td style="background-color: #f8f8f8; padding: 20px; text-align: center; font-size: 14px; color: #888888;">
                      <p style="margin: 0;">This is an automated message, please do not reply to this email.</p>
                      <p style="margin: 10px 0 0;">© 2023 ${
                        process.env.APP_NAME
                      }. All rights reserved.</p>
                  </td>
              </tr>
          </table>
      </td>
  </tr>
</table>
</body>
</html>

`;
};

export const resetPasswordTemplate = (name) => {
  return `
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f8f8; border-radius: 5px;">
      <tr>
          <td style="padding: 30px;">
              <h1 style="color: #4a4a4a; text-align: center; margin-bottom: 30px;">Password Reset Confirmation</h1>
              <div style="background-color: #ffffff; padding: 30px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                  <p style="font-size: 16px; margin-bottom: 20px;">Hi <span style="font-weight: bold;">${
                    name || "User"
                  }</span>,</p>
                  <p style="font-size: 16px; margin-bottom: 20px;">You have successfully reset your password.</p>
                  <p style="font-size: 16px; margin-bottom: 20px;">If you did not make this request, please contact us immediately.</p>
                  <div style="text-align: center; margin-top: 30px;">
                      <a href="${
                        process.env.CLIENT_URL
                      }/login" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Your Account</a>
                  </div>
              </div>
              <p style="text-align: center; margin-top: 30px; font-size: 14px; color: #888888;">This is an automated message, please do not reply to this email.</p>
          </td>
      </tr>
  </table>
              `;
};
