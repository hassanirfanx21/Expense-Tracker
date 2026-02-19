'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-xl p-3 shadow-xl border border-dark-500">
      <p className="text-sm font-medium text-gray-300 mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-bold" style={{ color: entry.color }}>
          ${entry.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </p>
      ))}
    </div>
  );
};

// Monthly Spending Bar/Area Chart
export function MonthlyChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-5 lg:p-6 h-full min-h-[300px]">
        <h3 className="text-lg font-semibold text-white mb-4">Monthly Spending</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          <p>No spending data available yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-5 lg:p-6 h-full min-h-[300px]">
      <h3 className="text-lg font-semibold text-white mb-1">Monthly Spending</h3>
      <p className="text-sm text-gray-500 mb-4">Last {data.length} months overview</p>
      <div className="h-64 lg:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(45, 45, 80, 0.3)" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickFormatter={(val) => `$${val}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#6366f1"
              strokeWidth={2.5}
              fill="url(#colorTotal)"
              dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#1a1a2e' }}
              activeDot={{ r: 6, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Category Pie Chart
export function CategoryChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-5 lg:p-6 h-full min-h-[300px]">
        <h3 className="text-lg font-semibold text-white mb-4">By Category</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          <p>No category data available yet</p>
        </div>
      </div>
    );
  }

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="glass-card rounded-2xl p-5 lg:p-6 h-full min-h-[300px]">
      <h3 className="text-lg font-semibold text-white mb-1">By Category</h3>
      <p className="text-sm text-gray-500 mb-4">Spending distribution</p>

      <div className="flex flex-col lg:flex-row items-center gap-4 h-[calc(100%-60px)]">
        {/* Pie Chart */}
        <div className="w-full lg:w-1/2 h-64 lg:h-full min-h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                stroke="rgba(10, 10, 15, 0.5)"
                strokeWidth={2}
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`$${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 'Amount']}
                contentStyle={{
                  backgroundColor: '#1a1a2e',
                  border: '1px solid #2d2d50',
                  borderRadius: '12px',
                  color: '#e2e8f0',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="w-full lg:w-1/2 space-y-2 max-h-56 overflow-y-auto">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-dark-700/50 transition-colors">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-sm">{item.icon}</span>
                  <span className="text-sm text-gray-300 truncate">{item.name}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-medium text-white">
                  ${item.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-gray-500">
                  {((item.value / total) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Daily Spending Chart
export function DailyChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-5 lg:p-6 h-full min-h-[300px]">
        <h3 className="text-lg font-semibold text-white mb-4">Daily Spending</h3>
        <div className="h-48 flex items-center justify-center text-gray-500">
          <p>No daily data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-5 lg:p-6 h-full min-h-[300px]">
      <h3 className="text-lg font-semibold text-white mb-1">Daily Spending</h3>
      <p className="text-sm text-gray-500 mb-4">This month&apos;s daily breakdown</p>
      <div className="h-48 lg:h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(45, 45, 80, 0.3)" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickFormatter={(val) => `$${val}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="total"
              fill="#6366f1"
              radius={[4, 4, 0, 0]}
              maxBarSize={24}
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.total > 100 ? '#ef4444' : entry.total > 50 ? '#f59e0b' : '#6366f1'}
                  opacity={0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
