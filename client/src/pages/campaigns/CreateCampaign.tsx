import { useState } from "react";
import { Layout } from "../Layout";
import { Input, Textarea } from "@material-tailwind/react";
import {
  errorAlertWithTimer,
  successAlertWithRedirect,
} from "../../component/alerts/Alerts";
import { createCampaign } from "../../services/campaign";

export const CreateCampaign = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  const handleInputChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    createCampaign(formData).then((res) => {
      if (typeof res === "string") {
        return errorAlertWithTimer("Error", res);
      }

      successAlertWithRedirect(
        "Campaña creada",
        "La campaña se ha creado correctamente",
        "/campañas/lista"
      );
    });
  };

  // const { user } = useSelector((state: AppStore) => state.auth)
  return (
    <Layout title="Registrar campaña">
      <div className="m-auto w-full lg:w-3/4 bg-white h-auto px-10 py-6 rounded-md">
        <form
          onSubmit={handleSubmit}
          action=""
          className="text-sm flex flex-col gap-4"
        >
          <div className="flex flex-col xl:flex-row items-center justify-between mb-4 gap-4">
            <div>
              <h1 className="text-xl text-gray-700">
                Registrar una nueva campaña
              </h1>
              <small className="text-gray-500 mb-6">
                Llena de forma correcta los campos de la campaña
              </small>
            </div>
          </div>
          <Input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            crossOrigin={undefined}
            type="text"
            label="Nombre de la campaña"
            required
          />
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            label="Descripcion"
          />
          {/* Start date */}
          <Input
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            crossOrigin={undefined}
            type="date"
            label="Fecha de inicio"
          />
          {/* End date */}
          <Input
            name="endDate"
            onChange={handleInputChange}
            value={formData.endDate}
            crossOrigin={undefined}
            type="date"
            label="Fecha de finalizacion"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};
