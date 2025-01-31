import {
    intervalToDuration,
    addDays,
    formatDuration,
    addHours,
    isAfter,
} from "date-fns";
import { AddToCalendarButton } from "../add-to-calendar";

interface CountdownProps {
    startTimestamp: number | undefined;
    daysToAdd: number;
}

function calculateTimeRemaining(
    timestamp: number,
    daysToAdd: number
): string | null {
    const endDate = addDays(timestamp, daysToAdd);
    const now = Date.now();
    const hasExpired = isAfter(now, endDate);
    
    if (hasExpired) {
        return null; 
    }

    const duration = intervalToDuration({ start: now, end: endDate });

    return formatDuration(
        { days: duration.days, hours: duration.hours }, 
        { delimiter: ", " } 
    );
}

export function Countdown({ startTimestamp, daysToAdd }: CountdownProps) {
    if (!startTimestamp) return null;

    const timeRemaining = calculateTimeRemaining(startTimestamp, daysToAdd);

    return (
        <div className="text-sm font-semibold text-gray-600 flex space-x-2 items-center">
            {timeRemaining ? (
                <p>{timeRemaining} remaining</p>
            ) : (
                <p className="text-green-500">Time to claim!</p>
            )}

            <AddToCalendarButton
                event={{
                    title: "Claim your transaction",
                    description:
                        "Wait is over, you can now claim your transaction",
                    startDate: addHours(startTimestamp, daysToAdd * 24),
                    endDate: addHours(startTimestamp, (daysToAdd * 24) + 1),
                }}
            />
        </div>
    );
}
