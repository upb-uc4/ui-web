import MatriculationData from "@/api/api_models/matriculation_management/MatriculationData";

export function compareSemesters(s1: String, s2: String): number {
    let semester1: { type: string; year: number } = { type: s1.substr(0, 2), year: parseInt(s1.substr(2, 5)) };
    let semester2: { type: string; year: number } = { type: s2.substr(0, 2), year: parseInt(s2.substr(2, 5)) };
    if (semester1.year > semester2.year) {
        return 1;
    } else if (semester1.year < semester2.year) {
        return -1;
    } else if (semester1.type == "WS" && semester2.type == "SS") {
        return 1;
    } else if (semester1.type == "SS" && semester2.type == "WS") {
        return -1;
    }
    return 0;
}

export function historyToSortedList(history: MatriculationData): { semester: String; fieldsOfStudy: String[] }[] {
    if (history.matriculationStatus == undefined) {
        return [];
    }
    let chronologicalList: { semester: String; fieldsOfStudy: String[] }[] = [];
    history.matriculationStatus.forEach((e) => {
        e.semesters.forEach((s) => {
            let exists = false;
            chronologicalList.forEach((data) => {
                if (data.semester == s) {
                    exists = true;
                    data.fieldsOfStudy.push(e.fieldOfStudy);
                    return;
                }
            });
            if (!exists) {
                chronologicalList.push({ semester: s, fieldsOfStudy: [e.fieldOfStudy] });
            }
        });
    });
    return chronologicalList.sort((s1, s2) => compareSemesters(s1.semester, s2.semester));
}
