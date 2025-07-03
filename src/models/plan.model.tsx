export interface Plan {
    id: number,
    slug: string,
    name: string,
    price: number,
    price_yearly: number,
    price_monthly: number,
    billing_cycle: string,
    created_at: string
}