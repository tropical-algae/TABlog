<template>
  <div class="nav-container">
    <hr class="split-line router-elem-fade anim-slide"/>
    <ul>
      <li class="router-elem-fade anim-slide">
        <RouterLink :to="{ name: 'Timeline'}">
          Timeline...
        </RouterLink>
      </li>
      <li class="router-elem-fade anim-slide">
        <RouterLink :to="{ name: 'Archive'}">
          Archive...
        </RouterLink>
      </li>
      <li class="router-elem-fade anim-slide">
        <RouterLink :to="{ name: 'Home'}">
          Home...
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>

.nav-container {
  margin: 0;
  padding: 0 0 1rem;
}

.nav-container ul{
  margin: 0;
  padding: 0;
}

.nav-container ul li{
  margin-right: 0;
  margin-left: 0;
  padding-bottom: 0.7rem;
  padding-right: 0;
  padding-left: 0;
  font-weight: bold;
  list-style-type: none;

  /* line-height: 1; */
}
</style>
