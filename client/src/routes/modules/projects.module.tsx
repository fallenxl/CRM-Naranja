import { HomeModernIcon } from "@heroicons/react/24/outline";
import { ProjectsList } from "../../pages/projects/ProjectsList";
import { LotInventory } from "../../pages/projects/LotInventory";
import { RoleRoute } from "../../interfaces";
import { CreateProject } from "../../pages/projects/CreateProject";
import { ProjectById } from "../../pages/projects/ProjectById";

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
        path: "/proyectos/crear",
        label: "Crear Proyecto",
        component: <CreateProject />,
      },
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
        component: <ProjectById />,
      },
    ],
  };

  return routes;
};
