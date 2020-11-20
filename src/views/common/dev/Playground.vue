<template>
    <div class="bg-gray-100 p-10 mt-10 rounded-lg w-full flex justify-between">
        <div class="">
            <h1 class="font-medium text-2xl text-gray-600 mb-2">Inputs</h1>
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
                <label class="input-label-error-tmp">This indicates that something is wrong.</label>
            </div>

            <div class="mt-6">
                <label class="input-label-tmp">warning</label>
                <input type="text" class="w-64 input-text-warning-tmp" value="empty" />
                <label class="input-label-warning-tmp">This is a warning.</label>
            </div>
        </div>

        <div class="">
            <div>
                <h1 class="font-medium text-2xl text-gray-600 mb-2">Primary Buttons</h1>
                <div class="flex">
                    <div class="mr-8">
                        <div class="">
                            <label class="input-label-tmp">default</label>
                            <button class="w-64 btn-tmp">Click Me</button>
                        </div>

                        <div class="mt-6">
                            <label class="input-label-tmp">add</label>
                            <button class="w-64 btn-add-tmp">Click Me</button>
                        </div>

                        <div class="mt-6">
                            <label class="input-label-tmp">remove</label>
                            <button class="w-64 btn-remove-tmp">Click Me</button>
                        </div>
                    </div>
                    <div class="">
                        <div class="">
                            <label class="input-label-tmp">default disabled</label>
                            <button disabled class="w-64 btn-tmp">Can't Click Me</button>
                        </div>
                        <div class="mt-6">
                            <label class="input-label-tmp">add disabled</label>
                            <button disabled class="w-64 btn-add-tmp">Can't Click Me</button>
                        </div>
                        <div class="mt-6">
                            <label class="input-label-tmp">remove disabled</label>
                            <button disabled class="w-64 btn-remove-tmp">Can't Click Me</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-10">
                <h1 class="font-medium text-2xl text-gray-600 mb-2">Secondary Buttons</h1>
                <div class="flex">
                    <div class="mr-8">
                        <div class="mt-6">
                            <label class="input-label-tmp">default</label>
                            <button class="w-64 btn-secondary-tmp">Click Me</button>
                        </div>

                        <div class="mt-6">
                            <label class="input-label-tmp">add</label>
                            <button class="w-64 btn-secondary-add-tmp">Click Me</button>
                        </div>

                        <div class="mt-6">
                            <label class="input-label-tmp">remove</label>
                            <button class="w-64 btn-secondary-remove-tmp">Click Me</button>
                        </div>
                    </div>
                    <div>
                        <div class="mt-6">
                            <label class="input-label-tmp">normal disabled</label>
                            <button disabled class="w-64 btn-secondary-tmp">Can't Click Me</button>
                        </div>

                        <div class="mt-6">
                            <label class="input-label-tmp">add disabled</label>
                            <button disabled class="w-64 btn-secondary-add-tmp">Can't Click Me</button>
                        </div>

                        <div class="mt-6">
                            <label class="input-label-tmp">remove disabled</label>
                            <button disabled class="w-64 btn-secondary-remove-tmp">Can't Click Me</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-10">
                <h1 class="font-medium text-2xl text-gray-600 mb-2">Tertiary Buttons</h1>

                <div class="flex">
                    <div class="">
                        <div class="mt-6">
                            <label class="input-label-tmp">default</label>
                            <button class="w-64 btn-tertiary-tmp">Click Me</button>
                        </div>

                        <div class="mt-6">
                            <label class="input-label-tmp">add</label>
                            <button class="w-64 btn-tertiary-add-tmp">Click Me</button>
                        </div>

                        <div class="mt-6">
                            <label class="input-label-tmp">remove</label>
                            <button class="w-64 btn-tertiary-remove-tmp">Click Me</button>
                        </div>
                    </div>
                    <div>
                        <div class="mt-6">
                            <label class="input-label-tmp">normal default</label>
                            <button disabled class="w-64 btn-tertiary-tmp">Can't Click Me</button>
                        </div>

                        <div class="mt-6">
                            <label class="input-label-tmp">add default</label>
                            <button disabled class="w-64 btn-tertiary-add-tmp">Can't Click Me</button>
                        </div>

                        <div class="mt-6">
                            <label class="input-label-tmp">remove default</label>
                            <button disabled class="w-64 btn-tertiary-remove-tmp">Can't Click Me</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div>
            <h1 class="font-medium text-2xl text-gray-600 mb-2">Radio Buttons</h1>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Playground",
    };
</script>
