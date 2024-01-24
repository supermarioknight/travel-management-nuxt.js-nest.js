import type { RefreshScheme } from '@nuxt-alt/auth/dist/runtime';
import type { ErrorResponse } from '@nuxtjs/apollo';

export default defineNuxtPlugin((nuxtApp) => {
  // Nuxt Apollo auth hook
  nuxtApp.hook('apollo:auth', async ({ token }) => {
    // @ts-expect-error -- not correct types from auth module
    const strategy = nuxtApp.$auth.strategy as RefreshScheme;

    if (strategy.token.status().expired()) {
      await strategy.refreshTokens();
    }

    const authToken = strategy.token.get();

    if (typeof authToken === 'string') {
      token.value = authToken;
    }
  });

  // Nuxt Apollo error hook
  nuxtApp.hook('apollo:error', (error: ErrorResponse) => {
    console.log('Apollo Error Handler', error);
  });
});
