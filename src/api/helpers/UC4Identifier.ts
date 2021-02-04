export enum UC4Identifier {
    SEPERATOR = ":",
    /* CONTRACTS */
    CONTRACT_APPROVAL = "UC4.OperationData",
    CONTRACT_MATRICULATION = "UC4.MatriculationData",
    CONTRACT_ADMISSION = "UC4.Admission",

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
}
