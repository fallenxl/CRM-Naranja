import {banksModule, campaignsModule, dashboardModule, leadsModule, projectsModule, settingsModule} from "../modules";
export const managerRoutes = [
  dashboardModule(),
  leadsModule(),
    projectsModule(),
    campaignsModule(),
    banksModule(),
  settingsModule(),
];
