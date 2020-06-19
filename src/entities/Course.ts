import { CourseType } from './CourseType';
import { Language } from './Language';


export class Course {
    courseType: CourseType = CourseType.NONE;
    courseId: string = "";
    courseName: string = "";
    lecturerId: string = "";
    ects: number = 1;
    maxParticipants: number = 0;
    currentParticipants: number = 0;
    courseDescription: string = "";
    courseLanguage:Language = Language.NONE;
    startDate: string ="";
    endDate: string = "";
}