<template>
  <div>
    <page-header title="New Tour">
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
          form="new-tour"
          class="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand"
        >
          Save
        </button>
      </template>
    </page-header>

    <page-body>
      <div class="card">
        <tour-form
          form-id="new-tour"
          :save="save"
        />
      </div>
    </page-body>
  </div>
</template>

<script lang="ts">
import {
  CreateTour,
  type CreateTourInput,
  type CreateTourMutation,
  type CreateTourMutationVariables,
} from '~/graphql/generated';
export default defineNuxtComponent({
  name: 'NewTourPage',
  setup(_props, ctx) {
    const __instance = getCurrentInstance();
    const __getCtx = (__gp) =>
      __instance.ctx[__gp] ??
      __instance.appContext.config.globalProperties[__gp];
    const cancel = () => {
      __getCtx('$router').go(-1);
    };
    const save = async (data: CreateTourInput) => {
      await __getCtx('$apollo').mutate<
        CreateTourMutation,
        CreateTourMutationVariables
      >({
        mutation: CreateTour,
        variables: {
          data: {
            ...data,
            travelId: __getCtx('$route').params.travelId,
          },
        },
      });
      __getCtx('$router').go(-1);
    };
    return { cancel, save };
  },
});
</script>
