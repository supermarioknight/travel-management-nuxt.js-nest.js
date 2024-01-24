<template>
  <div>
    <page-header :title="tour ? tour.name : 'Loading...'">
      <template
        v-if="tour && travel"
        #actions
      >
        <nuxt-link
          :to="'/' + travel.id"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand"
        >
          Back to travel
        </nuxt-link>

        <nuxt-link
          v-if="$auth.user && $auth.user.role === 'organizer'"
          :to="'/' + travel.id + '/tours/' + tour.id + `/edit`"
          class="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand"
        >
          Edit
        </nuxt-link>

        <template v-if="$auth.user && $auth.user.role === 'traveler'">
          <template v-if="tour.users.some((u) => u.id === $auth.user.userId)">
            <span
              class="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              I am going &rpar;
            </span>

            <button
              class="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand"
              @click="revoke"
            >
              Revoke
            </button>
          </template>
          <button
            v-else
            class="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand"
            @click="apply"
          >
            I want to go!
          </button>
        </template>
      </template>
    </page-header>

    <page-body>
      <div
        v-if="!travel || !tour"
        class="card"
      >
        <p>Loading...</p>
      </div>

      <div
        v-else
        class="card"
      >
        <div class="bg-white rounded-lg shadow px-4 py-5 sm:p-0">
          <dl class="sm:divide-y sm:divide-gray-200">
            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">
                Travel name
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {{ travel.name }}
              </dd>
            </div>

            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">
                Tour name
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {{ tour.name }}
              </dd>
            </div>

            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">
                Start date
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex">
                {{ new Date(tour.startingDate).toLocaleDateString() }}
              </dd>
            </div>

            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">
                End date
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {{ new Date(tour.endingDate).toLocaleDateString() }}
              </dd>
            </div>

            <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">
                Price
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                €
                {{ new Intl.NumberFormat().format(tour.price / 100) }}
              </dd>
            </div>
          </dl>
        </div>

        <template v-if="$auth.user?.role === 'organizer'">
          <h3
            class="text-md mt-5 font-bold leading-7 text-gray-900 sm:text-2xl sm:truncate"
          >
            Travelers
          </h3>

          <div
            v-if="tour.users.length === 0"
            class="mt-3 bg-white rounded-lg shadow px-4 py-5"
          >
            There no applied travelers
          </div>
          <div
            v-else
            class="mt-3 bg-white rounded-lg shadow px-4 py-5 sm:p-0"
          >
            <dl class="sm:divide-y sm:divide-gray-200">
              <div
                v-for="user in tour.users"
                :key="user.id"
                class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
              >
                <dt class="text-sm font-medium text-gray-500 sm:col-span-2">
                  {{ user.id }}
                </dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0">
                  <button
                    v-if="$auth.user && $auth.user.role === 'organizer'"
                    type="button"
                    class="text-brand-500 hover:text-brand-700 font-medium"
                    @click="revokeTraveler(user.id)"
                  >
                    Revoke traveler
                  </button>
                </dd>
              </div>
            </dl>
          </div>
        </template>
      </div>
    </page-body>
  </div>
</template>

<script lang="ts">
import {
  Tour,
  type TourQuery,
  type TourQueryVariables,
  Travel,
  type TravelQueryVariables,
  type TravelQuery,
  ApplyTour,
  RevokeTour,
} from '~/graphql/generated';
export default defineNuxtComponent({
  name: 'EditTourPage',
  setup(_props, ctx) {
    const __instance = getCurrentInstance();
    const __getCtx = (__gp) =>
      __instance.ctx[__gp] ??
      __instance.appContext.config.globalProperties[__gp];
    const { result: travelResult } = useQuery(Travel, () => ({
      id: __getCtx('$route').params.travelId,
    }));
    const travel = computed(() => travelResult.value?.travel);
    const { result: tourResult, refetch: refetchTour } = useQuery(Tour, () => ({
      id: __getCtx('$route').params.tourId,
    }));
    const tour = computed(() => tourResult.value?.tour);
    const cancel = () => {
      __getCtx('$router').go(-1);
    };
    const apply = async () => {
      await __getCtx('$apollo').mutate({
        mutation: ApplyTour,
        variables: {
          data: {
            tourId: __getCtx('$route').params.tourId,
            userId: __getCtx('$auth').user!.userId,
          },
        },
      });
      await refetchTour();
    };
    const revoke = async () => {
      if (!confirm('Do you really want to revoke from this tour?')) return;
      await __getCtx('$apollo').mutate({
        mutation: RevokeTour,
        variables: {
          data: {
            tourId: __getCtx('$route').params.tourId,
            userId: __getCtx('$auth').user!.userId,
          },
        },
      });
      await refetchTour();
    };
    const revokeTraveler = async (userId: string) => {
      if (
        !confirm(
          `Do you really want to revoke traveler: ${userId} from this tour?`,
        )
      )
        return;
      await __getCtx('$apollo').mutate({
        mutation: RevokeTour,
        variables: {
          data: {
            tourId: __getCtx('$route').params.tourId,
            userId,
          },
        },
      });
      await refetchTour();
    };
    return { travel, tour, cancel, apply, revoke, revokeTraveler };
  },
});
</script>
