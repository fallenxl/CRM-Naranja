import { Input, Switch } from "@material-tailwind/react";
import { Layout } from "../Layout";
import { useSelector } from "react-redux";
import { AppStore } from "../../redux/store";
import {ChangeEvent, useEffect, useState} from "react";
import {
  getUserSettings, updateUserSettings,
} from "../../services/user.services";
import { ModalRequirements } from "./ModalRequirements";

export const Settings = () => {
  const user = useSelector((state: AppStore) => state.auth.user);
  const [settings, setSettings] = useState({
    autoAssign: false,
    notificationsSound: false,
    maxDays: 0,
  });
  useEffect(() => {
    getUserSettings(user.id).then((res) => {
        setSettings({
            ...settings,
            autoAssign: res.autoAssign??false,
            notificationsSound: res.notificationsSound??false,
        });
    });
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if(e.target.name === "autoAssign" || e.target.name === "notificationsSound"){
        setSettings({
            ...settings,
            [e.target.name]: e.target.checked,
        });
        updateUserSettings(user.id, {
            ...settings,
            [e.target.name]: e.target.checked,
        }).then((_res) => {
        });

    }else{
        setSettings({
            ...settings,
            [e.target.name]: e.target.value,
        });
        updateUserSettings(user.id, {
            ...settings,
            [e.target.name]: e.target.value,
        }).then((_res) => {
        });
    }
  };

  const [openModal, setOpenModal] = useState(false);
  const [requirementSelected, setRequirementSelected] = useState("");
  function handleOpenModal(requirement: string) {
    setRequirementSelected(requirement);
    setOpenModal(!openModal);
  }
  return (
    <Layout title="Configuraciones">
      <div className="w-full md:w-3/4 flex flex-col gap-10  mb-10">
        <div className="w-full border-b-2 border-gray-300 py-4">
          <h2 className="text-2xl font-bold text-gray-800 ">
            Configuración General
          </h2>
        </div>
        <div className="flex  justify-between h-4">
          <label className=" text-gray-800 w-3/4">
            Asignar prospectos a un asesor de forma automática
          </label>
          <Switch
              crossOrigin={undefined}
              name={"autoAssign"}
              color="blue"
              checked={settings.autoAssign}
              className="h-full w-full"
              onChange={handleChange}
          />
        </div>
        <div className="flex  justify-between h-4">
          <label className=" text-gray-800 w-3/4">
            Activar sonido de notificaciones
          </label>
          <Switch
              crossOrigin={undefined}
                name={"notificationsSound"}
              color="blue"
              checked={settings.notificationsSound}
              className="h-full w-full"
              onChange={handleChange}
          />
        </div>
        {user.role === "ADMIN" && (
            <div className="flex justify-between h-4">
              <label className=" text-gray-800 w-3/4">
                Dias máximos para contactar a un prospecto
              </label>
              <Input
                  crossOrigin={undefined}
                  type="number"
                  color="blue-gray"
                  variant="standard"
                  placeholder="Dias"
                  className="text-right "
              />
            </div>
        )}

        {user.role === "ADMIN" && (
            <div className="mt-10 flex flex-col gap-6">
              <div className="w-full border-b-2 border-gray-300 py-4">
                <h2 className="text-2xl font-bold text-gray-800 ">
                  Configuración de Requisitos
                </h2>
              </div>
              <div className="flex justify-between h-4">
                <label className=" text-gray-800">
                  Requisitos primera etapa{" "}
                </label>
                <button
                    onClick={() => handleOpenModal("Primera Etapa")}
                    className="text-blue-500"
                >
                  Editar
                </button>
              </div>
              <div className="flex justify-between h-4 mt-4">
                <label className=" text-gray-800">
                  Requisitos segunda etapa{" "}
                </label>
                <button
                    onClick={() => handleOpenModal("Segunda Etapa")}
                    className="text-blue-500"
                >
                  Editar
                </button>
              </div>
            </div>
        )}
      </div>
      {openModal && (
          <ModalRequirements
              stage={requirementSelected}
              setOpenModal={setOpenModal}
          />
      )}
    </Layout>
  );
};
