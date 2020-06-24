import Student from './Student';
import Lecturer from './Lecturer';
import Admin from './Admin';

export default interface User_List {
    students: Student[],
    lecturers: Lecturer[],
    admins: Admin[]
}