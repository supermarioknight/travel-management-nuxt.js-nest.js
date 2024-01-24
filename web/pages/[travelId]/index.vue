<template>
  <div>
    <page-header :title="travel ? travel.name : 'Loading...'">
      <template
        v-if="travel && user.role === 'organizer'"
        #actions
      >
        <AppButton @click="toggleStatus">
          {{ travel.isPublic ? 'Unpublish' : 'Publish' }}
        </AppButton>

        <AppButton
          variant="secondary"
          class="ml-3"
          @click="onDelete"
        >
          Delete
        </AppButton>

        <AppLink
          name="travelId-edit"
          :params="{ travelId: travel.id }"
        >
          <AppButton
            variant="primary"
            class="ml-3"
          >
            Edit
          </AppButton>
        </AppLink>
      </template>
    </page-header>

    <page-body>
      <!-- DETAILS -->

      <div
        v-if="travel"
        class="bg-white rounded-lg shadow px-4 py-5 sm:p-0"
      >
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
              Travel slug
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ travel.slug }}
            </dd>
          </div>

          <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Travel status
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex">
              <travel-status :is-public="travel.isPublic" />
            </dd>
          </div>

          <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Number of days
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ travel.numberOfDays }}
            </dd>
          </div>

          <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">
              Travel description
            </dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ travel.description }}
            </dd>
          </div>
        </dl>
      </div>

      <!-- MOODS -->

      <div
        v-if="moods"
        class="mt-10"
      >
        <div class="sm:flex-auto">
          <h1 class="text-xl font-semibold text-gray-900">
            Moods
          </h1>
        </div>

        <div class="mt-5 grid grid-cols-2 md:grid-cols-5 gap-4">
          <div
            v-for="mood in moods"
            :key="mood.label"
            class="bg-white rounded-lg shadow px-4 py-4 flex flex-col space-y-2"
          >
            <div class="font-medium text-sm text-gray-500">
              {{ mood.label }}
            </div>

            <div class="font-medium text-xl text-gray-800">
              {{ mood.value }} %
            </div>
          </div>
        </div>
      </div>

      <!-- TOURS -->

      <div
        v-if="travel && tours"
        class="mt-12"
      >
        <div class="sm:flex sm:items-center">
          <div class="sm:flex-auto">
            <h1 class="text-xl font-semibold text-gray-900">
              Tours
            </h1>
          </div>

          <div
            v-if="user.role === 'organizer'"
            class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none"
          >
            <AppLink
              name="travelId-tours-new"
              :params="{ travelId: travel.id }"
            >
              <AppButton variant="primary">
                New
              </AppButton>
            </AppLink>
          </div>
        </div>

        <div
          v-if="tours.items.length === 0"
          class="bg-white rounded-lg shadow px-4 py-5 mt-5"
        >
          <dt class="text-sm font-medium text-gray-500">
            No tours
          </dt>
        </div>
        <div
          v-else
          class="mt-5 flex flex-col"
        >
          <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div
              class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8"
            >
              <div
                class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg"
              >
                <table class="min-w-full divide-y divide-gray-300">
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
                        Dates
                      </th>

                      <th
                        scope="col"
                        class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Price
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
                      v-for="tour in tours.items"
                      :key="tour.id"
                    >
                      <td
                        class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                      >
                        {{ tour.name }}
                      </td>

                      <td
                        class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                      >
                        {{ new Date(tour.startingDate).toLocaleDateString() }} -
                        {{ new Date(tour.endingDate).toLocaleDateString() }}
                      </td>

                      <td
                        class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                      >
                        €
                        {{ new Intl.NumberFormat().format(tour.price / 100) }}
                      </td>

                      <td
                        v-if="travel"
                        class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-3"
                      >
                        <AppLink
                          name="travelId-tours-tourId"
                          :params="{ travelId: travel.id, tourId: tour.id }"
                          class="text-gray-500 hover:text-gray-700"
                        >
                          View
                        </AppLink>

                        <template v-if="user.role === 'traveler'">
                          <span
                            v-if="tour.users.some((u) => u.id === user.userId)"
                            class="text-green-500 font-medium"
                          >
                            I am going &rpar;
                          </span>
                          <AppButton
                            v-else
                            unstyled
                            variant="secondary"
                            @click="applyTour(tour.id)"
                          >
                            I want to go!
                          </AppButton>
                        </template>

                        <AppLink
                          v-if="user.role === 'organizer'"
                          class="text-gray-500 hover:text-gray-700"
                          name="travelId-tours-tourId-edit"
                          :params="{ travelId: travel.id, tourId: tour.id }"
                        >
                          Edit
                          <span class="sr-only">, {{ tour.name }}</span>
                        </AppLink>

                        <AppButton
                          v-if="user.role === 'organizer'"
                          unstyled
                          variant="secondary"
                          @click="deleteTour(tour.id)"
                        >
                          Delete
                        </AppButton>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <table-pagination
                :page="page"
                :rows="rows"
                :total="tours.count"
                @change="onPaginationChange"
              />
            </div>
          </div>
        </div>
      </div>
    </page-body>
  </div>
</template>

<script lang="ts">
import {
  DeleteTour,
  type DeleteTourMutation,
  type DeleteTourMutationVariables,
  DeleteTravel,
  type DeleteTravelMutation,
  type DeleteTravelMutationVariables,
  ToursByTravel,
  type ToursByTravelQuery,
  type ToursByTravelQueryVariables,
  Travel,
  type TravelQuery,
  type TravelQueryVariables,
  UpdateTravel,
  type UpdateTravelMutation,
  type UpdateTravelMutationVariables,
  ApplyTour,
  type ApplyTourMutation,
  type ApplyTourMutationVariables,
} from '~/graphql/generated';

const ROWS = 5;

export default defineNuxtComponent({
  name: 'TravelPage',
  setup() {
    const route = useRoute('travelId');
    const router = useRouter();
    const user = useUser();

    const [page] = useRef(1, { watcher: () => Number(route.query.page) || 1 });

    const { result: travelResult, refetch: refetchTravel } = useQuery<
      TravelQuery,
      TravelQueryVariables
    >(Travel, () => ({
      id: route.params.travelId,
    }));
    const travel = computed(() => travelResult.value?.travel);

    const { result: toursResult, refetch: refetchToursByTravel } = useQuery<
      ToursByTravelQuery,
      ToursByTravelQueryVariables
    >(
      ToursByTravel,
      () => ({
        travelSlug: travel.value!.slug,
        rows: ROWS,
        page: page.value,
      }),
      () => ({ enabled: !!travel.value }),
    );
    const tours = computed(() => toursResult.value?.toursByTravel);

    const moods = computed<Array<{ label: string; value: number }>>(() => {
      if (!travel.value) {
        return [];
      }

      return [
        { label: 'Nature', value: travel.value.natureMood },
        { label: 'Relax', value: travel.value.relaxMood },
        { label: 'History', value: travel.value.historyMood },
        { label: 'Culture', value: travel.value.cultureMood },
        { label: 'Party', value: travel.value.partyMood },
      ];
    });

    const { mutate: apolloDeleteTravel } = useMutation<
      DeleteTravelMutation,
      DeleteTravelMutationVariables
    >(DeleteTravel);
    const onDelete = async () => {
      if (!confirm('Do you really want to delete this travel?')) return;

      await apolloDeleteTravel({ id: route.params.travelId });
      await router.replace('/');
    };

    const { mutate: apolloToggleStatus } = useMutation<
      UpdateTravelMutation,
      UpdateTravelMutationVariables
    >(UpdateTravel);
    const toggleStatus = async () => {
      if (
        !confirm(
          `Do you really want to ${
            travel.value!.isPublic ? 'unpublish' : 'publish'
          } this travel?`,
        )
      )
        return;

      await apolloToggleStatus({
        data: {
          isPublic: !travel.value!.isPublic,
          id: travel.value!.id,
        },
      });
      await refetchTravel();
    };

    const { mutate: apolloDeleteTour } = useMutation<
      DeleteTourMutation,
      DeleteTourMutationVariables
    >(DeleteTour);
    const deleteTour = async (tourId: string) => {
      if (!confirm('Do you really want to delete this tour?')) return;

      await apolloDeleteTour({ id: tourId });
      await refetchToursByTravel();
    };

    const { mutate: apolloApplyTour } = useMutation<
      ApplyTourMutation,
      ApplyTourMutationVariables
    >(ApplyTour);
    const applyTour = async (tourId: string) => {
      if (!confirm('Do you really want to apply to this tour?')) return;

      await apolloApplyTour({
        data: {
          tourId,
          userId: user.userId,
        },
      });
      await refetchToursByTravel();
    };

    const onPaginationChange = (page: number) => {
      router.replace({
        query: {
          ...route.query,
          page: page === 1 ? '' : page.toString(),
        },
      });
    };

    return {
      user,
      travel,
      tours,
      rows: ROWS,
      page,
      moods,
      onDelete,
      toggleStatus,
      deleteTour,
      applyTour,
      onPaginationChange,
    };
  },
});
</script>
