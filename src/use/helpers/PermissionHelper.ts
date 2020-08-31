import { Role } from "@/entities/Role";
import { useStore } from "@/use/store/store";

export async function checkPrivilege(...roles: Role[]): Promise<{ authenticated: boolean; allowed: boolean }> {
    const store = useStore();
    const role = await store.getters.role;
    return { authenticated: role != Role.NONE, allowed: roles.includes(role) };
}
