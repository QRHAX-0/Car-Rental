import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { useState } from "react";
import toast from "react-hot-toast";
import CarFormModal from "../components/cars/CarFormModal";

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

export default function FleetList() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const endpoint =
    user?.role === "SUPER_ADMIN" ? "/super-admin/cars" : "/agency-admin/cars";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [carToEdit, setCarToEdit] = useState(null);

  const {
    data: cars,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["fleetCars", user?.role],
    queryFn: async () => (await api.get(endpoint)).data,
  });

  // ميوتيشن الحذف
  const deleteMutation = useMutation({
    mutationFn: async (carId) => await api.delete(`${endpoint}/${carId}`),
    onSuccess: () => {
      toast.success("Vehicle deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["fleetCars"] });
    },
    onError: () => toast.error("Failed to delete vehicle"),
  });

  const handleDelete = (car) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${car.brand} ${car.model}?`,
      )
    ) {
      deleteMutation.mutate(car.id);
    }
  };

  const handleEdit = (car) => {
    setCarToEdit(car);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setCarToEdit(null);
    setIsModalOpen(true);
  };

  return (
    <>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8 max-w-7xl mx-auto font-['Plus_Jakarta_Sans']"
      >
        {/* Header */}
        <motion.div
          variants={item}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
              Fleet Management
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Manage your agency's premium vehicles and pricing.
            </p>
          </div>
          {user?.role === "ADMIN" && (
            <button
              onClick={handleAddNew}
              className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-primary/20 active:scale-95"
            >
              <span className="material-symbols-outlined text-xl">add</span>
              Add Vehicle
            </button>
          )}
        </motion.div>

        {/* Premium Table / List */}
        <motion.div
          variants={item}
          className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 ambient-shadow overflow-hidden p-2"
        >
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <span className="material-symbols-outlined animate-spin text-primary text-4xl">
                progress_activity
              </span>
            </div>
          ) : isError ? (
            <div className="p-12 text-center text-red-500 font-bold bg-red-50 dark:bg-red-500/10 rounded-3xl m-4">
              Failed to load fleet data. Check your connection.
            </div>
          ) : (
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr>
                    <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      Vehicle
                    </th>
                    <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      Category
                    </th>
                    <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      Rate / Day
                    </th>
                    <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      Status
                    </th>
                    <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                  {cars?.map((car) => (
                    <tr
                      key={car.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group"
                    >
                      <td className="px-6 py-4 flex items-center gap-5">
                        <div className="w-20 h-14 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                          {car.images?.length > 0 || car.imageUrl ? (
                            <img
                              src={car.images?.[0]?.image || car.imageUrl}
                              alt={car.model}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <span className="material-symbols-outlined">
                                directions_car
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-lg leading-tight">
                            {car.brand} {car.model}
                          </p>
                          <p className="text-sm text-slate-500 font-medium">
                            {car.year}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">
                        {car.category}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-primary text-lg">
                          ${Number(car.pricePerDay).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                          Available
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(car)}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-primary hover:bg-primary/10 transition-all"
                          >
                            <span className="material-symbols-outlined text-lg">
                              edit
                            </span>
                          </button>
                          <button
                            onClick={() => handleDelete(car)}
                            disabled={deleteMutation.isPending}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                          >
                            <span className="material-symbols-outlined text-lg">
                              delete
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(!cars || cars.length === 0) && (
                    <tr>
                      <td colSpan="5" className="p-16 text-center">
                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="material-symbols-outlined text-4xl text-slate-400">
                            no_crash
                          </span>
                        </div>
                        <p className="text-slate-900 dark:text-white font-bold text-lg">
                          No vehicles found
                        </p>
                        <p className="text-slate-500 mt-1">
                          Start building your fleet by adding a new vehicle.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* المودال تم نقله بره خالص زيه زي AuthModal */}
      <AnimatePresence>
        {isModalOpen && (
          <CarFormModal
            onClose={() => setIsModalOpen(false)}
            carToEdit={carToEdit}
          />
        )}
      </AnimatePresence>
    </>
  );
}
