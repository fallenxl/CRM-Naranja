import { useEffect, useState } from "react";
import { getLeadById } from "../../services/lead.services";
import { getAllAdvisor } from "../../services/user.services";
import { getAllCampaigns } from "../../services/campaign";
import { useSelector } from "react-redux";
import { AppStore } from "../../redux/store";

export const useLeadData = (id: string | undefined) => {
  const [lead, setLead] = useState({
    name: "",
    dni: "",
    phone: "",
    status: {
      type: "",
      enum: [],
      selected: "",
      role: "",
    },
    advisorID: {
      _id: "",
      name: "",
    },
    campaignID: {
      _id: "",
      name: "",
    },
    createdAt: "",
    bankID: {
      _id: "",
      name: "",
    },
    projectDetails: {
      _id: "",
      lotID: {
        lot: "",
        block: "",
        area: 0,
        price: 0,
        status: "",
        reservationDate: "",
      },
      projectID: {
        _id: "",
        name: "",
        address: "",
      },
    },
    financingProgram: "",
    rejectedBanks: [],
    timeline: [],
  });
  const[error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [advisorList, setAdvisorsList] = useState([]);
  const [campaignList, setCampaignList] = useState([]);
  const [socketTrigger, setSocketTrigger] = useState(false);
  const statusChange = useSelector((state:AppStore) => state.status.statusChange)
  const socket = useSelector((state:any) => state.socket.socket);

  useEffect(() => {
    if (id) {
    setIsLoading(true);
      getLeadById(id).then((res) => {
        setIsLoading(false);
        if(typeof res === "string") return setError(true);
        setLead(res?.data);
        if(!lead){
          window.location.href = "/404";
        }
      }).catch(() => {
        window.location.href = "/prospectos/lista";
      });
      socket.on("leadUpdated", (_data: any) => {
        getLeadById(id).then((res) => {
          setLead(res?.data);
        });
      });

      getAllAdvisor().then((res) => {
        setAdvisorsList(res);
      });

      getAllCampaigns().then((res) => {
        setCampaignList(res);
      });

    }
  }, [statusChange, id, socketTrigger]);

  return { lead, advisorList, campaignList, error, isLoading, setLead, setSocketTrigger };
};
