type User = {
  userId: string;
  role: 'organizer' | 'traveler';
};

export const useUser = () => {
  const auth = useAuth();
  return auth.user as User;
};
