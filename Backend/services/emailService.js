// Email service for sending emails
// This is a mock implementation. In production, integrate with SendGrid, AWS SES, etc.

// Send verification email
const sendVerificationEmail = async (email, token) => {
  try {
    // Mock email sending
    // In production, this would use actual email service
    console.log(`[EMAIL] Verification email sent to ${email}`);
    console.log(`[EMAIL] Verification link: ${process.env.FRONTEND_URL}/verify-email?token=${token}`);

    return {
      success: true,
      message: 'Verification email sent'
    };
  } catch (error) {
    console.error('Send verification email error:', error);
    return {
      success: false,
      error: 'Failed to send verification email'
    };
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, token) => {
  try {
    // Mock email sending
    console.log(`[EMAIL] Password reset email sent to ${email}`);
    console.log(`[EMAIL] Reset link: ${process.env.FRONTEND_URL}/reset-password?token=${token}`);

    return {
      success: true,
      message: 'Password reset email sent'
    };
  } catch (error) {
    console.error('Send password reset email error:', error);
    return {
      success: false,
      error: 'Failed to send password reset email'
    };
  }
};

// Send order confirmation email
const sendOrderConfirmation = async (email, orderDetails) => {
  try {
    // Mock email sending
    console.log(`[EMAIL] Order confirmation sent to ${email}`);
    console.log(`[EMAIL] Order number: ${orderDetails.orderNumber}`);
    console.log(`[EMAIL] Order total: $${orderDetails.orderTotal}`);

    return {
      success: true,
      message: 'Order confirmation email sent'
    };
  } catch (error) {
    console.error('Send order confirmation error:', error);
    return {
      success: false,
      error: 'Failed to send order confirmation email'
    };
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendOrderConfirmation
};
