export const generateHTML = (code) => {
    return `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            display: flex;
            align-items: center;
            margin-bottom: 25px;
        }
        .logo {
            height: 40px;
            width: 40px;
            border-radius: 8px;
            margin-right: 12px;
        }
        .brand {
            font-size: 20px;
            font-weight: 600;
            color: #4f46e5;
        }
        .container {
            background-color: #ffffff;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        h1 {
            font-size: 24px;
            color: #111827;
            margin-top: 0;
            margin-bottom: 20px;
        }
        .otp-container {
            background: #f9fafb;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 25px 0;
        }
        .otp {
            font-size: 32px;
            font-weight: 700;
            letter-spacing: 3px;
            color: #4f46e5;
            margin: 10px 0;
        }
        .note {
            font-size: 14px;
            color: #6b7280;
            margin-top: 25px;
            text-align: center;
        }
        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #9ca3af;
            text-align: center;
        }
        .divider {
            height: 1px;
            background-color: #e5e7eb;
            margin: 25px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img class="logo" src="https://thumbs.dreamstime.com/b/black-school-icon-shadow-logo-design-white-157312165.jpg" alt="ByteLearn Logo">
            <span class="brand">ByteLearn</span>
        </div>
        
        <h1>Password Reset Request</h1>
        <p>We received a request to reset your ByteLearn account password. Use the following verification code:</p>
        
        <div class="otp-container">
            <div style="font-size: 14px; color: #6b7280;">Your verification code</div>
            <div class="otp">${code}</div>
            <div style="font-size: 13px; color: #6b7280;">Valid for 5 minutes</div>
        </div>
        
        <p>If you didn't request this code, you can safely ignore this email.</p>
        
        <div class="divider"></div>
        
        <div class="note">
            For security reasons, please don't share this code with anyone.
        </div>
        
        <div class="footer">
            © ${new Date().getFullYear()} ByteLearn. All rights reserved.<br>
            Need help? Contact our support team at support@bytelearn.com
        </div>
    </div>
</body>
</html>`
}