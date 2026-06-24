import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response, // لو الريكويست سليم، عديه
    async (error) => {
        const originalRequest = error.config;

        // صمامات الأمان:
        // 1. الإيرور 401
        // 2. الريكويست ده مش إعادة محاولة سابقة (!originalRequest._retry)
        // 3. مسار الريكويست الأصلي مش هو مسار الريفريش (عشان نمنع اللوب)
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            originalRequest.url !== '/auth/refresh'
        ) {
            originalRequest._retry = true; // علم عليه عشان ميحاولش تاني

            try {
                // روح هات توكن جديد
                await api.post('/auth/refresh');
                // لو نجح، عيد الريكويست الأصلي
                return api(originalRequest);
            } catch (refreshError) {
                // لو الريفريش نفسه فشل (يعني اليوزر معندوش توكن أصلا)، ارفض الريكويست فوراً وماتعملش لوب
                return Promise.reject(refreshError);
            }
        }

        // أي إيرور تاني غير الـ 401، ارفضه عادي
        return Promise.reject(error);
    }
);