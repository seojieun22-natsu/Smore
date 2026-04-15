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
  received_date: string;
  created_at: string;
};
