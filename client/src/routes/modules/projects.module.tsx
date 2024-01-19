import { HomeModernIcon } from "@heroicons/react/24/outline";
import { ProjectsList } from "../../pages/projects/ProjectsList";
import { LotInventory } from "../../pages/projects/LotInventory";
import { RoleRoute } from "../../interfaces";

export const projectsModule = (): RoleRoute => {
  const routes = {
    path: "/proyectos",
    label: "Proyectos",
    icon: <HomeModernIcon />,
    component: <div>Proyectos</div>,
    gap: false,
    submenu: true,
    sub: [
      {
        path: "/proyectos/lista",
        label: "Proyectos",
        component: <ProjectsList />,
      },
      {
        path: "/proyectos/lotes",
        label: "Invetario de Lotes",
        component: <LotInventory />,
      },
      {
        path: ":id",
        component: <div>Proyecto</div>,
      },
    ],
  };

  return routes;
};
