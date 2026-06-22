import Footer from "@/components/Footer";
import TopNavBar from "@/components/TopNavBar";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";

function RootLayout() {
  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <TopNavBar />
      <Toaster
        position="top-center"
        toastOptions={{
          className:
            "dark:bg-slate-800 dark:text-white border border-slate-100 dark:border-slate-700 shadow-xl rounded-2xl",
          duration: 4000,
          style: {
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: "600",
          },
          success: {
            iconTheme: {
              primary: "#10b981", // لون أخضر شيك
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444", // لون أحمر شيك
              secondary: "#fff",
            },
          },
        }}
      />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default RootLayout;
