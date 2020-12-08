switch (process.env.TEST_ENV) {
    case "development":
        process.env.VUE_APP_API_BASE_URL = "https://uc4.cs.uni-paderborn.de/api/develop";
        break;
    case "experimental":
        process.env.VUE_APP_API_BASE_URL = "https://uc4.cs.uni-paderborn.de/api/experimental";
        break;
    default:
        process.env.VUE_APP_API_BASE_URL = "https://uc4.cs.uni-paderborn.de/api/develop";
        break;
}


