import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { BaseUser } from "@repo/types";

export async function POST(request: Request) {
  const {
    participants,
    user,
    time,
  }: {
    participants: BaseUser[];
    user: { fullName: string | null | undefined; email: string | undefined };
    time: string;
  } = await request.json();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NEXT_PUBLIC_AUTH_EMAIL,
      pass: process.env.NEXT_PUBLIC_AUTH_PW,
    },
  });

  try {
    for (const participant of participants) {
      let meetingLink = `${process.env.NEXT_PUBLIC_LANDING_URL}/dashboard/interviewer/${participant.id}`;
      const info = await transporter.sendMail({
        from: `${user.fullName} <${user.email}>`,
        to: `${participant.email}`,
        subject: "Interview Scheduled",
        text: `Hey ${participant.name}, you are scheduled for an interview with ${user.fullName} on ${new Date(time)}. Please join the meeting at schedule Date and Time from the following link: [${meetingLink}]`,
      });

      console.log("Message sent: %s", info.messageId);
    }

    return NextResponse.json({ message: "Emails sent successfully!" });
  } catch (error) {
    console.error("Error sending email", error);
    return NextResponse.json(
      { error: "Failed to send emails" },
      { status: 500 }
    );
  }
}
