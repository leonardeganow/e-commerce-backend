import { CLIENT_URL, SHOP_NAME } from "../constants/index.js";
import { moneyFormatter } from "../utils/index.js";

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

export const newUserEmail = (name) => {
  return `
   <html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to ${SHOP_NAME} store</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <header style="background-color: #4a4a4a; color: #ffffff; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">Welcome to ${SHOP_NAME}</h1>
    </header>
    <main style="padding: 20px;">
        <p>Hello ${name},</p>
        <p>We're thrilled to have you on board! Your account has been successfully created, and we can't wait for you to start exploring all the amazing products our shop has to offer.</p>
        <h2 style="color: #4a4a4a;">How to Navigate the shop:</h2>
        <ol>
            <li>Look for a product</li>
            <li>Add to cart</li>
            <li>Checkout and make payment with mobile money or your card</li>
            <li>After order is successful we will contact you for delivery</li>
        </ol>
        <p>If you have any questions or need assistance, don't hesitate to reach out to our support team.</p>
        <a href="${CLIENT_URL}/login"style="display: inline-block; background-color: #4CAF50; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px;">Get Started</a>
    </main>
    <footer style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 0.8em;">
        <p>&copy; 2025 ${SHOP_NAME}. All rights reserved.</p>
        <p>You're receiving this email because you recently created an account on our platform.</p>
    </footer>
</body>
</html>`;
};

export const successfulOrderCreated = (name, order) => {
  return `
    <html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #f4f4f4;
            padding: 20px;
            text-align: center;
        }
        .content {
            padding: 20px;
        }
        .footer {
            background-color: #f4f4f4;
            padding: 10px;
            text-align: center;
            font-size: 12px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Thank You for Your Order!</h1>
    </div>
    <div class="content">
        <p>Dear ${name},</p>
        <p>We're excited to confirm that your order has been successfully placed. Here are the details of your purchase:</p>
        <ul>
            <li>Order Number: ${order?._id}</li>
            <li>Order Date: ${new Date(
              order?.createdAt
            ).toLocaleDateString()}</li>
            <li>Total Amount:  ${moneyFormatter.format(order?.totalAmount)}</li>
        </ul>

        <p>Here's a summary of the items you've ordered:</p>
        <table style="width: 100%; border-collapse: collapse;">
            <tr style="background-color: #f4f4f4;">
                <th style="padding: 10px; text-align: left;">Product</th>
                <th style="padding: 10px; text-align: right;">Quantity</th>
                <th style="padding: 10px; text-align: right;">Price</th>
            </tr>
     
            ${order?.items?.map((item) => {
              return `<tr>
                    <td style="padding: 10px;">${item.product.name}</td>
                    <td style="padding: 10px; text-align: right;">${item.quantity}</td>
                    <td style="padding: 10px; text-align: right;">${item.price}</td>
                </tr>`;
            })}
       
        </table>
        <p>Thank you for shopping with us!</p>
        <p>Best regards,<br>The ${SHOP_NAME} Team</p>
    </div>
    <div class="footer">
        <p>&copy; 2023 ${SHOP_NAME}. All rights reserved.</p>
    </div>
</body>
</html>`;
};
