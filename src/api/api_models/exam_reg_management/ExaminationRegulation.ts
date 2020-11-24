import Module from "./Module";

export default interface ExaminationRegulation {
    name: string;
    active: boolean;
    modules: Module[];
}
