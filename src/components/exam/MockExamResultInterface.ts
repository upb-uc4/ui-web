export default interface ExamResult {
    examId: String;
    enrollmentId: String;
    grade: Grade;
}

export enum Grade {
    NONE = "Not Graded",
    g1_0 = "1.0",
    g1_3 = "1.3",
    g1_7 = "1.7",
    g2_0 = "2.0",
    g2_3 = "2.3",
    g2_7 = "2.7",
    g3_0 = "3.0",
    g3_3 = "3.3",
    g3_7 = "3.7",
    g4_0 = "4.0",
    g5_0 = "5.0",
}