import { useParams } from "react-router-dom";
import { Layout } from "../Layout";
import { Card } from "@material-tailwind/react";
import {
  ClipboardDocumentCheckIcon,
  PencilSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import {
  getAllLotsByProjectID,
  updateProjectById,
} from "../../services/projects.services";
import { Input } from "../../component/inputs/input";
import { ModalAddModel } from "./ModalAddModel";
import { IProjectModels } from "../../interfaces";
import { errorAlert, successAlert } from "../../component/alerts/Alerts";
import { ModalAddLot } from "./ModalAddLot";
import { createLot, deleteLot, updateLot } from "../../services/lots.services";

export function ProjectById() {
  const { id } = useParams<{ id: string }>();
  const [edit, setEdit] = useState(true);
  const handleEdit = () => {
    setEdit(!edit);
    if (!edit) setEditProject(project);
  };

  const [project, setProject] = useState<any>({
    _id: "",
    name: "",
    description: "",
    lots: [],
    models: [],
    address: "",
  });

  const [editProject, setEditProject] = useState<any>({
    _id: "",
    name: "",
    description: "",
    lots: [],
    models: [],
    address: "",
  });
  useEffect(() => {
    if (id) {
      getAllLotsByProjectID(id).then((res) => {
        setProject(res);
        setEditProject(res);
      });
    }
  }, []);

  const [openModal, setOpenModal] = useState(false);
  const [openModalLot, setOpenModalLot] = useState(false);
  const addModel = (model: IProjectModels) => {
    setEditProject((prev: any) => ({
      ...prev,
      models: [...(prev.models || []), model],
    }));
  };

  const [lotSelected, setLotSelected] = useState<any>(null);
  const [modelSelected, setModelSelected] = useState<number | null>(null);


  const handleChangeProject = (e: any) => {
    setEditProject((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDeleteModel = (index: number) => {
    setEditProject((prev: any) => ({
      ...prev,
      models: prev.models.filter((_: any, i: number) => i !== index),
    }));
  };

  const handleUpdateProject = (e: any) => {
    e.preventDefault();
    if (!id) return;
    updateProjectById(id, editProject).then((res) => {
      setProject(res);
      setEditProject(res);
      successAlert("Exito!", "Proyecto actualizado");
      setEdit(true);
    });
  };

  const handleAddLot = (lot: any, opt: string = "create") => {
    if (opt === "update") {
      updateLot(lot).then((res) => {
        if (typeof res === "string") return errorAlert("Error", res);
        const newLot = res.data;
        setEditProject((prev: any) => ({
          ...prev,
          lots: prev.lots.map((l: any) => {
            if (l._id === newLot._id) return newLot;
            return l;
          }),
        }));
      });
      return;
    }

    createLot(lot).then((res) => {
      if (typeof res === "string") return errorAlert("Error", res);
      const newLot = res.data;
      setEditProject((prev: any) => ({
        ...prev,
        lots: [...(prev.lots || []), newLot],
      }));
    });
  };

  const handleDeleteLot = (_id: string) => {
    deleteLot(_id).then((res) => {
      if (typeof res === "string") return errorAlert("Error", res);

      setProject((prev: any) => ({
        ...prev,
        lots: prev.lots.filter((lot: any) => lot._id !== _id),
      }));
      setEditProject((prev: any) => ({
        ...prev,
        lots: prev.lots.filter((lot: any) => lot._id !== _id),
      }));
    });
  };
  return (
    <Layout title="Proyecto">
      <Card className="h-full w-full lg:w-9/12 mx-auto p-0 lg:p-10 ">
        <div className="mb-8 lg:grid grid-cols-12 ">
          {/* Project info */}
          <div className="w-full col-start-1 col-end-13 flex flex-col items-center p-4">
            <div className="w-full flex justify-between py-2">
              <span>Información {project.name}</span>
              <button
                onClick={handleEdit}
                className="flex gap-x-2 items-center"
              >
                <span className="text-xs hover:text-blue-500 cursor-pointer">
                  Editar
                </span>
                <PencilSquareIcon className="w-4 h-4 " />
              </button>
            </div>
            <hr className="w-full mb-2" />
            {/* Lead details form */}
            <form className="w-full mt-5" onSubmit={handleUpdateProject}>
              <Input
                className="w-full"
                name="name"
                label="Nombre del proyecto"
                value={editProject.name}
                onChange={handleChangeProject}
                disabled={edit}
              />
              <Input
                className="w-full"
                name="description"
                label="Descripción"
                onChange={handleChangeProject}
                value={editProject.description}
                disabled={edit}
              />
              <Input
                className="w-full"
                name="address"
                label="Dirección"
                value={editProject.address}
                onChange={handleChangeProject}
                disabled={edit}
              />
              <div className="flex items-center gap-4 mt-3">
                <label className="text-gray-700 text-xs  ">
                  Modelos de casas
                </label>
                {!edit && (
                  <span
                    onClick={() => {
                      setModelSelected(null);
                      setOpenModal(true);
                    }}
                    className="text-xs text-blue-500 hover:text-blue-700 cursor-pointer"
                  >
                    Agregar modelo
                  </span>
                )}
              </div>
              {editProject.models?.length === 0 && (
                <span className="text-xs text-gray-500 block mt-4">
                  No hay modelos registrados
                </span>
              )}
              <ul className="flex flex-wrap gap-2 mt-2">
                {editProject.models?.map((program: any, index: number) => (
                  <li className="flex items-center gap-x-2 bg-teal-600 rounded-md text-white p-2 text-xs">
                    <div className="flex items-center gap-x-2">
                      {edit ? (
                        <ClipboardDocumentCheckIcon className="w-4 h-4" />
                      ) : (
                        <XMarkIcon
                          onClick={() => handleDeleteModel(index)}
                          className="w-4 h-4 cursor-pointer"
                        />
                      )}

                      <span
                        onClick={() => {
                          if (edit) return;
                          setModelSelected(index);
                          setOpenModal(true);
                        }}
                        className={`${
                          !edit
                            ? "hover:text-gray-200 hover:underline cursor-pointer "
                            : ""
                        }`}
                      >{`${program.model}`}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-4 mt-3">
                <label className="text-gray-700 text-xs  ">Lotes</label>
                {!edit && (
                  <span
                    onClick={() => {
                      setLotSelected(null);
                      setOpenModalLot(true);
                    }}
                    className="text-xs text-blue-500 hover:text-blue-700 cursor-pointer"
                  >
                    Agregar lote
                  </span>
                )}
              </div>

              {editProject.lots?.length === 0 && (
                <span className="text-xs text-gray-500 block mt-4">
                  No hay lotes registrados
                </span>
              )}
              <ul className="flex flex-wrap gap-2 mt-2">
                {editProject.lots?.map((lot: any) => (
                  <li className="flex items-center gap-x-2 bg-teal-600 rounded-md text-white p-2 text-xs">
                    {edit ? (
                      <ClipboardDocumentCheckIcon className="w-4 h-4" />
                    ) : (
                      <XMarkIcon
                        onClick={() => handleDeleteLot(lot._id)}
                        className="w-4 h-4 cursor-pointer"
                      />
                    )}
                    <span
                      onClick={() => {
                        if (edit) return;
                        setLotSelected(lot);
                        setOpenModalLot(true);
                      }}
                      className={`${
                        !edit
                          ? "hover:text-gray-200 hover:underline cursor-pointer "
                          : ""
                      }`}
                    >{`${lot.block && lot.block + " - "}${lot.lot}`}</span>
                  </li>
                ))}
              </ul>

              {!edit && (
                <>
                  <div className="flex items-center gap-2 flex-row-reverse">
                    <div className="flex flex-row-reverse">
                      <button className="bg-blue-500 px-4 py-2 rounded-md  text-white">
                        Guardar
                      </button>
                    </div>
                    <div className="flex flex-row-reverse">
                      <span
                        onClick={handleEdit}
                        className="bg-gray-500 hover:bg-red-500 cursor-pointer px-4 py-2 rounded-md  text-white"
                      >
                        Cancelar
                      </span>
                    </div>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </Card>
      {openModalLot && (
        <ModalAddLot
          addLot={handleAddLot}
          setOpenModal={setOpenModalLot}
          projectID={project._id}
          setEditProject={setProject}
          lot={lotSelected}
        />
      )}
      {openModal && (
        <ModalAddModel
          addModel={addModel}
          setOpenModal={setOpenModal}
          model={modelSelected !== null && editProject.models[modelSelected]}
          index={modelSelected && modelSelected}
          setEditProject={setEditProject}
        />
      )}
    </Layout>
  );
}
