// Image moderation using Sightengine API
// Sign up at https://sightengine.com for free API keys (500 checks/month free)

interface ModerationResult {
  safe: boolean
  reason?: string
  scores?: {
    nudity: number
    weapon: number
    alcohol: number
    drugs: number
    offensive: number
  }
}

export async function checkImageModeration(imageUrl: string): Promise<ModerationResult> {
  const apiUser = process.env.SIGHTENGINE_API_USER
  const apiSecret = process.env.SIGHTENGINE_API_SECRET

  // If no API keys, skip moderation (development mode)
  if (!apiUser || !apiSecret) {
    console.warn('Sightengine API keys not configured - skipping moderation')
    return { safe: true }
  }

  try {
    const params = new URLSearchParams({
      url: imageUrl,
      models: 'nudity-2.1,weapon,alcohol,recreational_drug,offensive',
      api_user: apiUser,
      api_secret: apiSecret,
    })

    const response = await fetch(
      `https://api.sightengine.com/1.0/check.json?${params.toString()}`
    )

    if (!response.ok) {
      console.error('Moderation API error:', response.status)
      // Fail open in case of API error (or fail closed if you prefer)
      return { safe: true }
    }

    const data = await response.json()

    // Check for inappropriate content
    const scores = {
      nudity: data.nudity?.sexual_activity || 0 + data.nudity?.sexual_display || 0 + data.nudity?.erotica || 0,
      weapon: data.weapon || 0,
      alcohol: data.alcohol || 0,
      drugs: data.recreational_drug || 0,
      offensive: data.offensive?.prob || 0,
    }

    // Thresholds - adjust as needed
    const NUDITY_THRESHOLD = 0.5
    const WEAPON_THRESHOLD = 0.8
    const OFFENSIVE_THRESHOLD = 0.7

    if (scores.nudity > NUDITY_THRESHOLD) {
      return {
        safe: false,
        reason: 'Bildet inneholder upassende innhold og kan ikke lastes opp.',
        scores,
      }
    }

    if (scores.weapon > WEAPON_THRESHOLD) {
      return {
        safe: false,
        reason: 'Bildet inneholder upassende innhold (våpen) og kan ikke lastes opp.',
        scores,
      }
    }

    if (scores.offensive > OFFENSIVE_THRESHOLD) {
      return {
        safe: false,
        reason: 'Bildet inneholder støtende innhold og kan ikke lastes opp.',
        scores,
      }
    }

    return { safe: true, scores }
  } catch (error) {
    console.error('Moderation check failed:', error)
    // Fail open - allow upload if moderation service fails
    return { safe: true }
  }
}

// For base64 images (from camera/file upload)
export async function checkImageModerationBase64(base64Image: string): Promise<ModerationResult> {
  const apiUser = process.env.SIGHTENGINE_API_USER
  const apiSecret = process.env.SIGHTENGINE_API_SECRET

  if (!apiUser || !apiSecret) {
    console.warn('Sightengine API keys not configured - skipping moderation')
    return { safe: true }
  }

  try {
    // Remove data URL prefix if present
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '')

    const formData = new FormData()
    formData.append('media', base64Data)
    formData.append('models', 'nudity-2.1,weapon,alcohol,recreational_drug,offensive')
    formData.append('api_user', apiUser)
    formData.append('api_secret', apiSecret)

    const response = await fetch('https://api.sightengine.com/1.0/check.json', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      console.error('Moderation API error:', response.status)
      return { safe: true }
    }

    const data = await response.json()

    const scores = {
      nudity: (data.nudity?.sexual_activity || 0) + (data.nudity?.sexual_display || 0) + (data.nudity?.erotica || 0),
      weapon: data.weapon || 0,
      alcohol: data.alcohol || 0,
      drugs: data.recreational_drug || 0,
      offensive: data.offensive?.prob || 0,
    }

    const NUDITY_THRESHOLD = 0.5

    if (scores.nudity > NUDITY_THRESHOLD) {
      return {
        safe: false,
        reason: 'Bildet inneholder upassende innhold og kan ikke lastes opp.',
        scores,
      }
    }

    return { safe: true, scores }
  } catch (error) {
    console.error('Moderation check failed:', error)
    return { safe: true }
  }
}
