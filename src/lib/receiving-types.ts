export type Product = {
  barcode: string;
  name: string;
  sku?: string | null;
};

export type ReceiptItem = {
  id: string;
  barcode: string;
  product_name: string;
  quantity: number;
  store: string;
  manager_name?: string | null;
  received_date: string;
  created_at: string;
};

export type ProductUploadLog = {
  id: string;
  file_name: string;
  uploaded_count: number;
  created_at: string;
};
