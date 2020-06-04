export class Course {
    courseType: string = "Lecture";
    courseId: bigint = 0n;
    courseName: string = "";
    lecturerId: bigint = 0n;
    ects: number = 0;
    maxStudents: number = 0;
    currentParticipants: number = 0;
    description: string = "";
    language:string = "English";
    startDate: string ="";
    endDate: string = "";
}