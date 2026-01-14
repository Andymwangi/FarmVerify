"use client";

import { Icon } from "@iconify/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { FarmerStats } from "@/types";

interface StatsCardsProps {
  stats: FarmerStats | null;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const items = [
    {
      title: "Total Farmers",
      value: stats?.total ?? 0,
      icon: "solar:users-group-rounded-bold",
      color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Pending Review",
      value: stats?.pending ?? 0,
      icon: "solar:clock-circle-bold",
      color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30",
    },
    {
      title: "Certified",
      value: stats?.certified ?? 0,
      icon: "solar:verified-check-bold",
      color: "text-green-600 bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Declined",
      value: stats?.declined ?? 0,
      icon: "solar:close-circle-bold",
      color: "text-red-600 bg-red-100 dark:bg-red-900/30",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.title}
            </CardTitle>
            <div className={`rounded-lg p-2 ${item.color}`}>
              <Icon icon={item.icon} className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
