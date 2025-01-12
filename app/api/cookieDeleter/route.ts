import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json(
    { message: 'Cookie cleared' },
    { status: 200 }
  );

  response.cookies.set('sessionToken', '', {
    path: '/',
    expires: new Date(0), 
    httpOnly: true,
    secure: true,
  });

  return response;
}
