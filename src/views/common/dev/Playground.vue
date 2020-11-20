<template>
    <div class="bg-gray-100 p-10 mt-10 rounded-lg w-full flex flex-row">
        <div class="mr-16">
            <div class="">
                <label class="input-label-tmp">default</label>
                <input type="text" autofocus class="w-64 input-text-tmp" value="empty" />
            </div>

            <div class="mt-6">
                <label class="input-label-tmp">placeholder</label>
                <input type="text" class="w-64 input-text-tmp" placeholder="empty" />
            </div>

            <div class="mt-6">
                <label class="input-label-tmp">disabled</label>
                <input type="text" disabled class="w-64 input-text-tmp" value="empty" />
            </div>

            <div class="mt-6">
                <label class="input-label-tmp">readonly</label>
                <input type="text" readonly class="w-64 input-text-tmp" value="empty" />
            </div>

            <div class="mt-6">
                <label class="input-label-tmp">error</label>
                <input type="text" class="w-64 input-text-error-tmp" value="empty" />
                <label class="input-label-error-temp">This indicates that something is wrong.</label>
            </div>

            <div class="mt-6">
                <label class="input-label-tmp">warning</label>
                <input type="text" class="w-64 input-text-warning-tmp" value="empty" />
                <label class="input-label-warning-temp">This is a warning.</label>
            </div>
        </div>
        <div class="mr-16">
            <div class="">
                <label class="input-label-tmp">primary normal</label>
                <button class="w-64 btn-tmp">Click Me</button>
            </div>

            <div class="mt-6">
                <label class="input-label-tmp">primary add</label>
                <button class="w-64 btn-add-tmp">Click Me</button>
            </div>

            <div class="mt-6">
                <label class="input-label-tmp">primary remove</label>
                <button class="w-64 btn-remove-tmp">Click Me</button>
            </div>

            <div class="mt-6">
                <label class="input-label-tmp">secondary normal</label>
                <button class="w-64 btn-secondary-tmp">Click Me</button>
            </div>

            <div class="mt-6">
                <label class="input-label-tmp">secondary add</label>
                <button class="w-64 btn-secondary-add-tmp">Click Me</button>
            </div>

            <div class="mt-6">
                <label class="input-label-tmp">secondary remove</label>
                <button class="w-64 btn-secondary-remove-tmp">Click Me</button>
            </div>

            <div class="mt-6">
                <label class="input-label-tmp">tertiary normal</label>
                <button class="w-64 btn-tertiary-tmp">Click Me</button>
            </div>

            <div class="mt-6">
                <label class="input-label-tmp">tertiary add</label>
                <button class="w-64 btn-tertiary-add-tmp">Click Me</button>
            </div>

            <div class="mt-6">
                <label class="input-label-tmp">tertiary remove</label>
                <button class="w-64 btn-tertiary-remove-tmp">Click Me</button>
            </div>
        </div>
        <div>
            <div class="">
                <label class="input-label-tmp">primary normal</label>
                <button disabled class="w-64 btn-tmp">Click Me</button>
            </div>
            <div class="mt-6">
                <label class="input-label-tmp">primary add</label>
                <button disabled class="w-64 btn-add-tmp">Click Me</button>
            </div>
            <div class="mt-6">
                <label class="input-label-tmp">primary remove</label>
                <button disabled class="w-64 btn-remove-tmp">Click Me</button>
            </div>

            <div class="mt-6">
                <label class="input-label-tmp">secondary normal</label>
                <button disabled class="w-64 btn-secondary-tmp">Click Me</button>
            </div>

            <div class="mt-6">
                <label class="input-label-tmp">secondary add</label>
                <button disabled class="w-64 btn-secondary-add-tmp">Click Me</button>
            </div>

            <div class="mt-6">
                <label class="input-label-tmp">secondary remove</label>
                <button disabled class="w-64 btn-secondary-remove-tmp">Click Me</button>
            </div>

            <div class="mt-6">
                <label class="input-label-tmp">tertiary normal</label>
                <button disabled class="w-64 btn-tertiary-tmp">Click Me</button>
            </div>

            <div class="mt-6">
                <label class="input-label-tmp">tertiary add</label>
                <button disabled class="w-64 btn-tertiary-add-tmp">Click Me</button>
            </div>

            <div class="mt-6">
                <label class="input-label-tmp">tertiary remove</label>
                <button disabled class="w-64 btn-tertiary-remove-tmp">Click Me</button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Playground",
    };
</script>
