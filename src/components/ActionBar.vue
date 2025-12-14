<template>
  <div class="action-bar router-elem-slide-fadein">
    <hr class="split-line"/>
    <ul>
      <li>
        <RouterLink :to="{ name: 'Timeline'}">
          Timeline...
        </RouterLink>
      </li>
      <li>
        <RouterLink :to="{ name: 'Index'}">
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