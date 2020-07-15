<template>
    <div id='root' class="container mx-auto px-4">
        <router-view/>
        <div id="modal-wrapper"/>
    </div>
</template>

<script lang="ts">
import {store} from "@/store/store"

export default {
	name: 'App',
	components: {

	}, 
	setup() {
	}
}
</script>
