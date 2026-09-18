import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../api/axios";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export default function Overview() {
  const { user } = useAuth();
  const endpoint =
    user?.role === "SUPER_ADMIN" ? "/super-admin/stats" : "/agency-admin/stats";

  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboardStats", user?.role],
    queryFn: async () => {
      const response = await api.get(endpoint);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">
          progress_activity
        </span>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 font-['Plus_Jakarta_Sans'] max-w-7xl mx-auto"
    >
      <motion.div variants={item} className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
            Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Your agency's performance at a glance.
          </p>
        </div>
        <div className="px-4 py-2 bg-white dark:bg-slate-900 rounded-full border border-slate-100 dark:border-slate-800 shadow-sm">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </motion.div>

      <motion.div
        variants={item}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 ambient-shadow">
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600">
              <span className="material-symbols-outlined text-3xl">
                directions_car
              </span>
            </div>
            <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold uppercase tracking-wider border border-green-100">
              Active
            </span>
          </div>
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            Total Fleet
          </h3>
          <p className="text-4xl font-bold text-slate-900 dark:text-white">
            {stats?.totalCars || 0}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 ambient-shadow">
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-3xl">key</span>
            </div>
          </div>
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            Active Rentals
          </h3>
          <p className="text-4xl font-bold text-slate-900 dark:text-white">
            {stats?.totalRentals || 0}
          </p>
        </div>

        <div className="bg-slate-900 dark:bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-900/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 dark:bg-slate-900/5 rounded-full blur-2xl"></div>
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/10 dark:bg-slate-900/10 flex items-center justify-center text-white dark:text-slate-900">
              <span className="material-symbols-outlined text-3xl">
                account_balance_wallet
              </span>
            </div>
          </div>
          <h3 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 relative z-10">
            Total Revenue
          </h3>
          <p className="text-4xl font-bold text-white dark:text-slate-900 relative z-10">
            ${stats?.totalRevenue || "0.00"}
          </p>
        </div>
      </motion.div>

      <motion.div
        variants={item}
        className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm"
      >
        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-8">
          Revenue Trend (Last 7 Days)
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats?.chartData || []}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />
              <XAxis
                dataKey="date"
                type="category"
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => {
                  if (!value) return "N/A";
                  const [, month, day] = value.split("-");
                  return `${month}/${day}`;
                }}
              />
              <YAxis axisLine={false} tickLine={false} domain={[0, "auto"]} />
              <Tooltip
                contentStyle={{
                  borderRadius: "16px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                }}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#4f46e5"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRev)"
                connectNulls={true}
                dot={{ r: 6, fill: "#4f46e5" }}
                curveType="monotone"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  );
}
