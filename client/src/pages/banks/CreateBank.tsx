import { useState } from "react";
import { Layout } from "../Layout";
import { Chip, Input, Textarea } from "@material-tailwind/react";
import axios from "axios";
import { Endpoints } from "../../constants";
import {
  errorAlert,
  successAlertWithRedirect,
} from "../../component/alerts/Alerts";
import { ModalFinancialProgram } from "./component/ModalFinancialProgram";
import { FinancialProgram } from "../../interfaces";
import { XMarkIcon } from "@heroicons/react/24/outline";

export const CreateBank = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    financingPrograms: [] as FinancialProgram[],
  });

  const handleInputChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (formData.financingPrograms.length === 0)
      return errorAlert(
        "Error",
        "Agrega al menos un programa de financiamiento"
      );
    axios.post(Endpoints.BANK, formData).then((_res) => {
      successAlertWithRedirect(
        "Banco creado",
        "El banco se ha creado correctamente",
        "/bancos/lista"
      );
    });
  };

  const addFinancialProgram = (program: FinancialProgram) => {
    setFormData({
      ...formData,
      financingPrograms: [...formData.financingPrograms, program],
    });
  };

  const [openModal, setOpenModal] = useState(false);

  return (
    <Layout title="Registrar Banco">
      <div className="m-auto w-full lg:w-3/4 bg-white h-auto px-10 py-6 rounded-md">
        {openModal && (
          <ModalFinancialProgram
            addFinancialProgram={addFinancialProgram}
            setOpenModal={setOpenModal}
          />
        )}
        <form
          onSubmit={handleSubmit}
          action=""
          className="text-sm flex flex-col gap-4"
        >
          <div className="flex flex-col xl:flex-row items-center justify-between mb-4 gap-4">
            <div>
              <h1 className="text-xl text-gray-700">
                Registrar un nuevo Banco
              </h1>
              <small className="text-gray-500 mb-6">
                Llena de forma correcta los campos del banco
              </small>
            </div>
          </div>
          <Input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            crossOrigin={undefined}
            type="text"
            label="Nombre del banco"
            required
          />
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            label="Descripcion"
          />
          {/* add financial program */}
          <span
            onClick={() => setOpenModal(true)}
            className="flex text-gray-600 hover:text-gray-800  underline cursor-pointer"
          >
            Agregar programa de financiamiento
          </span>
          <ul className="flex flex-wrap gap-2">
            {formData.financingPrograms.map((program, index) => (
              <li key={index}>
                <Chip
                  color="teal"
                  value={`${program.name} - ${program.interestRate}%`}
                  icon={
                    <XMarkIcon
                      onClick={() =>
                        setFormData({
                          ...formData,
                          financingPrograms: formData.financingPrograms.filter(
                            (p) => p.name !== program.name
                          ),
                        })
                      }
                      className="h-5 w-5 text-white hover:text-gray-200 cursor-pointer"
                    />
                  }
                />
              </li>
            ))}
          </ul>

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
