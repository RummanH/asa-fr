"use client";

import { RoleProtectedPage } from "@/components/auth/role-protected-page";
import { ChatConversationPage } from "@/components/chat/chat-conversation-page";

export default function InstitutionConversationPage() {
  return (
    <RoleProtectedPage role="INSTITUTION" loadingLabel="Loading conversation...">
      {({ accessToken, user }) => (
        <ChatConversationPage
          role="INSTITUTION"
          accessToken={accessToken}
          currentUserId={user.id}
        />
      )}
    </RoleProtectedPage>
  );
}
