"use client";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useId, useRef, useState } from "react";
import { BsCloudCheck } from "react-icons/bs";
import { LuLoaderCircle } from "react-icons/lu";
import { updateEmailNotifications } from "@/actions";
import CustomCheckbox from "../ui/checkbox";

const autosaveInterval = 200;
const iconWaitDelay = 1000;

function AutosaveIndicator({ status }: { status: "" | "saving" | "saved" }) {
  if (status === "saving") {
    return (
      <LuLoaderCircle className="inline animate-spin text-w11" size={16} />
    );
  }

  if (status === "saved") {
    return <BsCloudCheck className="inline text-w11" size={16} />;
  }

  return null;
}

export default function EditNotification() {
  const { data: session, update: updateSession } = useSession();
  if (!session) redirect("/login");

  const emailId = useId();

  const values = useRef({
    current: session.user.email_notifications,
    lastCached: session.user.email_notifications
  });
  const autosaver = useRef<NodeJS.Timeout | null>(null);
  const idler = useRef<NodeJS.Timeout | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<"" | "saving" | "saved">("");

  const attemptAutosave = async () => {
    if (isSaving) {
      if (autosaver.current) {
        clearTimeout(autosaver.current);
        autosaver.current = null;
      }
      return;
    }

    // the user changed the value since we last cached it
    // so just cache it again and try again later
    if (values.current.lastCached !== values.current.current) {
      values.current.lastCached = values.current.current;
      if (autosaver.current) clearTimeout(autosaver.current);
      autosaver.current = setTimeout(attemptAutosave, autosaveInterval);
      return;
    }

    setIsSaving(true);
    await updateEmailNotifications(values.current.current);
    await updateSession();
    setIsSaving(false);
    setStatus("saved");

    idler.current = setTimeout(() => {
      setStatus("");
    }, iconWaitDelay);
  };

  const handleCheckedChange = (checked: boolean) => {
    values.current.current = checked;

    // we are already attempting to autosave, so
    // just reset the interval, since user made a change
    if (autosaver.current) {
      clearTimeout(autosaver.current);
    } else {
      // first time change, update the last saved value
      values.current.lastCached = checked;
    }

    autosaver.current = setTimeout(attemptAutosave, autosaveInterval);

    setStatus("saving");
    if (idler.current) {
      clearTimeout(idler.current);
      idler.current = null;
    }
  };

  return (
    <div className="mt-12">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-medium">Notifications</h2>
        <AutosaveIndicator status={status} />
      </div>
      <label
        htmlFor={emailId}
        className="select-none flex items-center gap-2 mt-4"
      >
        <CustomCheckbox
          id={emailId}
          name="email"
          onCheckedChange={handleCheckedChange}
          defaultChecked={session.user.email_notifications}
        />
        <span className="text-lg">receive email chore reminders</span>
      </label>
    </div>
  );
}
