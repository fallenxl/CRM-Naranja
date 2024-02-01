import {
  Alert,
  Chip,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Textarea,
} from "@material-tailwind/react";
import { getAllManager, getUsersByRole } from "../../../services/user.services";
import { useEffect, useState } from "react";
import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  getLeadStatus,
  updateLeadStatus,
} from "../../../services/lead.services";
import { getAllBanks, getBankById } from "../../../services/bank.services";
import { Bank } from "../../../interfaces";
import { Loading } from "../../../component";
import { useDispatch, useSelector } from "react-redux";
import { setStatusChange } from "../../../redux/states/status.state";
import { Modal } from "../../../component/modal/Modal";
import { ToAssignProject } from "./status/ToAssignProject";
import { hasEmptyPropertiesExcept } from "../../../utils";
import { ToAssignModel } from "./status/ToAssignModel";
import { AppStore } from "../../../redux/store";
import { useNavigate } from "react-router-dom";
interface ChangeStatusModalProps {
  open: boolean;
  handleOpen: () => void;
  setLead?: () => void;
  lead?: any;
  updateLead?: any;
  setSocketTrigger?: any;
}

export const ChangeStatusModal = ({
  open,
  handleOpen,
  updateLead,
  lead,
}: ChangeStatusModalProps) => {
  const [status, setStatus] = useState({
    type: "",
    enum: [],
    selected: "",
  });

  const user = useSelector((state: AppStore) => state.auth.user);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [userSelected, setUserSelected] = useState("");
  const [date, setDate] = useState("");
  const handleDate = (e: any) => setDate(e.target.value);

  const [comment, setComment] = useState("");
  const handleChangeComment = (e: any) => setComment(e.target.value);
  const handleUserChange = (e: any) => {
    setUserSelected(e.target.value);
  };
  const [banks, setBanks] = useState([]);
  const [bankSelected, setBankSelected] = useState("");
  const handleBankChange = (e: any) => {
    setBankSelected(e.target.value);
  };

  const [projectSelected, setProjectSelected] = useState({
    projectID: "",
    lotID: "",
  });

  const [bank, setBank] = useState({} as Bank);
  const [banksAvailable, setBanksAvailable] = useState(true);
  const socket = useSelector((state: AppStore) => state.socket.socket);
  useEffect(() => {
    if (open) {
      getLeadStatus(lead._id).then((res) => {
        setStatus(res?.data);
        if (
          (res?.data.type === "Por Asignar" ||
            res?.data.type === "Prospecto" ||
            res?.data.type === "Oportunidad de venta futura") &&
          !lead.advisorID
        ) {
          getUsersByRole("ADVISOR").then((res) => {
            setUsers(res);
          });
        } else if (res?.data.type === "A Contactar") {
          getAllManager().then((res) => {
            setUsers(res);
            setUserSelected(res[0]._id);
          });
        } else if (res?.data.type === "Precalificar Buró") {
          getUsersByRole("BANK_MANAGER").then((res) => {
            setUsers(res);
          });
        }
      });

      getAllBanks().then((res) => {
        setBanks(res);
        setBanksAvailable(verifyBanksAvailable(res, lead.rejectedBanks));
      });
    }

    setError("");
  }, [open, status.type]);

  const verifyBanksAvailable = (banks: any, rejectedBanks: any) => {
    if (rejectedBanks.length === 0) return true;
    const availableBanks = banks.filter((bank: any) => {
      return !rejectedBanks.some(
        (rejectedBank: any) => rejectedBank._id === bank._id
      );
    });
    if (availableBanks.length > 0) return true;
    return false;
  };

  const [financingProgramSelected, setFinancingProgramSelected] = useState("");
  const handleFinancingProgramChange = (e: any) => {
    setFinancingProgramSelected(e.target.value);
  };
  useEffect(() => {
    getBankById(bankSelected).then((res) => {
      if (typeof res === "string") return;
      setBank(res?.data as Bank);
    });
  }, [bankSelected]);
  const handleSelect = (e: any) => {
    setStatus({
      ...status,
      selected: e.target.value,
    });

    if (status.selected === "A Contactar") {
      getUsersByRole("MANAGER").then((res) => {
        setUsers(res.data);
      });
    }
  };

  const [modelPayload, setModelPayload] = useState({} as any);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSumit = async (e: any) => {
    e.preventDefault();
    try {
      const payload =
        status.type === "A Contactar"
          ? {
              status: status.selected,
              managerID: userSelected,
              dateToCall: date,
              comment,
            }
          : status.type === "Prospecto" ||
            status.type === "Por Asignar" ||
            status.type === "Oportunidad de venta futura"
          ? {
              status: status.selected,
              advisorID: userSelected,
              dateToCall: date,
              comment,
            }
          : status.type === "Por Asignar Proyecto"
          ? {
              status: status.selected,
              projectID: projectSelected.projectID,
              lotID: projectSelected.lotID,
              comment,
            }
          : status.type === "Por Asignar Modelo de Casa"
          ? {
              status: status.selected,
              houseModel: modelPayload,
              comment,
            }
          : {
              status: status.selected,
              bankManagerID: lead.bankManagerID || userSelected,
              bankID: bankSelected,
              financingProgram: financingProgramSelected,
              dateToCall: date,
              comment,
            };
      if (status.selected === lead.status.selected) {
        return setError("Debe seleccionar un estado diferente");
      }

      if (
        hasEmptyPropertiesExcept(updateLead, [
          "comment",
          "workPosition",
          "paymentMethod",
          "workTime",
          "workAddress",
          "salary",
        ]) &&
        status.selected === "Contactado" &&
        status.type === "A Contactar"
      ) {
        return setError("Debe llenar toda la ficha");
      }

      if(hasEmptyPropertiesExcept(updateLead, ["comment"]) && status.selected === "Precalifica en Buró" && status.type === "Precalificar Buró") {
        return setError("Debe llenar toda la ficha");
      }

      setIsLoading(true);
      updateLeadStatus(lead._id, payload).then((res) => {
        setIsLoading(false);
        if (typeof res === "string") {
          navigate("/prospectos/lista");
        }
        dispatch(setStatusChange(true));
        setBankSelected("");
        setFinancingProgramSelected("");
        handleOpen();
        socket.emit("updateLeads");
        if (status.type === "Pendiente de llamar" && user.role !== "ADMIN") {
          window.location.href = `/prospectos/lista`;
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const isBankAvailable = (id: string) => {
    return lead.rejectedBanks?.some(
      (rejectedBank: any) => rejectedBank._id === id
    );
  };

  return (
    <Modal>
      {isLoading && <Loading className="z-10 opacity-70 rounded-md" />}
      <div className="flex items-center justify-between">
        <DialogHeader className="text-gray-700">
          Cambiar estado del prospecto
        </DialogHeader>
        <XMarkIcon
          onClick={handleOpen}
          className="w-5 h-5 cursor-pointer mr-5"
        />
      </div>
      <form onSubmit={handleSumit}>
        <DialogBody divider className="flex flex-col gap-3">
          {error && (
            <Alert
              className="flex items-center"
              icon={<ExclamationTriangleIcon className="w-5 h-5" />}
              color="red"
            >
              {error}
            </Alert>
          )}

          {status.type === "Precalificar Buró" && !banksAvailable && (
            // warning
            <Alert
              className="flex items-center bg-yellow-700"
              icon={<ExclamationTriangleIcon className="w-5 h-5" />}
            >
              {`El prospecto ya ha sido rechazado por todos los bancos disponibles, por favor envielo a oportunidad de venta futura`}
            </Alert>
          )}
          <div className="flex gap-2 items-center">
            <span className="text-gray-600 font-bold">Estado actual:</span>
            <Chip
              color="light-blue"
              className="font-medium text-white"
              value={status.type}
            />
          </div>
          {lead.bankID && (
            <div className="flex flex-col gap-3">
              <div className="flex gap-2 items-center">
                <span className="text-gray-600 font-bold">Banco:</span>
                <span className="font-medium text-gray-600">
                  {lead.bankID.name}
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-gray-600 font-bold">
                  Programa de financiamiento:
                </span>
                <span className="font-medium text-gray-600">
                  {lead.financingProgram}
                </span>
              </div>
            </div>
          )}
          {status.type === "Por Asignar Modelo de Casa" && (
            <div className="flex items-center gap-2">
              <span className="text-gray-600 font-bold">Proyecto:</span>
              <span className="font-medium text-gray-600">
                {lead.projectDetails?.projectID?.name}
              </span>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="selectStatus" className="font-bold text-gray-600">
              Seleccionar estado:
            </label>
            <select
              name="selectStatus"
              onChange={handleSelect}
              value={status.selected}
              className="border border-gray-300 rounded-md p-2"
            >
              {status.enum.map((item: any) => (
                <>
                  {item === "Selecciona un estado" ? (
                    <option key={item} value={item} defaultChecked disabled>
                      {item}
                    </option>
                  ) : (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  )}
                </>
              ))}
            </select>
            {/* A contactar */}
            {status.selected === "A Contactar" && !lead.advisorID && (
              <>
                <label
                  htmlFor="selectAdvisor"
                  className="text-gray-600 font-bold"
                >
                  Seleccionar un asesor:
                </label>
                <select
                  name="selectAdvisor"
                  className="border border-gray-300 rounded-md p-2"
                  onChange={handleUserChange}
                  value={userSelected}
                  required
                >
                  <option value="" defaultChecked disabled>
                    Seleccionar encargado
                  </option>
                  {users.length > 0 &&
                    users.map((item: any) => {
                      return (
                        <option key={item._id} value={item._id}>
                          {item.name}
                        </option>
                      );
                    })}
                </select>
              </>
            )}

            {status.selected === "Contactado" &&
              status.type === "A Contactar" && (
                <>
                  <label
                    htmlFor="selectAdvisor"
                    className="text-gray-600 font-bold"
                  >
                    Seleccionar al encargado de precalificar buró:
                  </label>
                  <select
                    name="selectAdvisor"
                    className="border border-gray-300 rounded-md p-2"
                    onChange={handleUserChange}
                    value={userSelected}
                    required
                  >
                    <option value="" defaultChecked disabled>
                      Seleccionar encargado
                    </option>

                    {users.length > 0 &&
                      users.map((item: any) => {
                        return (
                          <option key={item._id} value={item._id} defaultChecked={users.length === 1}>
                            {item.name}
                          </option>
                        );
                      })}
                  </select>
                </>
              )}

            {status.selected === "Precalifica en Buró" &&
              !lead.bankManagerID &&
              banksAvailable && (
                <>
                  <label
                    htmlFor="selectAdvisor"
                    className="text-gray-600 font-bold"
                  >
                    Seleccionar al encargado de precalificar banco:
                  </label>
                  <select
                    name="selectAdvisor"
                    className="border border-gray-300 rounded-md p-2"
                    onChange={handleUserChange}
                    value={userSelected}
                    required
                  >
                    <option value="" defaultChecked disabled>
                      Seleccionar encargado
                    </option>

                    {users &&
                      users.map((item: any) => {
                        return (
                          <option key={item._id} value={item._id} defaultChecked={users.length === 1}>
                            {item.name}
                          </option>
                        );
                      })}
                  </select>
                </>
              )}
            {/* Precalificar buro */}
            {status.selected === "Precalifica en Buró" && banksAvailable && (
              <>
                <label htmlFor="selectBank" className="text-gray-600 font-bold">
                  Seleccionar banco:
                </label>
                <select
                  name="selectBank"
                  className="border border-gray-300 rounded-md p-2"
                  onChange={handleBankChange}
                  value={bankSelected}
                  required
                >
                  <option value="" defaultChecked disabled>
                    Seleccionar banco
                  </option>

                  {banks &&
                    banks.map((item: any) => {
                      return (
                        <>
                          {isBankAvailable(item._id) ? (
                            <option key={item._id} value={item._id} disabled>
                              {item.name} (Rechazado)
                            </option>
                          ) : (
                            <option key={item._id} value={item._id}>
                              {item.name}
                            </option>
                          )}
                        </>
                      );
                    })}
                </select>

                {bankSelected && (
                  <>
                    <label
                      htmlFor="selectFinancingProgram"
                      className="text-gray-600 font-bold"
                    >
                      Seleccionar programa de financiamiento:
                    </label>
                    <select
                      name="selectFinancingProgram"
                      className="border border-gray-300 rounded-md p-2"
                      onChange={handleFinancingProgramChange}
                      value={financingProgramSelected}
                      required
                    >
                      <option value="" defaultChecked disabled>
                        Seleccionar programa de financiamiento
                      </option>

                      {bank.financingPrograms?.map((item, index) => {
                        return (
                          <option
                            key={index}
                            value={`${item.name} - ${item.interestRate}%`}
                          >
                            {item.name} - {item.interestRate}%{" "}
                          </option>
                        );
                      })}
                    </select>
                    {financingProgramSelected && (
                      <span className="text-gray-600">
                        Descripcion:{" "}
                        {
                          bank.financingPrograms?.find(
                            (program) =>
                              program.name ===
                              financingProgramSelected.split(" - ")[0]
                          )?.description
                        }
                      </span>
                    )}
                  </>
                )}
              </>
            )}

            {/* Por asignar proyecto */}
            {status.selected === "Asignar Proyecto" && (
              <ToAssignProject setProjectSelected={setProjectSelected} />
            )}

            {/* Por asignar modelo */}
            {status.selected === "Asignar Modelo de Casa" && (
              <>
                <ToAssignModel lead={lead} setModelPayload={setModelPayload} />
              </>
            )}

            {/* Contactarlo */}
            {(status.selected === "No dio informacion" ||
              status.selected === "No Precalifica en Buró" ||
              status.selected === "Oportunidad de venta futura" ||
              status.selected === "No contesto") && (
              <>
                <label className="text-gray-600 font-bold">
                  Contactarlo el:
                </label>
                <input
                  onChange={handleDate}
                  value={date}
                  type="date"
                  name="date"
                  className="border border-gray-300 rounded-md p-2 text-gray-600"
                  required
                />
              </>
            )}
            <Textarea
              name="comment"
              onChange={handleChangeComment}
              label="Comentario"
              value={comment}
            />
          </div>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <button
            type="button"
            onClick={handleOpen}
            className="btn btn-outlin bg-gray-400 p-2 rounded-md hover:bg-red-400 text-white"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary bg-blue-400 p-2 rounded-md text-white hover:bg-blue-500 "
          >
            Guardar
          </button>
        </DialogFooter>
      </form>
    </Modal>
  );
};
