<template>
  <SmartModal
    v-if="show"
    dialog
    :title="t('folder.edit')"
    @close="emit('hide-modal')"
  >
    <template #body>
      <div class="flex flex-col">
        <input
          id="selectLabelEditFolder"
          v-model="name"
          v-focus
          class="input floating-input"
          placeholder=" "
          type="text"
          autocomplete="off"
          @keyup.enter="editFolder"
        />
        <label for="selectLabelEditFolder">
          {{ t("action.label") }}
        </label>
      </div>
    </template>
    <template #footer>
      <span class="flex space-x-2">
        <ButtonPrimary
          :label="t('action.save')"
          :loading="loadingState"
          outline
          @click="editFolder"
        />
        <ButtonSecondary
          :label="t('action.cancel')"
          outline
          filled
          @click="hideModal"
        />
      </span>
    </template>
  </SmartModal>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { useI18n } from "@composables/i18n"
import { useToast } from "@composables/toast"

const t = useI18n()
const toast = useToast()

const props = withDefaults(
  defineProps<{
    show: boolean
    loadingState: boolean
    editingFolderName: string
  }>(),
  {
    show: false,
    loadingState: false,
    editingFolderName: "",
  }
)

const emit = defineEmits<{
  (e: "submit", name: string): void
  (e: "hide-modal"): void
}>()

const name = ref("")

watch(
  () => props.editingFolderName,
  (newName) => {
    name.value = newName
  }
)

const editFolder = () => {
  if (name.value.trim() === "") {
    toast.error(t("folder.invalid_name"))
    return
  }

  emit("submit", name.value)
}

const hideModal = () => {
  name.value = ""
  emit("hide-modal")
}
</script>
