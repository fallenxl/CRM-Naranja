import {
  banksModule,
  campaignsModule,
  dashboardModule,
  leadsModule,
  projectsModule,
  settingsModule,
  usersModule,
} from "../modules";

export const adminRoutes = [
  dashboardModule(),
  leadsModule(),
  campaignsModule(),
  banksModule(),
  projectsModule(),
  usersModule(),
  settingsModule(),
];
