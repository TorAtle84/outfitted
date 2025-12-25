import { createClient } from '@/lib/supabase/server'
import { checkImageModeration, checkImageModerationBase64 } from '@/lib/moderation'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  // Verify user is authenticated
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { imageUrl, base64Image } = await request.json()

    if (!imageUrl && !base64Image) {
      return NextResponse.json(
        { error: 'Enten imageUrl eller base64Image må oppgis' },
        { status: 400 }
      )
    }

    let result

    if (imageUrl) {
      result = await checkImageModeration(imageUrl)
    } else {
      result = await checkImageModerationBase64(base64Image)
    }

    if (!result.safe) {
      return NextResponse.json(
        {
          safe: false,
          error: result.reason || 'Bildet inneholder upassende innhold.',
        },
        { status: 400 }
      )
    }

    return NextResponse.json({ safe: true })
  } catch (error) {
    console.error('Moderation check error:', error)
    return NextResponse.json(
      { error: 'Kunne ikke sjekke bildet' },
      { status: 500 }
    )
  }
}
