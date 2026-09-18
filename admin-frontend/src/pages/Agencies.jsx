import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";
import AgencyModal from "../components/agencies/AgencyModal";
import CreateAdminModal from "../components/agencies/CreateAdminModal"; // 👈 استدعاء مودال الأدمن الجديد

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

export default function Agencies() {
  const [isAgencyModalOpen, setIsAgencyModalOpen] = useState(false);
  // 👈 State عشان نحفظ الـ ID بتاع الشركة اللي بنعملها Admin حالياً
  const [adminModalAgencyId, setAdminModalAgencyId] = useState(null);

  const { data: agencies, isLoading } = useQuery({
    queryKey: ["allAgencies"],
    queryFn: async () => (await api.get("/super-admin/agencies")).data,
  });

  return (
    <>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8 max-w-7xl mx-auto font-['Plus_Jakarta_Sans']"
      >
        <motion.div
          variants={item}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
              Partner Agencies
            </h1>
            <p className="text-slate-500">
              Monitor and manage all car rental agencies in the system.
            </p>
          </div>
          <button
            onClick={() => setIsAgencyModalOpen(true)}
            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
          >
            <span className="material-symbols-outlined text-xl">
              add_business
            </span>
            Onboard Agency
          </button>
        </motion.div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <span className="material-symbols-outlined animate-spin text-primary text-4xl">
              progress_activity
            </span>
          </div>
        ) : (
          <motion.div
            variants={item}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {agencies?.map((agency) => (
              <div
                key={agency.id}
                className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 ambient-shadow hover:shadow-2xl transition-all group overflow-hidden flex flex-col"
              >
                {/* Premium Banner */}
                <div className="h-24 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-800/50 relative">
                  <div className="absolute -bottom-6 left-6 w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-sm overflow-hidden">
                    <img
                      src={agency.logo || "https://placehold.co/100x100/png"}
                      alt={agency.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <span
                    className={`absolute top-4 right-4 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full backdrop-blur-md ${
                      agency.isActive
                        ? "bg-emerald-100/80 text-emerald-700"
                        : "bg-red-100/80 text-red-700"
                    }`}
                  >
                    {agency.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Agency Info */}
                <div className="pt-10 pb-6 px-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 truncate">
                    {agency.name}
                  </h3>
                  <p className="text-sm text-slate-500 mb-6 flex items-center gap-2 truncate">
                    <span className="material-symbols-outlined text-sm">
                      calendar_month
                    </span>
                    Joined {new Date(agency.createdAt).toLocaleDateString()}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                        Fleet Size
                      </p>
                      <p className="font-bold text-slate-900 dark:text-white text-lg">
                        {agency._count?.cars || 0}
                      </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                        Team Size
                      </p>
                      <p className="font-bold text-slate-900 dark:text-white text-lg">
                        {agency._count?.members || 0}
                      </p>
                    </div>
                  </div>

                  {/* Actions (تم إضافة زرار Add Admin هنا) */}
                  <div className="mt-auto flex gap-2">
                    <button
                      onClick={() => setAdminModalAgencyId(agency.id)} // 👈 بيفتح مودال الأدمن للشركة دي
                      className="flex-1 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-primary dark:text-primary text-sm font-bold hover:bg-primary/10 transition-colors flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-lg">
                        person_add
                      </span>
                      Add Admin
                    </button>
                    <button
                      onClick={() => toast.error("Agency Blocked")}
                      className="w-12 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">
                        block
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {isAgencyModalOpen && (
          <AgencyModal onClose={() => setIsAgencyModalOpen(false)} />
        )}

        {/* 👈 مودال إضافة المدير */}
        {adminModalAgencyId && (
          <CreateAdminModal
            agencyId={adminModalAgencyId}
            onClose={() => setAdminModalAgencyId(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
