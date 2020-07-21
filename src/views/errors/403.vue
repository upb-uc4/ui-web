<template>
    <div>
        <dev-nav-bar></dev-nav-bar>
        <div class="flex-1 items-center text-center">
            <h2 class="text-4xl text-center mt-4 font-semibold">
                403 Forbidden
            </h2>
            <p class="text-2xl text-center mt-8">
                You have no access to this page.<br />
                You will be redirected in
            </p>
            <p class="text-6xl text-center font-semibold mt-8">{{ countdown }}s</p>
            <button
                id="redirect"
                class="items-center text-xl mt-6 inline-block text-center text-blue-500 hover:text-blue-400 hover:cursor-pointer focus:outline-none"
                @click="redirect"
            >
                Take me there immediatly
            </button>
        </div>
    </div>
</template>
<script lang="ts">
    import DevNavBar from "../../components/dev_components/DevNavBar.vue";
    import Router from "@/router/";
    import { ref } from "vue";

    export default {
        components: {
            DevNavBar,
        },

        beforeRouteLeave(_from: any, _to: any, next: any) {
            clearInterval(this.timeout);
            return next();
        },
        setup() {
            let countdown = ref(10);
            let timeout = ref(0);

            //setup the timer
            countDownTimer();

            function countDownTimer() {
                timeout.value = setInterval(() => {
                    if (countdown.value > 0) {
                        countdown.value = countdown.value - 1;
                    } else {
                        redirect();
                    }
                }, 1000);
            }

            function redirect() {
                Router.go(-1);
            }

            return {
                countdown,
                timeout,
                countDownTimer,
                redirect,
            };
        },
    };
</script>
