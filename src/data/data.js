import { Chats } from "../context/Appcontext";



export const sidebarMenu = [
  "New group",
  "Stared messages",
  "Settings",
];

// export const chatMenu = ['Mute notifications', 'Delete chat', 'Pin chat', 'Mark as Unread', 'Block']

export const chatMenu = (id) => {
  const chat = Chats.value.find((u) => u.roomId === id);

  const mute = chat.muted ? "Unmute notifications" : "Mute notifications";
  const pinn = chat.pinned ? "Unpin chat" : "Pin chat";
  const del = "Delete chat";
  const marked = chat.marked ? "Mark as read" : "Mark as Unread";
  const block = chat.blocked ? "Unblock" : "Block";

  return [mute, pinn, del, marked, block]
};


export const messageMenu = [
  "Reply",
  "Forward",
  "Delete"
]


