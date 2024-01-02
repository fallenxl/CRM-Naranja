export interface Bank {
    _id : string;
    name : string;
    description : string;
    financingPrograms : FinancialProgram[]; 
    createdAt : string;
}
export interface FinancialProgram {
    name: string;
    description: string;
    interestRate: number;
  }