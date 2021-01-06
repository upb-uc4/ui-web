import { decodeProposal } from "@/api/helpers/ProtobuffDecoding";
import { validateCourseAdmissionProposal, validateMatriculationProposal } from "@/api/helpers/ProposalPayloadValidator";
import SubjectMatriculation from "@/api/api_models/matriculation_management/SubjectMatriculation";
import CourseAdmission from "@/api/api_models/admission_management/CourseAdmission";

describe("Proposal Validation Tests", () => {
    const protoURL = "public/hlf-proto.json";

    test("Test Matriculation Proposal Validation addMatriculation", async () => {
        const addMatriculationDataProposalB64 =
            "CtAHCmMIAxABGgwIuP6E/QUQgOSHrwMiA215YypAMGQyYzRlN2JjNjQzMzNlMTYwZTc0MzMwMDIwNDFjYjllMjdmN2E5OGY1NjVjZTU0ZDVmY2I2OGEwZWNkNWNhMjoIEgYSBG15Y2MS6AYKywYKDFNhbXBsZU9yZ01TUBK6Bi0tLS0tQkVHSU4gQ0VSVElGSUNBVEUtLS0tLQpNSUlDTmpDQ0FkMmdBd0lCQWdJUkFNbmY5L2RtVjlSdkNDVnc5cFpRVWZVd0NnWUlLb1pJemowRUF3SXdnWUV4CkN6QUpCZ05WQkFZVEFsVlRNUk13RVFZRFZRUUlFd3BEWVd4cFptOXlibWxoTVJZd0ZBWURWUVFIRXcxVFlXNGcKUm5KaGJtTnBjMk52TVJrd0Z3WURWUVFLRXhCdmNtY3hMbVY0WVcxd2JHVXVZMjl0TVF3d0NnWURWUVFMRXdORApUMUF4SERBYUJnTlZCQU1URTJOaExtOXlaekV1WlhoaGJYQnNaUzVqYjIwd0hoY05NVGN4TVRFeU1UTTBNVEV4CldoY05NamN4TVRFd01UTTBNVEV4V2pCcE1Rc3dDUVlEVlFRR0V3SlZVekVUTUJFR0ExVUVDQk1LUTJGc2FXWnYKY201cFlURVdNQlFHQTFVRUJ4TU5VMkZ1SUVaeVlXNWphWE5qYnpFTU1Bb0dBMVVFQ3hNRFEwOVFNUjh3SFFZRApWUVFERXhad1pXVnlNQzV2Y21jeExtVjRZVzF3YkdVdVkyOXRNRmt3RXdZSEtvWkl6ajBDQVFZSUtvWkl6ajBECkFRY0RRZ0FFWjhTNFY3MU9CSnB5TUlWWmR3WWRGWEFja0l0cnB2U3JDZjBIUWc0MFdXOVhTb09PTzc2SStVbWYKRWttVGxJSlhQNy9BeVJSU1JVMzhvSThJdnR1NE02Tk5NRXN3RGdZRFZSMFBBUUgvQkFRREFnZUFNQXdHQTFVZApFd0VCL3dRQ01BQXdLd1lEVlIwakJDUXdJb0FnaW5PUkloblBFRlpVaFhtNmVXQmttN0s3WmM4UjQvejdMVzRICm9zc0RsQ3N3Q2dZSUtvWkl6ajBFQXdJRFJ3QXdSQUlnVmlrSVVaemdmdUZzR0xRSFdKVVZKQ1U3cERhRVRrYXoKUHpGZ3NDaUx4VUFDSUNnekpZbFc3bnZaeFA3YjZ0YmV1M3Q4bXJoTVhRczk1Nm1ENCtCb0t1TkkKLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQoSGONRBRA1kXs+9++Z6MnvNsGGmbVTAgzS+RK7BAq4BAq1BAgBEgYSBG15Y2MaqAQKH1VDNC5BcHByb3ZhbDphcHByb3ZlVHJhbnNhY3Rpb24KFVVDNC5NYXRyaWN1bGF0aW9uRGF0YQoUYWRkTWF0cmljdWxhdGlvbkRhdGEK1wNbIntcImVucm9sbG1lbnRJZFwiOlwiNTAwXCIsXCJtYXRyaWN1bGF0aW9uU3RhdHVzXCI6W3tcImZpZWxkT2ZTdHVkeVwiOlwiTWVkaWEgU2NpZW5jZXNcIixcInNlbWVzdGVyc1wiOltcIldTMjAyMC8yMVwiXX0se1wiZmllbGRPZlN0dWR5XCI6XCJNYXRoZW1hdGljc1wiLFwic2VtZXN0ZXJzXCI6W1wiV1MyMDIwLzIxXCIsXCJTUzIwMThcIl19LHtcImZpZWxkT2ZTdHVkeVwiOlwiUGh5c2ljc1wiLFwic2VtZXN0ZXJzXCI6W1wiU1MyMDE4XCJdfSx7XCJmaWVsZE9mU3R1ZHlcIjpcIlBlZGFnb2d5XCIsXCJzZW1lc3RlcnNcIjpbXCJTUzIwMTRcIixcIlNTMjAxMFwiXX0se1wiZmllbGRPZlN0dWR5XCI6XCJCdXNpbmVzcyBJbmZvcm1hdGljc1wiLFwic2VtZXN0ZXJzXCI6W1wiV1MyMDE0LzE1XCJdfSx7XCJmaWVsZE9mU3R1ZHlcIjpcIlNwYW5pc2ggQ3VsdHVyZVwiLFwic2VtZXN0ZXJzXCI6W1wiV1MyMDEwLzExXCJdfV19Il0=";

        const addMatriculationDataProposal = await decodeProposal(addMatriculationDataProposalB64, protoURL);

        if (!addMatriculationDataProposal) fail("Could not decode Add Matriculation Proposal");

        const addMatriculationDataMatriculation: SubjectMatriculation[] = [
            { fieldOfStudy: "Media Sciences", semesters: ["WS2020/21"] },
            { fieldOfStudy: "Mathematics", semesters: ["WS2020/21", "SS2018"] },
            { fieldOfStudy: "Physics", semesters: ["SS2018"] },
            { fieldOfStudy: "Pedagogy", semesters: ["SS2014", "SS2010"] },
            { fieldOfStudy: "Business Informatics", semesters: ["WS2014/15"] },
            { fieldOfStudy: "Spanish Culture", semesters: ["WS2010/11"] },
        ];
        const addMatriculationDataEnrollmentId = "500";

        expect(
            validateMatriculationProposal(
                addMatriculationDataProposal.payload,
                addMatriculationDataEnrollmentId,
                addMatriculationDataMatriculation
            )
        ).toBe(true);

        addMatriculationDataMatriculation.push({ fieldOfStudy: "Some Studies", semesters: ["Some Semester"] });

        expect(
            validateMatriculationProposal(
                addMatriculationDataProposal.payload,
                addMatriculationDataEnrollmentId,
                addMatriculationDataMatriculation
            )
        ).toBe(false);
    });

    test("Test Matriculation Proposal Validation updateMatriculationData", async () => {
        const updateMatriculationDataProposalB64 =
            "Cs8HCmIIAxABGgsIu/6E/QUQwNO0FiIDbXljKkBiYWE4Y2NlNmVkNjNlYTIyNjkyMGVmZjQxN2E0NGY1ZWNjNTdiYWUzMTM1MTlhYzZiMmJlN2MxY2IwMWU5MTYzOggSBhIEbXljYxLoBgrLBgoMU2FtcGxlT3JnTVNQEroGLS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUNOakNDQWQyZ0F3SUJBZ0lSQU1uZjkvZG1WOVJ2Q0NWdzlwWlFVZlV3Q2dZSUtvWkl6ajBFQXdJd2dZRXgKQ3pBSkJnTlZCQVlUQWxWVE1STXdFUVlEVlFRSUV3cERZV3hwWm05eWJtbGhNUll3RkFZRFZRUUhFdzFUWVc0ZwpSbkpoYm1OcGMyTnZNUmt3RndZRFZRUUtFeEJ2Y21jeExtVjRZVzF3YkdVdVkyOXRNUXd3Q2dZRFZRUUxFd05EClQxQXhIREFhQmdOVkJBTVRFMk5oTG05eVp6RXVaWGhoYlhCc1pTNWpiMjB3SGhjTk1UY3hNVEV5TVRNME1URXgKV2hjTk1qY3hNVEV3TVRNME1URXhXakJwTVFzd0NRWURWUVFHRXdKVlV6RVRNQkVHQTFVRUNCTUtRMkZzYVdadgpjbTVwWVRFV01CUUdBMVVFQnhNTlUyRnVJRVp5WVc1amFYTmpiekVNTUFvR0ExVUVDeE1EUTA5UU1SOHdIUVlEClZRUURFeFp3WldWeU1DNXZjbWN4TG1WNFlXMXdiR1V1WTI5dE1Ga3dFd1lIS29aSXpqMENBUVlJS29aSXpqMEQKQVFjRFFnQUVaOFM0VjcxT0JKcHlNSVZaZHdZZEZYQWNrSXRycHZTckNmMEhRZzQwV1c5WFNvT09PNzZJK1VtZgpFa21UbElKWFA3L0F5UlJTUlUzOG9JOEl2dHU0TTZOTk1Fc3dEZ1lEVlIwUEFRSC9CQVFEQWdlQU1Bd0dBMVVkCkV3RUIvd1FDTUFBd0t3WURWUjBqQkNRd0lvQWdpbk9SSWhuUEVGWlVoWG02ZVdCa203SzdaYzhSNC96N0xXNEgKb3NzRGxDc3dDZ1lJS29aSXpqMEVBd0lEUndBd1JBSWdWaWtJVVp6Z2Z1RnNHTFFIV0pVVkpDVTdwRGFFVGthegpQekZnc0NpTHhVQUNJQ2d6SllsVzdudlp4UDdiNnRiZXUzdDhtcmhNWFFzOTU2bUQ0K0JvS3VOSQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tChIYtPUL2cKxQViR2HLULbz78OtWQId82mcSEr4ECrsECrgECAESBhIEbXljYxqrBAofVUM0LkFwcHJvdmFsOmFwcHJvdmVUcmFuc2FjdGlvbgoVVUM0Lk1hdHJpY3VsYXRpb25EYXRhChd1cGRhdGVNYXRyaWN1bGF0aW9uRGF0YQrXA1sie1wiZW5yb2xsbWVudElkXCI6XCI1MDBcIixcIm1hdHJpY3VsYXRpb25TdGF0dXNcIjpbe1wiZmllbGRPZlN0dWR5XCI6XCJNZWRpYSBTY2llbmNlc1wiLFwic2VtZXN0ZXJzXCI6W1wiV1MyMDIwLzIxXCJdfSx7XCJmaWVsZE9mU3R1ZHlcIjpcIk1hdGhlbWF0aWNzXCIsXCJzZW1lc3RlcnNcIjpbXCJXUzIwMjAvMjFcIixcIlNTMjAxOFwiXX0se1wiZmllbGRPZlN0dWR5XCI6XCJQaHlzaWNzXCIsXCJzZW1lc3RlcnNcIjpbXCJTUzIwMThcIl19LHtcImZpZWxkT2ZTdHVkeVwiOlwiUGVkYWdvZ3lcIixcInNlbWVzdGVyc1wiOltcIlNTMjAxNFwiLFwiU1MyMDEwXCJdfSx7XCJmaWVsZE9mU3R1ZHlcIjpcIkJ1c2luZXNzIEluZm9ybWF0aWNzXCIsXCJzZW1lc3RlcnNcIjpbXCJXUzIwMTUvMTZcIl19LHtcImZpZWxkT2ZTdHVkeVwiOlwiU3BhbmlzaCBDdWx0dXJlXCIsXCJzZW1lc3RlcnNcIjpbXCJXUzIwMTAvMTFcIl19XX0iXQ==";

        const updateMatriculationDataProposal = await decodeProposal(updateMatriculationDataProposalB64, protoURL);

        if (!updateMatriculationDataProposal) fail("Could not decode Add Matriculation Proposal");

        const updateMatriculationDataMatriculation: SubjectMatriculation[] = [
            { fieldOfStudy: "Media Sciences", semesters: ["WS2020/21"] },
            { fieldOfStudy: "Mathematics", semesters: ["WS2020/21", "SS2018"] },
            { fieldOfStudy: "Physics", semesters: ["SS2018"] },
            { fieldOfStudy: "Pedagogy", semesters: ["SS2014", "SS2010"] },
            { fieldOfStudy: "Business Informatics", semesters: ["WS2015/16"] },
            { fieldOfStudy: "Spanish Culture", semesters: ["WS2010/11"] },
        ];
        const updateMatriculationDataEnrollmentId = "500";

        expect(
            validateMatriculationProposal(
                updateMatriculationDataProposal.payload,
                updateMatriculationDataEnrollmentId,
                updateMatriculationDataMatriculation
            )
        ).toBe(true);

        updateMatriculationDataMatriculation.push({ fieldOfStudy: "Some Studies", semesters: ["Some Semester"] });

        expect(
            validateMatriculationProposal(
                updateMatriculationDataProposal.payload,
                updateMatriculationDataEnrollmentId,
                updateMatriculationDataMatriculation
            )
        ).toBe(false);
    });

    test("Test Matriculation Proposal Validation addEntriesToMatriculationData", async () => {
        const addEntriesToMatriculationDataProposalB64 =
            "Cs8HCmIIAxABGgsIvf6E/QUQgOnAXCIDbXljKkBjZmY5OThjYmNmMmJiZWFjZjliYzA1ZmY2ZDI5OTk2ZmI2N2VlMmY1ZDM3MTQ2ZjQyM2ZlZDhmYTFhZmJlZWI4OggSBhIEbXljYxLoBgrLBgoMU2FtcGxlT3JnTVNQEroGLS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUNOakNDQWQyZ0F3SUJBZ0lSQU1uZjkvZG1WOVJ2Q0NWdzlwWlFVZlV3Q2dZSUtvWkl6ajBFQXdJd2dZRXgKQ3pBSkJnTlZCQVlUQWxWVE1STXdFUVlEVlFRSUV3cERZV3hwWm05eWJtbGhNUll3RkFZRFZRUUhFdzFUWVc0ZwpSbkpoYm1OcGMyTnZNUmt3RndZRFZRUUtFeEJ2Y21jeExtVjRZVzF3YkdVdVkyOXRNUXd3Q2dZRFZRUUxFd05EClQxQXhIREFhQmdOVkJBTVRFMk5oTG05eVp6RXVaWGhoYlhCc1pTNWpiMjB3SGhjTk1UY3hNVEV5TVRNME1URXgKV2hjTk1qY3hNVEV3TVRNME1URXhXakJwTVFzd0NRWURWUVFHRXdKVlV6RVRNQkVHQTFVRUNCTUtRMkZzYVdadgpjbTVwWVRFV01CUUdBMVVFQnhNTlUyRnVJRVp5WVc1amFYTmpiekVNTUFvR0ExVUVDeE1EUTA5UU1SOHdIUVlEClZRUURFeFp3WldWeU1DNXZjbWN4TG1WNFlXMXdiR1V1WTI5dE1Ga3dFd1lIS29aSXpqMENBUVlJS29aSXpqMEQKQVFjRFFnQUVaOFM0VjcxT0JKcHlNSVZaZHdZZEZYQWNrSXRycHZTckNmMEhRZzQwV1c5WFNvT09PNzZJK1VtZgpFa21UbElKWFA3L0F5UlJTUlUzOG9JOEl2dHU0TTZOTk1Fc3dEZ1lEVlIwUEFRSC9CQVFEQWdlQU1Bd0dBMVVkCkV3RUIvd1FDTUFBd0t3WURWUjBqQkNRd0lvQWdpbk9SSWhuUEVGWlVoWG02ZVdCa203SzdaYzhSNC96N0xXNEgKb3NzRGxDc3dDZ1lJS29aSXpqMEVBd0lEUndBd1JBSWdWaWtJVVp6Z2Z1RnNHTFFIV0pVVkpDVTdwRGFFVGthegpQekZnc0NpTHhVQUNJQ2d6SllsVzdudlp4UDdiNnRiZXUzdDhtcmhNWFFzOTU2bUQ0K0JvS3VOSQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tChIYDlEdDDXpLZywOLRAKy80i22M3arWziKUEroBCrcBCrQBCAESBhIEbXljYxqnAQofVUM0LkFwcHJvdmFsOmFwcHJvdmVUcmFuc2FjdGlvbgoVVUM0Lk1hdHJpY3VsYXRpb25EYXRhCh1hZGRFbnRyaWVzVG9NYXRyaWN1bGF0aW9uRGF0YQpOWyI1MDAiLCJbe1wiZmllbGRPZlN0dWR5XCI6XCJDb21wdXRlciBTY2llbmNlXCIsXCJzZW1lc3RlcnNcIjpbXCJTUzIwMjJcIl19XSJd";

        const addEntriesToMatriculationDataProposal = await decodeProposal(addEntriesToMatriculationDataProposalB64, protoURL);

        if (!addEntriesToMatriculationDataProposal) fail("Could not decode Add Matriculation Proposal");

        const addEntriesToMatriculationDataMatriculation: SubjectMatriculation[] = [
            { fieldOfStudy: "Computer Science", semesters: ["SS2022"] },
        ];
        const addEntriesToMatriculationEnrollmentId = "500";

        expect(
            validateMatriculationProposal(
                addEntriesToMatriculationDataProposal.payload,
                addEntriesToMatriculationEnrollmentId,
                addEntriesToMatriculationDataMatriculation
            )
        ).toBe(true);

        addEntriesToMatriculationDataMatriculation.push({ fieldOfStudy: "Some Studies", semesters: ["Some Semester"] });

        expect(
            validateMatriculationProposal(
                addEntriesToMatriculationDataProposal.payload,
                addEntriesToMatriculationEnrollmentId,
                addEntriesToMatriculationDataMatriculation
            )
        ).toBe(false);
    });

    test("Test Admission Proposal Validation addCourseAdmission", async () => {
        const addCourseAdmissionProposalB64 =
            "CrcJCmsIAxABGgwIgdPj/gUQgKzPvAIiCW15Y2hhbm5lbCpAYjU2YzFkNGYzZTJlZTI3NzFmNDU3YjdmZjM5MTA3NThmZWJhYTEzZGMxZjk1YWE0Y2VjNDQ1Yjk4ZTVmNzZlODoKEggSBnVjNC1jYxLHCAqqCAoHb3JnMU1TUBKeCC0tLS0tQkVHSU4gQ0VSVElGSUNBVEUtLS0tLQpNSUlDM0RDQ0FvS2dBd0lCQWdJVUtlcXlXcXFaVWlnOG9jRklmbTk2cjgvTC9YMHdDZ1lJS29aSXpqMEVBd0l3ClhqRUxNQWtHQTFVRUJoTUNSRVV4RERBS0JnTlZCQWdNQTA1U1Z6RVNNQkFHQTFVRUJ3d0pVR0ZrWlhKaWIzSnUKTVF3d0NnWURWUVFLREFOVlF6UXhEREFLQmdOVkJBc01BMVZETkRFUk1BOEdBMVVFQXd3SWNtTmhMVzl5WnpFdwpIaGNOTWpBeE1qRTFNVFkwTmpBd1doY05NakV4TWpFMU1UWTFNVEF3V2pCRk1ROHdEUVlEVlFRTEV3WmpiR2xsCmJuUXhNakF3QmdOVkJBTVRLV1p5YjI1MFpXNWtMWE5wWjI1cGJtY3RkR1Z6ZEdWeUxXbHVabTh0WVdSa1FXUnQKYVhOemFXOXVNRmt3RXdZSEtvWkl6ajBDQVFZSUtvWkl6ajBEQVFjRFFnQUVJb3BmYzNHVmNxdCtHcVdmQ21SOApCZDVsY1ZRQXBOK25HOTVaK1FhZXRGNVJVRHllMnViZFB0V1VlT0s5TnFrSk1oVWJ5ZGtSTDVvL0RoRmFiYlZhCjY2T0NBVFV3Z2dFeE1BNEdBMVVkRHdFQi93UUVBd0lEcURBZEJnTlZIU1VFRmpBVUJnZ3JCZ0VGQlFjREFRWUkKS3dZQkJRVUhBd0l3REFZRFZSMFRBUUgvQkFJd0FEQWRCZ05WSFE0RUZnUVUzZTJLUzhodmRUM1FNSU1JQ0pRMwphK3htL1Nvd0h3WURWUjBqQkJnd0ZvQVVwU3JzY29PYzBTOWNrdHlhUE50elpZaEFkRVV3TkFZRFZSMFJCQzB3Cks0SXBabkp2Ym5SbGJtUXRjMmxuYm1sdVp5MTBaWE4wWlhJdGFXNW1ieTFoWkdSQlpHMXBjM05wYjI0d2ZBWUkKS2dNRUJRWUhDQUVFY0hzaVlYUjBjbk1pT25zaWFHWXVRV1ptYVd4cFlYUnBiMjRpT2lJaUxDSm9aaTVGYm5KdgpiR3h0Wlc1MFNVUWlPaUptY205dWRHVnVaQzF6YVdkdWFXNW5MWFJsYzNSbGNpMXBibVp2TFdGa1pFRmtiV2x6CmMybHZiaUlzSW1obUxsUjVjR1VpT2lKamJHbGxiblFpZlgwd0NnWUlLb1pJemowRUF3SURTQUF3UlFJaEFNanMKck85dTI2MXpKdFYxTzl6TDFyUmNLMHhjVFpZMW9yMkZaWTU0NkNYNUFpQnZtSW5LN3lsR1dvU21hTldTdVovSwpxTUtISE81SHM1QXR0TGpLTlRUL2NBPT0KLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQoSGI9/QOyOaL66/z6CIVh+vVeVHR5u0HA1IxLAAgq9Agq6AggBEggSBnVjNC1jYxqrAgofVUM0LkFwcHJvdmFsOmFwcHJvdmVUcmFuc2FjdGlvbgoNVUM0LkFkbWlzc2lvbgoMYWRkQWRtaXNzaW9uCuoBWyJ7XCJhZG1pc3Npb25JZFwiOlwiZnJvbnRlbmQtc2lnbmluZy10ZXN0ZXItaW5mby1hZGRBZG1pc3Npb246QzFcIixcImVucm9sbG1lbnRJZFwiOlwiZnJvbnRlbmQtc2lnbmluZy10ZXN0ZXItaW5mby1hZGRBZG1pc3Npb25cIixcImNvdXJzZUlkXCI6XCJDMVwiLFwibW9kdWxlSWRcIjpcIk1hdHJpY3VsYXRpb25UZXN0TW9kdWxlLjFcIixcInRpbWVzdGFtcFwiOlwiMjAyMC0xMi0zMVQyMzo1OTo1OVwifSJd";

        const addCourseAdmissionProposal = await decodeProposal(addCourseAdmissionProposalB64, protoURL);

        if (!addCourseAdmissionProposal) fail("Could not decode Add Course Admission Proposal");

        const addCourseAdmission: CourseAdmission = {
            admissionId: "frontend-signing-tester-info-addAdmission:C1",
            courseId: "C1",
            enrollmentId: "frontend-signing-tester-info-addAdmission",
            moduleId: "MatriculationTestModule.1",
            timestamp: "2020-12-31T23:59:59",
        };

        expect(
            validateCourseAdmissionProposal(
                addCourseAdmissionProposal.payload,
                undefined,
                addCourseAdmission,
                addCourseAdmission.enrollmentId
            )
        ).toBe(true);

        addCourseAdmission.courseId = "this is a different id";

        expect(
            validateCourseAdmissionProposal(
                addCourseAdmissionProposal.payload,
                undefined,
                addCourseAdmission,
                addCourseAdmission.enrollmentId
            )
        ).toBe(false);
    });

    test("Test Admission Proposal Validation dropCourseAdmission", async () => {
        const dropCourseAdmissionProposalB64 =
            "CroJCmoIAxABGgsI4eLj/gUQgL/WBiIJbXljaGFubmVsKkAxMTUwMzEyNjMxNDI2ZmQxMTkyNDZjYmQwMjI0YjcyN2FhZGEwNDkzNDhhM2ZkYTUyNzNlNTA5YTQzMjQ0YzY2OgoSCBIGdWM0LWNjEssICq4ICgdvcmcxTVNQEqIILS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUMzekNDQW9XZ0F3SUJBZ0lVZjJ5d3dwMnM4TFAzT1ExRE1uOTdEd1NONEhnd0NnWUlLb1pJemowRUF3SXcKWGpFTE1Ba0dBMVVFQmhNQ1JFVXhEREFLQmdOVkJBZ01BMDVTVnpFU01CQUdBMVVFQnd3SlVHRmtaWEppYjNKdQpNUXd3Q2dZRFZRUUtEQU5WUXpReEREQUtCZ05WQkFzTUExVkROREVSTUE4R0ExVUVBd3dJY21OaExXOXlaekV3CkhoY05NakF4TWpFMU1UY3hPVEF3V2hjTk1qRXhNakUxTVRjeU5EQXdXakJHTVE4d0RRWURWUVFMRXdaamJHbGwKYm5ReE16QXhCZ05WQkFNVEttWnliMjUwWlc1a0xYTnBaMjVwYm1jdGRHVnpkR1Z5TFdsdVptOHRaSEp2Y0VGawpiV2x6YzJsdmJqQlpNQk1HQnlxR1NNNDlBZ0VHQ0NxR1NNNDlBd0VIQTBJQUJHTitmRlBmWlhNdFJHLzlKTUdlCkduT1d5VTV1UkF0Wk9EdHl6MjJFRndDenR1Y2NpSnZZOTM0anZxblhRWmtZWEVnaDZEVFFZRGt6Y1NIU0UrMVUKTk5TamdnRTNNSUlCTXpBT0JnTlZIUThCQWY4RUJBTUNBNmd3SFFZRFZSMGxCQll3RkFZSUt3WUJCUVVIQXdFRwpDQ3NHQVFVRkJ3TUNNQXdHQTFVZEV3RUIvd1FDTUFBd0hRWURWUjBPQkJZRUZCNW9lZ3dnWmptYjRadERRWnA2CnE0Q0plRVF0TUI4R0ExVWRJd1FZTUJhQUZHRCtCbEYrTWRHR2d4STFXWk9NMkhXMDF6d2JNRFVHQTFVZEVRUXUKTUN5Q0ttWnliMjUwWlc1a0xYTnBaMjVwYm1jdGRHVnpkR1Z5TFdsdVptOHRaSEp2Y0VGa2JXbHpjMmx2YmpCOQpCZ2dxQXdRRkJnY0lBUVJ4ZXlKaGRIUnljeUk2ZXlKb1ppNUJabVpwYkdsaGRHbHZiaUk2SWlJc0ltaG1Ma1Z1CmNtOXNiRzFsYm5SSlJDSTZJbVp5YjI1MFpXNWtMWE5wWjI1cGJtY3RkR1Z6ZEdWeUxXbHVabTh0WkhKdmNFRmsKYldsemMybHZiaUlzSW1obUxsUjVjR1VpT2lKamJHbGxiblFpZlgwd0NnWUlLb1pJemowRUF3SURTQUF3UlFJaApBTThZbWo3SUFYYnNSbWh4UGR0U0JwTDY2UUU2ckZrRzQ4UTczOFpLZWJ2eUFpQXJHQVl1ZHVTR3ZqR0lZUDNNCnFCemtKSWZrSGpoT1BNRFBvcUdHMDJFSUR3PT0KLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQoSGPBqO1aiUSFuuwt8sb+ZEyQpvi7JM42dKhKGAQqDAQqAAQgBEggSBnVjNC1jYxpyCh9VQzQuQXBwcm92YWw6YXBwcm92ZVRyYW5zYWN0aW9uCg1VQzQuQWRtaXNzaW9uCg1kcm9wQWRtaXNzaW9uCjFbImZyb250ZW5kLXNpZ25pbmctdGVzdGVyLWluZm8tZHJvcEFkbWlzc2lvbjpDMSJd";

        const dropCourseAdmissionProposal = await decodeProposal(dropCourseAdmissionProposalB64, protoURL);

        if (!dropCourseAdmissionProposal) fail("Could not decode Drop Course Admission Proposal");

        let admissionId = "frontend-signing-tester-info-dropAdmission:C1";

        expect(validateCourseAdmissionProposal(dropCourseAdmissionProposal.payload, admissionId)).toBe(true);

        admissionId = "this is a different id";

        expect(validateCourseAdmissionProposal(dropCourseAdmissionProposal.payload, admissionId)).toBe(false);
    });
});
