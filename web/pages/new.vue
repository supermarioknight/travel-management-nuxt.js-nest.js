<template>
  <div>
    <page-header title="New Travel">
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
          form="new-travel"
          class="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand"
        >
          Save
        </button>
      </template>
    </page-header>

    <page-body>
      <div class="card">
        <TravelForm
          :save="save"
          form-id="new-travel"
        />
      </div>
    </page-body>
  </div>
</template>

<script lang="ts">
import { isApolloError } from '~/utils/errors';
import {
  CreateTravel,
  type CreateTravelInput,
  type CreateTravelMutation,
  type CreateTravelMutationVariables,
} from '~/graphql/generated';
export default defineNuxtComponent({
  name: 'NewTravel',
  setup(_props, ctx) {
    const __instance = getCurrentInstance();
    const __getCtx = (__gp) =>
      __instance.ctx[__gp] ??
      __instance.appContext.config.globalProperties[__gp];
    const cancel = () => {
      __getCtx('$router').replace('/');
    };
    const save = async (data: CreateTravelInput) => {
      try {
        const res = await __getCtx('$apollo').mutate<
          CreateTravelMutation,
          CreateTravelMutationVariables
        >({
          mutation: CreateTravel,
          variables: { data },
        });
        __getCtx('$router').replace(`/${res.data?.createTravel.id}`);
      } catch (error) {
        if (isApolloError(error)) {
          const errors = error.graphQLErrors.map((e) => e.message);
          if (errors.includes('slug-already-exists')) {
            alert('A travel with this slug already exists');
          }
        }
      }
    };
    return { cancel, save };
  },
});
</script>
