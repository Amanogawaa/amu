import { LeaderboardsPage } from "@/features/leaderboards/presentation/LeaderboardsPage";

export const metadata = {
  title: "Leaderboard | AMU",
  description: "See how you rank among other learners on AMU",
};

export default function LeaderboardRoute() {
  return <LeaderboardsPage />;
}
