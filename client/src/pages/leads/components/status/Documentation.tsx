import { Checkbox } from "@material-tailwind/react";

interface Props {
  handleDocumentsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export function DocumentationState({ handleDocumentsChange }: Props) {
  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Checkbox
          crossOrigin={undefined}
          name="dni"
          onChange={handleDocumentsChange}
          label="DNI"
          color="light-blue"
        />
        <Checkbox
          crossOrigin={undefined}
          name="ficha"
          onChange={handleDocumentsChange}
          label="Ficha de Pre-Contrato Llena"
          color="light-blue"
        />
        <Checkbox
          crossOrigin={undefined}
          name="req1"
          onChange={handleDocumentsChange}
          label="Requisito 1"
          color="light-blue"
        />
        <Checkbox
          crossOrigin={undefined}
          name="req2"
          onChange={handleDocumentsChange}
          label="Requisito 2"
          color="light-blue"
        />
      </div>
    </>
  );
}
