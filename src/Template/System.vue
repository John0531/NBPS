<template>
  <div class="d-flex position-relative">
    <Sidebar></Sidebar>
    <div class="mx-auto my-5" style="width:78%;">
      <router-view/>
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue'
export default {
  components: {
    Sidebar
  }
}
</script>
