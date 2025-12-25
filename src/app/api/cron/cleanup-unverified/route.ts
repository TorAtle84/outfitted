import { createClient } from '@supabase/supabase-js'
import { sendEmail, emailTemplates } from '@/lib/email'
import { NextResponse } from 'next/server'

// This endpoint should be called by a cron job every hour
// It checks for unverified users and sends reminders or deletes accounts

const REMINDER_HOURS = [12, 6, 3, 1] // Hours before deletion to send reminders
const DELETION_HOURS = 24 // Delete after 24 hours

export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Need service role key for admin operations
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json(
      { error: 'Missing Supabase configuration' },
      { status: 500 }
    )
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  try {
    // Get all unverified users
    const { data: { users }, error } = await supabase.auth.admin.listUsers()

    if (error) {
      console.error('Error listing users:', error)
      return NextResponse.json({ error: 'Failed to list users' }, { status: 500 })
    }

    const now = new Date()
    const results = {
      reminders_sent: 0,
      accounts_deleted: 0,
      errors: [] as string[],
    }

    for (const user of users) {
      // Skip verified users
      if (user.email_confirmed_at) continue

      const createdAt = new Date(user.created_at)
      const hoursElapsed = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60)
      const hoursLeft = DELETION_HOURS - hoursElapsed

      // Delete if past 24 hours
      if (hoursLeft <= 0) {
        try {
          // Send deletion notification
          if (user.email) {
            const template = emailTemplates.accountDeleted(user.email)
            await sendEmail({
              to: user.email,
              subject: template.subject,
              html: template.html,
            })
          }

          // Delete the user
          const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id)

          if (deleteError) {
            results.errors.push(`Failed to delete ${user.email}: ${deleteError.message}`)
          } else {
            results.accounts_deleted++
            console.log(`Deleted unverified account: ${user.email}`)
          }
        } catch (err) {
          results.errors.push(`Error processing deletion for ${user.email}: ${err}`)
        }
        continue
      }

      // Check if we should send a reminder
      for (const reminderHour of REMINDER_HOURS) {
        // Send reminder if we're within the reminder window (±30 minutes)
        const reminderWindow = Math.abs(hoursLeft - reminderHour)
        if (reminderWindow <= 0.5) {
          try {
            // Generate a new verification link
            const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
              type: 'signup',
              email: user.email!,
              options: {
                redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
              },
            })

            if (linkError || !linkData) {
              results.errors.push(`Failed to generate link for ${user.email}`)
              continue
            }

            const template = emailTemplates.verificationReminder(
              user.email!,
              Math.round(hoursLeft),
              linkData.properties.action_link
            )

            await sendEmail({
              to: user.email!,
              subject: template.subject,
              html: template.html,
            })

            results.reminders_sent++
            console.log(`Sent ${reminderHour}h reminder to: ${user.email}`)
          } catch (err) {
            results.errors.push(`Error sending reminder to ${user.email}: ${err}`)
          }
          break // Only send one reminder per user per cron run
        }
      }
    }

    return NextResponse.json({
      success: true,
      ...results,
      timestamp: now.toISOString(),
    })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
