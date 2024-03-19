import { useParams } from "react-router-dom";
import { Layout } from "../Layout";
import { useState } from "react";
import { Avatar, Card, Chip } from "@material-tailwind/react";
import {
  AtSymbolIcon,
  BriefcaseIcon,
  BuildingLibraryIcon,
  ChartPieIcon,
  ChatBubbleBottomCenterIcon,
  CheckIcon,
  ClockIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  HomeIcon,
  IdentificationIcon,
  MapIcon,
  MegaphoneIcon,
  PencilIcon,
  PencilSquareIcon,
  PhoneIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { Roles } from "../../constants";
import { useSelector } from "react-redux";
import { AppStore } from "../../redux/store";
import { ChangeStatusModal } from "./components/ChangeStatusModal.tsx";
import {
  errorAlertWithTimer,
  successAlertWithTimer,
} from "../../component/alerts/Alerts.tsx";
import { useLeadData } from "../../hooks/lead/useLeadData.tsx";
import { useEditLead } from "../../hooks/lead/useEditLead.tsx";
import { LeadTimeline } from "./components/LeadTimeline.tsx";
import { isError, validateID } from "../../utils/redirects.tsx";
import { Loading } from "../../component/index.ts";
import {
  assignLeadAdvisor,
  assignLeadCampaign,
  deleteBankRejected,
  deleteDocumentByLead,
} from "../../services/lead.services.ts";
import Swal from "sweetalert2";
import { currencyFormatToLempiras } from "../../utils/currencyFormat.ts";
import { Input } from "../../component/inputs/input.tsx";
import { channels } from "../../constants/general.ts";
import { ChangeBankModal } from "../../features/ChangeBankModal.tsx";
import { isArrayOfStrings } from "../../utils/utilities.ts";
export const LeadById = () => {
  const { id } = useParams<{ id: string }>();
  validateID(id ?? "");
  const { user } = useSelector((state: AppStore) => state.auth);

  const {
    advisorList,
    campaignList,
    lead,
    setLead,
    error,
    isLoading,
    setSocketTrigger,
  } = useLeadData(id);

  isError(error, "/prospectos/lista");
  const {
    edit,
    handleEdit,
    handleSubmit,
    handleUpdateLeadChange,
    updateLead,
    handleCancelEdit,
  } = useEditLead(id, lead);

  const [editAdvisors, setEditAdvisors] = useState(false);
  const [advisorSelected, setAdvisorSelected] = useState(" ");

  const handleAdvisorChange = (e: any) => setAdvisorSelected(e.target.value);
  const handleSubmitAdvisor = () => {
    assignLeadAdvisor(id, advisorSelected).then((res) => {
      if (typeof res === "string") {
        errorAlertWithTimer("Error", res);
      }
      successAlertWithTimer("Asesor asignado", "", 3000);
      setEditAdvisors(false);
    });
  };

  const [editCampaigns, setEditCampaigns] = useState(false);
  const [campaignSelected, setCampaignSelected] = useState("");
  const handleCampaignChange = (e: any) => setCampaignSelected(e.target.value);
  const handleSubmitCampaign = () => {
    assignLeadCampaign(id, campaignSelected).then((res) => {
      if (typeof res === "string") {
        errorAlertWithTimer("Error", res, 3000);
      }

      successAlertWithTimer("Campaña asignada", "", 3000);
      setEditCampaigns(false);
    });
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);

  const verifyPermissions = (role: Roles) => {
    if (!lead.status.role) return false;

    if (role === "ADMIN") return true;

    if (lead.status.role.includes(role)) return true;

    if (lead.status.role.includes("ADVISOR") && user.id === lead.advisorID?._id)
      return true;

    return false;
  };

  const [openChangeBankModal, setOpenChangeBankModal] = useState(false);
  const handleOpenChangeBankModal = () =>
    setOpenChangeBankModal(!openChangeBankModal);

  const handleDeleteBankRejected = (bankId: string) => {
    Swal.fire({
      title: "¿Estas seguro?",
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteBankRejected(id, bankId).then((res) => {
          if (typeof res === "string") {
            errorAlertWithTimer("Error", res, 3000);
          }
          setLead((prev) => ({
            ...prev,
            rejectedBanks: prev.rejectedBanks.filter(
              (bank: any) => bank._id !== bankId
            ),
          }));
          successAlertWithTimer("Banco eliminado", "", 3000);
        });
      }
    });
  };
  return (
    <Layout title={"Prospecto " + lead.name}>
      {isLoading && <Loading className="z-10" />}
      <div className="relative">
        {open && (
          <ChangeStatusModal
            open={open}
            handleOpen={handleOpen}
            updateLead={updateLead}
            setSocketTrigger={setSocketTrigger}
            lead={lead}
          />
        )}
        {openChangeBankModal && (
          <ChangeBankModal lead={lead} onClose={handleOpenChangeBankModal} />
        )}
        <div className="flex flex-col lg:flex-row gap-4">
          <Card className="h-full w-full lg:w-7/12 mx-auto p-3 md:p-10 ">
            <div className="mb-8 lg:grid grid-cols-12 ">
              {/* Lead info */}
              <div className="w-full col-start-1 col-end-13 flex flex-col items-center p-4">
                <div className="flex flex-col items-center gap-y-2 mb-5">
                  <Avatar
                    src={`https://api.dicebear.com/5.x/initials/svg?seed=${lead.name}`}
                    size="xxl"
                  />
                  <div className="flex flex-col items-center">
                    <span className="text-2xl">{lead.name}</span>
                    <div className="flex gap-x-2 items-center mb-2">
                      <IdentificationIcon className="w-5 h-5" />
                      <span>{lead.dni}</span>
                    </div>
                    <div className="bg-blue-300 px-3 py-1 rounded-md flex items-center">
                      <Chip
                        value={lead.status.type}
                        className="bg-transparent font-medium text-white"
                      />
                      {user.role && verifyPermissions(user.role) && (
                        <button onClick={handleOpen} className="">
                          <PencilIcon className="w-4 h-4 text-white" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-full flex justify-between py-2">
                  <span className="font-bold text-gray-600">Información</span>
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
                  className="w-full flex flex-col gap-y-2 p-0 md:p-4"
                >
                  <div className="flex items-center gap-x-2  w-full">
                    <IdentificationIcon className="w-5 h-5" />
                    <Input
                      name="name"
                      onChange={handleUpdateLeadChange}
                      label="Nombre completo"
                      value={updateLead.name}
                      disabled={edit}
                    />
                  </div>

                  <div className="flex items-center gap-x-2  w-full">
                    <IdentificationIcon className="w-5 h-5" />
                    <Input
                      name="dni"
                      onChange={handleUpdateLeadChange}
                      label="Tarjeta de identidad"
                      value={updateLead.dni}
                      disabled={edit}
                    />
                  </div>

                  <div className="flex items-center gap-x-2  w-full">
                    <PhoneIcon className="w-5 h-5" />
                    <Input
                      name="phone"
                      onChange={handleUpdateLeadChange}
                      label="Numero de teléfono"
                      value={updateLead.phone}
                      disabled={edit}
                    />
                  </div>

                  <div className="flex items-center gap-x-2  w-full">
                    <AtSymbolIcon className="w-5 h-5" />
                    <Input
                      name="email"
                      onChange={handleUpdateLeadChange}
                      label="Correo electrónico"
                      value={updateLead.email}
                      disabled={edit}
                    />
                  </div>

                  <div className="flex items-center gap-x-2  w-full">
                    <MapIcon className="w-5 h-5" />
                    <Input
                      name="address"
                      onChange={handleUpdateLeadChange}
                      label="Dirección"
                      value={updateLead.address}
                      disabled={edit}
                    />
                  </div>

                  <div className="flex items-center gap-x-2  w-full">
                    <MapIcon className="w-5 h-5" />
                    <Input
                      name="department"
                      onChange={handleUpdateLeadChange}
                      label="Departamento"
                      value={updateLead.department}
                      disabled={edit}
                    />
                  </div>

                  <div className="flex items-center gap-x-2  w-full">
                    <MapIcon className="w-5 h-5" />
                    <Input
                      name="country"
                      onChange={handleUpdateLeadChange}
                      label="País"
                      value={updateLead.country}
                      disabled={edit}
                    />
                  </div>

                  <div className="flex items-center gap-x-2  w-full">
                    <BriefcaseIcon className="w-5 h-5" />
                    <Input
                      name="interestedIn"
                      onChange={handleUpdateLeadChange}
                      label="Interesado en"
                      value={updateLead.interestedIn}
                      disabled={edit}
                    />
                  </div>

                  <label className="text-gray-700 text-xs ml-7">Canal</label>
                  <div className="flex items-center gap-x-2  w-full">
                    <MegaphoneIcon className="w-5 h-5" />
                    <select
                      name="source"
                      value={updateLead.source}
                      onChange={handleUpdateLeadChange}
                      className={`w-full border border-gray-300 bg-gray-50 rounded-md py-[.7em] px-3 text-sm ${
                        edit && "bg-blue-gray-50"
                      } text-black`}
                      disabled={edit}
                    >
                      <option value="">Canal</option>
                      {channels.map((channel, index) => {
                        return (
                          <option key={index} value={channel}>
                            {channel}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="flex items-center gap-x-2  w-full">
                    <ChatBubbleBottomCenterIcon className="w-5 h-5" />
                    <Input
                      name="comment"
                      onChange={handleUpdateLeadChange}
                      label="Comentarios"
                      value={updateLead.comment}
                      disabled={edit}
                    />
                  </div>
                  {/* Detalles laborales */}
                  <div className="flex flex-col gap-y-2 mt-4">
                    <span className="font-bold text-sm">
                      Detalles laborales
                    </span>
                    <hr className="w-full mb-4" />

                    <div className="flex items-center gap-x-2  w-full">
                      <BriefcaseIcon className="w-5 h-5" />
                      <Input
                        name="workAddress"
                        onChange={handleUpdateLeadChange}
                        label="Lugar de trabajo"
                        value={updateLead.workAddress}
                        disabled={edit}
                      />
                    </div>

                    <div className="flex items-center gap-x-2  w-full">
                      <UserCircleIcon className="w-5 h-5" />
                      <Input
                        name="workPosition"
                        onChange={handleUpdateLeadChange}
                        label="Posición"
                        value={updateLead.workPosition}
                        disabled={edit}
                      />
                    </div>

                    <div className="flex items-center gap-x-2  w-full">
                      <CurrencyDollarIcon className="w-5 h-5" />
                      <Input
                        name="salary"
                        onChange={handleUpdateLeadChange}
                        label="Salario"
                        value={
                          !edit
                            ? updateLead.salary
                            : updateLead.salary !== ""
                            ? currencyFormatToLempiras(updateLead.salary)
                            : ""
                        }
                        type={!edit ? "number" : "text"}
                        min={0}
                        accept="number"
                        disabled={edit}
                        step={0.01}
                      />
                    </div>

                    <div className="flex items-center gap-x-2  w-full">
                      <ClockIcon className="w-5 h-5" />
                      <Input
                        name="workTime"
                        onChange={handleUpdateLeadChange}
                        label="Antigüedad"
                        value={updateLead.workTime}
                        disabled={edit}
                      />
                    </div>
                    <label className="text-gray-700 text-xs ml-7">
                      Método de pago
                    </label>
                    <div className="flex items-center gap-x-2  w-full">
                      <CreditCardIcon className="w-5 h-5" />
                      <select
                        name="paymentMethod"
                        value={updateLead.paymentMethod}
                        onChange={handleUpdateLeadChange}
                        className={`w-full border border-gray-300 bg-gray-50 rounded-md py-[.7em] px-3 text-sm ${
                          edit && "bg-blue-gray-50"
                        } text-black`}
                        disabled={edit}
                      >
                        <option value="">Seleccionar forma de pago</option>
                        <option value="Efectivo">Pago en Efectivo</option>
                        <option value={"Transferencia Bancaria"}>
                          Transferencia Bancaria
                        </option>
                      </select>
                    </div>
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
                            onClick={handleCancelEdit}
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
          {/* Details  */}
          <div className="w-full lg:w-5/12">
            {/* Other data */}
            <Card className=" w-full mx-auto p-8 mb-4">
              <div className="flex items-center py-2 border-b mb-2 gap-2 ">
                <h4 className="font-bold  text-gray-700 ">Detalles</h4>
              </div>
              <div className="flex items-center gap-2 py-2">
                <UserCircleIcon className="w-5 h-5" />
                <div className={"w-full flex items-center gap-2"}>
                  <span className="text-sm text-gray-600 w-[5rem]">
                    Asesor:
                  </span>
                  <select
                    className={`w-full border border-gray-300 rounded-md p-2 text-sm`}
                    onChange={handleAdvisorChange}
                    disabled={!editAdvisors}
                  >
                    {!lead.advisorID && (
                      <option value={""} selected={true} disabled={true}>
                        Ninguno
                      </option>
                    )}
                    {advisorList.length > 0 &&
                      advisorList.map((item: any) => (
                        <option
                          value={item._id}
                          selected={item._id === lead.advisorID?._id}
                        >
                          {item.name}
                        </option>
                      ))}
                  </select>
                </div>
                {user.role === "ADMIN" && (
                  <div className={"flex items-center gap-2"}>
                    {!editAdvisors && (
                      <button onClick={() => setEditAdvisors(!editAdvisors)}>
                        <PencilSquareIcon className="w-4 h-4" />
                      </button>
                    )}
                    {editAdvisors && (
                      <button onClick={handleSubmitAdvisor}>
                        <CheckIcon className="w-4 h-4 hover:text-green-500" />
                      </button>
                    )}
                    {editAdvisors && (
                      <button onClick={() => setEditAdvisors(!editAdvisors)}>
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div className="w-full flex items-center gap-2 py-2 mb-6">
                <MegaphoneIcon className="w-5 h-5" />
                <div className={"w-full flex items-center gap-2"}>
                  <span className="text-sm text-gray-600 w-[5rem]">
                    Campaña:
                  </span>
                  <select
                    onChange={handleCampaignChange}
                    className={`w-full border border-gray-300 rounded-md p-2 text-sm`}
                    disabled={!editCampaigns}
                  >
                    {!lead.campaignID && (
                      <option value={""} selected={true} disabled={true}>
                        Ninguno
                      </option>
                    )}
                    {campaignList.length > 0 &&
                      campaignList.map((item: any) => {
                        return (
                          <>
                            {item._id === lead.campaignID?._id ? (
                              <option value={item._id} selected={true}>
                                {item.name}
                              </option>
                            ) : (
                              <option value={item._id}>{item.name}</option>
                            )}
                          </>
                        );
                      })}
                  </select>
                </div>
                {user.role === "ADMIN" && (
                  <div className={"flex items-center gap-2"}>
                    {!editCampaigns && (
                      <button onClick={() => setEditCampaigns(!editCampaigns)}>
                        <PencilSquareIcon className="w-4 h-4" />
                      </button>
                    )}
                    {editCampaigns && (
                      <button onClick={handleSubmitCampaign}>
                        <CheckIcon className="w-4 h-4 hover:text-green-500" />
                      </button>
                    )}
                    {editCampaigns && (
                      <button onClick={() => setEditCampaigns(!editCampaigns)}>
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
              {(lead.bankID || lead.rejectedBanks.length > 0) && (
                <>
                  <div className="flex justify-between py-2 border-b gap-2 ">
                    <h4 className="font-bold  text-gray-700 ">
                      Detalles Bancarios
                    </h4>
                    {/* Cambiar banco */}
                    {(user.role === "ADMIN" ||
                      user.role === "BANK_MANAGER") && (
                      <div className="flex items-center gap-2  ">
                        <button
                          onClick={handleOpenChangeBankModal}
                          className="text-gray-700  text-sm cursor-pointer "
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  {lead.bankID && (
                    <>
                      <div className="flex items-center gap-2 py-2 w-full">
                        <BuildingLibraryIcon className="w-4 h-4" />
                        <span className="text-sm text-gray-600  ">Banco:</span>
                        <span className="text-sm">{`${lead.bankID.name} ${
                          lead.status.type === "Precalificar Banco"
                            ? "(Pendiente de aprobar)"
                            : ""
                        }`}</span>
                      </div>
                      <div className="flex items-center gap-2 py-2 w-full">
                        <ChartPieIcon className="w-4 h-4" />
                        <span className="text-sm text-gray-600  ">
                          Programa de financiamiento:
                        </span>
                        <span className="text-sm">{lead.financingProgram}</span>
                      </div>
                    </>
                  )}
                  {/* Bancos rechazados */}
                  {lead.rejectedBanks.length > 0 && (
                    <div className="flex items-center gap-2 py-2 w-full">
                      <BuildingLibraryIcon className="w-4 h-4" />
                      <span className="text-sm text-gray-600  ">
                        Bancos rechazados:
                      </span>
                      <div className="flex items-center flex-wrap gap-2">
                        {lead.rejectedBanks.map((item: any) => {
                          return (
                            <Chip
                              value={item.name}
                              color="red"
                              className="flex items-center "
                              icon={
                                (user.role === "ADMIN" ||
                                  user.role === "BANK_MANAGER") && (
                                  <XMarkIcon
                                    className="cursor-pointer"
                                    onClick={() =>
                                      handleDeleteBankRejected(item._id)
                                    }
                                  />
                                )
                              }
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
              {lead.projectDetails?.lotID && (
                <>
                  <div className="flex items-center py-2 border-b gap-2">
                    <h4 className="font-bold  text-gray-700 ">
                      Detalles del Proyecto
                    </h4>
                  </div>
                  {lead.projectDetails.projectID && (
                    <>
                      {" "}
                      <div className="flex items-center gap-2 py-2 w-full">
                        <HomeIcon className="w-4 h-4" />
                        <span className="text-sm text-gray-600  ">
                          Proyecto:
                        </span>
                        <span className="text-sm">
                          {lead.projectDetails.projectID.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 py-2 w-full">
                        <ChartPieIcon className="w-4 h-4" />
                        <span className="text-sm text-gray-600  ">Lote:</span>
                        <span className="text-sm">
                          {lead.projectDetails.lotID.block
                            ? `${lead.projectDetails.lotID.block} - `
                            : ""}
                          {lead.projectDetails.lotID.lot}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 py-2 w-full">
                        <HomeIcon className="w-4 h-4" />
                        <span className="text-sm text-gray-600  ">Area:</span>
                        <span className="text-sm">
                          {lead.projectDetails.lotID.area} varas cuadradas
                        </span>
                      </div>
                      <div className="flex items-center gap-2 py-2 w-full">
                        <HomeIcon className="w-4 h-4" />
                        <span className="text-sm text-gray-600  ">Precio:</span>
                        <span className="text-sm">
                          {currencyFormatToLempiras(
                            lead.projectDetails.lotID.price?.toString()
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 py-2 w-full">
                        <HomeIcon className="w-4 h-4" />
                        <span className="text-sm text-gray-600  ">Estado:</span>
                        <span className="text-sm">
                          {lead.projectDetails.lotID.status}
                        </span>
                      </div>
                      {lead.projectDetails.lotID.status === "Reservado" && (
                        <div className="flex items-center gap-2 py-2 w-full">
                          <HomeIcon className="w-4 h-4" />
                          <span className="text-sm text-gray-600  ">
                            Fecha de reserva:
                          </span>
                          <span className="text-sm">
                            {new Date(
                              lead.projectDetails.lotID.reservationDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
              {lead.projectDetails?.houseModel && (
                <>
                  <div className="flex items-center py-2 border-b gap-2">
                    <h4 className="font-bold  text-gray-700 ">
                      Detalles Modelo de Casa
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 py-2 w-full">
                    <HomeIcon className="w-4 h-4" />
                    <span className="text-sm text-gray-600  ">Modelo:</span>
                    <span className="text-sm">
                      {lead.projectDetails.houseModel.model}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 py-2 w-full">
                    <HomeIcon className="w-4 h-4" />
                    <span className="text-sm text-gray-600  ">Area:</span>
                    <span className="text-sm">
                      {lead.projectDetails.houseModel.area} v²
                    </span>
                  </div>
                  <div className="flex items-center gap-2 py-2 w-full">
                    <HomeIcon className="w-4 h-4" />
                    <span className="text-sm text-gray-600  ">Precio:</span>
                    <span className="text-sm">
                      {lead.projectDetails.houseModel.price?.toString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 py-2 w-full">
                    <HomeIcon className="w-4 h-4" />
                    <span className="text-sm text-gray-600  ">
                      Precio con descuento:
                    </span>
                    <span className="text-sm">
                      {lead.projectDetails.houseModel.priceWithDiscount}
                    </span>
                  </div>
                </>
              )}
              {(isArrayOfStrings(lead.documents) && lead.documents?.length > 0) && (
                <>
                  <div className="flex items-center py-2 border-b gap-2">
                    <h4 className="font-bold  text-gray-700 ">Documentos</h4>
                  </div>
                  <div className="flex flex-wrap gap-2 py-2">
                    {lead.documents.map((doc: string, index: number) => (
                      <Chip
                        key={index}
                        value={doc}
                        color="blue"
                        className="text-white"
                        icon={
                          <XMarkIcon
                            onClick={() =>
                              deleteDocumentByLead(id, doc).then(res => {
                                if (typeof res === "string") {
                                  errorAlertWithTimer("Error", res, 3000);
                                }
                             
                                successAlertWithTimer("Documento eliminado", "", 3000);
                              
                              })
                            }
                            className="h-5 w-5 text-white hover:text-gray-200 cursor-pointer"
                          />
                        }

                      />
                    ))}
                  </div>
                </>
              )}
            </Card>
            {/* timeline */}
            <LeadTimeline lead={lead} />
          </div>
        </div>
      </div>
    </Layout>
  );
};
