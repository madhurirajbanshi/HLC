import * as Crypto from 'expo-crypto';
import { v4 as uuidv4 } from 'uuid';

export const generateEsewaPaymentForm = async (price: number) => {
  const uuid = uuidv4();
  const secretKey = '8gBm/:&EnhH.1/q';

  const data = `total_amount=${price},transaction_uuid=${uuid},product_code=EPAYTEST`;

  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    data + secretKey
  );

  const base64Hash = btoa(hash); // ✅ instead of Buffer

  const formData = {
    amount: price.toString(),
    tax_amount: '0',
    total_amount: price.toString(),
    transaction_uuid: uuid,
    product_code: 'EPAYTEST',
    product_service_charge: '0',
    product_delivery_charge: '0',
    success_url: 'https://developer.esewa.com.np/success',
    failure_url: 'https://developer.esewa.com.np/failure',
    signed_field_names: 'total_amount,transaction_uuid,product_code',
    signature: base64Hash,
  };

  const htmlForm = `
    <html>
      <body onload="document.forms[0].submit()">
        <form method="POST" action="https://rc-epay.esewa.com.np/api/epay/main/v2/form">
          ${Object.entries(formData)
            .map(([key, value]) => `<input type="hidden" name="${key}" value="${value}" />`)
            .join('')}
        </form>
      </body>
    </html>
  `;

  return { htmlForm, uuid };
};
