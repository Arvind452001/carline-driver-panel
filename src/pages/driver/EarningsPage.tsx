import { useState, useEffect } from 'react';
import { formatCurrency } from '@/utils/formatCurrency';
import { api } from '@/services/api';
import { getDriverEarnings } from '@/services/DriverBooking';
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
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  CircleDollarSign,
  Gift,
  Lightbulb,
  Wallet,
  Banknote,
  ChevronDown,
} from 'lucide-react';

export function EarningsPage() {
  const [filter, setFilter] = useState('today');
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    setData(null);

    const fetchEarnings = async () => {
      try {
        const [mockRes, bookingRes] = await Promise.allSettled([
          api.getEarnings(filter),
          getDriverEarnings(),
        ]);

        const mockData = mockRes.status === 'fulfilled' ? mockRes.value : null;
        const bookingData = bookingRes.status === 'fulfilled' ? bookingRes.value : null;

        let total = 0;
        if (filter === 'today') {
          total = bookingData?.today?.earned ?? bookingData?.totalEarned ?? mockData?.total ?? 0;
        } else if (filter === 'week') {
          total = bookingData?.week?.earned ?? bookingData?.totalEarned ?? mockData?.total ?? 0;
        } else if (filter === 'month') {
          total = bookingData?.month?.earned ?? bookingData?.totalEarned ?? mockData?.total ?? 0;
        } else {
          total = bookingData?.totalEarned ?? mockData?.total ?? 0;
        }

        const breakdown = {
          trip: total,
          incentives:
            bookingData?.incentives ??
            mockData?.breakdown?.incentives ??
            0,
          tips:
            bookingData?.tips ??
            mockData?.breakdown?.tips ??
            0,
          others: 0,
        };

        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weeklyData =
          Array.isArray(bookingData?.daily) && bookingData.daily.length > 0
            ? bookingData.daily.map((item: any) => {
                const dateObj = new Date(item.date);
                const day = !isNaN(dateObj.getTime())
                  ? dayNames[dateObj.getDay()]
                  : item.date;
                return {
                  day,
                  amount: Number(item.earned || 0),
                };
              })
            : mockData?.weeklyData || [];

        setData({
          total,
          breakdown,
          weeklyData,
        });
      } catch (err) {
        console.error('Error fetching driver earnings:', err);
      }
    };

    fetchEarnings();
  }, [filter]);

  if (!data) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 rounded-full border-4 border-primary-100 border-t-primary-500 animate-spin" />
          <p className="text-sm text-gray-500 font-medium">
            Loading earnings...
          </p>
        </div>
      </div>
    );
  }

  const earningStats = [
    {
      label: 'Total Earnings',
      value: formatCurrency(data.total),
      description: 'Total revenue',
      icon: CircleDollarSign,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      label: 'Trip Earnings',
      value: formatCurrency(data.breakdown.trip),
      description: 'From completed trips',
      icon: BarChart3,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Incentives',
      value: formatCurrency(data.breakdown.incentives),
      description: 'Bonuses & incentives',
      icon: Gift,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      label: 'Tips',
      value: formatCurrency(data.breakdown.tips),
      description: 'Customer tips',
      icon: Lightbulb,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
  ];

  return (
    <div className="space-y-6 pb-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-primary-500 mb-1">
            Financial Overview
          </p>

          <h2 className="text-2xl sm:text-3xl font-bold text-navy tracking-tight">
            Earnings
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Track your earnings, incentives and payouts.
          </p>
        </div>

        {/* Filter */}
        <div className="relative">
          <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="
              appearance-none
              w-full sm:w-[170px]
              pl-10 pr-10 py-2.5
              bg-white
              border border-gray-200
              rounded-xl
              text-sm font-semibold text-gray-700
              outline-none
              cursor-pointer
              shadow-sm
              hover:border-gray-300
              focus:border-primary-400
              focus:ring-4 focus:ring-primary-500/10
              transition-all
            "
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>

          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Earnings Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {earningStats.map(
          ({
            label,
            value,
            description,
            icon: Icon,
            iconBg,
            iconColor,
          }) => (
            <div
              key={label}
              className="
                group relative overflow-hidden
                bg-white
                rounded-2xl
                border border-gray-100
                p-5
                shadow-[0_4px_20px_rgba(0,0,0,0.04)]
                hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]
                hover:-translate-y-0.5
                transition-all duration-300
              "
            >
              {/* Decorative circle */}
              <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-gray-50 group-hover:scale-125 transition-transform duration-500" />

              <div className="relative">
                <div className="flex items-start justify-between">
                  <div
                    className={`
                      w-11 h-11
                      rounded-xl
                      ${iconBg}
                      flex items-center justify-center
                      ${iconColor}
                    `}
                  >
                    <Icon className="w-5 h-5" strokeWidth={2.2} />
                  </div>

                  <ArrowUpRight
                    className="
                      w-4 h-4
                      text-gray-300
                      group-hover:text-primary-500
                      transition-colors
                    "
                  />
                </div>

                <div className="mt-5">
                  <p className="text-sm font-medium text-gray-500">
                    {label}
                  </p>

                  <p className="text-2xl font-bold text-navy mt-1 tracking-tight">
                    {value}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    {description}
                  </p>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* Chart */}
      <div
        className="
          bg-white
          rounded-2xl
          border border-gray-100
          shadow-[0_4px_20px_rgba(0,0,0,0.04)]
          overflow-hidden
        "
      >
        <div className="p-5 sm:p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-gray-900">
                Earnings Overview
              </h3>

              <p className="text-xs text-gray-400 mt-1">
                Your earnings for the current period
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary-500" />
              <span className="text-xs font-medium text-gray-500">
                Earnings
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="h-[280px] sm:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.weeklyData}
                margin={{
                  top: 15,
                  right: 10,
                  left: -10,
                  bottom: 0,
                }}
                barCategoryGap="30%"
              >
                <defs>
                  <linearGradient id="earningsBarGradient" x1="0" y1="0" x2="0" y2="1">
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
                  tick={{
                    fill: '#94A3B8',
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                  dy={10}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#94A3B8',
                    fontSize: 11,
                  }}
                  tickFormatter={(value) => `₹${value}`}
                />

                <Tooltip
                  cursor={{ fill: 'rgba(255, 91, 38, 0.04)', radius: 6 }}
                  formatter={(value) =>
                    formatCurrency(value as number)
                  }
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #F1F5F9',
                    boxShadow:
                      '0 10px 25px rgba(0,0,0,0.06)',
                    padding: '10px 14px',
                    fontWeight: 500,
                  }}
                  labelStyle={{
                    fontWeight: 700,
                    color: '#0F172A',
                    marginBottom: 4,
                  }}
                />

                <Bar
                  dataKey="amount"
                  fill="url(#earningsBarGradient)"
                  radius={[6, 6, 2, 2]}
                  barSize={18}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Wallet / Payout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Wallet */}
        <div
          className="
            relative overflow-hidden
            bg-white
            rounded-2xl
            border border-gray-100
            p-6
            shadow-[0_4px_20px_rgba(0,0,0,0.04)]
          "
        >
          <div className="absolute -right-12 -bottom-12 w-32 h-32 rounded-full bg-emerald-50" />

          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-emerald-600" />
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">
                    Wallet Balance
                  </h3>

                  <p className="text-xs text-gray-400 mt-0.5">
                    Available balance
                  </p>
                </div>
              </div>

              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                Available
              </span>
            </div>

            <div className="mt-6">
              <p className="text-3xl font-bold text-navy tracking-tight">
                {formatCurrency(1250)}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Ready for withdrawal
              </p>
            </div>
          </div>
        </div>

        {/* Next Payout */}
        <div
          className="
            relative overflow-hidden
            bg-white
            rounded-2xl
            border border-gray-100
            p-6
            shadow-[0_4px_20px_rgba(0,0,0,0.04)]
          "
        >
          <div className="absolute -right-12 -bottom-12 w-32 h-32 rounded-full bg-orange-50" />

          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center">
                  <Banknote className="w-5 h-5 text-orange-600" />
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">
                    Next Payout
                  </h3>

                  <p className="text-xs text-gray-400 mt-0.5">
                    Amount available for payout
                  </p>
                </div>
              </div>

              <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg">
                Pending
              </span>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-3xl font-bold text-navy tracking-tight">
                  {formatCurrency(3500)}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Scheduled payout
                </p>
              </div>

              <button
                className="
                  inline-flex items-center justify-center
                  gap-2
                  bg-[#FF5B26]
                  hover:bg-[#E04815]
                  active:bg-[#BC360B]
                  text-white
                  font-bold
                  text-sm
                  px-5 py-2.5
                  rounded-xl
                  shadow-md shadow-orange-500/20
                  hover:shadow-lg hover:shadow-orange-500/25
                  transition-all duration-200
                  active:scale-[0.98]
                "
              >
                Withdraw
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}