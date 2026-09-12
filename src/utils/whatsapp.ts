export function buildWhatsAppOfferLink(options: {
  pharmacyPhone: string;
  productName: string;
  price: number;
  quantity?: number;
}) {
  const { pharmacyPhone, productName, price, quantity = 1 } = options;
  const cleanPhone = pharmacyPhone.replace(/\D/g, '');

  const text = encodeURIComponent(
    `مساء الخير، محتاج أطلب العرض ده:\n` +
    `📦 المنتج: ${productName}\n` +
    `🔢 الكمية: ${quantity}\n` +
    `💰 الإجمالي: ${price * quantity} ج.م\n\n` +
    `يرجى تأكيد التوصيل!`
  );

  return `https://wa.me/${cleanPhone}?text=${text}`;
}
