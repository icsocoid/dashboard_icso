import axios from 'axios';
import type {IntEmailTemplate} from "@/models/email-template.model.tsx";
import type {Plan} from "@/models/plan.model.tsx";
import type {arrayOutputType} from "zod";
import type {CouponModal} from "@/models/coupon.modal.tsx";
import type {PaymentModel} from "@/models/payment.model.tsx";
import type {SubscriptionModel} from "@/models/subscription.model.tsx";
import type {UsersModel} from "@/models/users.model.tsx";

const BASE_URL_EMAIL = "https://emailapi.als.today/api/email"
const BASE_URL = "https://apibilling.icso.biz.id/public/api"
const API_URL = "https://als.icso.biz.id/public/api"; //Login Auth API
const BASE_USERS_URL = "https://authapi.als.today/api";
const BASE_NEW_URL = "https://als-billing-service.icso.biz.id/api";

// ====================
// 🔐 Auth API
// ====================
export async function loginUser(username: string, password: string) {
    try {
        const response = await axios.post(`${API_URL}/login-form`, {
            username,
            password,
        });

        const { status, message, karyawan } = response.data;

        return {
            status: status === true, // pastikan boolean
            karyawan: karyawan ?? null,
            message: message ?? "Login gagal",
        };
    } catch (error: any) {
        return {
            status: false,
            karyawan: null,
            message: error?.response?.data?.message || "Terjadi kesalahan jaringan",
        };
    }
}

// ====================
// 📩 Email Template APIs
// ====================

export const AllEmailTemplates = async (page: number, size: number, search: string): Promise<{ data: IntEmailTemplate[]; total: number } | null> => {
    try {
        const res = await axios.get(`${BASE_URL_EMAIL}/all?page=${page}&per_page=${size}&search=${encodeURIComponent(search)}`);
        return {
            data: res.data?.data?.data ?? [],
            total: res.data?.data?.total ?? 0,
        };
    } catch (error) {
        console.error(error);
        return null;
    }
}


export const saveTemplate = async (
    code: string,
    subject: string,
    body: string,
    template: string
): Promise<{ status: boolean; message?: string }> => {
    try {
        const res = await axios.post(
            `${BASE_URL_EMAIL}/template/store`,
            {
                code,
                subject,
                body,
                template,
            }
        );

        if (res.data.status) {
            return { status: true };
        } else {
            return { status: false, message: res.data.message };
        }
    } catch (error: any) {
        return { status: false, message: error.message};
    }
};

export const updateTemplate = async (
    id: number,
    code: string,
    subject: string,
    body: string,
    template: string
): Promise<{ status: boolean; message?: string }> => {
    try {
        const res = await axios.post(
            `${BASE_URL_EMAIL}/edit/${id}`,
            {
                code,
                subject,
                body,
                template,
            }
        );
        if (res.data.status) {
            return { status: true };
        } else {
            return { status: false, message: res.data.message };
        }
    } catch (error: any) {
        return { status: false, message: error.message || 'Terjadi kesalahan' };
    }
}

export const getTemplateById = async (id: number): Promise<{ subject: string; code: string; body: string; template: string } | null> => {
    try {
        const res = await axios.get(
            `${BASE_URL_EMAIL}/template/${id}`
        );

        if (res.data.status && res.data.data) {
            const { subject, code, body, template } = res.data.data;
            return { subject, code, body, template };
        }

        return null;
    } catch (err) {
        console.error(err);
        return null;
    }
};

export async function deleteTemplate(id: number) {
    try {
        const response = await axios.delete(`${BASE_URL_EMAIL}/delete/${id}`)
        return response.data
    } catch (error: any) {
        console.error(error)
        return {
            status: false,
            message: error?.response?.data?.message,
        }
    }
}

// ====================
// 📩 Master Plan APIs
// ====================

export const AllPlan = async (page: number, size: number, search: string): Promise<{
    data: Plan[];
    meta: {
        current_page: number;
        from: number;
        to: number;
        per_page: number;
        total: number;
        last_page: number;
    }; total: number } | null> => {
    try {
        const token = localStorage.getItem("token");

        const response  = await axios.get(`${BASE_URL}/plan/get-data?page=${page}&per_page=${size}&search=${encodeURIComponent(search)}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data
    } catch (error) {
        console.error(error);
        return null;
    }
}


export const savePlan = async (
    name: string,
    price_monthly: number,
    price_yearly: number,
    description: string,
    trial_days: number,
    features: arrayOutputType<any>,
    features_another: arrayOutputType<any>,
): Promise<{ status: boolean; message?: string }> => {
    const params = {
        name,
        price_monthly,
        price_yearly,
        description,
        trial_days,
        features,
        features_another
    };

    try {
        const token = localStorage.getItem("token");
        const res = await axios.post(`${BASE_URL}/plan/create-data`, params, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return res.data?.success
            ? { status: true, message: res.data.message }
            : {
                status: false,
                message: res.data.message,
            };
    } catch (error: any) {
        if (error.response && error.response.status === 422) {
            return {
                status: false,
                message: error.response.data.message,
            };
        }

        return {
            status: false,
            message: error.response?.data?.message || error.message,
        };
    }
};


export const updatePlan = async (
    id: number,
    name: string,
    price_monthly: number,
    price_yearly: number,
    description: string,
    trial_days: number,
    features: arrayOutputType<any>,
    features_another: arrayOutputType<any>,
): Promise<{ status: boolean; message?: string }> => {
    const params = {
        name,
        price_monthly,
        price_yearly,
        description,
        trial_days,
        features,
        features_another
    }
    try {
        const token = localStorage.getItem("token");

        const res = await axios.post(`${BASE_URL}/plan/update-data/${id}`, params,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return res.data?.success
            ? { status: true, message: res.data.message }
            : { status: false, message: res.data.message};
    } catch (error: any) {
        return { status: false, message: error.message };
    }
};

export const getPlanById = async (id: number): Promise<{
    popular_plan: number;
    id: number,
    name: string,
    price_monthly: number,
    price_yearly: number,
    description: string,
    trial_days: number,
    features: arrayOutputType<any>} | null> => {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
            `${BASE_URL}/plan/detail-data/${id}`,{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (res.data.success && res.data.data) {
            const { name, popular_plan, price_monthly, price_yearly, description, trial_days, features} = res.data.data;
            return { id, name, popular_plan, price_monthly, price_yearly, description, trial_days, features };
        }

        return null;
    } catch (err) {
        console.error(err);
        return null;
    }
};


export async function deletePlan(id: number) {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`${BASE_URL}/plan/delete-data/${id}`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response.data
    } catch (error: any) {
        console.error(error)
        return {
            status: false,
            message: error?.response?.data?.message,
        }
    }
}


// ====================
// 📩 Master Coupon APIs
// ====================

export const AllCoupon = async (page: number, size: number, search: string): Promise<{
    data: CouponModal[];
    meta: {
        current_page: number;
        from: number;
        to: number;
        per_page: number;
        total: number;
        last_page: number;
    }; total: number } | null> => {
    try {
        const token = localStorage.getItem("token");

        const response  = await axios.get(`${BASE_URL}/coupon/get-data?page=${page}&per_page=${size}&search=${encodeURIComponent(search)}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const saveCoupon = async (
    code: string,
    percentage: number,
    plan_id: string,
    action_type: number,
    limit: number,
    deleted_at: string,
    expiry_at: string
): Promise<{ status: boolean; message?: string }> => {
    const params = {
        code,
        percentage,
        plan_id,
        action_type,
        limit,
        deleted_at,
        expiry_at,
    };

    try {
        const token = localStorage.getItem("token");
        const res = await axios.post(`${BASE_URL}/coupon/create-data`, params, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return res.data?.success
            ? { status: true, message: res.data.message }
            : {
                status: false,
                message: res.data.message,
            };
    } catch (error: any) {
        if (error.response && error.response.status === 422) {
            return {
                status: false,
                message: error.response.data.message,
            };
        }

        return {
            status: false,
            message: error.response?.data?.message || error.message,
        };
    }
};

export const getCouponById = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get(`${BASE_URL}/coupon/detail-data/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.data; // pastikan sesuai dengan response API-mu
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const updateCoupon = async (
    id: number,
    code: string,
    percentage: number,
    plan_id: string,
    action_type: number,
    limit: number,
    deleted_at: string,
    expiry_at: string
) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.post(`${BASE_URL}/coupon/update-data/${id}`, {
            code,
            percentage,
            plan_id,
            action_type,
            limit,
            deleted_at,
            expiry_at,
        }, {
            headers: { Authorization: `Bearer ${token}` }
        })

        return response.data?.success
            ? { status: true, message: response.data.message }
            : {
                status: false,
                message: response.data.message,
            };
    } catch (error) {
        console.error(error)
        return { status: false, message: error }
    }
}

export async function deleteCoupon(id: number) {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`${BASE_URL}/coupon/delete-data/${id}`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response.data
    } catch (error: any) {
        console.error(error)
        return {
            status: false,
            message: error?.response?.data?.message,
        }
    }
}


// ====================
// 📩 Master Payment APIs
// ====================

export const savePayment = async (formData: FormData): Promise<{ status: boolean; message?: string }> => {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.post(`${BASE_NEW_URL}/payment-method/create-data`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return res.data?.success
            ? { status: true, message: res.data.message }
            : {
                status: false,
                message: res.data.message,
            };
    } catch (error: any) {
        if (error.response && error.response.status === 422) {
            return {
                status: false,
                message: error.response.data.message,
            };
        }

        return {
            status: false,
            message: error.response?.data?.message || error.message,
        };
    }
};

export const AllPayment = async (page: number, size: number, search: string): Promise<{
    data: PaymentModel[];
    meta: {
        current_page: number;
        from: number;
        to: number;
        per_page: number;
        total: number;
        last_page: number;
    }; total: number } | null> => {
    try {
        const token = localStorage.getItem("token");

        const response  = await axios.get(`${BASE_NEW_URL}/payment-method/get-data?page=${page}&per_page=${size}&search=${encodeURIComponent(search)}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const getPaymentById = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get(`${BASE_NEW_URL}/payment-method/detail-data/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.data; // pastikan sesuai dengan response API-mu
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const updatePayment = async (id: number, formData: FormData) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.post(`${BASE_NEW_URL}/payment-method/update-data/${id}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }

        })

        return response.data?.success
            ? { status: true, message: response.data.message }
            : {
                status: false,
                message: response.data.message,
            };
    } catch (error) {
        console.error(error)
        return { status: false, message: error }
    }
}

export async function deletePayment(id: number) {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`${BASE_NEW_URL}/payment-method/delete-data/${id}`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response.data
    } catch (error: any) {
        console.error(error)
        return {
            status: false,
            message: error?.response?.data?.message,
        }
    }
}

// ====================
// 📩 Subscription APIs
// ====================

export const AllSubscription = async (page: number, size: number, search: string): Promise<{
    data: SubscriptionModel[];
    meta: {
        current_page: number;
        from: number;
        to: number;
        per_page: number;
        total: number;
        last_page: number;
    }; total: number } | null> => {
    try {
        const token = localStorage.getItem("token");

        const response  = await axios.get(`${BASE_URL}/subscribe/get-data?page=${page}&per_page=${size}&search=${encodeURIComponent(search)}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const getSubscribeById = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get(`${BASE_URL}/subscribe/detail-data/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

// ====================
// 📩 Users APIs
// ====================

export const AllUsers = async (page: number, size: number, search: string): Promise<{
    data: UsersModel[];
    meta: {
        current_page: number;
        from: number;
        to: number;
        per_page: number;
        total: number;
        last_page: number;
    }; total: number } | null> => {
    try {
        const token = localStorage.getItem("token");

        const response  = await axios.get(`${BASE_USERS_URL}/users/list?page=${page}&per_page=${size}&search=${encodeURIComponent(search)}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const getUserById = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get(`${BASE_USERS_URL}/users/detail/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const updateUser = async (id: number, name:string, email:string, phone:number, password:string) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.put(`${BASE_USERS_URL}/users/edit/${id}?name=${name}&email=${email}&phone=${phone}&password=${password}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export async function deleteUser(id: number) {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`${BASE_USERS_URL}/users/delete-data/${id}`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response.data
    } catch (error: any) {
        console.error(error)
        return {
            status: false,
            message: error?.response?.data?.message,
        }
    }
}
