<template>
    <header class="lg:px-8 px-4 bg-white justify-between flex bg-gray-800 items-center lg:py-0 py-2 h-20">
        <div class="flex">
            <div class="flex items-center pr-8 mr-8 border-gray-100 border-r-4 my-2">
                <a href="#" class="flex text-3xl font-semibold text-gray-100 tracking-wider">
                    UC4
                </a>
            </div>

            <div class="w-auto items-center flex w-full">
                <nav>
                    <ul class="lg:flex items-center justify-between font-semibold text-gray-100 tracking-wider pt-4 lg:pt-0">
                        <li>
                            <a
                                class="py-1 mx-2 block border-b-2 border-transparent hover:border-gray-100 transition duration-500 ease-in-out"
                                href="#"
                            >Features</a>
                        </li>
                        <li>
                            <a
                                class="py-1 mx-2 block border-b-2 border-transparent hover:border-gray-100 transition duration-500 ease-in-out"
                                href="#"
                            >Pricing</a>
                        </li>
                        <li>
                            <a
                                class="py-1 mx-2 block border-b-2 border-transparent hover:border-gray-100 transition duration-500 ease-in-out"
                                href="#"
                            >Documentation</a>
                        </li>
                        <li>
                            <a
                                class="py-1 mx-2 block border-b-2 border-transparent hover:border-gray-100 lg:mb-0 mb-2 transition duration-500 ease-in-out"
                                href="#"
                            >Support</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>

        <div class="flex items-center">
            <div class="mr-2 text-gray-100 font-semibold tracking-wide">
                Theo
            </div>
            <a href="#" class="lg:ml-4 flex items-center justify-start lg:mb-0 mb-4 pointer-cursor">
                <img
                    class="rounded-full w-10 h-10 border-2 border-transparent hover:border-indigo-400"
                    src="@/assets/blank_profile_picture.png"
                    alt="profile_image"
                />
            </a>
        </div>
    </header>
</template>

<script>
    export default {
        name: "Navbar",
    };
</script>
