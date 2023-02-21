<template>
  <div class="d-flex position-relative">
    <SideMenu></SideMenu>
    <div class="mx-auto my-5" style="width:78%;">
      <router-view/>
    </div>
  </div>
</template>

<script>
import SideMenu from '@/components/SideMenu.vue'
export default {
  components: {
    SideMenu
  },
  watch: {
    '$route' () {
      console.log(this.$store.state.pageBtnPermission)
    }
  }
}
</script>
