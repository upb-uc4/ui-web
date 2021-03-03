import Exam from "@/api/api_models/exam_management/Exam";

export class ExamEntity implements Exam {
    examId = "";
    courseId = "";
    moduleId = "";
    lecturerEnrollmentId = "";
    type = "";
    date = "";
    ects = 0;
    admittableUntil = "";
    droppableUntil = "";
    /**
     * Clones all information of object that implements Exam in parameter into new object
     * @param exam
     */
    constructor(exam?: Exam) {
        if (exam !== undefined) {
            this.examId = exam.examId;
            this.courseId = exam.courseId;
            this.moduleId = exam.moduleId;
            this.lecturerEnrollmentId = exam.lecturerEnrollmentId;
            this.ects = exam.ects;
            this.type = exam.type;
            this.date = exam.date;
            this.admittableUntil = exam.admittableUntil;
            this.droppableUntil = exam.droppableUntil;
        }
    }

    public equals(obj: any): boolean {
        if (this == obj) return true;
        if (obj == null) return false;
        if (!(obj instanceof ExamEntity)) return false;

        const exam: Exam = obj as ExamEntity;
        let equal: boolean = true;
        equal = equal && this.examId === exam.examId;
        equal = equal && this.courseId === exam.courseId;
        equal = equal && this.moduleId === exam.moduleId;
        equal = equal && this.lecturerEnrollmentId === exam.lecturerEnrollmentId;
        equal = equal && this.ects === exam.ects;
        equal = equal && this.type === exam.type;
        equal = equal && this.date === exam.date;
        equal = equal && this.admittableUntil === exam.admittableUntil;
        equal = equal && this.droppableUntil === exam.droppableUntil;

        return equal;
    }
}
