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