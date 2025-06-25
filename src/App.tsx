import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "@/pages/dashboard/Dashboard.tsx";
import LoginPage from "@/pages/login/LoginPage.tsx";
import PrivateRoute from "@/components/PrivateRoute.tsx";
import EmailTemplateEditor from "@/pages/email/EmailTemplateEditor.tsx";
import EmailEditor from "@/pages/email/EmailEditor.tsx";
import React from "react";
import EmailTemplate from "@/pages/email/EmailTemplate.tsx";

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


            </Routes>
        </BrowserRouter>
    );
};

export default App;