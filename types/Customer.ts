interface ExistingCustomer {
  id: Number,
  "id_siigo": string,
  "type": string,
  "person_type": "Person" | "Company",
  "id_type": Number,
  "name_type": string,
  "identification": string,
  "branch_office": string,
  "check_digit": Number,
  "first_name": string,
  "last_name": string,
  "active": boolean,
  "vat_responsible": boolean,
  "code_fiscal_responsabilities": string,
  "address": string,
  "number_phone": string,
  "email": string,
  "date_created": string
}

interface NotRegisteredCustomer {
  nit: string,
  razonSocial: string,
  formaJuridica: string,
}

interface Customer {
  exist: boolean,
  data: ExistingCustomer | NotRegisteredCustomer
}