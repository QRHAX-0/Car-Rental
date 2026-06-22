import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { api } from "../utils/api";

export default function ProtectedRoute() {
  // بنسأل الباك إند: هل اليوزر ده مسجل دخول؟
  const { data: user, isLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const res = await api.get("/auth/profile");
      return res.data;
    },
    retry: false,
  });

  useEffect(() => {
    // لو التحميل خلص واتأكدنا إن مفيش يوزر
    if (!isLoading && !user) {
      toast.error("Please log in to access this page", {
        id: "auth-guard-toast", // الـ ID ده بيمنع إن الإشعار يتكرر مرتين فوق بعض
      });
    }
  }, [isLoading, user]);
  // 1. لو لسه بيحمل الداتا، نعرض شاشة تحميل أنيقة عشان الصفحة ماتعملش فلاش
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">
          progress_activity
        </span>
      </div>
    );
  }

  // 2. لو مفيش يوزر، رجعه لصفحة الـ Home فوراً (وممكن تفتحله المودال كمان لو حابب)
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // 3. لو اليوزر موجود، افتحله الصفحة اللي هو كان رايحلها (الـ Outlet هو الصفحة المقصودة)
  return <Outlet />;
}
