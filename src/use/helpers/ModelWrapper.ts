import { computed } from "vue";
import __ from "lodash";

export function useModelWrapper(props: any, emit: any, name = "modelValue") {
    return computed({
        get: () => props[name],
        set: (value) => emit(`update:${name}`, value),
    });
}

export function useObjectModelWrapper(props: any, emit: any, name: string, ...keys: string[]) {
    return computed({
        get: () => {
            const obj = props[name];
            return __.get(obj, keys);
        },
        set: (value) => {
            const newObj = __.cloneDeep(props[name]);
            __.set(newObj, keys, value);
            emit(`update:${name}`, newObj);
        },
    });
}
