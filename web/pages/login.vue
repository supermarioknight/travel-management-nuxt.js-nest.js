<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div
    class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <img
          class="mx-auto h-12 w-auto"
          src="~/assets/weroad-logo.png"
          alt="Workflow"
        >

        <p class="mt-3 text-center text-gray-600 font-medium">
          Welcome back! Please sign in to your account.
        </p>
      </div>

      <form
        class="mt-8 space-y-6"
        @submit.prevent="onLogin"
      >
        <input
          type="hidden"
          name="remember"
          value="true"
        >

        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label
              for="email"
              class="sr-only"
            > Email address </label>
            <input
              id="email"
              v-model="login.email"
              name="email"
              type="email"
              autocomplete="email"
              required=""
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-brand focus:border-brand focus:z-10 sm:text-sm"
              placeholder="Email address"
            >
          </div>

          <div>
            <label
              for="password"
              class="sr-only"
            > Password </label>
            <input
              id="password"
              v-model="login.password"
              name="password"
              type="password"
              autocomplete="current-password"
              required=""
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-brand focus:border-brand focus:z-10 sm:text-sm"
              placeholder="Password"
            >
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-brand border-gray-300 rounded"
            >
            <label
              for="remember-me"
              class="ml-2 block text-sm text-gray-900"
            >
              Remember me
            </label>
          </div>

          <div class="text-sm">
            <a
              href="#"
              class="font-medium text-brand hover:text-brand-600"
            >
              Forgot your password?
            </a>
          </div>
        </div>

        <div>
          <div class="flex gap-2">
            <button
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand disabled:opacity-50"
              @click="
                () => {
                  login.email = 'traveler@test.com';
                  login.password = 'password';
                }
              "
            >
              Traveler
            </button>
            <button
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand disabled:opacity-50"
              @click="
                () => {
                  login.email = 'organizer@test.com';
                  login.password = 'password';
                }
              "
            >
              Organizer
            </button>
          </div>
          <br>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand disabled:opacity-50"
          >
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
definePageMeta({
  layout: 'auth',
});

export default defineNuxtComponent({
  name: 'LoginPage',
  setup(_props, ctx) {
    const __instance = getCurrentInstance();
    const __getCtx = (__gp) =>
      __instance.ctx[__gp] ??
      __instance.appContext.config.globalProperties[__gp];
    const isLoading = ref(false);
    const login = ref({
      email: '',
      password: '',
    });
    const onLogin = async () => {
      isLoading.value = true;
      try {
        await __getCtx('$auth').loginWith('local', { body: login.value });
        __getCtx('$router').push('/');
      } catch (err) {
        isLoading.value = false;
        alert('Invalid email or password');
      }
    };
    return { isLoading, login, onLogin };
  },
});
</script>
