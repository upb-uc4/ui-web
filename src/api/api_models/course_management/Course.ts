import { CourseType } from '@/entities/CourseType';
import { Language } from '@/entities/Language';

export default interface ICourse {
    courseType: CourseType;
    courseId: string;
    courseName: string;
    lecturerId: string;
    ects: number;
    maxParticipants: number;
    currentParticipants: number;
    courseDescription: string;
    courseLanguage: Language;
    startDate: string;
    endDate: string;
}