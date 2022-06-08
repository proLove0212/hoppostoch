<template>
  <div>
    <div>
      <div class="flex flex-col">
        <SmartItem
          :label="currentUser.displayName"
          svg="user"
          :info-icon="workspace.type === 'personal' ? 'done' : ''"
          :active-info-icon="workspace.type === 'personal'"
          @click.native="changePersonalWorkspace"
        />
        <hr />
      </div>
      <div v-if="loading" class="flex flex-col items-center justify-center">
        <SmartSpinner class="mb-4" />
        <span class="text-secondaryLight">{{ t("state.loading") }}</span>
      </div>
      <div
        v-if="!loading && myTeams.length === 0"
        class="flex flex-col items-center justify-center p-4 text-secondaryLight"
      >
        <img
          :src="`/images/states/${$colorMode.value}/add_group.svg`"
          loading="lazy"
          class="inline-flex flex-col object-contain object-center w-16 h-16 mb-8"
          :alt="`${t('empty.teams')}`"
        />
        <span class="mb-4 text-center">
          {{ t("empty.teams") }}
        </span>
        <ButtonSecondary
          :label="`${t('team.create_new')}`"
          filled
          @click.native="displayModalAdd(true)"
        />
      </div>
      <div v-else-if="!loading" class="flex flex-col">
        <SmartItem
          v-for="(team, index) in myTeams"
          :key="`team-${String(index)}`"
          :label="team.name"
          svg="users"
          :info-icon="team.id === workspace.teamID ? 'done' : ''"
          :active-info-icon="team.id === workspace.teamID"
          @click.native="changeTeamWorkspace(team)"
        />
      </div>
      <div v-if="!loading && adapterError" class="flex flex-col items-center">
        <i class="mb-4 material-icons">help_outline</i>
        {{ t("error.something_went_wrong") }}
      </div>
      <hr />
      <SmartItem
        :label="`${t('team.create_new')}`"
        svg="users"
        @click.native="displayModalAdd(true)"
      />
    </div>
    <TeamsAdd :show="showModalAdd" @hide-modal="displayModalAdd(false)" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "@nuxtjs/composition-api"
import { GetMyTeamsQuery } from "~/helpers/backend/graphql"
import { onLoggedIn, probableUser$ } from "~/helpers/fb/auth"
import TeamListAdapter from "~/helpers/teams/TeamListAdapter"
import { useI18n, useReadonlyStream } from "~/helpers/utils/composables"
import { changeWorkspace, workspaceStatus$ } from "~/newstore/Workspace"

const t = useI18n()

const showModalAdd = ref(false)

const adapter = new TeamListAdapter(true)
const adapterLoading = useReadonlyStream(adapter.loading$, false)
const adapterError = useReadonlyStream(adapter.error$, null)
const myTeams = useReadonlyStream(adapter.teamList$, [])

const loading = computed(
  () => adapterLoading.value && myTeams.value.length === 0
)

onLoggedIn(() => {
  adapter.initialize()
})

const displayModalAdd = (shouldDisplay: boolean) => {
  showModalAdd.value = shouldDisplay
  adapter.fetchList()
}

const currentUser = useReadonlyStream(probableUser$, null)
const workspace = useReadonlyStream(workspaceStatus$, null)

const changeTeamWorkspace = (team: GetMyTeamsQuery["myTeams"][number]) => {
  changeWorkspace({
    teamID: team.id,
    teamName: team.name,
    type: "team",
  })
}

const changePersonalWorkspace = () => {
  changeWorkspace({
    type: "personal",
  })
}
</script>
