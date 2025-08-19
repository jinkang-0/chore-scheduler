import ReminderEmail from "@/components/emails/reminder";
import { render } from "@react-email/components";
import { notFound } from "next/navigation";

export default async function EmailPreviewPage() {
  // this page is used to preview emails during development
  // it is not used in production
  if (process.env.NODE_ENV !== "development") return notFound();

  const emailHtml = await render(
    <ReminderEmail
      chores={[
        { id: "123", emoji: "🚽", title: "Clean boys' bathroom" },
        {
          id: "345",
          emoji: "🧹",
          title: "Sweep the floor and then swiffer it after"
        }
      ]}
    />
  );

  return (
    <main className="w-full h-svh grid place-items-center bg-white text-black">
      <div dangerouslySetInnerHTML={{ __html: emailHtml }} />
    </main>
  );
}
