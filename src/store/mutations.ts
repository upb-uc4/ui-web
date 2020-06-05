import { MutationTypes } from './mutation-types'
import { State } from './state'
import { MutationTree } from 'vuex'

export type Mutations<S = State> = {
    [MutationTypes.SET_ID](state: S, payload: number): void,
    [MutationTypes.SET_ROLE](state: S, payload: string): void
  }
  
  export const mutations: MutationTree<State> & Mutations = {
    [MutationTypes.SET_ID](state: State, payload: number) {
      state.myId = payload
    },
    [MutationTypes.SET_ROLE](state: State, payload: string) {
        state.myRole = payload
    },
}
