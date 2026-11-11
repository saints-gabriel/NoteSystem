import { Navigate, Route, Routes } from "react-router-dom";
import { WorkspaceLayout } from "../components/layout/WorkspaceLayout.jsx";
import { ROLES, STAFF_ROLES, homePathFor } from "../config/roles.js";
import { useSession } from "../context/SessionContext.jsx";
import { LoginPage } from "../features/auth/LoginPage.jsx";
import { DashboardPage } from "../features/dashboard/DashboardPage.jsx";
import { FinancePage } from "../features/finance/FinancePage.jsx";
import { GroupsPage } from "../features/groups/GroupsPage.jsx";
import { LandingPage } from "../features/landing/LandingPage.jsx";
import {
  AdministrationPage,
  CommunicationPage,
  CoursesPage,
  EnrollmentPage,
  FinanceHubPage,
  PedagogyHubPage,
} from "../features/modules/ModulePages.jsx";
import { PedagogyPage } from "../features/pedagogy/PedagogyPage.jsx";
import { StudentPortalPage } from "../features/portal/StudentPortalPage.jsx";
import { ReportsPage } from "../features/reports/ReportsPage.jsx";
import { SchedulePage } from "../features/schedule/SchedulePage.jsx";
import { SettingsPage } from "../features/settings/SettingsPage.jsx";
import { StudentsPage } from "../features/students/StudentsPage.jsx";
import { RoleRoute } from "./RoleRoute.jsx";

/** Telas do workspace. O `id` precisa existir em `config/navigation.js` para aparecer no menu. */
const WORKSPACE_PAGES = [
  { id: "dashboard", element: <DashboardPage /> },
  { id: "students", element: <StudentsPage /> },
  { id: "schedule", element: <SchedulePage /> },
  { id: "groups", element: <GroupsPage /> },
  { id: "finance", element: <FinancePage /> },
  { id: "pedagogy", element: <PedagogyPage /> },
  { id: "reports", element: <ReportsPage /> },
  { id: "settings", element: <SettingsPage /> },
  { id: "enrollment", element: <EnrollmentPage /> },
  { id: "courses", element: <CoursesPage /> },
  { id: "pedagogy-hub", element: <PedagogyHubPage /> },
  { id: "finance-hub", element: <FinanceHubPage /> },
  { id: "communication", element: <CommunicationPage /> },
  { id: "administration", element: <AdministrationPage />, roles: [ROLES.ADMIN] },
];

function FallbackRedirect() {
  const { user } = useSession();
  return <Navigate to={user ? homePathFor(user.role) : "/"} replace />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route
        path="/student-home"
        element={
          <RoleRoute roles={[ROLES.STUDENT]}>
            <StudentPortalPage />
          </RoleRoute>
        }
      />
      <Route element={<RoleRoute roles={STAFF_ROLES} />}>
        <Route element={<WorkspaceLayout />}>
          {WORKSPACE_PAGES.map(({ id, element, roles }) => (
            <Route
              key={id}
              path={id}
              element={roles ? <RoleRoute roles={roles}>{element}</RoleRoute> : element}
            />
          ))}
        </Route>
      </Route>
      <Route path="*" element={<FallbackRedirect />} />
    </Routes>
  );
}
