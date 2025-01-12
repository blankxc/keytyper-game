import { NextResponse } from "next/server";
import crypto from 'crypto'

const SESSION_TOKENS: Record<string, string> = {};

export async function POST(request: Request) {
    const body = await request.json();
    const userId = body.userId;

    if (!userId) {
        return NextResponse.json(
            {success: false, message: 'userId not found'},
            {status: 400}
        )
    }

    const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || '';
    const IV_LENGTH = 12;

    const iv = crypto.randomBytes(IV_LENGTH)
    const cipher = crypto.createCipheriv(
        'aes-256-gcm',
        Buffer.from(ENCRYPTION_KEY, 'utf-8'),
        iv
    );

    let encrypted = cipher.update(userId.toString(), 'utf-8', 'hex');
    encrypted += cipher.final('hex')

    const authTag = cipher.getAuthTag().toString('hex');
    const sessionToken = iv.toString('hex') + ':' + encrypted + ':' + authTag
    SESSION_TOKENS[sessionToken] = userId;
    
    const response = NextResponse.json({success: true})
    response.cookies.set('sessionToken', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 30
    })

    return response
}