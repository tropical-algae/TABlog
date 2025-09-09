<template>
  <div class="action-bar">
    <hr class="split-line"/>
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