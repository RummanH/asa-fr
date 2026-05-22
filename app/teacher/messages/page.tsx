"use client";

import { RoleProtectedPage } from "@/components/auth/role-protected-page";
import { ChatInboxPage } from "@/components/chat/chat-inbox-page";

export default function TeacherMessagesPage() {
  return (
    <RoleProtectedPage role="TEACHER" loadingLabel="Loading teacher inbox...">
      {({ accessToken }) => <ChatInboxPage role="TEACHER" accessToken={accessToken} />}
    </RoleProtectedPage>
  );
}
