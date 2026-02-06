import { db } from "@/lib/db";
import { Eye, Link2 } from "lucide-react";

interface StatisticsProps {
  userId: string;
}

export async function Statistics({ userId }: StatisticsProps) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { profileViews: true },
  });

  const linkCount = await db.link.count({
    where: { userId },
  });

  const stats = [
    {
      label: "Views",
      value: user?.profileViews ?? 0,
      icon: Eye,
    },
    {
      label: "Links",
      value: linkCount,
      icon: Link2,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-3 p-4 rounded-xl bg-background border"
        >
          <div className="p-2 bg-primary/10 rounded-lg">
            <stat.icon className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xl font-bold">{stat.value.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
