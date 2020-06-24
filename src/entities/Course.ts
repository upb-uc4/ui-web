import { CourseType } from './CourseType';
import { Language } from './Language';
import ICourse from '@/api/api_models/course_management/ICourse';


export class Course implements ICourse {
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

    constructor(course?: ICourse) {
        if(course !== undefined) {
            this.courseType = course.courseType;
            this.courseId = course.courseId;
            this.courseName = course.courseName;
            this.lecturerId = course.lecturerId;
            this.ects = course.ects;
            this.maxParticipants = course.maxParticipants;
            this.currentParticipants = course.currentParticipants;
            this.courseDescription = course.courseDescription;
            this.courseLanguage = course.courseLanguage;
            this.startDate = course.startDate;
            this.endDate = course.endDate;
        }
    }

    public equals(obj: any): boolean {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (!(obj instanceof Course))
            return false;
        
        const course: Course = obj as Course;
        let equal: boolean = true;
        equal = equal && (this.courseType === course.courseType);
        equal = equal && (this.courseId === course.courseId);
        equal = equal && (this.courseName === course.courseName);
        equal = equal && (this.lecturerId === course.lecturerId);
        equal = equal && (this.ects === course.ects);
        equal = equal && (this.maxParticipants === course.maxParticipants);
        equal = equal && (this.currentParticipants === course.currentParticipants);
        equal = equal && (this.courseDescription === course.courseDescription);
        equal = equal && (this.courseLanguage === course.courseLanguage);
        equal = equal && (this.startDate === course.startDate);
        equal = equal && (this.endDate === course.endDate);
        
        return equal;
    }
}