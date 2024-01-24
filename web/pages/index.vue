<template>
  <div>
    <page-header title="Travels">
      <template #actions>
        <input
          v-model="searchTerm"
          placeholder="Search..."
          class="shadow-sm border border-gray-200 rounded-md px-2.5 py-2 text-sm"
          @keydown.enter="search"
        >

        <nuxt-link
          v-if="$auth.user?.role === 'organizer'"
          to="/new"
        >
          <button
            type="button"
            class="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand"
          >
            New
          </button>
        </nuxt-link>
      </template>
    </page-header>

    <page-body>
      <div
        v-if="travels"
        class="mt-8 flex flex-col"
      >
        <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div
            class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8"
          >
            <div
              class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg"
            >
              <table
                class="bg-white rounded-lg shadow min-w-full divide-y divide-gray-300"
              >
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Name
                    </th>

                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>

                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Number of days
                    </th>

                    <th
                      scope="col"
                      class="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span class="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>

                <tbody class="divide-y divide-gray-200 bg-white">
                  <tr
                    v-for="travel in travels.items"
                    :key="travel.id"
                  >
                    <td
                      class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                    >
                      {{ travel.name }}
                    </td>

                    <td
                      class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 flex"
                    >
                      <travel-status :is-public="travel.isPublic" />
                    </td>

                    <td
                      class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                    >
                      {{ travel.numberOfDays }}
                    </td>

                    <td
                      class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-4"
                    >
                      <nuxt-link
                        :to="travel.id"
                        class="text-gray-500 hover:text-gray-700"
                      >
                        View
                        <span class="sr-only">, {{ travel.name }}</span>
                      </nuxt-link>

                      <nuxt-link
                        v-if="$auth.user?.role === 'organizer'"
                        :to="travel.id + '/edit'"
                        class="text-brand hover:text-brand-700"
                      >
                        Edit
                        <span class="sr-only">, {{ travel.name }}</span>
                      </nuxt-link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <table-pagination
              :page="page"
              :rows="rows"
              :total="travels.count"
              @change="onPaginationChange"
            />
          </div>
        </div>
      </div>
    </page-body>
  </div>
</template>

<script lang="ts">
import {
  Travels,
  type TravelsQuery,
  type TravelsQueryVariables,
} from '~/graphql/generated';
export default defineNuxtComponent({
  name: 'IndexPage',
  setup(_props, ctx) {
    const __instance = getCurrentInstance();
    const __getCtx = (__gp) =>
      __instance.ctx[__gp] ??
      __instance.appContext.config.globalProperties[__gp];
    const rows = ref(5);
    const page = ref(Number(__getCtx('$route').query.page || 0) || 1);
    const searchTerm = ref((__getCtx('$route').query.search as string) || '');
    const { result } = useQuery(Travels, () => ({
      page: page.value,
      rows: rows.value,
      searchTerm: searchTerm.value,
    }));
    const travels = computed(() => result.value?.travels);
    const search = () => {
      __getCtx('$router').replace({
        query: {
          ...__getCtx('$route').query,
          search: searchTerm.value,
          page: undefined,
        },
      });
    };
    const onPaginationChange = (page: number) => {
      __getCtx('$router').replace({
        query: {
          ...__getCtx('$route').query,
          page: page === 1 ? '' : page.toString(),
        },
      });
    };
    watch(
      () => __getCtx('$route').query.page,
      (page: string) => {
        page.value = Number(page) || 1;
      },
    );
    return { travels, rows, page, searchTerm, search, onPaginationChange };
  },
});
</script>
