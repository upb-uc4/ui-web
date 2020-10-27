import Admin from "./Admin";
import Lecturer from "./Lecturer";
import Student from "./Student";

export default interface User_List {
    students: Student[];
    lecturers: Lecturer[];
    admins: Admin[];
}
