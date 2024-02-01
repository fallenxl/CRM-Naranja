import { useEffect, useState } from "react";
import { Layout } from "../Layout";
import { Input, Textarea } from "@material-tailwind/react";
import { getAllCampaignsByStatus } from "../../services/campaign";
import {
  getAdvisorsIncludingManagers,
  getLastAdvisor,
  getSettingsAutoAssign,
} from "../../services/user.services";
import { createLead } from "../../services/lead.services";
import { useSelector } from "react-redux";
import { AppStore } from "../../redux/store";
import {
  errorAlertWithTimer,
  successAlertWithRedirect,
} from "../../component/alerts/Alerts";
import { Loading } from "../../component";
import { capitalizeFirtsLetterByWord, clearDNIMask } from "../../utils";
import { channels } from "../../constants/general";

interface Campaign {
  _id: string;
  name: string;
}
interface Advisor {
  _id: string;
  name: string;
}
export const CreateLead = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [campaignSelected, setCampaignSelected] = useState<string>("");
  const handleCampaignSelected = (e: any) => {
    setCampaignSelected(e.target.value);
  };
  const [advisorSelected, setAdvisorSelected] = useState<string>("");
  const handleAdvisorSelected = (e: any) => {
    setAdvisorSelected(e.target.value);
  };
  const [formData, setFormData] = useState({
    name: "",
    dni: "",
    email: "",
    phone: "",
    address: "",
    country: "",
    department: "",
    source: "Facebook",
    interestedIn: "",
    workAddress: "",
    workPosition: "",
    salary: "",
    workTime: "",
    paymentMethod: "",
    comment: "",
  });

  const handleInputChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.name === "salary"
          ? e.target.value.toString()
          : e.target.name === "dni"
          ? clearDNIMask(e.target.value)
          : e.target.name !== "email" &&
            e.target.name !== "comment" &&
            e.target.name !== "address" &&
            e.target.name !== "interestedIn"
          ? capitalizeFirtsLetterByWord(e.target.value)
          : e.target.value,
    });
  };
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    const data = {
      ...formData,
      name: capitalizeFirtsLetterByWord(formData.name),
      dni: clearDNIMask(formData.dni),
      campaignID: campaignSelected,
      advisorID:
        user.role === "ADVISOR" ? user.id : advisorSelected || undefined,
    };
    createLead(data).then((res) => {
      setIsLoading(false);
      if (typeof res === "string") {
        return errorAlertWithTimer("El lead ya existe", res);
      }

      successAlertWithRedirect(
        "Lead creado",
        "El lead se ha creado correctamente",
        "/prospectos/lista"
      );
    });
  };

  const [autoAssign, setAutoAssign] = useState<boolean>(false);
  useEffect(() => {
    getAllCampaignsByStatus().then((res) => {
      setCampaigns(res?.data);
    });

    getAdvisorsIncludingManagers().then((res) => {
      setAdvisors(res);
    });

    getSettingsAutoAssign(user.id).then((res) => {
      setAutoAssign(res);
    });
  }, []);

  const [lastAdvisor, setLastAdvisor] = useState<string>("");
  useEffect(() => {
    if (autoAssign) {
      getLastAdvisor().then((res) => {
        setAdvisorSelected(res?.data._id);
        setLastAdvisor(res?.data.name);
      });
    } else {
      setLastAdvisor("");
      setAdvisorSelected("");
    }
  }, [autoAssign]);

  const { user } = useSelector((state: AppStore) => state.auth);
  return (
    <>
      <Layout title="Crear prospecto">
        {isLoading && <Loading className="bg-[rgba(255,255,255,0.1)] z-10" />}
        <div className="m-auto w-full lg:w-3/4 bg-white h-auto px-10 py-6 rounded-md">
          <form
            onSubmit={handleSubmit}
            action=""
            className="text-sm flex flex-col gap-4"
          >
            <div className="flex flex-col xl:flex-row items-center justify-between mb-4 gap-4">
              <div>
                <h1 className="text-xl text-gray-700">
                  Registrar un nuevo prospecto 
                </h1>
                <small className="text-gray-500 mb-6">
                  Llena de forma correcta los campos del prospecto
                </small>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  {!autoAssign &&
                    user.role !== "ADVISOR" &&
                    user.role !== "COMMUNITY_MANAGER" && (
                      <div className="flex flex-col">
                        <small className="text-gray-600">
                          <strong className="text-red-500 text-sm">*</strong>
                          Asigna un asesor:
                        </small>
                        <select
                          placeholder="Seleccione un asesor"
                          className="border p-2 text-gray-700 rounded-md border-blue-gray-300"
                          onChange={handleAdvisorSelected}
                          value={advisorSelected}
                          required
                        >
                          <option value="" defaultChecked>
                            Sin asignar
                          </option>
                          
                          {advisors.length > 0 &&
                            advisors.map((advisor) => {
                              return (
                                <option
                                  value={advisor._id}
                                  key={advisor._id}
                                  className="mb-1 p-4"
                                >
                                  {advisor.name}
                                </option>
                              );
                            })}
                        </select>
                      </div>
                    )}

                  <div className="flex flex-col">
                    <small className="text-gray-600">
                      <strong className="text-red-500 text-sm">*</strong>
                      Selecciona una campaña:
                    </small>
                    <select
                      placeholder="Seleccione un asesor"
                      className="border p-2 text-gray-700 rounded-md border-blue-gray-300"
                      onChange={handleCampaignSelected}
                      value={campaignSelected}
                      required
                    >
                      <option value="" defaultChecked>
                        Sin asignar
                      </option>
                     
                      {campaigns.map((campaign) => {
                        return (
                          <option
                            value={campaign._id}
                            key={campaign._id}
                            className="mb-1"
                          >
                            {campaign.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                {user.role !== "ADVISOR" && (
                  <div className="flex flex-col justify-center items-center">
                    {autoAssign && (
                      <div className="flex flex-col items-center">
                        <small className="text-gray-600">
                          Configuracion automatica{" "}
                          <span className="font-bold">activada</span>
                        </small>
                        <div className="flex items-center gap-2">
                          <small className="text-gray-600">
                            Asesor asignado:
                          </small>
                          <span className="text-blue-500 text-sm">
                            {lastAdvisor}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              crossOrigin={undefined}
              type="text"
              label="Nombre Completo"
              required
            />
            <Input
              name="dni"
              value={formData.dni}
              onChange={handleInputChange}
              crossOrigin={undefined}
              onPaste={(e: any) => {
                e.preventDefault();
                const text = e.clipboardData.getData("text/plain");
                const numbers = text.replace(/\D/g, "");
                e.target.value = numbers;
              }}
              maxLength={13}
              minLength={13}
              type="text"
              label="DNI"
              required
            />
            <div className="flex flex-col  gap-4 md:gap-2 md:flex-row items-center">
              <Input
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                crossOrigin={undefined}
                type="text"
                label="Direccion"
              />
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                crossOrigin={undefined}
                type="tel"
                label="Numero de telefono"
                required
              />
            </div>
            <div className="flex flex-col  gap-4 md:gap-2 md:flex-row items-center">
              <Input
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                crossOrigin={undefined}
                type="text"
                label="Pais"
              />
              <Input
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                crossOrigin={undefined}
                type="text"
                label="Departamento"
              />
            </div>
            <Input
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              crossOrigin={undefined}
              type="email"
              label="Correo electronico"
            />
            <div className="flex flex-col">
              <label htmlFor="source" className="text-gray-700 mb-2">
                Canal:
              </label>
              <select
                name="source"
                value={formData.source}
                onChange={handleInputChange}
                className="border p-2 text-gray-700 rounded-md border-blue-gray-300"
                placeholder="Seleccione una fuente"
              >
                {channels.map((channel) => {
                  return (
                    <option value={channel} key={channel}>
                      {channel}
                    </option>
                  );
                })}
              </select>
            </div>
            <Textarea
              name="interestedIn"
              onChange={handleInputChange}
              label="Interesado en"
              value={formData.interestedIn}
            />
            <Textarea
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              label="Comentarios"
            />
            <span className="text-gray-500 text-sm">Detalles laborales:</span>
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                name="workAddress"
                value={formData.workAddress}
                onChange={handleInputChange}
                crossOrigin={undefined}
                type="text"
                label="Lugar de trabajo"
              />
              <Input
                name="workPosition"
                value={formData.workPosition}
                onChange={handleInputChange}
                crossOrigin={undefined}
                type="text"
                label="Cargo"
              />
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                crossOrigin={undefined}
                min={0}
                type="number"
                label="Salario"
                step={0.01}
              />
              <Input
                name="workTime"
                value={formData.workTime}
                onChange={handleInputChange}
                crossOrigin={undefined}
                type="text"
                label="Antiguedad"
              />
            </div>
            <span className="text-gray-500 text-sm">Detalles de pago:</span>
            <div className="flex flex-col md:flex-row gap-4">
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className="border p-2 text-gray-700 rounded-md border-blue-gray-300"
              >
                <option value="" defaultChecked>
                  Seleccione un metodo de pago
                </option>
                <option value="Efectivo">Pago en Efectivo</option>
                <option value="Transferencia Bancaria">
                  Transferencia Bancaria
                </option>
              </select>
            </div>
            <div className="flex justify-end">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                Guardar
              </button>
            </div>
          </form>
        </div>
      </Layout>
    </>
  );
};
