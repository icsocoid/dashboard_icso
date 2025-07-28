import type {Plan} from "@/models/plan.model.tsx";
import {type UsersModel} from "@/models/users.model";

export interface SubscriptionModel {
    id: number;
    starts_at: string;
    expiry_at: string;
    tenant_id: string;
    plan: Plan;
    user: UsersModel;
}