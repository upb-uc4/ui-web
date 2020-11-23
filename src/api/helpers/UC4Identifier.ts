export enum UC4Identifier {
    SEPERATOR = ":",
    /* CONTRACTS */
    CONTRACT_APPROVAL = "UC4.Approval",
    CONTRACT_MATRICULATION = "UC4.MatriculationData",

    /* TRANSACTIONS */
    //common
    TRANSACTION_APPROVAL = "approveTransaction",
    //matriculation
    TRANSACTION_ADD_MATRICULATION = "addMatriculationData",
    TRANSACTION_UPDATE_MATRICULATION = "updateMatriculationData",
    TRANSACTION_ADD_ENTRIES_MATRICULATION = "addEntriesToMatriculationData",
}