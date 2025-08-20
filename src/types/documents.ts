export type ValidateDocument = {
  beValid: boolean;
  rejectionReason: string;
};

export type AddDocument = {
  approvalProcessId: number;
  fileName: string;
  content: File;
};

export type ValidateDocumentResponse = ValidateDocument & {
  documentId: number;
};

export type AddDocumentResponse = {
  id: number;
  fileName: string;
  content: string;
  isApproved: boolean;
  isMandatory: boolean;
};
