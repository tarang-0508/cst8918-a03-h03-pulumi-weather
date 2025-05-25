import * as pulumi from "@pulumi/pulumi";
import * as azure from "@pulumi/azure-native";

// Get config values
const config = new pulumi.Config();
const location = config.require("azure-native:location");
const appName = config.require("weatherAppName");

// Create an Azure Resource Group
const resourceGroup = new azure.resources.ResourceGroup("weather-rg", {
  location: location,
});

// Create an App Service Plan (Basic Tier)
const appServicePlan = new azure.web.AppServicePlan("weather-plan", {
  resourceGroupName: resourceGroup.name,
  location: resourceGroup.location,
  sku: {
    name: "B1",
    tier: "Basic",
  },
  kind: "Linux",
  reserved: true,
});

// Create the Web App
const webApp = new azure.web.WebApp("weather-webapp", {
  resourceGroupName: resourceGroup.name,
  location: resourceGroup.location,
  serverFarmId: appServicePlan.id,
  siteConfig: {
    appSettings: [
      {
        name: "WEBSITE_RUN_FROM_PACKAGE",
        value: "1", // This means the app expects a .zip deploy
      },
      {
        name: "NODE_ENV",
        value: "production",
      },
    ],
    linuxFxVersion: "NODE|18-lts", // Node version for Remix app
  },
  httpsOnly: true,
  name: appName,
});

// ✅ Export the public URL so it shows up in `pulumi stack output`
export const url = webApp.defaultHostName.apply(
  host => `https://${host}`
);
