import { getPublicKeyFromCertificate, pemStringToPrivateKey, pemStringToPublicKey } from "@/use/crypto/certificates";
import { signProtobuf, verifyProtobufSignature } from "@/use/crypto/signing";

describe("Transaction Signing Tests", () => {
    const privateKeyPem =
        "-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgjSxULr+PUQtz22nk\n7Xv9kO4m8dT2qf1WgDcn6z5+E2qgCgYIKoZIzj0DAQehRANCAARJFI1Srj+IloyE\n5sw59Z9qs9ETZhidJZAr0I0NxLHlE3zsf8wAdK4A1oa3hSjEkSsDypNXjkeGokcb\nFdKCMFoD\n-----END PRIVATE KEY-----\n";
    const certificate =
        "-----BEGIN CERTIFICATE-----\nMIICZzCCAg6gAwIBAgIUFYQhngIphWlQ8NlRenYivaajGz4wCgYIKoZIzj0EAwIw\nXjELMAkGA1UEBhMCREUxDDAKBgNVBAgMA05SVzESMBAGA1UEBwwJUGFkZXJib3Ju\nMQwwCgYDVQQKDANVQzQxDDAKBgNVBAsMA1VDNDERMA8GA1UEAwwIcmNhLW9yZzEw\nHhcNMjAxMjAxMDkyODAwWhcNMjExMjAxMDkzMzAwWjAfMQ8wDQYDVQQLEwZjbGll\nbnQxDDAKBgNVBAMTAzEwMTBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABEkUjVKu\nP4iWjITmzDn1n2qz0RNmGJ0lkCvQjQ3EseUTfOx/zAB0rgDWhreFKMSRKwPKk1eO\nR4aiRxsV0oIwWgOjgegwgeUwDgYDVR0PAQH/BAQDAgOoMB0GA1UdJQQWMBQGCCsG\nAQUFBwMBBggrBgEFBQcDAjAMBgNVHRMBAf8EAjAAMB0GA1UdDgQWBBTV2tpCoXs1\n9iV2TSfqI/pQ2YJsQTAfBgNVHSMEGDAWgBSIXgNRxI/Arcrcpm+T/6q4Cqa9NDAO\nBgNVHREEBzAFggMxMDEwVgYIKgMEBQYHCAEESnsiYXR0cnMiOnsiaGYuQWZmaWxp\nYXRpb24iOiIiLCJoZi5FbnJvbGxtZW50SUQiOiIxMDEiLCJoZi5UeXBlIjoiY2xp\nZW50In19MAoGCCqGSM49BAMCA0cAMEQCIGew41nSkA3+6HJKZomIssB+KE7p4czs\n2cVsfrBK3SaIAiB4qQxWy+c5Vfmdh/wqS1nI9MvmX3d1Ne2pevS3QNSwhQ==\n-----END CERTIFICATE-----\n";
    const trans =
        "CpgICmsIAxABGgwImqeY/gUQ4L36wQMiCW15Y2hhbm5lbCpAZjZhYjA5ZmI0NjM0ZGMwMDZkNTdiNTI1MDgxY2NhM2IwNDI2MGQxMGZmMGFiN2MxYWExMDJlMGFhM2ZlZjE4YjoKEggSBnVjNC1jYxKoBwqLBwoHb3JnMU1TUBL/Bi0tLS0tQkVHSU4gQ0VSVElGSUNBVEUtLS0tLQpNSUlDWnpDQ0FnNmdBd0lCQWdJVUZZUWhuZ0lwaFdsUThObFJlbllpdmFhakd6NHdDZ1lJS29aSXpqMEVBd0l3ClhqRUxNQWtHQTFVRUJoTUNSRVV4RERBS0JnTlZCQWdNQTA1U1Z6RVNNQkFHQTFVRUJ3d0pVR0ZrWlhKaWIzSnUKTVF3d0NnWURWUVFLREFOVlF6UXhEREFLQmdOVkJBc01BMVZETkRFUk1BOEdBMVVFQXd3SWNtTmhMVzl5WnpFdwpIaGNOTWpBeE1qQXhNRGt5T0RBd1doY05NakV4TWpBeE1Ea3pNekF3V2pBZk1ROHdEUVlEVlFRTEV3WmpiR2xsCmJuUXhEREFLQmdOVkJBTVRBekV3TVRCWk1CTUdCeXFHU000OUFnRUdDQ3FHU000OUF3RUhBMElBQkVrVWpWS3UKUDRpV2pJVG16RG4xbjJxejBSTm1HSjBsa0N2UWpRM0VzZVVUZk94L3pBQjByZ0RXaHJlRktNU1JLd1BLazFlTwpSNGFpUnhzVjBvSXdXZ09qZ2Vnd2dlVXdEZ1lEVlIwUEFRSC9CQVFEQWdPb01CMEdBMVVkSlFRV01CUUdDQ3NHCkFRVUZCd01CQmdnckJnRUZCUWNEQWpBTUJnTlZIUk1CQWY4RUFqQUFNQjBHQTFVZERnUVdCQlRWMnRwQ29YczEKOWlWMlRTZnFJL3BRMllKc1FUQWZCZ05WSFNNRUdEQVdnQlNJWGdOUnhJL0FyY3JjcG0rVC82cTRDcWE5TkRBTwpCZ05WSFJFRUJ6QUZnZ014TURFd1ZnWUlLZ01FQlFZSENBRUVTbnNpWVhSMGNuTWlPbnNpYUdZdVFXWm1hV3hwCllYUnBiMjRpT2lJaUxDSm9aaTVGYm5KdmJHeHRaVzUwU1VRaU9pSXhNREVpTENKb1ppNVVlWEJsSWpvaVkyeHAKWlc1MEluMTlNQW9HQ0NxR1NNNDlCQU1DQTBjQU1FUUNJR2V3NDFuU2tBMys2SEpLWm9tSXNzQitLRTdwNGN6cwoyY1ZzZnJCSzNTYUlBaUI0cVF4V3krYzVWZm1kaC93cVMxbkk5TXZtWDNkMU5lMnBldlMzUU5Td2hRPT0KLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQoSGC4jHaDIvS5K/OjbAX4FC+a1lBlwSVFyeRKDLgqALgqoBwqLBwoHb3JnMU1TUBL/Bi0tLS0tQkVHSU4gQ0VSVElGSUNBVEUtLS0tLQpNSUlDWnpDQ0FnNmdBd0lCQWdJVUZZUWhuZ0lwaFdsUThObFJlbllpdmFhakd6NHdDZ1lJS29aSXpqMEVBd0l3ClhqRUxNQWtHQTFVRUJoTUNSRVV4RERBS0JnTlZCQWdNQTA1U1Z6RVNNQkFHQTFVRUJ3d0pVR0ZrWlhKaWIzSnUKTVF3d0NnWURWUVFLREFOVlF6UXhEREFLQmdOVkJBc01BMVZETkRFUk1BOEdBMVVFQXd3SWNtTmhMVzl5WnpFdwpIaGNOTWpBeE1qQXhNRGt5T0RBd1doY05NakV4TWpBeE1Ea3pNekF3V2pBZk1ROHdEUVlEVlFRTEV3WmpiR2xsCmJuUXhEREFLQmdOVkJBTVRBekV3TVRCWk1CTUdCeXFHU000OUFnRUdDQ3FHU000OUF3RUhBMElBQkVrVWpWS3UKUDRpV2pJVG16RG4xbjJxejBSTm1HSjBsa0N2UWpRM0VzZVVUZk94L3pBQjByZ0RXaHJlRktNU1JLd1BLazFlTwpSNGFpUnhzVjBvSXdXZ09qZ2Vnd2dlVXdEZ1lEVlIwUEFRSC9CQVFEQWdPb01CMEdBMVVkSlFRV01CUUdDQ3NHCkFRVUZCd01CQmdnckJnRUZCUWNEQWpBTUJnTlZIUk1CQWY4RUFqQUFNQjBHQTFVZERnUVdCQlRWMnRwQ29YczEKOWlWMlRTZnFJL3BRMllKc1FUQWZCZ05WSFNNRUdEQVdnQlNJWGdOUnhJL0FyY3JjcG0rVC82cTRDcWE5TkRBTwpCZ05WSFJFRUJ6QUZnZ014TURFd1ZnWUlLZ01FQlFZSENBRUVTbnNpWVhSMGNuTWlPbnNpYUdZdVFXWm1hV3hwCllYUnBiMjRpT2lJaUxDSm9aaTVGYm5KdmJHeHRaVzUwU1VRaU9pSXhNREVpTENKb1ppNVVlWEJsSWpvaVkyeHAKWlc1MEluMTlNQW9HQ0NxR1NNNDlCQU1DQTBjQU1FUUNJR2V3NDFuU2tBMys2SEpLWm9tSXNzQitLRTdwNGN6cwoyY1ZzZnJCSzNTYUlBaUI0cVF4V3krYzVWZm1kaC93cVMxbkk5TXZtWDNkMU5lMnBldlMzUU5Td2hRPT0KLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQoSGC4jHaDIvS5K/OjbAX4FC+a1lBlwSVFyeRLSJgpoCmYKZAgBEggSBnVjNC1jYxpWCh9VQzQuQXBwcm92YWw6YXBwcm92ZVRyYW5zYWN0aW9uCg9VQzQuQ2VydGlmaWNhdGUKDmFkZENlcnRpZmljYXRlChJbIjEwMSIsIldoYXRldmVyIl0S5SUKpgQKIGJbiHvJxSY0DZ0XV+2vGd8lEz/jFZULN6PJky81haoEEoEECtICEjcKCl9saWZlY3ljbGUSKQonCiFuYW1lc3BhY2VzL2ZpZWxkcy91YzQtY2MvU2VxdWVuY2USAggDEpYCCgZ1YzQtY2MSiwIKOwo1AGRyYWZ0OgBZL011VGVZWE5LSDgrZUJpU0tLOWlwZ0VtNmJLTlVBeDhlVU1UcnYrOUxVPQASAggKGssBCjUAZHJhZnQ6AFkvTXVUZVlYTktIOCtlQmlTS0s5aXBnRW02YktOVUF4OGVVTVRydis5TFU9ABqRAVt7ImlkIjoieDUwOTo6Q05cdTAwM2QxMDEsIE9VXHUwMDNkY2xpZW50OjpDTlx1MDAzZHJjYS1vcmcxLCBPVVx1MDAzZFVDNCwgT1x1MDAzZFVDNCwgTFx1MDAzZFBhZGVyYm9ybiwgU1RcdTAwM2ROUlcsIENcdTAwM2RERSIsInR5cGUiOiJjbGllbnQifV0alwEIyAEakQFbeyJpZCI6Ing1MDk6OkNOXHUwMDNkMTAxLCBPVVx1MDAzZGNsaWVudDo6Q05cdTAwM2RyY2Etb3JnMSwgT1VcdTAwM2RVQzQsIE9cdTAwM2RVQzQsIExcdTAwM2RQYWRlcmJvcm4sIFNUXHUwMDNkTlJXLCBDXHUwMDNkREUiLCJ0eXBlIjoiY2xpZW50In1dIhASBnVjNC1jYxoGMC4xMy4wEqwICuEHCgdvcmcxTVNQEtUHLS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUNwakNDQWsyZ0F3SUJBZ0lVRmJoWTNLSFpLeVNwV0ZGd1hlTTFiUm1SMVZ3d0NnWUlLb1pJemowRUF3SXcKWGpFTE1Ba0dBMVVFQmhNQ1JFVXhEREFLQmdOVkJBZ01BMDVTVnpFU01CQUdBMVVFQnd3SlVHRmtaWEppYjNKdQpNUXd3Q2dZRFZRUUtEQU5WUXpReEREQUtCZ05WQkFzTUExVkROREVSTUE4R0ExVUVBd3dJY21OaExXOXlaekV3CkhoY05NakF4TWpBeE1EZzFNVEF3V2hjTk1qRXhNakF4TURnMU5qQXdXakJnTVFzd0NRWURWUVFHRXdKVlV6RVgKTUJVR0ExVUVDQk1PVG05eWRHZ2dRMkZ5YjJ4cGJtRXhGREFTQmdOVkJBb1RDMGg1Y0dWeWJHVmtaMlZ5TVEwdwpDd1lEVlFRTEV3UndaV1Z5TVJNd0VRWURWUVFERXdwd1pXVnlNaTF2Y21jeE1Ga3dFd1lIS29aSXpqMENBUVlJCktvWkl6ajBEQVFjRFFnQUVXYk1qYisvTWY5RVpBWWVnVjFYYTlGNTZxbTlyUTdCS0YwTWVxZ1lWRzZqdSszSWoKZTBOc1BjWU4vRFkzcVhrUDRWaElCZkYyeXErZTh1WFJNN0g2Q2FPQjVqQ0I0ekFPQmdOVkhROEJBZjhFQkFNQwpCNEF3REFZRFZSMFRBUUgvQkFJd0FEQWRCZ05WSFE0RUZnUVUrZGwranVBMDFvOVNqWUE4eFZCMUlrWU1MbG93Ckh3WURWUjBqQkJnd0ZvQVVpRjREVWNTUHdLM0szS1p2ay8rcXVBcW12VFF3SmdZRFZSMFJCQjh3SFlJYmNHVmwKY2pJdGIzSm5NUzAxT1RjNFpHUm1PV0kwTFhKNmVuWnVNRnNHQ0NvREJBVUdCd2dCQkU5N0ltRjBkSEp6SWpwNwpJbWhtTGtGbVptbHNhV0YwYVc5dUlqb2lJaXdpYUdZdVJXNXliMnhzYldWdWRFbEVJam9pY0dWbGNqSXRiM0puCk1TSXNJbWhtTGxSNWNHVWlPaUp3WldWeUluMTlNQW9HQ0NxR1NNNDlCQU1DQTBjQU1FUUNJRVJxV21RUEVFRC8KWDdpVUl2SEZxUzE3MVdDSTJtRjl5eDlMMTJ6S1d0bFhBaUJBSzNFaWFxd0xzaEczaERwZXloaXRhaUNaYlgrRQo1ZkZFM09OK0pRTlFoUT09Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0KEkYwRAIgUseOI+buRSFVT67bAxwCGpnHwUu/wNWsupiVSZZc2iACIF60IIWfq9RWsBOYv+hg0ymbWTRTdzFTHBhcD6dY5NjIEqwICuEHCgdvcmcyTVNQEtUHLS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUNwekNDQWsyZ0F3SUJBZ0lVRnFkeHJ1bkc5dlk5emwxdzl0Sk52L2hjL05Zd0NnWUlLb1pJemowRUF3SXcKWGpFTE1Ba0dBMVVFQmhNQ1JFVXhEREFLQmdOVkJBZ01BMDVTVnpFU01CQUdBMVVFQnd3SlVHRmtaWEppYjNKdQpNUXd3Q2dZRFZRUUtEQU5WUXpReEREQUtCZ05WQkFzTUExVkROREVSTUE4R0ExVUVBd3dJY21OaExXOXlaekl3CkhoY05NakF4TWpBeE1EZzFNVEF3V2hjTk1qRXhNakF4TURnMU5qQXdXakJnTVFzd0NRWURWUVFHRXdKVlV6RVgKTUJVR0ExVUVDQk1PVG05eWRHZ2dRMkZ5YjJ4cGJtRXhGREFTQmdOVkJBb1RDMGg1Y0dWeWJHVmtaMlZ5TVEwdwpDd1lEVlFRTEV3UndaV1Z5TVJNd0VRWURWUVFERXdwd1pXVnlNaTF2Y21jeU1Ga3dFd1lIS29aSXpqMENBUVlJCktvWkl6ajBEQVFjRFFnQUVOWitEUDNINU0xNCtUYUpQZU9RVDhpY3JQdEhMVHJZVEtUOTNZRXJRTVd0bVZXMy8KNHMvbkU2VHZoem54Z1RsMmxqY0pBZEVDUlorUFE4ekdRamQ3VUtPQjVqQ0I0ekFPQmdOVkhROEJBZjhFQkFNQwpCNEF3REFZRFZSMFRBUUgvQkFJd0FEQWRCZ05WSFE0RUZnUVVXRUp1cGFWNmlUcVZyUUcvUjdkWFM5VFoxdzB3Ckh3WURWUjBqQkJnd0ZvQVVzTVZOQllaRlhqa1VqZ0tJVCtYbGRHaUpmSTh3SmdZRFZSMFJCQjh3SFlJYmNHVmwKY2pJdGIzSm5NaTAzWm1JMk4ySTNabU0xTFhKc2VHMDBNRnNHQ0NvREJBVUdCd2dCQkU5N0ltRjBkSEp6SWpwNwpJbWhtTGtGbVptbHNhV0YwYVc5dUlqb2lJaXdpYUdZdVJXNXliMnhzYldWdWRFbEVJam9pY0dWbGNqSXRiM0puCk1pSXNJbWhtTGxSNWNHVWlPaUp3WldWeUluMTlNQW9HQ0NxR1NNNDlCQU1DQTBnQU1FVUNJUUNnMGVqTGRsNjkKUFQ2dlptUGlZYzZwTjNMNzhwMjBjK3NIaVlwMFk2akM3UUlnY1kvZmNwaWFUME51RmI1VTNxeS96c1ZjV29CeQptdzlmalF3MCtmNGJOUkU9Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0KEkYwRAIgIImwk0pmxj1GU+tR9SQgUTI2ig1q6iMgLXk0vaqNYxUCIDXwDwvw9Mtd2yfclXNtSsMYFahUYUCQiHjilwNcP+iPEqwICuEHCgdvcmcxTVNQEtUHLS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUNwekNDQWsyZ0F3SUJBZ0lVWVVmMHJsYVlTREx6NG1mT0ZGZDJhdEs5Wm5Jd0NnWUlLb1pJemowRUF3SXcKWGpFTE1Ba0dBMVVFQmhNQ1JFVXhEREFLQmdOVkJBZ01BMDVTVnpFU01CQUdBMVVFQnd3SlVHRmtaWEppYjNKdQpNUXd3Q2dZRFZRUUtEQU5WUXpReEREQUtCZ05WQkFzTUExVkROREVSTUE4R0ExVUVBd3dJY21OaExXOXlaekV3CkhoY05NakF4TWpBeE1EZzFNVEF3V2hjTk1qRXhNakF4TURnMU5qQXdXakJnTVFzd0NRWURWUVFHRXdKVlV6RVgKTUJVR0ExVUVDQk1PVG05eWRHZ2dRMkZ5YjJ4cGJtRXhGREFTQmdOVkJBb1RDMGg1Y0dWeWJHVmtaMlZ5TVEwdwpDd1lEVlFRTEV3UndaV1Z5TVJNd0VRWURWUVFERXdwd1pXVnlNUzF2Y21jeE1Ga3dFd1lIS29aSXpqMENBUVlJCktvWkl6ajBEQVFjRFFnQUVWN1F3RmRVaFBPUm5hV1hoaVhnWk9ONEovRlpSLytvbnU4dGI5OXdJenVuOGozMDkKZU5NOE1LdVVGZG5vbFlGU1RONWU2YXpFaEw5aUVPbjExb3pDTnFPQjVqQ0I0ekFPQmdOVkhROEJBZjhFQkFNQwpCNEF3REFZRFZSMFRBUUgvQkFJd0FEQWRCZ05WSFE0RUZnUVUxL1BjVGM3Z0FRSHVSRWJSWkFOSkt2Q09VTTB3Ckh3WURWUjBqQkJnd0ZvQVVpRjREVWNTUHdLM0szS1p2ay8rcXVBcW12VFF3SmdZRFZSMFJCQjh3SFlJYmNHVmwKY2pFdGIzSm5NUzAyT0RWak9XTmpZbUptTFRKa09UVXlNRnNHQ0NvREJBVUdCd2dCQkU5N0ltRjBkSEp6SWpwNwpJbWhtTGtGbVptbHNhV0YwYVc5dUlqb2lJaXdpYUdZdVJXNXliMnhzYldWdWRFbEVJam9pY0dWbGNqRXRiM0puCk1TSXNJbWhtTGxSNWNHVWlPaUp3WldWeUluMTlNQW9HQ0NxR1NNNDlCQU1DQTBnQU1FVUNJUUMxZWdHTnRBUXYKTUppbk1wblpNYzlFRk9lMXJkc1UvN0xpSkdtbkM4ajEzd0lnQU5MTk5ZWk5vTGdpampWd3krZGtwakErdzJaMApzWnpsRXVGSUEvcFZkWmM9Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0KEkYwRAIgCUYTlS1e5QZQ1fp7UfEYpt4MDEqYE1iB0ueFTmgqMBgCIA70Azr2i8BxV602BY+2AfCA/M73GsMZ1U2d2U1EfZFOEqwICuEHCgdvcmcyTVNQEtUHLS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUNwekNDQWsyZ0F3SUJBZ0lVWnQwRFpPODRXWUVPVWlHT1Bna3QrNlhGazJNd0NnWUlLb1pJemowRUF3SXcKWGpFTE1Ba0dBMVVFQmhNQ1JFVXhEREFLQmdOVkJBZ01BMDVTVnpFU01CQUdBMVVFQnd3SlVHRmtaWEppYjNKdQpNUXd3Q2dZRFZRUUtEQU5WUXpReEREQUtCZ05WQkFzTUExVkROREVSTUE4R0ExVUVBd3dJY21OaExXOXlaekl3CkhoY05NakF4TWpBeE1EZzFNVEF3V2hjTk1qRXhNakF4TURnMU5qQXdXakJnTVFzd0NRWURWUVFHRXdKVlV6RVgKTUJVR0ExVUVDQk1PVG05eWRHZ2dRMkZ5YjJ4cGJtRXhGREFTQmdOVkJBb1RDMGg1Y0dWeWJHVmtaMlZ5TVEwdwpDd1lEVlFRTEV3UndaV1Z5TVJNd0VRWURWUVFERXdwd1pXVnlNUzF2Y21jeU1Ga3dFd1lIS29aSXpqMENBUVlJCktvWkl6ajBEQVFjRFFnQUVSbXhQYWZaTHhMNVFXWlJ0eWxJVWVFN002VzZPbEd3VXQ5M0lrY2xBeUhrcWVweDgKTFlPdVNMRkpobWlmQmFmTS9jdHM5R0swQ0JDcVE2NmVCNkY5dnFPQjVqQ0I0ekFPQmdOVkhROEJBZjhFQkFNQwpCNEF3REFZRFZSMFRBUUgvQkFJd0FEQWRCZ05WSFE0RUZnUVVmT3A4WWlML2ZBUU9VQWJWNjd2d0N1VTR3T1V3Ckh3WURWUjBqQkJnd0ZvQVVzTVZOQllaRlhqa1VqZ0tJVCtYbGRHaUpmSTh3SmdZRFZSMFJCQjh3SFlJYmNHVmwKY2pFdGIzSm5NaTAxT0dRME5tTTBabUk0TFd4M2F6SjBNRnNHQ0NvREJBVUdCd2dCQkU5N0ltRjBkSEp6SWpwNwpJbWhtTGtGbVptbHNhV0YwYVc5dUlqb2lJaXdpYUdZdVJXNXliMnhzYldWdWRFbEVJam9pY0dWbGNqRXRiM0puCk1pSXNJbWhtTGxSNWNHVWlPaUp3WldWeUluMTlNQW9HQ0NxR1NNNDlCQU1DQTBnQU1FVUNJUUNqMVova2tRejAKeUg1bWZ1T2NsOTRqWDFzeHBqblVRTC9IQzJzRmJmUG1uQUlnUTJ6T0JMNlNmRzdXK0V4aWlqVDFTcGxLOXpHegpMUzgzTGdaaFNBSGk4dnM9Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0KEkYwRAIgAbNRDNPXEgduhn00uIDZ4pPFpy4EBhVLMTjSRhh8JhMCICyBK1adHJqaiXZb1xd2tHeInFalChYUD3f/IYwEo3aG";

    let privateKey: CryptoKey;
    let publicKey: CryptoKey;

    beforeAll(async () => {
        privateKey = await pemStringToPrivateKey(privateKeyPem);
        publicKey = await getPublicKeyFromCertificate(certificate);
    });

    test("Transaction signing", async () => {
        const signature = await signProtobuf(trans, privateKey);

        const ownSignatureVerification = await verifyProtobufSignature(trans, signature, publicKey);
        expect(ownSignatureVerification).toBe(true);

        // as the signature algorithm is exactly the same as in proposal signing, we can omit testing "bad" signatures here.
        // the only interesting part is the extraction of the public key, which will be used
    });
});
