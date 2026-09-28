import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  Clock,
  Navigation,
  Coffee,
  Zap,
  ShieldCheck,
  TrendingUp,
  Award,
} from 'lucide-react';

export function OnlineHoursPage() {
  const [selectedRange, setSelectedRange] = useState('week');

  const data = [
    { day: 'Mon', hours: 7.0, active: 5.5, trips: 8 },
    { day: 'Tue', hours: 8.0, active: 6.8, trips: 10 },
    { day: 'Wed', hours: 6.5, active: 5.2, trips: 7 },
    { day: 'Thu', hours: 9.0, active: 7.4, trips: 11 },
    { day: 'Fri', hours: 7.5, active: 6.0, trips: 9 },
    { day: 'Sat', hours: 10.0, active: 8.2, trips: 13 },
    { day: 'Sun', hours: 5.0, active: 3.8, trips: 6 },
  ];

  const metrics = [
    {
      label: 'Total Online Time',
      value: '53h 00m',
      subtext: '+4.5h vs last week',
      trend: '+9.2%',
      trendUp: true,
      icon: Clock,
      iconBg: 'bg-orange-50',
      iconColor: 'text-[#FF5B26]',
    },
    {
      label: 'Active Driving Time',
      value: '42h 54m',
      subtext: '81% productive time',
      trend: '+11.4%',
      trendUp: true,
      icon: Navigation,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      label: 'Break & Idle Time',
      value: '10h 06m',
      subtext: 'Rest & waiting time',
      trend: '-2.1%',
      trendUp: false,
      icon: Coffee,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    {
      label: 'Avg. Daily Hours',
      value: '7.6 hrs/day',
      subtext: 'Recommended: 8 hrs',
      trend: 'Optimal',
      trendUp: true,
      icon: Zap,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
  ];

  // Custom sleek tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-gray-100 shadow-xl shadow-gray-200/50 text-xs">
          <p className="font-bold text-gray-900 mb-1.5 flex items-center justify-between gap-4">
            <span>{label} Activity</span>
            <span className="text-[#FF5B26] font-semibold">{item.trips} trips</span>
          </p>
          <div className="space-y-1 text-gray-600">
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FF5B26]" />
                Online Time:
              </span>
              <span className="font-bold text-gray-900">{item.hours} hrs</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Active Driving:
              </span>
              <span className="font-semibold text-emerald-600">{item.active} hrs</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 pb-6 w-full min-w-0 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#FF5B26] mb-1">
            Driving Activity & Schedule
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-navy tracking-tight">
            Online Hours
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Monitor your online presence, active driving hours, and shifts.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-gray-200 shadow-sm self-start sm:self-auto">
          {[
            { label: 'This Week', value: 'week' },
            { label: 'Last Week', value: 'last_week' },
            { label: 'This Month', value: 'month' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedRange(tab.value)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedRange === tab.value
                  ? 'bg-[#FF5B26] text-white shadow-sm shadow-orange-500/20'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`w-11 h-11 rounded-xl ${item.iconBg} ${item.iconColor} flex items-center justify-center`}
                >
                  <Icon className="w-5 h-5" strokeWidth={2.2} />
                </div>

                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
                    item.trendUp
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <TrendingUp className="w-3 h-3" />
                  {item.trend}
                </span>
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {item.label}
                </p>
                <p className="text-2xl font-bold text-navy mt-1 tracking-tight">
                  {item.value}
                </p>
                <p className="text-xs text-gray-400 mt-1 font-medium">
                  {item.subtext}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Professional Chart Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Daily Driving Hours Breakdown
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Active driving hours compared throughout the week
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5B26]" />
              <span>Online Hours</span>
            </div>
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-1.5 text-emerald-600">
              <Award className="w-3.5 h-3.5" />
              <span>Peak: Saturday (10h)</span>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="h-[280px] sm:h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 15, right: 10, left: -20, bottom: 0 }}
                barCategoryGap="30%"
              >
                <defs>
                  <linearGradient id="onlineHoursGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF5B26" stopOpacity={1} />
                    <stop offset="100%" stopColor="#FF8A65" stopOpacity={0.85} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  stroke="#F1F5F9"
                />

                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }}
                  dy={10}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 11 }}
                  tickFormatter={(v) => `${v}h`}
                  domain={[0, 12]}
                  ticks={[0, 3, 6, 9, 12]}
                />

                <Tooltip
                  cursor={{ fill: 'rgba(255, 91, 38, 0.04)', radius: 6 }}
                  content={<CustomTooltip />}
                />

                {/* Sleek, thin professional bars */}
                <Bar
                  dataKey="hours"
                  fill="url(#onlineHoursGradient)"
                  radius={[6, 6, 2, 2]}
                  barSize={18}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Schedule & Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-orange-50 text-[#FF5B26] flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                Average Start Time
              </p>
              <p className="text-lg font-bold text-gray-900 mt-0.5">
                08:45 AM
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg">
            Consistent
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                Safety Compliance
              </p>
              <p className="text-lg font-bold text-gray-900 mt-0.5">
                100% Compliant
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg">
            No Fatigue Violations
          </span>
        </div>
      </div>
    </div>
  );
}