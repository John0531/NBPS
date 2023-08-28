<template v-once>
  <!-- 網站最上方即時公告 -->
  <div class="space"></div>
  <div class="position-fixed w-100" style="z-index:99;top:0;">
    <h6 class="text-nowrap overflow-hidden text-center fw-normal py-2 bg-announce">
      <span class="pe-2 fw-bold">{{$store.state.announceInfo.ann[0].title}}</span>
      <a class="" href="#" @click.prevent="$store.dispatch('openAnnounceModal')"> 詳細內容(點此)</a>
    </h6>
  </div>
</template>

<style scoped>
.bg-announce {
  background-color: #ff5f57d4;
  /* text-decoration: underline; */
}
.bg-announce a{
  color: #fff;
}
.space{
  height: 35px;
}
</style>
