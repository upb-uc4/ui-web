import { GetterTree } from "vuex";
import { State } from "./state";
import { Role } from "@/entities/Role";
import UserManagement from "@/api/UserManagement";
import { store, useStore } from "./store";
import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
import { MutationTypes } from "./mutation-types";
import Lecturer from "@/api/api_models/user_management/Lecturer";
import Admin from "@/api/api_models/user_management/Admin";
import Student from "@/api/api_models/user_management/Student";
import AuthenticationManagement from "@/api/AuthenticationManagement";
import ConfigurationManagement from "@/api/ConfigurationManagement";
import lodash from "lodash";
import Configuration from "@/api/api_models/configuration_management/Configuration";

//example code: https://dev.to/3vilarthas/vuex-typescript-m4j
export type Getters = {
    user(state: State): Promise<Student | Lecturer | Admin>;
    loggedIn(state: State): boolean;
    role(state: State): Promise<Role>;
    validation(state: State): Promise<any>;
    configuration(state: State): Promise<Configuration>;
};

export const getters: GetterTree<State, State> & Getters = {
    loggedIn: (state) => {
        return state.loggedIn;
    },
    user: async (state) => {
        if (state.user.username == undefined || state.user.username == "") {
            // get own user
            await AuthenticationManagement._getLoginToken();

            if (state.user.username == undefined || state.user.username == "") {
                // there was no refresh token
                let modal = state.modal;
                await modal();
            }
        }
        return state.user;
    },
    role: async (state) => {
        const store = useStore();
        return (await store.getters.user).role;
    },
    validation: async (state) => {
        if (lodash.isEmpty(state.validation)) {
            store.commit(MutationTypes.SET_VALIDATION, (await new ConfigurationManagement().getValidation()).returnValue);
        }
        return state.validation;
    },
    configuration: async (state) => {
        if (state.configuration.courseTypes == undefined) {
            store.commit(MutationTypes.SET_CONFIGURATION, (await new ConfigurationManagement().getConfiguration()).returnValue);
        }
        return state.configuration;
    },
};
