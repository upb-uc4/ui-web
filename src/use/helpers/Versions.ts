import AdmissionManagement from "@/api/AdmissionManagement";
import AuthenticationManagement from "@/api/AuthenticationManagement";
import CertificateManagement from "@/api/CertificateManagement";
import ConfigurationManagement from "@/api/ConfigurationManagement";
import CourseManagement from "@/api/CourseManagement";
import ExaminationRegulationManagement from "@/api/ExaminationRegulationManagement";
import MatriculationManagement from "@/api/MatriculationManagement";
import ReportManagement from "@/api/ReportManagement";
import UserManagement from "@/api/UserManagement";
import axios, { AxiosResponse } from "axios";

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

export async function getVersionsWithoutHyperledger(): Promise<version[]> {
    const versions: version[] = [];

    const frontEndVersion = "v" + process.env.VUE_APP_VERSION;

    const authenticationManagementVersion = await AuthenticationManagement.getVersion();
    const courseManagementVersion = await CourseManagement.getVersion();
    const userManagementVersion = await UserManagement.getVersion();
    const matriculationManagementVersion = await MatriculationManagement.getVersion();
    const certificateManagementVersion = await CertificateManagement.getVersion();
    const examinationRegulationManagementVersion = await ExaminationRegulationManagement.getVersion();

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

    return versions;
}

export async function generatePrefilledGithubIssueURL(): Promise<string> {
    //todo integrate this with the new service status or store versions in store instead of querying them AGAIN.
    let versions = await getVersionsWithoutHyperledger();
    let issueTemplate = await getIssueTemplate();
    const baseURL = "https://github.com/upb-uc4/ui-web/issues/new?&labels=bug&body=";
    let payload: string = injectVersionsIntoIssueTemplate(issueTemplate, versions);
    return baseURL + payload;
}

export async function getIssueTemplate(): Promise<string> {
    //get the default uc4 issue template from GitHub
    let template: string = "";
    const instance = axios.create({
        baseURL: "https://raw.githubusercontent.com/upb-uc4/.github/master/.github/ISSUE_TEMPLATE/",
        headers: {
            "Accept": "*/*",
            "Content-Type": "application/json;charset=UTF-8",
        },
    });
    await instance.get("/bug_report.md").then((response: AxiosResponse) => {
        template = response.data;
        template = template.substring(template.indexOf("**Describe the bug**"));
        template = template.replace(/ /g, "%20");
        template = template.replace(/\n/g, "%0A");
    });
    return template;
}

export function injectVersionsIntoIssueTemplate(template: string, versions: version[]): string {
    let versionsBody = `**Versions%20(Do%20not%20change)**%0A`;
    versions.forEach((version) => {
        versionsBody += "-%20" + version.name + ":%20" + version.version + "%0A";
    });
    versionsBody += "%0A";
    return versionsBody + template;
}
