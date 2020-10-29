import { CourseType } from "./CourseType";
import { Language } from "./Language";
import Course from "@/api/api_models/course_management/Course";

export class CourseEntity implements Course {
    courseType: CourseType = CourseType.NONE;
    courseId: string = "";
    courseName: string = "";
    lecturerId: string = "";
    ects: number = 1;
    maxParticipants: number = 0;
    currentParticipants: number = 0;
    courseDescription: string = "";
    courseLanguage: Language = Language.NONE;
    startDate: string = "";
    endDate: string = "";
    moduleIds: string[] = [];
    /**
     * Clones all information of object that implements Course in parameter into new object
     * @param course
     */
    constructor(course?: Course) {
        if (course !== undefined) {
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
            this.moduleIds = course.moduleIds;
        }
    }

    public equals(obj: any): boolean {
        if (this == obj) return true;
        if (obj == null) return false;
        if (!(obj instanceof CourseEntity)) return false;

        const course: Course = obj as Course;
        let equal: boolean = true;
        equal = equal && this.courseType === course.courseType;
        equal = equal && this.courseId === course.courseId;
        equal = equal && this.courseName === course.courseName;
        equal = equal && this.lecturerId === course.lecturerId;
        equal = equal && this.ects === course.ects;
        equal = equal && this.maxParticipants === course.maxParticipants;
        equal = equal && this.currentParticipants === course.currentParticipants;
        equal = equal && this.courseDescription === course.courseDescription;
        equal = equal && this.courseLanguage === course.courseLanguage;
        equal = equal && this.startDate === course.startDate;
        equal = equal && this.endDate === course.endDate;
        equal = equal && this.moduleIds === course.moduleIds;

        return equal;
    }

    /**
     * Returns whether the object is equal with respects to all editable info, i.e. everything except the courseId and current participants
     * @param obj
     */
    public editableInfoEquals(obj: any): boolean {
        if (this == obj) return true;
        if (obj == null) return false;

        const course: Course = obj as Course;
        let equal: boolean = true;
        equal = equal && this.courseType === course.courseType;

        equal = equal && this.courseName === course.courseName;
        //equal = equal && (this.lecturerId === course.lecturerId);
        equal = equal && this.ects === course.ects;
        equal = equal && this.maxParticipants === course.maxParticipants;
        equal = equal && this.moduleIds === course.moduleIds;
        equal = equal && this.courseDescription === course.courseDescription;
        equal = equal && this.courseLanguage === course.courseLanguage;
        //equal = equal && (this.startDate === course.startDate);
        //equal = equal && (this.endDate === course.endDate);
        //lecturer ID and dates are set during the setup of the course in the createCourse process -> always false

        equal = equal && this.lecturerId === course.lecturerId;

        return equal;
    }
}
