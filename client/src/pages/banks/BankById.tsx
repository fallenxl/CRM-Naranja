import { useParams } from "react-router-dom";
import { Layout } from "../Layout";
import { useEffect, useState } from "react";
import { getBankById, updateBankById } from "../../services/bank.services";
import {
  errorAlertWithTimer,
  successAlertWithTimer,
} from "../../component/alerts/Alerts";
import { Bank, FinancialProgram } from "../../interfaces";
import { Card, Input, Textarea } from "@material-tailwind/react";
import {
  ClipboardDocumentCheckIcon,
  IdentificationIcon,
  PencilSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ModalFinancialProgram } from "./component/ModalFinancialProgram";

export const BankById = () => {
  const { id } = useParams<{ id: string }>();
  const [bank, setBank] = useState<Bank>({
    _id: "",
    name: "",
    description: "",
    createdAt: "",
    financingPrograms: [],
  });
  const [updateBank, setUpdateBank] = useState<Partial<Bank>>({
    name: "",
    description: "",
    createdAt: "",
    financingPrograms: [],
  });

  const handleChange = (e: any) => {
    setUpdateBank({
      ...updateBank,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (!id) return;
    getBankById(id).then((response) => {
      if (typeof response === "string") {
        return errorAlertWithTimer("Error", response);
      }
      if (response?.data) {
        setBank(response?.data as Bank);
        setUpdateBank(response?.data as Bank);
      }
    });
  }, [id]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    updateBankById(bank._id, updateBank).then((response) => {
      if (typeof response === "string") {
        return errorAlertWithTimer("Error", response);
      }
      setBank(response?.data as Bank);
      successAlertWithTimer("Éxito", "Banco actualizado correctamente");
      setEdit(true);
    });
  };

  const [edit, setEdit] = useState(true);
  const handleEdit = () => {
    setUpdateBank(bank);
    setEdit(!edit);
  };

  const [openModal, setOpenModal] = useState(false);
  const addFinancialProgram = (program: FinancialProgram) => {
    if (!updateBank.financingPrograms) return;
    setUpdateBank({
      ...bank,
      financingPrograms: [...updateBank.financingPrograms, program],
    });
  };

  const [selectedProgram, setSelectedProgram] = useState<FinancialProgram | null>(null);
  const handleSelectProgram = (program: FinancialProgram) => {
    if(edit) return;
    setSelectedProgram(program);
    setOpenModal(true);
  };

  const handleUpdateProgram = (program: FinancialProgram) => {
    if (!bank.financingPrograms) return;
    setUpdateBank({
      ...updateBank,
      financingPrograms: updateBank.financingPrograms?.map((p, index) =>
        index === updateBank.financingPrograms?.indexOf(selectedProgram??program) ? program : p
      ),
    });
  };


  return (
    <Layout title={bank.name ?? "Bank"}>
      {openModal && (
        <ModalFinancialProgram
          setOpenModal={setOpenModal}
          addFinancialProgram={addFinancialProgram}
          updateProgram={selectedProgram}
          setUpdateProgram={setSelectedProgram}
          handleUpdateProgram={handleUpdateProgram}
        />
      )}
      <Card className="h-full w-full lg:w-9/12 mx-auto p-10 ">
        <div className="mb-8 lg:grid grid-cols-12 ">
          {/* Lead info */}
          <div className="w-full col-start-1 col-end-13 flex flex-col items-center p-4">
            <div className="w-full flex justify-between py-2">
              <span>Información</span>
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
            <form
              onSubmit={handleSubmit}
              action=""
              className="w-full flex flex-col gap-y-2 p-4"
            >
              <label className="text-gray-700 text-xs ml-7">Nombre del banco</label>
              <div className="flex items-center gap-x-2  w-full">
                <IdentificationIcon className="w-5 h-5" />
                <Input
                  name="name"
                  onChange={handleChange}
                  label="Nombre del banco"
                  crossOrigin={undefined}
                  size="md"
                  value={updateBank.name}
                  disabled={edit}
                />
              </div>
              <label className="text-gray-700 text-xs ml-7">Descripción</label>
              <div className="flex items-center gap-x-2  w-full">
                <IdentificationIcon className="w-5 h-5" />
                <Textarea
                  onChange={handleChange}
                  name="description"
                  disabled={edit}
                  label="Descripción"
                  size="md"
                  value={updateBank.description}
                />
              </div>
              <div className="flex flex-col  gap-x-2  w-full">
                <div className="flex items-center gap-x-2  w-full mb-4">
                  <span className="text-gray-700">
                    Programas de financiamiento
                  </span>
                  {!edit && (
                    <span
                      onClick={() => setOpenModal(true)}
                      className="text-blue-500 hover:text-blue-700 cursor-pointer underline"
                    >
                      Agregar
                    </span>
                  )}
                </div>
                <ul className="flex flex-wrap gap-2">
                  {updateBank.financingPrograms?.map((program) => (
                    <li className="flex items-center gap-x-2 bg-teal-600 rounded-md text-white p-2 text-xs">
                      <div className="flex items-center gap-x-2">
                        {edit ? (
                          <ClipboardDocumentCheckIcon className="w-4 h-4" />
                        ) : (
                          <XMarkIcon
                            className="w-4 h-4 cursor-pointer"
                            onClick={() =>
                              setUpdateBank({
                                ...updateBank,
                                financingPrograms:
                                  updateBank.financingPrograms?.filter(
                                    (_p, index) =>
                                      index !==
                                      updateBank.financingPrograms?.indexOf(program)
                                  ),
                              })
                            }
                          />
                        )}

                        <span
                          onClick={() => handleSelectProgram(program)}
                          className={`${
                            !edit ? "hover:text-gray-200 hover:underline cursor-pointer " : ""
                          }`}
                        >{`${program.name} - ${program.interestRate}%`}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

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
    </Layout>
  );
};
