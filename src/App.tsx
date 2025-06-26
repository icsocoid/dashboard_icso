import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "@/pages/dashboard/Dashboard.tsx";
import LoginPage from "@/pages/login/LoginPage.tsx";
import PrivateRoute from "@/components/PrivateRoute.tsx";
import EmailTemplateEditor from "@/pages/email/EmailTemplateEditor.tsx";
import EmailEditor from "@/pages/email/EmailEditor.tsx";
import EmailTemplate from "@/pages/email/EmailTemplate.tsx";
import React from "react";
import AddPlanPage from "@/pages/plan/AddPlanPage.tsx";
import PlanPage from "@/pages/plan/PlanPage.tsx";

const App: React.FC = () => {

    return (
        <BrowserRouter>
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


            </Routes>
        </BrowserRouter>
    );
};

export default App;