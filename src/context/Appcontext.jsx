import { signal } from "@preact/signals-react";

// Signal for hover states
export const hoverStates = signal(null);

// Signal for storing chat data
export const Chats = signal([]);

// Signal for indicating the selected chat
export const selectedChat = signal(null);

// Signal for storing last messages
export const lastMessages = signal([]);

// Signal for indicating whether a new chat tab is open
export const newChatTab = signal(false);

// Signal for storing target profile information
export const targetProfile = signal(null);

// Signal for storing messages
export const messages = signal([]);

// Signal for storing width data
export const Width = signal([]);

// Signal for storing span width
export const spanWidth = signal(null);

// Signal for storing unread messages
export const UnreadMessages = signal([]);

// Signal for storing rooms data
export const storedRooms = signal(null);

// Signal for storing messages data
export const storedMessages = signal(null);

// Signal for storing quick menu data
export const quickMenu = signal(null);

// Signal for storing emoji list data
export const emojiList = signal(null);

// Signal for displaying pop-up messages
export const popUpMessage = signal(null);
