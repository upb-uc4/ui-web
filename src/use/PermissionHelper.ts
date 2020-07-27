import { Role } from "@/entities/Role";
import { useStore } from "@/store/store";

export async function checkPrivilege(...roles: Role[]) {
    const store = useStore();
    return roles.includes(await store.getters.role);
}
