// "use client";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Flame } from "lucide-react";
// import { useMyStats } from "@/features/leaderboards/application/useLeaderboards";
// import { Skeleton } from "@/components/ui/skeleton";
// import { useAuth } from "@/features/auth/application/AuthContext";

// export function StreakCalendar() {
//   const { user } = useAuth();
//   const { data: stats, isLoading } = useMyStats(user?.uid || "");
//   console.log("Streak stats:", stats);

//   const getStreakMessage = (streak: number) => {
//     if (streak === 0) return "Start your streak!";
//     if (streak === 1) return "Great start!";
//     if (streak < 7) return "Keep it up!";
//     if (streak < 30) return "You're on fire! 🔥";
//     return "Unstoppable!";
//   };

//   const generateCalendarDays = () => {
//     const today = new Date();
//     const days = [];

//     // Generate last 52 weeks (365 days) - GitHub style
//     for (let i = 364; i >= 0; i--) {
//       const date = new Date();
//       date.setDate(date.getDate() - i);

//       // Reset time to start of day for comparison
//       const dayStart = new Date(
//         date.getFullYear(),
//         date.getMonth(),
//         date.getDate(),
//       );

//       // Calculate if this day is part of the active streak
//       let isActive = false;
//       if (stats?.streakStartDate && stats?.currentStreak > 0) {
//         const streakStartMs = (stats.streakStartDate as any)._seconds * 1000;
//         const streakStart = new Date(streakStartMs);
//         const streakStartDay = new Date(
//           streakStart.getFullYear(),
//           streakStart.getMonth(),
//           streakStart.getDate(),
//         );

//         const todayStart = new Date(
//           today.getFullYear(),
//           today.getMonth(),
//           today.getDate(),
//         );

//         // Day is active if it's between streak start and today
//         isActive = dayStart >= streakStartDay && dayStart <= todayStart;
//       }

//       days.push({
//         date,
//         isActive,
//         dayOfWeek: date.getDay(), // 0 = Sunday, 6 = Saturday
//       });
//     }

//     return days;
//   };

//   if (isLoading) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Flame className="h-5 w-5 text-orange-500" />
//             Daily Streak
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <Skeleton className="h-10 w-24 mb-2" />
//                 <Skeleton className="h-4 w-32" />
//               </div>
//               <div className="text-right">
//                 <Skeleton className="h-8 w-8 mb-2" />
//                 <Skeleton className="h-4 w-24" />
//               </div>
//             </div>
//             <div className="grid grid-cols-10 gap-1.5">
//               {Array.from({ length: 30 }).map((_, idx) => (
//                 <Skeleton key={idx} className="aspect-square rounded-sm" />
//               ))}
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   const currentStreak = stats?.currentStreak || 0;
//   const longestStreak = stats?.longestStreak || 0;
//   const totalXP = stats?.totalPoints || 0;
//   const days = generateCalendarDays();

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Flame className="h-5 w-5 text-orange-500" />
//           Daily Streak
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           {/* Streak Stats */}
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-3xl font-bold">
//                 {currentStreak} {currentStreak === 1 ? "day" : "days"}
//               </p>
//               <p className="text-sm text-muted-foreground">Current streak</p>
//             </div>
//             <div className="text-right">
//               <p className="text-2xl font-semibold text-orange-500">
//                 {currentStreak > 0 ? "🔥" : "💤"}
//               </p>
//               <p className="text-sm text-muted-foreground">
//                 {getStreakMessage(currentStreak)}
//               </p>
//             </div>
//           </div>

//           {/* Additional Stats */}
//           <div className="flex gap-4 text-sm">
//             <div className="flex-1">
//               <p className="text-muted-foreground">Longest</p>
//               <p className="font-semibold">{longestStreak} days</p>
//             </div>
//             <div className="flex-1">
//               <p className="text-muted-foreground">Total XP</p>
//               <p className="font-semibold">{totalXP.toLocaleString()}</p>
//             </div>
//           </div>

//           {/* Activity Calendar - GitHub Style */}
//           <div className="mt-6">
//             {/* Month labels */}
//             <div className="flex gap-2 ml-8 mb-2 text-xs text-muted-foreground">
//               {Array.from({ length: 12 }).map((_, monthIdx) => {
//                 const monthDate = new Date();
//                 monthDate.setMonth(monthDate.getMonth() - (11 - monthIdx));
//                 const monthName = monthDate.toLocaleDateString("en-US", {
//                   month: "short",
//                 });
//                 return (
//                   <div key={monthIdx} className="w-12 text-center">
//                     {monthName}
//                   </div>
//                 );
//               })}
//             </div>

//             {/* Calendar grid */}
//             <div className="overflow-x-auto">
//               <div className="inline-flex gap-2 pb-2">
//                 {/* Day labels */}
//                 <div className="flex flex-col gap-1 justify-between text-xs text-muted-foreground font-medium">
//                   <div className="h-5" />
//                   {/* Align with first row below month labels */}
//                   <div>Sun</div>
//                   <div className="h-1" />
//                   <div>Tue</div>
//                   <div className="h-1" />
//                   <div>Thu</div>
//                   <div className="h-1" />
//                   <div>Sat</div>
//                 </div>

//                 {/* Weeks grid */}
//                 <div className="flex gap-1">
//                   {Array.from({ length: 53 }).map((_, weekIndex) => (
//                     <div key={weekIndex} className="flex flex-col gap-1">
//                       {/* Days in week (Sun-Sat) */}
//                       {[0, 1, 2, 3, 4, 5, 6].map((dayOfWeek) => {
//                         const dayIndex = weekIndex * 7 + dayOfWeek;
//                         const day = days[dayIndex];

//                         if (!day) {
//                           return (
//                             <div
//                               key={`${weekIndex}-${dayOfWeek}`}
//                               className="w-4 h-4 rounded-sm bg-transparent"
//                             />
//                           );
//                         }

//                         const dateStr = day.date.toLocaleDateString("en-US", {
//                           month: "short",
//                           day: "numeric",
//                           year: "numeric",
//                         });

//                         return (
//                           <div
//                             key={`${weekIndex}-${dayOfWeek}`}
//                             className={`w-4 h-4 rounded-sm transition-all cursor-pointer ${
//                               day.isActive
//                                 ? "bg-orange-500 hover:ring-2 hover:ring-orange-600 ring-offset-1"
//                                 : "bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700"
//                             }`}
//                             title={`${dateStr}: ${day.isActive ? "Active 🔥" : "No activity"}`}
//                           />
//                         );
//                       })}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Legend */}
//           <div className="flex items-center justify-end gap-3 text-xs text-muted-foreground mt-4 pt-4 border-t">
//             <span>Contribution Activity</span>
//             <div className="flex items-center gap-1">
//               <div className="w-3 h-3 rounded-sm bg-zinc-200 dark:bg-zinc-800" />
//               <span>Less</span>
//             </div>
//             <div className="w-3 h-3 rounded-sm bg-orange-200 dark:bg-orange-900/30" />
//             <div className="w-3 h-3 rounded-sm bg-orange-300 dark:bg-orange-700" />
//             <div className="flex items-center gap-1">
//               <div className="w-3 h-3 rounded-sm bg-orange-500" />
//               <span>More</span>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame } from "lucide-react";
import { useMyStats } from "@/features/leaderboards/application/useLeaderboards";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/features/auth/application/AuthContext";

const DAYS = ["", "Mon", "", "Wed", "", "Fri", ""];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function getCellClass(
  isActive: boolean,
  isFuture: boolean,
  isToday: boolean,
): string {
  const base =
    "w-[11px] h-[11px] rounded-[2px] mb-[2px] cursor-pointer transition-opacity hover:opacity-70";
  const todayRing = isToday
    ? " outline outline-1 outline-orange-500 -outline-offset-1"
    : "";
  const opacity = isFuture ? " opacity-35" : "";
  const bg = isActive ? " bg-orange-500" : " bg-zinc-200 dark:bg-zinc-800";
  return `${base}${bg}${todayRing}${opacity}`;
}

const LEGEND_CELLS = [
  "bg-zinc-200 dark:bg-zinc-800",
  "bg-orange-200 dark:bg-orange-950",
  "bg-orange-300 dark:bg-orange-800",
  "bg-orange-400 dark:bg-orange-600",
  "bg-orange-500",
];

export function StreakCalendar() {
  const { user } = useAuth();
  const { data: stats, isLoading } = useMyStats(user?.uid || "");

  const getStreakMessage = (streak: number) => {
    if (streak === 0) return "Start your streak today";
    if (streak === 1) return "Great start!";
    if (streak < 7) return "Keep it up!";
    if (streak < 30) return "You're on fire!";
    return "Unstoppable!";
  };

  const generateCalendarData = () => {
    const today = new Date();
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    const currentDayOfWeek = todayStart.getDay();
    const startDate = new Date(todayStart);
    startDate.setDate(startDate.getDate() - currentDayOfWeek - 52 * 7);

    const totalDays = 52 * 7 + 7;

    let streakStartDay: Date | null = null;
    if (stats?.streakStartDate && stats?.currentStreak > 0) {
      const ms = (stats.streakStartDate as any)._seconds * 1000;
      const d = new Date(ms);
      streakStartDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }

    const weeks: {
      date: Date;
      isActive: boolean;
      isToday: boolean;
      isFuture: boolean;
    }[][] = [];
    let currentWeek: {
      date: Date;
      isActive: boolean;
      isToday: boolean;
      isFuture: boolean;
    }[] = [];

    for (let i = 0; i < totalDays; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dayStart = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      );

      const isFuture = dayStart > todayStart;
      let isActive = false;
      if (!isFuture && streakStartDay) {
        isActive = dayStart >= streakStartDay && dayStart <= todayStart;
      }
      const isToday = dayStart.getTime() === todayStart.getTime();

      currentWeek.push({ date: dayStart, isActive, isToday, isFuture });

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    return weeks;
  };

  const getMonthLabels = (weeks: { date: Date }[][]) => {
    const labels: { month: string; weekIndex: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, wi) => {
      const m = week[0].date.getMonth();
      if (m !== lastMonth) {
        labels.push({ month: MONTHS[m], weekIndex: wi });
        lastMonth = m;
      }
    });
    return labels;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <Flame className="w-4 h-4 text-orange-500" />
            Daily Streak
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  const currentStreak = stats?.currentStreak || 0;
  const longestStreak = stats?.longestStreak || 0;
  const totalXP = stats?.totalPoints || 0;
  const weeks = generateCalendarData();
  const monthLabels = getMonthLabels(weeks);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <Flame className="w-4 h-4 text-orange-500" />
          Daily Streak
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current streak + message */}
        <div className="flex items-start gap-6">
          <div>
            <p className="text-3xl font-bold leading-tight">
              {currentStreak} {currentStreak === 1 ? "day" : "days"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Current streak
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <span className="text-sm">{currentStreak > 0 ? "🔥" : "💤"}</span>
            {getStreakMessage(currentStreak)}
          </div>
        </div>

        {/* Secondary stats */}
        <div className="flex gap-6 text-xs text-muted-foreground">
          <div>
            <p className="text-sm font-semibold text-foreground">
              {longestStreak} days
            </p>
            Longest streak
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {totalXP.toLocaleString()}
            </p>
            Total XP
          </div>
        </div>

        {/* Calendar */}
        <div className="overflow-x-auto">
          <div className="flex min-w-max">
            {/* Day-of-week labels */}
            <div className="flex flex-col mr-1 pt-5">
              {DAYS.map((d, i) => (
                <div
                  key={i}
                  className="h-[13px] w-7 text-right text-[9px] leading-[13px] text-muted-foreground mb-[2px]"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Weeks grid */}
            <div className="flex flex-col">
              {/* Month labels row */}
              <div className="flex h-5 mb-0.5">
                {weeks.map((week, wi) => {
                  const label = monthLabels.find((l) => l.weekIndex === wi);
                  return (
                    <div
                      key={wi}
                      className="w-[13px] mr-[2px] text-[9px] text-muted-foreground whitespace-nowrap overflow-visible"
                    >
                      {label ? label.month : ""}
                    </div>
                  );
                })}
              </div>

              {/* Cell grid */}
              <div className="flex">
                {weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col mr-[2px]">
                    {week.map((day, di) => {
                      const dateStr = day.date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                      const title = day.isFuture
                        ? dateStr
                        : `${dateStr}: ${day.isActive ? "Active 🔥" : "No activity"}`;

                      return (
                        <div
                          key={di}
                          className={getCellClass(
                            day.isActive,
                            day.isFuture,
                            day.isToday,
                          )}
                          title={title}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-1 text-[11px] text-muted-foreground pt-3 border-t">
          <span className="mr-0.5">Less</span>
          {LEGEND_CELLS.map((cls, i) => (
            <div key={i} className={`w-[11px] h-[11px] rounded-[2px] ${cls}`} />
          ))}
          <span className="ml-0.5">More</span>
        </div>
      </CardContent>
    </Card>
  );
}
