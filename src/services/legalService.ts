import { axiosInstance } from './axiosClient';

export interface LegalDocumentSection {
  heading?: string;
  title?: string;
  content?: string;
  body?: string;
  items?: string[];
}

export interface LegalDocumentResponse {
  title?: string;
  lastUpdated?: string;
  updatedAt?: string;
  effectiveDate?: string;
  version?: string;
  content?: string;
  sections?: LegalDocumentSection[];
  [key: string]: any;
}

const unwrapData = (res: any) => {
  return res?.data?.data !== undefined ? res.data.data : res?.data;
};

/**
 * Fetch Privacy Policy from backend
 * Endpoint: /legal/privacy-policy (/api/v1/legal/privacy-policy)
 */
export const getPrivacyPolicy = async (): Promise<LegalDocumentResponse | string | null> => {
  try {
    const res = await axiosInstance.get('/legal/privacy-policy');
    console.log('resp getPrivacyPolicy:', res?.data);
    return unwrapData(res);
  } catch (err: any) {
    if (err?.response?.status === 404) {
      try {
        const fallback = await axiosInstance.get('/api/v1/legal/privacy-policy');
        console.log('resp getPrivacyPolicy fallback:', fallback?.data);
        return unwrapData(fallback);
      } catch (fallbackErr) {
        console.warn('getPrivacyPolicy fallback error:', fallbackErr);
        return null;
      }
    }
    console.warn('getPrivacyPolicy error:', err);
    return null;
  }
};

/**
 * Fetch Terms and Conditions from backend
 * Endpoint: /legal/terms-and-conditions (/api/v1/legal/terms-and-conditions)
 */
export const getTermsAndConditions = async (): Promise<LegalDocumentResponse | string | null> => {
  try {
    const res = await axiosInstance.get('/legal/terms-and-conditions');
    console.log('resp getTermsAndConditions:', res?.data);
    return unwrapData(res);
  } catch (err: any) {
    if (err?.response?.status === 404) {
      try {
        const fallback = await axiosInstance.get('/api/v1/legal/terms-and-conditions');
        console.log('resp getTermsAndConditions fallback:', fallback?.data);
        return unwrapData(fallback);
      } catch (fallbackErr) {
        console.warn('getTermsAndConditions fallback error:', fallbackErr);
        return null;
      }
    }
    console.warn('getTermsAndConditions error:', err);
    return null;
  }
};
