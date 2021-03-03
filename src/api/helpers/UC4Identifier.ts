export enum UC4Identifier {
    SEPERATOR = ":",
    /* CONTRACTS */
    CONTRACT_APPROVAL = "UC4.OperationData",
    CONTRACT_MATRICULATION = "UC4.MatriculationData",
    CONTRACT_ADMISSION = "UC4.Admission",
    CONTRACT_EXAM = "UC4.Exam",
    CONTRACT_EXAM_RESULT = "UC4.ExamResult",

    /* TRANSACTIONS */
    //common
    TRANSACTION_APPROVAL = "approveOperation",
    TRANSACTION_REJECTION = "rejectOperation",
    //matriculation
    TRANSACTION_ADD_MATRICULATION = "addMatriculationData",
    TRANSACTION_UPDATE_MATRICULATION = "updateMatriculationData",
    TRANSACTION_ADD_ENTRIES_MATRICULATION = "addEntriesToMatriculationData",
    //admission
    TRANSACTION_ADD_ADMISSION = "addAdmission",
    TRANSACTION_DROP_ADMISSION = "dropAdmission",
    //exam
    TRANSACTION_ADD_EXAM = "addExam",
    //exam results
    TRANSACTION_ADD_EXAM_RESULT = "addExamResult",
}
