"use client";

import { RoleProtectedPage } from "@/components/auth/role-protected-page";
import { ChatInboxPage } from "@/components/chat/chat-inbox-page";

export default function InstitutionMessagesPage() {
  return (
    <RoleProtectedPage role="INSTITUTION" loadingLabel="Loading institution inbox...">
      {({ accessToken }) => <ChatInboxPage role="INSTITUTION" accessToken={accessToken} />}
    </RoleProtectedPage>
  );
}
