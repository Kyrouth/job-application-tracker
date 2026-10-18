import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/auth/auth";


export default async function Proxy(request: NextRequest) {

    const session = await getSession();


    const isSignInPage = request.nextUrl.pathname.startsWith("/account/sign-in");
    const isSignUpPage = request.nextUrl.pathname.startsWith("/account/sign-up");

    if((isSignInPage || isSignUpPage) && session?.user)
        return NextResponse.redirect(new URL("/dashboard", request.url));

    return NextResponse.next();
}