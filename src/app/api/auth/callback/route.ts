import { createClient } from "@/lib/supabase";
import { NextRequest, NextResponse  } from "next/server";
import { createSessionCookie } from '@/lib/server-actions/auth-actions'

export async function GET(req: NextRequest) {
    const requestUrl = new URL(req.url)
    const code = requestUrl.searchParams.get('code')

    if (code) {
        const supabase = createClient()
        await supabase.auth.exchangeCodeForSession(code)

         // Create the session cookie
        await createSessionCookie();
    }
    return NextResponse.redirect(`${requestUrl.origin}/home`)
}