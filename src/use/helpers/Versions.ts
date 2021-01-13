import AuthenticationManagement from "@/api/AuthenticationManagement";
import CertificateManagement from "@/api/CertificateManagement";
import CourseManagement from "@/api/CourseManagement";
import ExaminationRegulationManagement from "@/api/ExaminationRegulationManagement";
import GroupManagement from "@/api/GroupManagement";
import MatriculationManagement from "@/api/MatriculationManagement";
import OperationsManagement from "@/api/OperationManagement";
import UserManagement from "@/api/UserManagement";

export interface version {
    name: String;
    version: String;
    link: String;
    hlVersions?: {
        hlfApiVersion: string;
        chaincodeVersion: string;
    };
}

export async function getVersions(): Promise<version[]> {
    const versions: version[] = [];

    const frontEndVersion = "v" + process.env.VUE_APP_VERSION;

    const authenticationManagementVersion = await AuthenticationManagement.getVersion();

    const courseManagementVersion = await CourseManagement.getVersion();

    const userManagementVersion = await UserManagement.getVersion();

    const matriculationManagementVersion = await MatriculationManagement.getVersion();
    const hlfMatriculationVersion = await MatriculationManagement.getHyperledgerVersion();

    const certificateManagementVersion = await CertificateManagement.getVersion();
    const hlfCertificateVersion = await CertificateManagement.getHyperledgerVersion();

    const examinationRegulationManagementVersion = await ExaminationRegulationManagement.getVersion();
    const hlfExamRegVersion = await ExaminationRegulationManagement.getHyperledgerVersion();

    const operationsManagementVersion = await OperationsManagement.getVersion();
    const hlfoperationsManagementVersion = await OperationsManagement.getHyperledgerVersion();

    const groupManagementVersion = await GroupManagement.getVersion();
    const hlfGroupManagementVersion = await GroupManagement.getHyperledgerVersion();

    versions.push({
        name: "Frontend",
        version: frontEndVersion,
        link: "https://github.com/upb-uc4/ui-web/blob/" + frontEndVersion + "/CHANGELOG.md",
    });
    versions.push({
        name: "Authentication Management",
        version: authenticationManagementVersion,
        link:
            "https://github.com/upb-uc4/University-Credits-4.0/blob/" +
            "authentication-" +
            authenticationManagementVersion +
            "/product_code/authentication_service/CHANGELOG.md",
    });
    versions.push({
        name: "Course Management",
        version: courseManagementVersion,
        link:
            "https://github.com/upb-uc4/University-Credits-4.0/blob/" +
            "course-" +
            courseManagementVersion +
            "/product_code/course_service/CHANGELOG.md",
    });
    versions.push({
        name: "User Management",
        version: userManagementVersion,
        link:
            "https://github.com/upb-uc4/University-Credits-4.0/blob/" +
            "user-" +
            userManagementVersion +
            "/product_code/user_service/CHANGELOG.md",
    });
    versions.push({
        name: "Matriculation Management",
        version: matriculationManagementVersion,
        link:
            "https://github.com/upb-uc4/University-Credits-4.0/blob/" +
            "matriculation-" +
            matriculationManagementVersion +
            "/product_code/matriculation_service/CHANGELOG.md",
        hlVersions: hlfMatriculationVersion,
    });
    versions.push({
        name: "Certificate Management",
        version: certificateManagementVersion,
        link:
            "https://github.com/upb-uc4/University-Credits-4.0/blob/" +
            "certificate-" +
            certificateManagementVersion +
            "/product_code/certificate_service/CHANGELOG.md",
        hlVersions: hlfCertificateVersion,
    });
    versions.push({
        name: "Examination Regulations Management",
        version: examinationRegulationManagementVersion,
        link:
            "https://github.com/upb-uc4/University-Credits-4.0/blob/" +
            "examreg-" +
            examinationRegulationManagementVersion +
            "/product_code/examreg_service/CHANGELOG.md",
        hlVersions: hlfExamRegVersion,
    });
    versions.push({
        name: "Operation Management",
        version: operationsManagementVersion,
        link:
            "https://github.com/upb-uc4/University-Credits-4.0/blob/" +
            "examreg-" +
            operationsManagementVersion +
            "/product_code/operation_service/CHANGELOG.md",
        hlVersions: hlfoperationsManagementVersion,
    });
    versions.push({
        name: "Group Management",
        version: groupManagementVersion,
        link:
            "https://github.com/upb-uc4/University-Credits-4.0/blob/" +
            "examreg-" +
            groupManagementVersion +
            "/product_code/group_service/CHANGELOG.md",
        hlVersions: hlfGroupManagementVersion,
    });

    return versions;
}
