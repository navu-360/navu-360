export const generateAvatar = (seed: string | number) => {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&radius=50&backgroundType=gradientLinear&fontFamily=Arial&fontSize=41&fontWeight=500`;
};
