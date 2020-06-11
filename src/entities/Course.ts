import { CourseType } from './CourseType';
import { Language } from './Language';


export class Course {
    courseType: CourseType = CourseType.NONE;
    courseId: number = 0;
    courseName: string = "";
    lecturerId: number = 0;
    ects: number = 0;
    maxParticipants: number = 0;
    currentParticipants: number = 0;
    courseDescription: string = "";
    courseLanguage:Language = Language.NONE;
    startDate: string ="";
    endDate: string = "";
}