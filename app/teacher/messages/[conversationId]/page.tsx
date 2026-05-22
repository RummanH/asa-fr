"use client";

import { RoleProtectedPage } from "@/components/auth/role-protected-page";
import { ChatConversationPage } from "@/components/chat/chat-conversation-page";

export default function TeacherConversationPage() {
  return (
    <RoleProtectedPage role="TEACHER" loadingLabel="Loading conversation...">
      {({ accessToken, user }) => (
        <ChatConversationPage
          role="TEACHER"
          accessToken={accessToken}
          currentUserId={user.id}
        />
      )}
    </RoleProtectedPage>
  );
}
