import { AddToCalendar, CalendarEvent } from "@/lib/add-to-calendar";
import { useMemo } from "react";
import { GoogleCalendarIcon } from "./icons";

export function AddToCalendarButton(props: {
  event: CalendarEvent;
  className?: string;
}) {
  const eventUrl = useMemo(() => {
    return new AddToCalendar().createGoogleUrl(props.event);
  }, [props.event]);

  return <a data-test-id="create-reminder-btn" href={eventUrl} target={"_blank"} className="btn btn-sm space-x-1">
     <GoogleCalendarIcon className="h-4 w-4" />
     <span>Create reminder</span>
  </a>;
}
