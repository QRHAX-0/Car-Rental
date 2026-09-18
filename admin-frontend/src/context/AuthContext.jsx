import { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();

  // جلب بيانات اليوزر باستخدام React Query v5 syntax
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const response = await api.get("/auth/profile"); // تأكد إن ده مسار الباك إند بتاعك
      return response.data;
    },
    retry: false, // لو مش عامل لوجين، مفيش داعي يحاول تاني
    refetchOnWindowFocus: false,
  });

  // دالة تسجيل الخروج كـ Mutation
  const logoutMutation = useMutation({
    mutationFn: () => api.post("/auth/logout"),
    onSuccess: () => {
      queryClient.setQueryData(["authUser"], null);
      window.location.href = "/login";
    },
  });

  const isAuthenticated = !!user && !isError;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        logout: logoutMutation.mutate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
