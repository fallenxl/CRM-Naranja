import { useEffect, useState } from "react";
import { updateLeadService } from "../../services/lead.services";
import { useSelector } from "react-redux";

export const useEditLead = (id: string | undefined, lead:any) => {
    const [updateLead, setUpdateLead] = useState({
        name:'',
        dni: '',
        phone: '',
        address: '',
        email: '',
        department: '',
        country: '',
        interestedIn: '',
        comment: '',
        source: '',
        salary: '',
        workAddress: '',
        workTime: '',
        paymentMethod : '',
        workPosition: '',
    });
    const [edit, setEdit] = useState(true);
    const socket = useSelector((state:any) => state.socket.socket);
    useEffect(() => {
            setUpdateLead({
                name: lead.name,
                dni: lead.dni,
                phone: lead.phone,
                address: lead.address,
                department: lead.department,
                country: lead.country,
                email: lead.email,
                interestedIn: lead.interestedIn,
                comment: lead.comment,
                source: lead.source,
                salary: lead.salary,
                workAddress: lead.workAddress,
                workTime: lead.workTime,
                paymentMethod : lead.paymentMethod,
                workPosition: lead.workPosition,

            })
    }, [lead, id]);

    const handleUpdateLeadChange = (e:any) => {
        setUpdateLead({
            ...updateLead,
            [e.target.name]: e.target.value,
        });
    }

    const handleEdit = () => {
        setEdit(!edit);
    }

    const handleCancelEdit = () => {
        setUpdateLead(lead)
        setEdit(true);

    }
    const handleSubmit = (e: any) => {
        e.preventDefault();
        updateLeadService(id, updateLead).then((res) => {
            if(res){
                setEdit(true);
                socket.emit("leadUpdated");
            }
        });
    };

    return {
        updateLead,
        edit,
        handleUpdateLeadChange,
        handleEdit,
        handleCancelEdit,
        handleSubmit
    }
};