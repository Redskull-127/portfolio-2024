'use client';
import { Icons } from '@/components/icons/icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import NumFormate from '@/lib/number-formate';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

export function UniqueVisitors(params: {
  totalViews: number;
  lastMonthsVisits: { month: string; visits: number }[];
  translation: { uniqueVisitors: string };
}) {
  const chartData = params.lastMonthsVisits;
  const chartConfig = {
    desktop: {
      label: 'Desktop',
      color: '#2563eb',
    },
    mobile: {
      label: 'Mobile',
      color: '#60a5fa',
    },
  } satisfies ChartConfig;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex gap-1 hover:text-primary cursor-pointer transition-all">
            <Icons.TrendingUp />
            {NumFormate(params.totalViews)} {params.translation.uniqueVisitors}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex flex-col size-fit py-2 gap-5 item-center justify-center">
            <p className="text-center">
              {NumFormate(params.totalViews)} Unique Visitors in past 30 Days!
            </p>
            <ChartContainer
              config={chartConfig}
              className="min-h-[200px] w-fit mx-0"
            >
              <AreaChart accessibilityLayer data={chartData}>
                <defs>
                  <linearGradient id="colorMonth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffe974" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ffe974" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="10 10" />
                <YAxis tickMargin={0} />
                <XAxis dataKey="month" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type={'monotone'}
                  stroke="#ffe974"
                  strokeWidth={3}
                  dataKey="visits"
                  fill="url(#colorMonth)"
                  radius={4}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
