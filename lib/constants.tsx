import { SidebarLinkTypes } from "@/types";
import { BookOpenText, Home, Plus, User } from "lucide-react";

export const SidebarLinks: SidebarLinkTypes[] = [
  {
    id: 0,
    title: "Stories",
    route: "/",
    icon: <Home size={16} />,
  },
  {
    id: 1,
    title: "Profile",
    route: "/profile",
    icon: <User size={16} />,
  },
  {
    id: 2,
    title: "New Story",
    route: "/new-story",
    icon: <Plus size={16} />,
  },
  {
    id: 3,
    title: "Custom Story",
    route: "/custom-story",
    icon: <BookOpenText size={16} />,
  },
];
