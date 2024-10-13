'use client';
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { LineChart, Line } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { useJobs } from './hooks/useJobs';
import { Job } from './types';
import { getWeeklyApplications } from './lib/week-jobs';

export default function KanbanStats() {
  const { data, isPending, isLoading } = useJobs();
  if (isLoading || isPending) return <div>Loading...</div>;
  if (data?.status !== 'success') {
    return <div>Something went wrong!</div>;
  }
  if (data?.data) {
    return <KanbanStatsComponent data={data} />;
  }

  type KanbanStatsComponentProps = {
    data: {
      data: Job[];
      status: string;
    };
  };

  function KanbanStatsComponent(props: KanbanStatsComponentProps) {
    const weekStatistics = useMemo(
      () => getWeeklyApplications(props.data.data),
      [],
    );
    const totalApplications = useMemo(() => props.data.data.length, []);
    const interviewStage = useMemo(
      () =>
        props.data.data.filter((job) => job.columnId === 'interviewing').length,
      [],
    );
    const totalInProgress = useMemo(
      () =>
        props.data.data.filter(
          (job) => job.columnId !== 'rejected' && job.columnId !== 'offer',
        ).length,
      [],
    );
    const totalOffers = useMemo(
      () => props.data.data.filter((job) => job.columnId === 'offer'),
      [],
    );
    const totalApplied = useMemo(
      () => props.data.data.filter((job) => job.columnId === 'applied'),
      [],
    );
    const totalResponse =
      totalApplied.length > 0
        ? (totalOffers.length / totalApplied.length) * 100
        : 0;
    const statusData = [
      {
        name: 'Open',
        value: props.data.data.filter((job) => job.columnId === 'open').length,
      },
      {
        name: 'Applied',
        value: props.data.data.filter((job) => job.columnId === 'applied')
          .length,
      },
      {
        name: 'Interviewing',
        value: props.data.data.filter((job) => job.columnId === 'interviewing')
          .length,
      },
      {
        name: 'Offer',
        value: props.data.data.filter((job) => job.columnId === 'offer').length,
      },
      {
        name: 'Rejected',
        value: props.data.data.filter((job) => job.columnId === 'rejected')
          .length,
      },
    ];

    const trendData = [
      { name: 'Week 1', applications: weekStatistics[0] },
      { name: 'Week 2', applications: weekStatistics[1] },
      { name: 'Week 3', applications: weekStatistics[2] },
      { name: 'Week 4', applications: weekStatistics[3] },
    ];

    const sourceData = [
      { name: 'LinkedIn', value: 40 },
      { name: 'Company Website', value: 30 },
      { name: 'Referral', value: 20 },
      { name: 'Job Board', value: 10 },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Job Application Statistics</h1>
        <p className="text-muted-foreground mb-8">
          Overview of your job application progress and metrics
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalApplications}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalInProgress}</div>
              <p className="text-xs text-muted-foreground">
                {interviewStage > 0
                  ? `${interviewStage} in interview stage`
                  : null}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Offers Received
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">
                {totalOffers.length > 0
                  ? `${totalOffers.length} pending decisions`
                  : null}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Response Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalResponse}%</div>
              {/* <p className="text-xs text-muted-foreground">
                {totalResponse}% from last month
              </p> */}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Applications by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Application Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="applications"
                    stroke="#8884d8"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Application Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {sourceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    );
  }
}
