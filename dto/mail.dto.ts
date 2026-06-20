const resetPasswordTemplate = (name: string, resetLink: string) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #2563eb; padding: 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Sahani Paints</h1>
      </div>
      <div style="padding: 30px; color: #333333; line-height: 1.6;">
        <h2 style="margin-top: 0;">Password Reset Request</h2>
        <p>Hello ${name},</p>
        <p>We received a request to reset the password for your account. Click the button below to choose a new one:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" 
             style="background-color: #2563eb; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Reset My Password
          </a>
        </div>
        
        <p style="font-size: 14px; color: #666666;">
          If you didn't request this, you can safely ignore this email. This link will expire in 1 hour.
        </p>
        <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;">
        <p style="font-size: 12px; color: #999999; text-align: center;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${resetLink}" style="color: #2563eb;">${resetLink}</a>
        </p>
      </div>
    </div>
  `;
};

export { resetPasswordTemplate };
