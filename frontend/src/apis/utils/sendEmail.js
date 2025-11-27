import emailjs from "emailjs-com";
export async function sendRegisterEmail(userEmail, userToken, utorid) {
  const templateParams = {
    email: userEmail,
    token: userToken,
    utorid: utorid,
  };
  const templateId = import.meta.env.VITE_EMAILJS_REGISTER_TEMPLATE_ID;
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  emailjs.send(serviceId, templateId, templateParams, publicKey);
}

export async function sendResetEmail(userEmail, userToken) {
  const templateParams = {
    email: userEmail,
    token: userToken,
  };
  const templateId = import.meta.env.VITE_EMAILJS_RESET_TEMPLATE_ID;
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  emailjs.send(serviceId, templateId, templateParams, publicKey);
}
