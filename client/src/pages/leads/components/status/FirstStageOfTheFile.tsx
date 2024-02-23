import { Checkbox } from "@material-tailwind/react";

interface Props {
    handleDocumentsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }
export function FirstStageOfTheFile({ handleDocumentsChange }: Props) {
   
    return(
        <>
      <div className="flex flex-wrap gap-3">
        <Checkbox
          crossOrigin={undefined}
          name="purchaseAndSaleContract"
          onChange={handleDocumentsChange}
          label="Contrato de compra-venta"
          color="light-blue"
          required
        />
        <Checkbox
          crossOrigin={undefined}
          name="blueprints"
          onChange={handleDocumentsChange}
          label="Juego de planos"
          color="light-blue"
          required
        />
        <Checkbox
          crossOrigin={undefined}
          name="primaReceipt"
          onChange={handleDocumentsChange}
          label="Recibo de prima"
          color="light-blue"
          required
        />
        <Checkbox
          crossOrigin={undefined}
          name="legalDocumentsOfTheCompany"
          onChange={handleDocumentsChange}
          label="Documentos legales de la empresa"
          color="light-blue"
          required
        />
      </div>
    </>
    )
}