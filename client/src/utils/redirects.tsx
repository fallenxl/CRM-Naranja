import { useNavigate } from "react-router-dom";

export const validateID = (id: string) => {
  const navigate = useNavigate();
  if (id.length !== 24) {
    navigate("/404");
  }
};

export const isError = (response: boolean) => {
    const navigate = useNavigate();
    if(response){
        navigate("/404");
    }
};