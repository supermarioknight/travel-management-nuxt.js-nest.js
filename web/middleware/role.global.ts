type Role = 'organizer' | 'traveler';

import type { RoutesNamesList } from '@typed-router';

export default defineNuxtRouteMiddleware(async (to) => {
  const nuxtApp = useNuxtApp();

  const accessURLS: Record<Role, RoutesNamesList[]> = {
    organizer: [
      'login',
      'index',
      'new',
      'travelId',
      'travelId-edit',
      'travelId-tours-new',
      'travelId-tours-tourId',
      'travelId-tours-tourId-edit',
    ],
    traveler: ['login', 'index', 'travelId', 'travelId-tours-tourId'],
  };

  const role = nuxtApp.$auth.user?.role as Role | undefined;
  const routeName = to.name as RoutesNamesList;

  if (!role) return;

  if (!accessURLS[role].includes(routeName)) {
    if (import.meta.env.DEV) {
      console.warn(
        `USER WITH ROLE: '${role}' IS NOT ALLOWED TO ENTER ROUTE: ${routeName}`,
      );
    }

    return navigateTo('/');
  }
});
