import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    await transporter.sendMail({
      from: `"Outfitted" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    })
    return { success: true }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error }
  }
}

// Email templates
export const emailTemplates = {
  welcome: (name: string) => ({
    subject: 'Welcome to Outfitted!',
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #FAF9F7; padding: 40px; border-radius: 12px;">
        <h1 style="color: #4A4A4A; margin-bottom: 24px;">Welcome to Outfitted, ${name}!</h1>
        <p style="color: #6B6B6B; font-size: 16px; line-height: 1.6;">
          We're excited to have you! With Outfitted you can:
        </p>
        <ul style="color: #6B6B6B; font-size: 16px; line-height: 1.8;">
          <li>Organize your wardrobe digitally</li>
          <li>Get AI-powered outfit suggestions</li>
          <li>Plan outfits for trips</li>
          <li>Share and get feedback from friends</li>
        </ul>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/home"
           style="display: inline-block; background: #D4A5A5; color: white; padding: 14px 28px;
                  border-radius: 8px; text-decoration: none; margin-top: 20px; font-weight: 500;">
          Get started
        </a>
        <p style="color: #9B9B9B; font-size: 14px; margin-top: 32px;">
          Best regards,<br>The Outfitted team
        </p>
      </div>
    `,
  }),

  passwordReset: (resetLink: string) => ({
    subject: 'Reset your password - Outfitted',
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #FAF9F7; padding: 40px; border-radius: 12px;">
        <h1 style="color: #4A4A4A; margin-bottom: 24px;">Reset password</h1>
        <p style="color: #6B6B6B; font-size: 16px; line-height: 1.6;">
          You have requested to reset your password. Click the button below to choose a new password.
        </p>
        <a href="${resetLink}"
           style="display: inline-block; background: #D4A5A5; color: white; padding: 14px 28px;
                  border-radius: 8px; text-decoration: none; margin-top: 20px; font-weight: 500;">
          Reset password
        </a>
        <p style="color: #9B9B9B; font-size: 14px; margin-top: 32px;">
          If you did not request this, you can ignore this email.
        </p>
        <p style="color: #9B9B9B; font-size: 14px;">
          The link expires in 1 hour.
        </p>
      </div>
    `,
  }),

  dailyOutfitSuggestion: (name: string, weather: string, suggestion: string) => ({
    subject: `Good morning, ${name}! Here's your outfit suggestion for today`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #FAF9F7; padding: 40px; border-radius: 12px;">
        <h1 style="color: #4A4A4A; margin-bottom: 24px;">Good morning, ${name}!</h1>
        <p style="color: #6B6B6B; font-size: 16px; line-height: 1.6;">
          <strong>Today's weather:</strong> ${weather}
        </p>
        <div style="background: white; padding: 24px; border-radius: 8px; margin: 20px 0; border: 1px solid #E8E4E0;">
          <h3 style="color: #4A4A4A; margin-top: 0;">Today's outfit suggestion</h3>
          <p style="color: #6B6B6B; font-size: 16px; line-height: 1.6;">${suggestion}</p>
        </div>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/home"
           style="display: inline-block; background: #D4A5A5; color: white; padding: 14px 28px;
                  border-radius: 8px; text-decoration: none; font-weight: 500;">
          View all outfits
        </a>
      </div>
    `,
  }),

  tripReminder: (name: string, destination: string, startDate: string) => ({
    subject: `Reminder: Your trip to ${destination} starts tomorrow!`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #FAF9F7; padding: 40px; border-radius: 12px;">
        <h1 style="color: #4A4A4A; margin-bottom: 24px;">Ready for your trip, ${name}?</h1>
        <p style="color: #6B6B6B; font-size: 16px; line-height: 1.6;">
          Your trip to <strong>${destination}</strong> starts tomorrow (${startDate}).
        </p>
        <p style="color: #6B6B6B; font-size: 16px; line-height: 1.6;">
          Make sure you've planned all your outfits!
        </p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/trip"
           style="display: inline-block; background: #D4A5A5; color: white; padding: 14px 28px;
                  border-radius: 8px; text-decoration: none; margin-top: 20px; font-weight: 500;">
          View trip plan
        </a>
      </div>
    `,
  }),

  newFollower: (name: string, followerName: string) => ({
    subject: `${followerName} is now following you on Outfitted`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #FAF9F7; padding: 40px; border-radius: 12px;">
        <h1 style="color: #4A4A4A; margin-bottom: 24px;">New follower!</h1>
        <p style="color: #6B6B6B; font-size: 16px; line-height: 1.6;">
          Hi ${name}, <strong>${followerName}</strong> is now following you on Outfitted!
        </p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/feed"
           style="display: inline-block; background: #D4A5A5; color: white; padding: 14px 28px;
                  border-radius: 8px; text-decoration: none; margin-top: 20px; font-weight: 500;">
          View profile
        </a>
      </div>
    `,
  }),

  newComment: (name: string, commenterName: string, comment: string) => ({
    subject: `${commenterName} commented on your outfit`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #FAF9F7; padding: 40px; border-radius: 12px;">
        <h1 style="color: #4A4A4A; margin-bottom: 24px;">New comment!</h1>
        <p style="color: #6B6B6B; font-size: 16px; line-height: 1.6;">
          Hi ${name}, <strong>${commenterName}</strong> commented on your outfit:
        </p>
        <div style="background: white; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #D4A5A5;">
          <p style="color: #6B6B6B; font-style: italic; margin: 0;">"${comment}"</p>
        </div>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/feed"
           style="display: inline-block; background: #D4A5A5; color: white; padding: 14px 28px;
                  border-radius: 8px; text-decoration: none; font-weight: 500;">
          View post
        </a>
      </div>
    `,
  }),

  newRating: (name: string, stars: number) => ({
    subject: `Someone gave your outfit ${stars} stars!`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #FAF9F7; padding: 40px; border-radius: 12px;">
        <h1 style="color: #4A4A4A; margin-bottom: 24px;">New rating!</h1>
        <p style="color: #6B6B6B; font-size: 16px; line-height: 1.6;">
          Hi ${name}, someone rated your outfit:
        </p>
        <p style="font-size: 32px; margin: 20px 0;">
          ${'★'.repeat(stars)}${'☆'.repeat(5 - stars)}
        </p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/feed"
           style="display: inline-block; background: #D4A5A5; color: white; padding: 14px 28px;
                  border-radius: 8px; text-decoration: none; font-weight: 500;">
          View post
        </a>
      </div>
    `,
  }),

  verificationReminder: (email: string, hoursLeft: number, verificationLink: string) => ({
    subject: hoursLeft <= 1
      ? `⚠️ LAST CHANCE: Your account will be deleted in ${hoursLeft} hour!`
      : `⚠️ Verify your email - ${hoursLeft} hours left before account deletion`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #FAF9F7; padding: 40px; border-radius: 12px;">
        <div style="background: ${hoursLeft <= 3 ? '#DC2626' : '#F59E0B'}; color: white; padding: 16px; border-radius: 8px; margin-bottom: 24px; text-align: center;">
          <strong style="font-size: 18px;">
            ${hoursLeft <= 1 ? '⚠️ FINAL WARNING!' : '⏰ Important reminder'}
          </strong>
        </div>

        <h1 style="color: #4A4A4A; margin-bottom: 24px;">
          ${hoursLeft <= 1 ? 'Your account will be deleted soon!' : 'Verify your email'}
        </h1>

        <p style="color: #6B6B6B; font-size: 16px; line-height: 1.6;">
          Hi! You registered on Outfitted with the email address <strong>${email}</strong>,
          but you haven't verified your account yet.
        </p>

        <div style="background: ${hoursLeft <= 3 ? '#FEE2E2' : '#FEF3C7'}; border-left: 4px solid ${hoursLeft <= 3 ? '#DC2626' : '#F59E0B'}; padding: 16px; margin: 24px 0; border-radius: 0 8px 8px 0;">
          <p style="color: #4A4A4A; font-size: 16px; margin: 0; font-weight: 600;">
            ${hoursLeft <= 1
              ? `Your account and all data will be deleted in ${hoursLeft} hour!`
              : `You have ${hoursLeft} hours left to verify your email.`}
          </p>
          <p style="color: #6B6B6B; font-size: 14px; margin: 8px 0 0 0;">
            Unverified accounts are automatically deleted after 24 hours.
          </p>
        </div>

        <a href="${verificationLink}"
           style="display: inline-block; background: #D4A5A5; color: white; padding: 16px 32px;
                  border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; margin: 20px 0;">
          Verify my email now
        </a>

        <p style="color: #9B9B9B; font-size: 14px; margin-top: 32px;">
          If you didn't sign up for Outfitted, you can ignore this email.
        </p>
      </div>
    `,
  }),

  accountDeleted: (email: string) => ({
    subject: 'Your Outfitted account has been deleted',
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #FAF9F7; padding: 40px; border-radius: 12px;">
        <h1 style="color: #4A4A4A; margin-bottom: 24px;">Your account has been deleted</h1>

        <p style="color: #6B6B6B; font-size: 16px; line-height: 1.6;">
          The account associated with <strong>${email}</strong> has been deleted because the email address
          was not verified within 24 hours.
        </p>

        <p style="color: #6B6B6B; font-size: 16px; line-height: 1.6; margin-top: 20px;">
          You're welcome to sign up again anytime!
        </p>

        <a href="${process.env.NEXT_PUBLIC_APP_URL}/register"
           style="display: inline-block; background: #D4A5A5; color: white; padding: 14px 28px;
                  border-radius: 8px; text-decoration: none; margin-top: 20px; font-weight: 500;">
          Sign up again
        </a>
      </div>
    `,
  }),
}
