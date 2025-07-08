import {Routes, Route} from "react-router-dom";
import Dashboard from "@/pages/dashboard/Dashboard.tsx";
import LoginPage from "@/pages/login/LoginPage.tsx";
import PrivateRoute from "@/components/PrivateRoute.tsx";
import EmailTemplateEditor from "@/pages/email/EmailTemplateEditor.tsx";
import EmailEditor from "@/pages/email/EmailEditor.tsx";
import EmailTemplate from "@/pages/email/EmailTemplate.tsx";
import React from "react";
import AddPlanPage from "@/pages/plan/AddPlanPage.tsx";
import PlanPage from "@/pages/plan/PlanPage.tsx";
import CouponPage from "@/pages/coupon/CouponPage.tsx";
import PaymentPage from "@/pages/payment/PaymentPage.tsx";

const privateRoutes = [
    { path: "/", element: <Dashboard /> },
    { path: "/email-template", element: <EmailTemplate /> },
    { path: "/email-template-add", element: <EmailTemplateEditor /> },
    { path: "/email-template-edit/:id", element: <EmailEditor /> },
    { path: "/plan", element: <PlanPage /> },
    { path: "/add-plan", element: <AddPlanPage /> },
    { path: "/edit-plan/:id", element: <AddPlanPage /> },
    { path: "/coupon", element: <CouponPage /> },
    { path: "/edit-coupon/:id", element: <CouponPage /> },
    { path: "/payment", element: <PaymentPage /> },
]

const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />

            {privateRoutes.map(({ path, element }) => (
                <Route
                    key={path}
                    path={path}
                    element={<PrivateRoute>{element}</PrivateRoute>}
                />
            ))}
        </Routes>
    );
};

export default App;