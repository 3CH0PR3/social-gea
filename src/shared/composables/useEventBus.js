/**
 * EventBus singleton para comunicación desacoplada entre stores y componentes
 * Cumple principios SOLID (evita acoplamiento cruzado directo entre stores)
 */
class EventBus {
  constructor() {
    this.events = {};
  }

  emit(event, data) {
    if (import.meta.env.DEV) {
      console.log(`[EventBus] 📡 Emitting: ${event}`, data);
    }
    if (!this.events[event]) return;
    this.events[event].forEach((callback) => {
      try {
        callback(data);
      } catch (err) {
        console.error(`[EventBus] Error handling ${event}:`, err);
      }
    });
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter((cb) => cb !== callback);
  }

  once(event, callback) {
    const wrappedCallback = (data) => {
      callback(data);
      this.off(event, wrappedCallback);
    };
    this.on(event, wrappedCallback);
  }
}

const eventBus = new EventBus();

export const EVENTS = {
  // Posts
  POST_CREATED: 'post:created',
  POST_UPDATED: 'post:updated',
  POST_DELETED: 'post:deleted',
  POST_SAVED: 'post:saved',

  // Comments
  COMMENT_CREATED: 'comment:created',
  COMMENT_UPDATED: 'comment:updated',
  COMMENT_DELETED: 'comment:deleted',

  // Reactions
  REACTION_UPDATED: 'reaction:updated',

  // User & Profile
  USER_PROFILE_UPDATED: 'user:profile-updated',
  USER_AVATAR_UPDATED: 'user:avatar-updated',
  USER_COVER_UPDATED: 'user:cover-updated',

  // EcoPoints & Rewards
  POINTS_UPDATED: 'points:updated',
  REWARD_REDEEMED: 'reward:redeemed',
  REWARDS_SYNCED: 'rewards:synced',

  // Companies & Subscriptions
  SUBSCRIPTION_UPDATED: 'subscription:updated',
  SUBSCRIPTION_CANCELLED: 'subscription:cancelled',

  // Stories
  STORY_CREATED: 'story:created',

  // Generic
  DATA_REFRESH_NEEDED: 'data:refresh-needed',
};

export function useEventBus() {
  return {
    emit: (event, data) => eventBus.emit(event, data),
    on: (event, callback) => eventBus.on(event, callback),
    off: (event, callback) => eventBus.off(event, callback),
    once: (event, callback) => eventBus.once(event, callback),
    EVENTS,
  };
}

export default eventBus;
