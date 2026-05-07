export interface CreateProductIssueRequest {
  orderItemId: string;
  description: string;
  requestRefund: boolean;
  evidenceUrls: string[];
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountImageUrl?: string;
}

export interface ResolveProductIssueRequest {
  resolution: string;
  staffNotes?: string;
  repairNotes?: string;
}

export interface CompleteProductIssueRequest {
  finalNotes?: string;
}

export interface RejectProductIssueRequest {
  reason: string;
}
