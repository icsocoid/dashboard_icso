import type {Plan} from "@/models/plan.model";

export interface OrderModel {
    id: number;
    order_no: string;
    user_id: number;
    subscription_id: string;
    tenant_id: string;
    coupon_code: string | null;
    coupon_id: string | null;
    payment_method_id: number;
    discount_amount: number;
    status: string;
    start_date: string;
    end_date: string;
    amount: number;
    order_date: string;
    payment_date: string | null;
    tax_amount: number;
    fees_price: number;
    order_type: string;
    created_at: string;
    updated_at: string;
    plan: Plan;

}