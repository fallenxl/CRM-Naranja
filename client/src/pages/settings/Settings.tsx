import { Input, Switch } from "@material-tailwind/react";
import { Layout } from "../Layout";
import { useSelector } from "react-redux";
import { AppStore } from "../../redux/store";
import { useEffect, useState } from "react";
import { getSettingsAutoAssign, updateSettingsAutoAssign } from "../../services/user.services";

export const Settings = () => {
  const user = useSelector((state: AppStore) => state.auth.user);
  const [settings, setSettings] = useState({
    autoAssign: false,
    maxDays: 0,

  });
  useEffect(() => {
    getSettingsAutoAssign(user.id).then((res) => {
      setSettings({
        ...settings,
        autoAssign: res
      });
    });
  }, [settings.autoAssign]);

  const handleAutoAssign = () => {
    updateSettingsAutoAssign(user.id).then((res) => {
      setSettings({
        ...settings,
        autoAssign: res?.data
      });
    });
  };
  return (
    <Layout title="Configuraciones">
      <div className="w-3/4 flex flex-col gap-10 mx-auto mb-10">
        <div className="w-full border-b-2 border-gray-300 py-4">
          <h2 className="text-2xl font-bold text-gray-800 ">
            Configuracion de prospectos
          </h2>
        </div>
        <div className="flex justify-between h-4">
          <label className=" text-gray-800">
            Asignar prospectos a un asesor de forma automática
          </label>
          <Switch 
            crossOrigin={undefined}
            color="blue"
            checked={settings.autoAssign}
            className="h-full w-full"
            onChange={handleAutoAssign}
          />
        </div>
        {user.role === "ADMIN" && 
        <div className="flex justify-between h-4">
          <label className=" text-gray-800 w-3/4">
            Dias maximos para contactar a un prospecto
          </label>
          <Input
          crossOrigin={undefined}
            type="number"
            color="blue-gray"
            variant="standard"
            placeholder="Dias"
            className="text-right "
          />
        </div>}
      </div>
      
    </Layout>
  );
};
