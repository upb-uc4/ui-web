<template>
    <div>
        <div>
            <span v-html="formattedString"></span>
            <span v-show="text.length > maxChars" class="ml-2 text-gray-700 uppercase text-xs font-semibold tracking-wide">
                <span class="cursor-pointer" v-show="!isReadMore" v-on:click="triggerReadMore($event, true)">{{ moreStr }}</span>
                <span class="cursor-pointer" v-show="isReadMore" v-on:click="triggerReadMore($event, false)">{{ lessStr }}</span>
            </span>
        </div>
    </div>
</template>

<script>
    //https://github.com/orlyyani/read-more
    export default{
        props: {
            moreStr: {
                type: String,
                default: 'Show more'
            },
            lessStr: {
                type: String,
                default: 'Show less'
            },
            text: {
                type: String,
                required: true
            },
            link: {
                type: String,
                default: '#'
            },
            maxChars: {
                type: Number,
                default: 100
            }
        },

        data (){
            return{
                isReadMore: false
            }
        },

        computed: {
            formattedString(){
                var val_container = this.text;

                if(!this.isReadMore && this.text.length > this.maxChars){
                    val_container = val_container.substring(0,this.maxChars) + '...';
                }

                return(val_container);
            }
        },

        methods: {
            triggerReadMore(e, b){
                if(this.link == '#'){
                    e.preventDefault();
                }
                if(this.lessStr !== null || this.lessStr !== '')
                    this.isReadMore = b;
            }
        }
    }
</script>