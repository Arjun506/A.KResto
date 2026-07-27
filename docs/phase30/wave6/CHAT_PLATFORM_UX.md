# Phase 30 Wave 6 — Chat Platform UX Specifications

---

## Universal Contextual Chat Center Blueprint

```typescript
export interface ChatConversation {
  conversationId: string;
  contextType: 'ORDER' | 'BOOKING' | 'RIDE' | 'TASK' | 'SUPPORT' | 'INCIDENT';
  contextId: string;
  participants: { id: string; name: string; role: string }[];
  unreadCount: number;
  lastMessage?: { text: string; sentAt: string };
}
```
