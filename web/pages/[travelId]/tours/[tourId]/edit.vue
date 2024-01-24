<template>
  <div>
    <page-header :title="tour ? tour.name : 'Loading...'">
      <template #actions>
        <button
          type="button"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand"
          @click="cancel"
        >
          Cancel
        </button>

        <button
          type="submit"
          form="edit-tour"
          class="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand"
        >
          Save
        </button>
      </template>
    </page-header>

    <page-body>
      <div
        v-if="tour === null"
        class="card"
      >
        <p>Loading...</p>
      </div>

      <div
        v-if="tour"
        class="card"
      >
        <tour-form
          form-id="edit-tour"
          :save="save"
          :initial-data="{
            name: tour.name,
            startingDate: tour.startingDate,
            endingDate: tour.endingDate,
            price: tour.price,
          }"
        />
      </div>
    </page-body>
  </div>
</template>

<script lang="ts">
import {
  Tour,
  type TourQuery,
  type TourQueryVariables,
  UpdateTour,
  type UpdateTourInput,
} from '~/graphql/generated';
export default defineNuxtComponent({
  name: 'EditTourPage',
  apollo: {
    tour: {
      query: Tour,
      variables(): TourQueryVariables {
        return {
          id: this.$route.params.tourId,
        };
      },
    },
  },
  setup(_props, ctx) {
    const __instance = getCurrentInstance();
    const __getCtx = (__gp) =>
      __instance.ctx[__gp] ??
      __instance.appContext.config.globalProperties[__gp];
    const { result: tourResult } = useQuery(Tour, () => ({
      id: __getCtx('$route').params.tourId,
    }));
    const tour = computed(() => tourResult.value?.tour);
    const cancel = () => {
      __getCtx('$router').go(-1);
    };
    const save = async (data: Omit<UpdateTourInput, 'id'>) => {
      await __getCtx('$apollo').mutate({
        mutation: UpdateTour,
        variables: {
          data: {
            ...data,
            id: tour.value!.id,
          },
        },
      });
      __getCtx('$router').go(-1);
    };
    return { tour, cancel, save };
  },
});
</script>
