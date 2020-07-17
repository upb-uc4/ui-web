import { GetterTree } from "vuex";
import { State } from "./state";

//example code: https://dev.to/3vilarthas/vuex-typescript-m4j
export type Getters = {
    doubledCounter(state: State): string;
};

export const getters: GetterTree<State, State> & Getters = {
    doubledCounter: (state) => {
        return state.myId;
    },
};
