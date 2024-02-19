import { signal } from "@preact/signals-react";
import users from "../data/users";

const Users = signal(
  [...users].map((user) => ({
    ...user,
    selected: false,
    showMenu: false,
    muted: false,
    pinned: false,
    deleted: false,
    marked: false,
    blocked: false,
  }))
);

export default Users;
