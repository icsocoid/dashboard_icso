import axios from 'axios';
import type {IntEmailTemplate} from "@/models/email-template.model.tsx";

const BASE_URL = "https://emailapi.als.today/api/api/email"
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

export const AllEmailTemplates = async (): Promise<IntEmailTemplate[] | null> => {
    try {
        const res = await axios.get(`${BASE_URL}/all`)
        return res.data?.data?.data ?? null
    } catch (error) {
        console.error("Gagal mengambil semua template:", error)
        return null
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
            `${BASE_URL}/template/store`,
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
            `${BASE_URL}/edit/${id}`,
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
            `${BASE_URL}/template/${id}`
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
        const response = await axios.delete(`${BASE_URL}/delete/${id}`)
        return response.data
    } catch (error: any) {
        console.error("Gagal menghapus data:", error)
        return {
            status: false,
            message: error?.response?.data?.message || "Terjadi kesalahan saat menghapus template",
        }
    }
}