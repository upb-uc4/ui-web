<template>
    <div>
        <div v-for="account in accounts" :key="account.username">
			<!-- show Account Object -->
		</div>
    </div>
</template>

<script lang="ts">

export default {
    name: "AccountList",
    components: {
       
    },
    
    async setup() {
        //TODO get all accounts via API call + export "accounts" s.t. we can show them in the template
        return {
           
        }
    }
    
}
</script>