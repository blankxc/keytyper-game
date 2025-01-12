import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({
    status: 200,
    headers: {
      'Set-Cookie': 'sessionToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure',
    },
  });
}
