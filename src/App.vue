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
		console.log("bla")
		console.log(process.env.BASE_URL)
		store.state.apiUrl = process.env.VUE_APP_API_URL;
		if (store.state.apiUrl === undefined) {
			//fallback url for dev
			store.state.apiUrl = "http://localhost:9000";
		}
	}
}
</script>
