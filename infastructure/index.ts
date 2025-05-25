import * as pulumi from "@pulumi/pulumi";
import * as azure from "@pulumi/azure-native";

const config = new pulumi.Config();
const location = config.require("azure-native:location");
const appName = config.require("weatherAppName");

// Resource Group
const resourceGroup = new azure.resources.ResourceGroup("weather-rg", {
  location,
});

// App Service Plan
const appServicePlan = new azure.web.AppServicePlan("weather-plan", {
  location,
  resourceGroupName: resourceGroup.name,
  sku: {
    name: "B1",
    tier: "Basic",
  },
});

// Web App
const webApp = new azure.web.WebApp("weather-webapp", {
  location,
  resourceGroupName: resourceGroup.name,
  serverFarmId: appServicePlan.id,
  siteConfig: {
    linuxFxVersion: "NODE|18-lts",
  },
  httpsOnly: true,
  name: appName,
});

// Export public URL
export const url = webApp.defaultHostName.apply(
  host => `https://${host}`
);

