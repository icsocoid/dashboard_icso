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

const App: React.FC = () => {
    // const navigate = useNavigate();
    //
    // useEffect(() => {
    //     const expiredStr = localStorage.getItem("expired");
    //     if (expiredStr) {
    //         const expired = Number(expiredStr);
    //         const now = Date.now();
    //
    //         if (now >= expired) {
    //             logout();
    //         } else {
    //             const timeout = expired - now;
    //             const timer = setTimeout(() => {
    //                 logout();
    //             }, timeout);
    //
    //             return () => clearTimeout(timer); // cleanup saat komponen unmount
    //         }
    //     }
    // }, []);
    //
    // const logout = () => {
    //     localStorage.removeItem("token");
    //     localStorage.removeItem("expired");
    //     navigate("/login");
    // };

    return (

            <Routes>
                <Route path="/login" element={
                        <LoginPage />
                    } />

                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/email-template-add"
                    element={
                        <PrivateRoute>
                            <EmailTemplateEditor />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/email-template-edit/:id"
                    element={
                        <PrivateRoute>
                            <EmailEditor />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/email-template"
                    element={
                        <PrivateRoute>
                            <EmailTemplate />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/plan"
                    element={
                        <PrivateRoute>
                            <PlanPage />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/add-plan"
                    element={
                        <PrivateRoute>
                            <AddPlanPage />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/edit-plan/:id"
                    element={
                        <PrivateRoute>
                            <AddPlanPage />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/coupon"
                    element={
                        <PrivateRoute>
                            <CouponPage />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/edit-coupon/:id"
                    element={
                        <PrivateRoute>
                            <CouponPage />
                        </PrivateRoute>
                    }
                />


            </Routes>
    );
};

export default App;