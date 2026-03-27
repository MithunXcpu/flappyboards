import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL(`/display?spotify_error=${error}`, request.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/display?spotify_error=no_code", request.url)
    );
  }

  // Redirect back to display with the code — token exchange happens client-side via PKCE
  return NextResponse.redirect(
    new URL(`/display?spotify_code=${code}`, request.url)
  );
}
