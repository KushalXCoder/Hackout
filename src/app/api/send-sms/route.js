import { NextResponse } from "next/server";
import twilio from "twilio";

export async function POST(req) {
  try {
    const { to, message } = await req.json();

    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const sms = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });

    return NextResponse.json({ success: true, sid: sms.sid });
  } catch (error) {
    console.error("SMS Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
