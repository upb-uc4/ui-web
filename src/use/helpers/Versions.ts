import AuthenticationManagement from "@/api/AuthenticationManagement";
import CertificateManagement from "@/api/CertificateManagement";
import ConfigurationManagement from "@/api/ConfigurationManagement";
import CourseManagement from "@/api/CourseManagement";
import ExaminationRegulationManagement from "@/api/ExaminationRegulationManagement";
import MatriculationManagement from "@/api/MatriculationManagement";
import UserManagement from "@/api/UserManagement";
import { useStore } from "../store/store";

export interface version {
    name: String;
    version: String;
    link: String;
}

export async function getVersions(): Promise<version[]> {
    let versions: version[] = [];
    let store = useStore();

    let frontEndVersion = "v" + process.env.VUE_APP_VERSION;

    let authenticationManagementVersion = await AuthenticationManagement.getVersion();
    let courseManagementVersion = await CourseManagement.getVersion();
    let userManagementVersion = await UserManagement.getVersion();
    let matriculationManagementVersion = await MatriculationManagement.getVersion();
    let certificateManagementVersion = await CertificateManagement.getVersion();
    let examinationRegulationManagementVersion = await ExaminationRegulationManagement.getVersion();
    let configurationManagementVersion = await ConfigurationManagement.getVersion();

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
    });
    versions.push({
        name: "Certificate Management",
        version: certificateManagementVersion,
        link:
            "https://github.com/upb-uc4/University-Credits-4.0/blob/" +
            "certificate-" +
            certificateManagementVersion +
            "/product_code/certificate_service/CHANGELOG.md",
    });
    versions.push({
        name: "Examination Regulations Management",
        version: examinationRegulationManagementVersion,
        link:
            "https://github.com/upb-uc4/University-Credits-4.0/blob/" +
            "examreg-" +
            examinationRegulationManagementVersion +
            "/product_code/examreg_service/CHANGELOG.md",
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

    return versions;
}
