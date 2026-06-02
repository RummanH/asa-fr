"use client";

import { RoleProtectedPage } from "@/components/auth/role-protected-page";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { getTeacherNavItems } from "@/components/dashboard/teacher-nav";
import { ChatConversationPage } from "@/components/chat/chat-conversation-page";

export default function TeacherConversationPage() {
  return (
    <RoleProtectedPage role="TEACHER" loadingLabel="Loading conversation...">
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
