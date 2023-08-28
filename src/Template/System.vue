<template>
  <div class="position-relative">
    <AnnounceBar v-if="$store.state.announceInfo.isPublish&&$store.state.announceInfo.ann[0].ann"></AnnounceBar>
    <AnnounceModal></AnnounceModal>
    <div class="d-flex">
      <SideMenu></SideMenu>
      <div class="mx-auto my-5" style="width:78%;">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script>
import SideMenu from '@/components/SideMenu.vue'
import AnnounceBar from '@/components/AnnounceBar.vue'
import AnnounceModal from '@/components/AnnounceModal.vue'
export default {
  components: {
    SideMenu,
    AnnounceBar,
    AnnounceModal
  },
  mounted () {
    this.$store.dispatch('getAnnounceInfo')
  }
}
</script>

<style lang="css">
  th{
    min-width: 65px;
  }
</style>
