import * as pulumi from "@pulumi/pulumi";
import * as azure from "@pulumi/azure-native";

// Create a Resource Group
const resourceGroup = new azure.resources.ResourceGroup("weather-rg");

// Create an App Service Plan
const plan = new azure.web.AppServicePlan("weather-plan", {
    resourceGroupName: resourceGroup.name,
    kind: "App",
    sku: {
        name: "F1",
        tier: "Free",
    },
});

// Create the Web App with WEBSITE_RUN_FROM_PACKAGE settings
const webApp = new azure.web.WebApp("weather-app", {
    resourceGroupName: resourceGroup.name,
    serverFarmId: plan.id,
    siteConfig: {
        appSettings: [
            {
                name: "WEBSITE_RUN_FROM_PACKAGE",
                value: "1"
            },
            {
                name: "WEBSITE_RUN_FROM_PACKAGE_URL",
                value: "https://github.com/rlmckenney/cst8918-a03-h03-pulumi-weather/releases/latest/download/weather.zip",
            }
        ],
    },
    httpsOnly: true,
});

// Export the app's URL
export const url = webApp.defaultHostName.apply((host: string) => `https://${host}`);
