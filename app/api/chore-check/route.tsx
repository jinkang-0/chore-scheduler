import { getChoresDueToday } from "@/api/db";
import { sendEmail } from "@/api/messaging/email";
import ReminderEmail from "@/components/emails/reminder";
import { ChoreMinimal } from "@/types/types";
import { render } from "@react-email/components";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // verify secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`)
    return new Response("Unauthorized", { status: 401 });

  const dueChores = await getChoresDueToday();

  const assigned: Record<string, ChoreMinimal[]> = dueChores.reduce(
    (prev, curr) => {
      const chore: ChoreMinimal = {
        id: curr.id,
        title: curr.title,
        emoji: curr.emoji,
        due_date: curr.due_date
      };

      const assignedTo = curr.queue[curr.passIndex % curr.queue.length];
      if (!prev[assignedTo]) {
        prev[assignedTo] = [];
      }
      prev[assignedTo].push(chore);

      return prev;
    },
    {} as Record<string, ChoreMinimal[]>
  );

  const emails = await Promise.all(
    Object.entries(assigned).map(async ([userEmail, chores]) => ({
      to: userEmail,
      subject: "Chore reminder",
      html: await render(<ReminderEmail chores={chores} />)
    }))
  );

  await Promise.all(emails.map((email) => sendEmail(email)));

  return new Response(`Successfully sent ${emails.length} emails`);
}
