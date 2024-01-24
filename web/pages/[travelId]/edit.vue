<template>
  <div>
    <page-header :title="travel ? travel.name : 'Loading...'">
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
          form="edit-travel"
          class="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand"
        >
          Save
        </button>
      </template>
    </page-header>

    <page-body>
      <div
        v-if="travel === null"
        class="card"
      >
        <p>Loading...</p>
      </div>

      <div
        v-if="travel"
        class="card"
      >
        <travel-form
          form-id="edit-travel"
          :save="save"
          :initial-data="{
            name: travel.name,
            slug: travel.slug,
            description: travel.description,
            numberOfDays: travel.numberOfDays,
            natureMood: travel.natureMood,
            relaxMood: travel.relaxMood,
            historyMood: travel.historyMood,
            cultureMood: travel.cultureMood,
            partyMood: travel.partyMood,
          }"
        />
      </div>
    </page-body>
  </div>
</template>

<script lang="ts">
import {
  type CreateTravelInput,
  Travel,
  type TravelQuery,
  type TravelQueryVariables,
  UpdateTravel,
  type UpdateTravelMutation,
  type UpdateTravelMutationVariables,
} from '~/graphql/generated';
import { isApolloError } from '~/utils/errors';
export default defineNuxtComponent({
  name: 'EditTravelPage',
  setup(_props, ctx) {
    const __instance = getCurrentInstance();
    const __getCtx = (__gp) =>
      __instance.ctx[__gp] ??
      __instance.appContext.config.globalProperties[__gp];
    const { result: travelResult } = useQuery(Travel, () => ({
      id: __getCtx('$route').params.travelId,
    }));
    const travel = computed(() => travelResult.value?.travel);
    const cancel = () => {
      __getCtx('$router').go(-1);
    };
    const save = async (data: CreateTravelInput) => {
      try {
        await __getCtx('$apollo').mutate<
          UpdateTravelMutation,
          UpdateTravelMutationVariables
        >({
          mutation: UpdateTravel,
          variables: {
            data: {
              ...data,
              id: travel.value!.id,
            },
          },
        });
        __getCtx('$router').go(-1);
      } catch (error) {
        if (isApolloError(error)) {
          const errors = error.graphQLErrors.map((e) => e.message);
          if (errors.includes('slug-already-exists')) {
            alert('A travel with this slug already exists');
          }
        }
      }
    };
    return { travel, cancel, save };
  },
});
</script>
