export const avatarOptions = [
  { key: "robot", label: "ربات", src: "/avatars/robot.png", color: "bg-blue-100" },
  { key: "lion", label: "شیر", src: "/avatars/lion.png", color: "bg-yellow-100" },
  { key: "cat", label: "گربه", src: "/avatars/cat.png", color: "bg-white" },
  { key: "astronaut", label: "فضانورد", src: "/avatars/astronaut.png", color: "bg-indigo-100" },
  // Keeping some fallbacks or previous keys mapped to new images or defaults if needed
  { key: "star", label: "ستاره", src: "/avatars/robot.png", color: "bg-slate-100" }, // Fallback for legacy
];

export function getAvatarSrc(key: string) {
  return avatarOptions.find((item) => item.key === key)?.src ?? "/avatars/robot.png";
}

export function getAvatarLabel(key: string) {
  return avatarOptions.find((item) => item.key === key)?.label ?? "کودک";
}
