import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const sessionToken = request.cookies.get("session")?.value;

    const redirectResponse = NextResponse.redirect(
        new URL("/auth", request.url)
    );

    if (!sessionToken) {
        return redirectResponse;
    }

    const sessionIsValid = await fetch(
        new URL("/api/auth/validate-session", request.url),
        {
            method: "POST",
            body: sessionToken,
        }
    ).then((res) => res.json());

    if (!sessionIsValid) {
        redirectResponse.cookies.delete("session");

        return redirectResponse;
    }

    return NextResponse.next();
}

export const config = {
    matcher:
        "/((?!auth|api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
};
