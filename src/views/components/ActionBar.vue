<template>
  <div class="action-bar">
    <ul>
      <li>
        <router-link :to="{ name: 'Home'}">
          Home...
        </router-link>
      </li>
      <li>
        <router-link :to="{ name: 'Index'}">
          Links...
        </router-link>
      </li>
    </ul>
  </div>
</template>