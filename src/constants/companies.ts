export interface CompanyOption {
  label: string;
  value: string; // companyId
}

export const MOCK_COMPANIES: CompanyOption[] = [
  { label: 'ABC Logistics', value: 'abc-logistics' },
  { label: 'Global Transport', value: 'global-transport' },
  { label: 'Express Fleet Services', value: 'express-fleet' },
  { label: 'City Cab Services', value: 'city-cab' },
  { label: 'Metro Freight Systems', value: 'metro-freight' },
];
