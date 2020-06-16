<template>
<div>
    <dev-nav-bar></dev-nav-bar>
    <div class="flex-1 items-center text-center"> 
        <h2 class="text-4xl text-center mt-4 font-semibold">
            403 Forbidden
        </h2>
        <p class="text-2xl text-center mt-8">You have no access to this page.<br/> You will be redirected in</p>
        <p class="text-6xl text-center font-semibold mt-8">{{ countdown }}s</p>
        <button 
        class="items-center text-xl mt-6 inline-block text-center text-blue-500 hover:text-blue-400 hover:cursor-pointer focus:outline-none"
        @click="redirect">
        Take me there immediatly</button>
    </div>
</div>
</template>
<script lang="ts">
    import DevNavBar from "../../components/dev_components/DevNavBar.vue";
    import Router from "@/router/";

    export default {
        props: [
            
        ],
        components: {
            DevNavBar
        },
        data () {
            return {
                countdown: 10,
                timeout : 0,
            };
        },
       
        methods: {
            countDownTimer() {
                this.timeout = setInterval(() => {
                    if (this.countdown > 0) {
                        this.countdown -= 1;
                    } else {
                        this.redirect();
                    }
                }, 1000) 
            },
            redirect() {
                clearInterval(this.timeout);
                Router.go(-1)
            }, 
        },
        created() {
           this.countDownTimer();
        },
    }
</script>