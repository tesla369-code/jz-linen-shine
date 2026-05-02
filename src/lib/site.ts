export const SITE = {
  name: "JZ Linen & Laundry",
  short: "JZ Linen",
  tagline: "Premium Commercial Laundry & Linen Supply",
  domain: "https://jzlinen.co.uk",
  phone: "+44 20 4538 9921",
  phoneDisplay: "020 4538 9921",
  whatsapp: "447700900123",
  whatsappMessage: "Hello JZ Linen, I'd like to enquire about your services.",
  email: "hello@jzlinen.co.uk",
  address: {
    street: "Unit 14, Riverside Industrial Estate",
    city: "London",
    postcode: "E16 2QT",
    country: "United Kingdom",
  },
  hours: "Mon–Sat 6:00 – 20:00",
  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
  },
};

export const waLink = (msg = SITE.whatsappMessage) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`;
