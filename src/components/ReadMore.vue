<template>
    <div>
        <div>
            <span v-html="formattedString"></span>
            <span v-show="text.length > maxChars" class="ml-2 text-gray-700 uppercase text-xs font-semibold tracking-wide">
                <span v-show="!isReadMore" id="readMore" class="cursor-pointer" @click="triggerReadMore($event, true)">{{ moreStr }}</span>
                <span v-show="isReadMore" id="readLess" class="cursor-pointer" @click="triggerReadMore($event, false)">{{ lessStr }}</span>
            </span>
        </div>
    </div>
</template>

<script lang="ts">
    import { ref, computed } from "vue";
    //https://github.com/orlyyani/read-more
    export default {
        props: {
            moreStr: {
                type: String,
                default: "Show more",
            },
            lessStr: {
                type: String,
                default: "Show less",
            },
            text: {
                type: String,
                required: true,
            },
            link: {
                type: String,
                default: "#",
            },
            maxChars: {
                type: Number,
                default: 100,
            },
        },

        setup(props) {
            let isReadMore = ref(new Boolean(false));

            let formattedString = computed(() => {
                var val_container = props.text;

                if (!isReadMore.value && props.text.length > props.maxChars) {
                    val_container = val_container.substring(0, props.maxChars) + "...";
                }

                return val_container;
            });

            function triggerReadMore(e: Event, b: boolean) {
                if (props.link == "#") {
                    e.preventDefault();
                }
                if (props.lessStr !== null || props.lessStr !== "") isReadMore.value = b;
            }

            return {
                isReadMore,
                formattedString,
                triggerReadMore,
            };
        },
    };
</script>
