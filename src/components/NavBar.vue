<template>
  <div class="nav-container router-elem-slide-fadein">
    <hr class="split-line router-elem-slide-fadein"/>
    <ul>
      <li>
        <RouterLink :to="{ name: 'Timeline'}">
          Timeline...
        </RouterLink>
      </li>
      <li>
        <RouterLink :to="{ name: 'Archive'}">
          Archive...
        </RouterLink>
      </li>
      <li>
        <RouterLink :to="{ name: 'Home'}">
          Home...
        </RouterLink>
      </li>
    </ul>
  </div>
</template>