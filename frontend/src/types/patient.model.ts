export interface IPatient {
    id?: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    dob: string;
    status: "Inquiry" | "Onboarding" | "Active" | "Churned";
    city: string;
    state: string;
    zipCode: string;
    address?: string;
}

// Alias for backward compatibility
export type Patient = IPatient;