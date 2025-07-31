import type {Plan} from "@/models/plan.model";

export interface OrderItem {
    id: number,
    order_id: number,
    item_type: string,
    qty: number,
    order_duration: string,
    price: number,
    price_type: string,
    item_id: number,
    plan: Plan
}