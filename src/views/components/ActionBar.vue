<template>
  <hr class="split-line"/>
  <div class="action-bar">
    <ul>
      <li>
        <RouterLink :to="{ name: 'Home'}">
          Home...
        </RouterLink>
      </li>
      <li>
        <RouterLink :to="{ name: 'Index'}">
          Links...
        </RouterLink>
      </li>
    </ul>
  </div>
</template>