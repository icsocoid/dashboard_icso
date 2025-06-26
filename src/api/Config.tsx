import axios from 'axios';
import type {IntEmailTemplate} from "@/models/email-template.model.tsx";
import type {Plan} from "@/models/plan.model.tsx";

const BASE_URL_EMAIL = "https://emailapi.als.today/api/email"
const BASE_URL = "null"
const API_URL = "https://als.icso.biz.id/public/api"; //Login Auth API

// ====================
// 🔐 Auth API
// ====================
export async function loginUser(username: string, password: string) {
    const response = await axios.post(`${API_URL}/login-form`, {
        username,
        password,
    });

    return response.data;
}

// ====================
// 📩 Email Template APIs
// ====================

export const AllEmailTemplates = async (page: number, size: number): Promise<{ data: IntEmailTemplate[]; total: number } | null> => {
    try {
        const res = await axios.get(`${BASE_URL_EMAIL}/all?page=${page}&per_page=${size}`);
        return {
            data: res.data?.data?.data ?? [],
            total: res.data?.data?.total ?? 0,
        };
    } catch (error) {
        console.error("Gagal mengambil semua template:", error);
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
        return { status: false, message: error.message || 'Terjadi kesalahan' };
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
        console.error('Gagal mengambil data:', err);
        return null;
    }
};

export async function deleteTemplate(id: number) {
    try {
        const response = await axios.delete(`${BASE_URL_EMAIL}/delete/${id}`)
        return response.data
    } catch (error: any) {
        console.error("Gagal menghapus data:", error)
        return {
            status: false,
            message: error?.response?.data?.message || "Terjadi kesalahan saat menghapus template",
        }
    }
}

// ====================
// 📩 Master Plan APIs
// ====================

export const AllPlan = async (page: number, size: number): Promise<{ data: Plan[]; total: number } | null> => {
    try {
        const res = await fetch('/planDummy.json');
        const json = await res.json();

        // Simulasi pagination manual
        const startIndex = (page - 1) * size;
        const endIndex = startIndex + size;
        const pagedData = json.slice(startIndex, endIndex);

        return {
            data: pagedData,
            total: json.length,
        };

        // const res = await axios.get(`${BASE_URL}/all?page=${page}&per_page=${size}`);
        // return {
        //     data: res.data?.data?.data ?? [],
        //     total: res.data?.data?.total ?? 0,
        // };
    } catch (error) {
        console.error("Gagal mengambil semua template:", error);
        return null;
    }
}

interface FeaturePayload {
    description: string;
    qty: number;
    has_access: "yes" | "no";
}

export const savePlan = async (
    name: string,
    price_monthly: number,
    price_yearly: number,
    description: string,
    trial_days: number,
    features: FeaturePayload[]
): Promise<{ status: boolean; message?: string }> => {
    const params = {
        name,
        price_monthly,
        price_yearly,
        description,
        trial_days,
        features,
    }
    try {
        const res = await axios.post(`${BASE_URL}/plan/create-data`, params);

        return res.data?.status
            ? { status: true }
            : { status: false, message: res.data.message || "Gagal menyimpan data" };
    } catch (error: any) {
        return { status: false, message: error.message || "Terjadi kesalahan" };
    }
};

export const updatePlan = async (
    id: number,
    name: string,
    price_monthly: number,
    price_yearly: number,
    description: string,
    trial_days: number,
    features: FeaturePayload[]
): Promise<{ status: boolean; message?: string }> => {
    const params = {
        name,
        price_monthly,
        price_yearly,
        description,
        trial_days,
        features,
    }
    try {
        const res = await axios.post(`${BASE_URL}/plan/update-data/${id}`, params);
        return res.data?.status
            ? { status: true }
            : { status: false, message: res.data.message || "Gagal menyimpan plan" };
    } catch (error: any) {
        return { status: false, message: error.message || "Terjadi kesalahan" };
    }
};

export const getPlanById = async (id: number): Promise<{
    id: number,
    name: string,
    price_monthly: number,
    price_yearly: number,
    description: string,
    trial_days: number,
    features: FeaturePayload[]} | null> => {
    try {
        const res = await axios.get(
            `/planDetailDummy.json`
        );


        if (res.data.success && res.data.data) {
            const { name, price_monthly, price_yearly, description, trial_days, features } = res.data.data;

            // Pastikan `price_*` bertipe number
            return {
                id,
                name,
                price_monthly: Number(price_monthly),
                price_yearly: Number(price_yearly),
                description,
                trial_days,
                features: features.map((f: any) => ({
                    description: f.description,
                    quantity: Number(f.quantity),
                    has_access: f.has_access === "yes" ? "yes" : "no",
                }))
            };
        }

        // const res = await axios.get(
        //     `${BASE_URL}/plan/detail-data/${id}`
        // );
        //
        // if (res.data.status && res.data.data) {
        //     const { name, price_monthly, price_yearly, description, trial_days, features} = res.data.data;
        //     return { name, price_monthly, price_yearly, description, trial_days, features };
        // }

        return null;
    } catch (err) {
        console.error('Gagal mengambil data:', err);
        return null;
    }
};


export async function deletePlan(id: number) {
    try {
        const response = await axios.delete(`/planDeleteDummy.json?id=${id}`);
        return response.data

        // const response = await axios.delete(`${BASE_URL}/plan/delete-data/${id}`)
        // return response.data
    } catch (error: any) {
        console.error("Gagal menghapus data:", error)
        return {
            status: false,
            message: error?.response?.data?.message || "Terjadi kesalahan saat menghapus data",
        }
    }
}