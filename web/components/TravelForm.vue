<template>
  <form
    :id="formId"
    class="grid grid-cols-6 gap-6"
    @submit.prevent="onSave"
  >
    <div class="col-span-6 sm:col-span-3">
      <label
        for="name"
        class="block text-sm font-medium text-gray-700"
      >
        Name
      </label>

      <input
        id="name"
        v-model="name"
        required
        type="text"
        name="name"
        placeholder="Travel name"
        class="mt-1 focus:ring-brand focus:border-brand block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
      >
    </div>

    <div class="col-span-6 sm:col-span-3">
      <label
        for="slug"
        class="block text-sm font-medium text-gray-700"
      >
        Slug
      </label>

      <input
        id="slug"
        v-model="slug"
        required
        type="text"
        name="slug"
        placeholder="Travel slug"
        class="mt-1 focus:ring-brand focus:border-brand block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
      >
    </div>

    <div class="col-span-6 sm:col-span-3">
      <label
        for="numberOfDays"
        class="block text-sm font-medium text-gray-700"
      >
        Number of days
      </label>

      <input
        id="numberOfDays"
        v-model.number="numberOfDays"
        required
        type="number"
        min="1"
        name="numberOfDays"
        placeholder="Number of days"
        class="mt-1 focus:ring-brand focus:border-brand block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
      >
    </div>

    <div class="col-span-6">
      <label
        for="description"
        class="block text-sm font-medium text-gray-700"
      >
        Description
      </label>

      <textarea
        id="description"
        v-model="description"
        rows="10"
        type="text"
        name="description"
        placeholder="Travel description"
        class="mt-1 focus:ring-brand focus:border-brand block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
      />
    </div>

    <div
      v-for="mood in moods"
      :key="mood.label"
      class="col-span-1"
    >
      <label
        :for="mood.label + '-mood'"
        class="block text-sm font-medium text-gray-700"
      >
        {{ mood.label }}
      </label>

      <input
        :id="mood.label + '-mood'"
        v-model.number="mood.value"
        type="number"
        step="5"
        class="mt-1 focus:ring-brand focus:border-brand block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
      >
    </div>
  </form>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import slugify from 'slugify';
import type { CreateTravelInput } from '~/graphql/generated';
export default defineNuxtComponent({
  name: 'TravelForm',
  props: {
    formId: {
      type: String,
      required: true,
    },
    initialData: {
      type: Object as PropType<CreateTravelInput>,
      default(): CreateTravelInput {
        return {
          name: '',
          slug: '',
          description: '',
          numberOfDays: 1,
          natureMood: 0,
          relaxMood: 0,
          historyMood: 0,
          cultureMood: 0,
          partyMood: 0,
        };
      },
    },
    save: {
      type: Function as PropType<(data: CreateTravelInput) => void>,
      required: true,
    },
  },
  setup(props, ctx) {
    const { formId, initialData, save } = toRefs(props);
    const name = ref(initialData.value.name);
    const slug = ref(initialData.value.slug);
    const description = ref(initialData.value.description);
    const numberOfDays = ref(initialData.value.numberOfDays);
    const moods = ref({
      nature: {
        label: 'Nature',
        value: initialData.value.natureMood,
      },
      relax: {
        label: 'Relax',
        value: initialData.value.relaxMood,
      },
      history: {
        label: 'History',
        value: initialData.value.historyMood,
      },
      culture: {
        label: 'Culture',
        value: initialData.value.cultureMood,
      },
      party: {
        label: 'Party',
        value: initialData.value.partyMood,
      },
    });
    const onSave = () => {
      save.value({
        name: name.value,
        slug: slug.value,
        description: description.value,
        numberOfDays: numberOfDays.value,
        natureMood: moods.value.nature.value,
        relaxMood: moods.value.relax.value,
        historyMood: moods.value.history.value,
        cultureMood: moods.value.culture.value,
        partyMood: moods.value.party.value,
      });
    };
    watch(name, (value) => {
      slug.value = slugify(value).toLowerCase();
    });
    return { name, slug, description, numberOfDays, moods, onSave };
  },
});
</script>
