import { useEffect, useState } from "react";
import { Table } from "../../component/table/Table";
import { Layout } from "../Layout";

import { getAllProjects } from "../../services/projects.services";

export function ProjectsList() {
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    setIsLoading(true);
    getAllProjects().then((res) => {
      setProjects(res?.data);
      setIsLoading(false);
    });
  }, []);
  const tableHead = ["Nombre del Proyecto", "Descripción"];
  const tableRows = projects.map((project: any) => {
    return {
      id: project._id,
      name: project.name,
      description: project.description,
    };
  });
  return (
    <Layout title="Lista de Proyectos">
      <Table
        isLoading={isLoading}
        path="/proyectos/"
        tableHead={tableHead}
        tableRows={tableRows}
        title="Lista de proyectos"
        description="Lista de todos los proyectos registrados en el sistema."
       
      />
    </Layout>
  );
}
