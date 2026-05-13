export const SITE = {
  name: "JZ Linen & Laundry",
  short: "JZ Linen",
  tagline: "Premium Commercial Laundry & Linen Supply",
  domain: "https://jzlinen.co.uk",
  phone: "+447462314383",
  phoneDisplay: "07462 314383",
  whatsapp: "447700900123",
  whatsappMessage: "Hello JZ Linen, I'd like to enquire about your services.",
  email: "JZLINENLAUNDRY@Gmail.com",
  address: {
    street: "Stanley House, Bramble Road",
    city: "Swindon",
    postcode: "SN2 8ER",
    country: "England, United Kingdom",
  },
  hours: "Monday to Friday 8AM to 6PM, Saturday 8AM to 2PM, Sunday Off",
  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
  },
};

export const waLink = (msg = SITE.whatsappMessage) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`;
