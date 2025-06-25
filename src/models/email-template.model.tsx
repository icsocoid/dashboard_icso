export interface IntEmailTemplate {
    id: number
    code: string
    subject: string
    body?: string      // opsional jika tidak selalu dipakai
    template?: string  // opsional JSON (stringified)
    created_at: string
    updated_at?: string
}