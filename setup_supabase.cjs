const fs = require('fs');
const path = require('path');

// 1. Client
const clientCode = import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
;
fs.writeFileSync('src/utils/supabase/client.ts', clientCode, 'utf8');

// 2. Server
const serverCode = import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch (error) {
            // The \setAll\ method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
;
fs.writeFileSync('src/utils/supabase/server.ts', serverCode, 'utf8');

// 3. Middleware utility
const middlewareUtilCode = import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (
    !user &&
    request.nextUrl.pathname.startsWith('/admin')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
;
fs.writeFileSync('src/utils/supabase/middleware.ts', middlewareUtilCode, 'utf8');

// 4. Root Middleware
const middlewareCode = import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
;
fs.writeFileSync('src/middleware.ts', middlewareCode, 'utf8');

// 5. WhatsApp Util
const waCode = export function buildWhatsAppOfferLink(options: {
  pharmacyPhone: string;
  productName: string;
  price: number;
  quantity?: number;
}) {
  const { pharmacyPhone, productName, price, quantity = 1 } = options;
  const cleanPhone = pharmacyPhone.replace(/\D/g, '');

  const text = encodeURIComponent(
    \???? ?????? ????? ???? ????? ??:\n\ +
    \?? ??????: \\n\ +
    \?? ??????: \\n\ +
    \?? ????????: \ ?.?\n\n\ +
    \???? ????? ???????!\
  );

  return \https://wa.me/\?text=\\;
}
;
fs.writeFileSync('src/utils/whatsapp.ts', waCode, 'utf8');

console.log('Supabase utilities setup complete');
