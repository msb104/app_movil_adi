declare module '@/stores/authStore' {
  import type { StoreGeneric } from 'pinia';

  type PocketbaseRecord = Record<string, any> & { id?: string };

  export interface AuthStoreState {
    user: PocketbaseRecord | null;
    loginLoading: boolean;
    loginError: string;
    registerLoading: boolean;
    registerError: string;
    registerSuccess: string;
  }

  export interface AuthStoreActions {
    login(email: string, password: string): Promise<void>;
    register(name: string, email: string, password: string, confirmPassword: string): Promise<void>;
    doLogout(): void;
    logout(): void;
    syncUserFromSession(): void;
  }

  export type AuthStore = StoreGeneric &
    AuthStoreState &
    AuthStoreActions & {
      readonly isAuthenticated: boolean;
    };

  export function useAuthStore(): AuthStore;
}

declare module '@/stores/eventStore' {
  import type { StoreGeneric } from 'pinia';

  type EventRecord = Record<string, any> & { id?: string };

  export interface EventStoreState {
    events: EventRecord[];
    loading: boolean;
    error: string;
    lastUpdated: number | null;
    realtimeActive: boolean;
  }

  type RealtimeEvent = {
    action: string;
    record: EventRecord;
  };

  export interface EventStoreActions {
    fetchEvents(): Promise<void>;
    startRealtime(): Promise<void>;
    stopRealtime(): void;
    createEvent(eventData: EventRecord): Promise<EventRecord | undefined>;
    updateEvent(eventId: string, eventData: EventRecord): Promise<EventRecord | undefined>;
    deleteEvent(eventId: string): Promise<void>;
    clearError(): void;
    handleRealtimeEvent(event: RealtimeEvent): void;
  }

  export type EventStore = StoreGeneric & EventStoreState & EventStoreActions;

  export function useEventStore(): EventStore;
}

declare module '@/backend/services/userService' {
  type UserUpdatePayload = Record<string, any>;

  export function updateUser(updatedData: UserUpdatePayload): Promise<UserUpdatePayload>;
  export function updatePassword(currentPassword: string, newPassword: string): Promise<void>;
}

declare module '@/backend/services/authService' {
  type AuthRecord = Record<string, any>;

  export function login(email: string, password: string): Promise<AuthRecord>;
  export function logout(): void;
  export function register(
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<AuthRecord>;
  export function deleteUser(): Promise<void>;
  export function isAuthenticated(): boolean;
  export function getCurrentUser(): AuthRecord | null;
}
