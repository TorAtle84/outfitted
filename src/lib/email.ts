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
    subject: 'Velkommen til Outfitted!',
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #FAF9F7; padding: 40px; border-radius: 12px;">
        <h1 style="color: #4A4A4A; margin-bottom: 24px;">Velkommen til Outfitted, ${name}!</h1>
        <p style="color: #6B6B6B; font-size: 16px; line-height: 1.6;">
          Vi er glade for å ha deg med! Med Outfitted kan du:
        </p>
        <ul style="color: #6B6B6B; font-size: 16px; line-height: 1.8;">
          <li>Organisere garderoben din digitalt</li>
          <li>Få AI-drevne antrekksforslag</li>
          <li>Planlegge antrekk for reiser</li>
          <li>Dele og få tilbakemelding fra venner</li>
        </ul>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/home"
           style="display: inline-block; background: #D4A5A5; color: white; padding: 14px 28px;
                  border-radius: 8px; text-decoration: none; margin-top: 20px; font-weight: 500;">
          Kom i gang
        </a>
        <p style="color: #9B9B9B; font-size: 14px; margin-top: 32px;">
          Med vennlig hilsen,<br>Outfitted-teamet
        </p>
      </div>
    `,
  }),

  passwordReset: (resetLink: string) => ({
    subject: 'Tilbakestill passordet ditt - Outfitted',
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #FAF9F7; padding: 40px; border-radius: 12px;">
        <h1 style="color: #4A4A4A; margin-bottom: 24px;">Tilbakestill passord</h1>
        <p style="color: #6B6B6B; font-size: 16px; line-height: 1.6;">
          Du har bedt om å tilbakestille passordet ditt. Klikk på knappen under for å velge et nytt passord.
        </p>
        <a href="${resetLink}"
           style="display: inline-block; background: #D4A5A5; color: white; padding: 14px 28px;
                  border-radius: 8px; text-decoration: none; margin-top: 20px; font-weight: 500;">
          Tilbakestill passord
        </a>
        <p style="color: #9B9B9B; font-size: 14px; margin-top: 32px;">
          Hvis du ikke ba om dette, kan du ignorere denne e-posten.
        </p>
        <p style="color: #9B9B9B; font-size: 14px;">
          Lenken utløper om 1 time.
        </p>
      </div>
    `,
  }),

  dailyOutfitSuggestion: (name: string, weather: string, suggestion: string) => ({
    subject: `God morgen, ${name}! Her er dagens antrekksforslag`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #FAF9F7; padding: 40px; border-radius: 12px;">
        <h1 style="color: #4A4A4A; margin-bottom: 24px;">God morgen, ${name}!</h1>
        <p style="color: #6B6B6B; font-size: 16px; line-height: 1.6;">
          <strong>Været i dag:</strong> ${weather}
        </p>
        <div style="background: white; padding: 24px; border-radius: 8px; margin: 20px 0; border: 1px solid #E8E4E0;">
          <h3 style="color: #4A4A4A; margin-top: 0;">Dagens antrekksforslag</h3>
          <p style="color: #6B6B6B; font-size: 16px; line-height: 1.6;">${suggestion}</p>
        </div>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/home"
           style="display: inline-block; background: #D4A5A5; color: white; padding: 14px 28px;
                  border-radius: 8px; text-decoration: none; font-weight: 500;">
          Se alle antrekk
        </a>
      </div>
    `,
  }),

  tripReminder: (name: string, destination: string, startDate: string) => ({
    subject: `Påminnelse: Reisen til ${destination} starter i morgen!`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #FAF9F7; padding: 40px; border-radius: 12px;">
        <h1 style="color: #4A4A4A; margin-bottom: 24px;">Klar for reisen, ${name}?</h1>
        <p style="color: #6B6B6B; font-size: 16px; line-height: 1.6;">
          Reisen din til <strong>${destination}</strong> starter i morgen (${startDate}).
        </p>
        <p style="color: #6B6B6B; font-size: 16px; line-height: 1.6;">
          Sjekk at du har planlagt alle antrekkene dine!
        </p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/trip"
           style="display: inline-block; background: #D4A5A5; color: white; padding: 14px 28px;
                  border-radius: 8px; text-decoration: none; margin-top: 20px; font-weight: 500;">
          Se reiseplan
        </a>
      </div>
    `,
  }),

  newFollower: (name: string, followerName: string) => ({
    subject: `${followerName} følger deg nå på Outfitted`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #FAF9F7; padding: 40px; border-radius: 12px;">
        <h1 style="color: #4A4A4A; margin-bottom: 24px;">Ny følger!</h1>
        <p style="color: #6B6B6B; font-size: 16px; line-height: 1.6;">
          Hei ${name}, <strong>${followerName}</strong> følger deg nå på Outfitted!
        </p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/feed"
           style="display: inline-block; background: #D4A5A5; color: white; padding: 14px 28px;
                  border-radius: 8px; text-decoration: none; margin-top: 20px; font-weight: 500;">
          Se profilen
        </a>
      </div>
    `,
  }),

  newComment: (name: string, commenterName: string, comment: string) => ({
    subject: `${commenterName} kommenterte på antrekket ditt`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #FAF9F7; padding: 40px; border-radius: 12px;">
        <h1 style="color: #4A4A4A; margin-bottom: 24px;">Ny kommentar!</h1>
        <p style="color: #6B6B6B; font-size: 16px; line-height: 1.6;">
          Hei ${name}, <strong>${commenterName}</strong> kommenterte på antrekket ditt:
        </p>
        <div style="background: white; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #D4A5A5;">
          <p style="color: #6B6B6B; font-style: italic; margin: 0;">"${comment}"</p>
        </div>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/feed"
           style="display: inline-block; background: #D4A5A5; color: white; padding: 14px 28px;
                  border-radius: 8px; text-decoration: none; font-weight: 500;">
          Se innlegget
        </a>
      </div>
    `,
  }),

  newRating: (name: string, stars: number) => ({
    subject: `Noen ga antrekket ditt ${stars} stjerner!`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #FAF9F7; padding: 40px; border-radius: 12px;">
        <h1 style="color: #4A4A4A; margin-bottom: 24px;">Ny vurdering!</h1>
        <p style="color: #6B6B6B; font-size: 16px; line-height: 1.6;">
          Hei ${name}, noen vurderte antrekket ditt:
        </p>
        <p style="font-size: 32px; margin: 20px 0;">
          ${'★'.repeat(stars)}${'☆'.repeat(5 - stars)}
        </p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/feed"
           style="display: inline-block; background: #D4A5A5; color: white; padding: 14px 28px;
                  border-radius: 8px; text-decoration: none; font-weight: 500;">
          Se innlegget
        </a>
      </div>
    `,
  }),
}
