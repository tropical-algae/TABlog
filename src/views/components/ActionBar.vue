<template>
  <div class="action-bar">
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