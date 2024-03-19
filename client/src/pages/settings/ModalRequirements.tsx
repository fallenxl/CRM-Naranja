import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Modal } from "../../component/modal/Modal";
import { Input } from "../../component/inputs/input";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Chip } from "@material-tailwind/react";
import {
  getRequirementByName,
  updateRequirementByName,
} from "../../services/requirements.services";
import { successAlert } from "../../component/alerts/Alerts";

interface ModalRequirementsProps {
  stage: string;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
}
export function ModalRequirements({
  stage,
  setOpenModal,
}: ModalRequirementsProps) {
  const [formData, setFormData] = useState({
    name: stage,
    requirements: [] as string[],
  });

  useEffect(() => {
    getRequirementByName(stage).then((res: any) => {
      if (res.data) {
        
        setFormData({
          name: res.data[0]?.name ?? stage,
          requirements: res.data[0]?.requirements ?? [],
        });
      }
    });
  }, []);

  const handleSubmit = () => {
    updateRequirementByName(formData.name, formData.requirements).then(
      (_res) => {
        successAlert("Requisitos actualizados", "Los requisitos se han actualizado correctamente");
        setOpenModal(false);
      }
    );
  };

  return (
    <Modal>
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800">{`Requisitos ${stage}`}</h2>
      </div>
      <div className="p-4">
        <Input
          value={formData.name}
          label="Nombre"
          className="mb-4 text-gray-500"
          disabled
        />
        <Input
          placeholder="Escribe el requisito y presiona [Enter] para agregarlo"
          type="text"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setFormData({
                ...formData,
                requirements: [...formData.requirements, e.currentTarget.value],
              });
              e.currentTarget.value = "";
            }
          }}
          label="Requisitos"
        />
        <ul className="flex flex-wrap gap-2 mt-3">
          {formData.requirements.map((requirement, index) => (
            <li key={index}>
              <Chip
                color="blue"
                value={requirement}
                icon={
                  <XMarkIcon
                    onClick={() =>
                      setFormData({
                        ...formData,
                        requirements: formData.requirements.filter(
                          (p) => p !== requirement
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

        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={() => setOpenModal(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Guardar
          </button>
        </div>
      </div>
    </Modal>
  );
}
