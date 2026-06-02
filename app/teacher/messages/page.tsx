"use client";

import { RoleProtectedPage } from "@/components/auth/role-protected-page";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { getTeacherNavItems } from "@/components/dashboard/teacher-nav";
import { ChatInboxPage } from "@/components/chat/chat-inbox-page";

export default function TeacherMessagesPage() {
  return (
    <RoleProtectedPage role="TEACHER" loadingLabel="Loading teacher inbox...">
      {({ user, accessToken, logoutAction, isLoggingOut }) => (
        <DashboardLayout
          navItems={getTeacherNavItems("messages")}
          userName={user.name}
          userEmail={user.email}
          userRole={user.role}
          settingsHref="/teacher/profile"
          onLogout={logoutAction}
          isLoggingOut={isLoggingOut}
        >
          <ChatInboxPage role="TEACHER" accessToken={accessToken} />
        </DashboardLayout>
      )}
    </RoleProtectedPage>
  );
}
