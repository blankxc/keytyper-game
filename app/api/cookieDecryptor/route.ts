import { NextRequest, NextResponse } from "next/server";
import crypto from 'crypto';
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || '';

export async function GET(req: NextRequest) {
    // const cookies = req.headers.get('cookie') || '';
    // const sessionToken = cookies
    // .split(':')
    // .find((cookie: string) => cookie.trim().startsWith('sessionToken'))
    // ?.split('=')[1]

    const sessionToken = req.cookies.get("sessionToken")?.value


    if (!sessionToken) {
        return NextResponse.json(
            {message: 'session token not found'},
            {status: 400}
        )
    }

    const decodedToken = decodeURIComponent(sessionToken)
    const [ivHex, encryptedTextHex, tagHex] = decodedToken.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedText = Buffer.from(encryptedTextHex, 'hex');
    const authTag = Buffer.from(tagHex, 'hex')

    const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        Buffer.from(ENCRYPTION_KEY, 'utf-8'),
        iv
    )

    decipher.setAuthTag(authTag)
    let decrypted = decipher.update(encryptedText)
    decrypted = Buffer.concat([decrypted, decipher.final()])
    const token = decrypted.toString('utf-8')

    return NextResponse.json({ token }, {status: 200})
}