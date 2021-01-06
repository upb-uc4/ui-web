import AdmissionManagement from "@/api/AdmissionManagement";
import AuthenticationManagement from "@/api/AuthenticationManagement";
import CertificateManagement from "@/api/CertificateManagement";
import ConfigurationManagement from "@/api/ConfigurationManagement";
import CourseManagement from "@/api/CourseManagement";
import ExaminationRegulationManagement from "@/api/ExaminationRegulationManagement";
import MatriculationManagement from "@/api/MatriculationManagement";
import ReportManagement from "@/api/ReportManagement";
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

    const configurationManagementVersion = await ConfigurationManagement.getVersion();
    const hyperledgerNetworkVersion = (await ConfigurationManagement.getHyperledgerNetworkVersion()).networkVersion;

    const matriculationManagementVersion = await MatriculationManagement.getVersion();
    const hlfMatriculationVersion = await MatriculationManagement.getHyperledgerVersion();

    const certificateManagementVersion = await CertificateManagement.getVersion();
    const hlfCertificateVersion = await CertificateManagement.getHyperledgerVersion();

    const examinationRegulationManagementVersion = await ExaminationRegulationManagement.getVersion();
    const hlfExamRegVersion = await ExaminationRegulationManagement.getHyperledgerVersion();

    const reportManagementVersion = await ReportManagement.getVersion();

    const admissionsManagementVersion = await AdmissionManagement.getVersion();
    const hlfAdmissionVersion = await AdmissionManagement.getHyperledgerVersion();

    versions.push({
        name: "Frontend",
        version: frontEndVersion,
        link: "https://github.com/upb-uc4/ui-web/blob/" + frontEndVersion + "/CHANGELOG.md",
    });
    versions.push({
        name: "Hyperledger Network",
        version: hyperledgerNetworkVersion,
        link: "https://github.com/upb-uc4/hlf-network/blob/" + hyperledgerNetworkVersion + "/CHANGELOG.md",
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
        name: "Report Management",
        version: reportManagementVersion,
        link:
            "https://github.com/upb-uc4/University-Credits-4.0/blob/" +
            "report-" +
            reportManagementVersion +
            "/product_code/report_service/CHANGELOG.md",
    });
    versions.push({
        name: "Configuration Management",
        version: configurationManagementVersion,
        link:
            "https://github.com/upb-uc4/University-Credits-4.0/blob/" +
            "configuration-" +
            configurationManagementVersion +
            "/product_code/configuration_service/CHANGELOG.md",
    });

    versions.push({
        name: "Admissions Management",
        version: admissionsManagementVersion,
        link:
            "https://github.com/upb-uc4/University-Credits-4.0/blob/" +
            "admission-" +
            admissionsManagementVersion +
            "/product_code/admission_service/CHANGELOG.md",
        hlVersions: hlfAdmissionVersion,
    });

    return versions;
}
