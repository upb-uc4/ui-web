<template>
    <div id='root'>
        <div id='nav'>
            <router-link to='/'>Home</router-link>
            <router-link to='/login'>Login</router-link>
        </div>
        <router-view/>
    </div>
</template>

<script>

export default {
  name: 'App',
  components: {

  }
}
</script>
