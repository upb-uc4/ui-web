export default interface Exam {
    examId: string;
    courseId: string;
    moduleId: string;
    lecturerEnrollmentId: string;
    type: string;
    date: string;
    ects: number;
    admittableUntil: string;
    droppableUntil: string;
}
