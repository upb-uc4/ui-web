import { ActionTree, ActionContext } from "vuex";
import { State } from "./state";
import { Mutations } from "./mutations";
import { ActionTypes } from "./action-types";
import { MutationTypes } from "./mutation-types";

type AugmentedActionContext = {
    commit<K extends keyof Mutations>(key: K, payload: Parameters<Mutations[K]>[1]): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, State>, "commit">;

export interface Actions {
    // [ActionTypes.GET_ID]({ commit }: AugmentedActionContext, payload: string): Promise<string>;
    // [ActionTypes.GET_ROLE]({ commit }: AugmentedActionContext, payload: string): Promise<string>;
}

export const actions: ActionTree<State, State> & Actions = {
    // [ActionTypes.GET_ID]({ commit }) {
    //     return new Promise((resolve) => {
    //         setTimeout(() => {
    //             const data = "";
    //             commit(MutationTypes.SET_ID, data);
    //             resolve(data);
    //         }, 500);
    //     });
    // },
    // [ActionTypes.GET_ROLE]({ commit }) {
    //     return new Promise((resolve) => {
    //         setTimeout(() => {
    //             const data = "256";
    //             commit(MutationTypes.SET_ROLE, data);
    //             resolve(data);
    //         }, 500);
    //     });
    // },
};
