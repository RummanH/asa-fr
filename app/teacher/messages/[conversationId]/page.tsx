"use client";

import { RoleProtectedPage } from "@/components/auth/role-protected-page";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ChatConversationPage } from "@/components/chat/chat-conversation-page";

export default function TeacherConversationPage() {
  return (
    <RoleProtectedPage role="TEACHER" loadingLabel="Loading conversation...">
      {({ user, accessToken, logoutAction, isLoggingOut }) => (
        <DashboardLayout
          navItems={[
            { href: "/teacher/profile", label: "Edit Profile", icon: <span />, isActive: false },
            { href: "/teacher/jobs", label: "Browse Jobs", icon: <span /> },
            { href: "/teacher/messages", label: "Messages", icon: <span />, isActive: true },
            { href: "/teacher/change-password", label: "Change Password", icon: <span /> },
            { href: "/teacher/hire-requests", label: "Received Requests", icon: <span /> },
          ]}
          userName={user.name}
          userEmail={user.email}
          userRole={user.role}
          settingsHref="/teacher/profile"
          onLogout={logoutAction}
          isLoggingOut={isLoggingOut}
        >
          <ChatConversationPage
            role="TEACHER"
            accessToken={accessToken}
            currentUserId={user.id}
          />
        </DashboardLayout>
      )}
    </RoleProtectedPage>
  );
}