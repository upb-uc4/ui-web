export default interface Course {
    courseType: string;
    courseId: string;
    courseName: string;
    lecturerId: string;
    ects: number;
    maxParticipants: number;
    currentParticipants: number;
    courseDescription: string;
    courseLanguage: string;
    startDate: string;
    endDate: string;
}
