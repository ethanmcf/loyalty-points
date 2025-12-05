import emailjs from "emailjs-com";
export async function sendRegisterEmail(userEmail, userToken, utorid) {
  const body = `
    <p>You have successfully registered for Reedema. To proceed, your generated utorid and password reset token are below:</p>
    <p><strong>Utorid:</strong> ${utorid}</p>
    <p><strong>Reset token:</strong> ${userToken}</p>
    <p>Note that the reset token will expire in 1 hour, utorid will not.</p>
  `;
  const templateParams = {
    subject: "Registration",
    title: "Account Registration",
    body: body,
    email: userEmail,
  };
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  emailjs.send(serviceId, templateId, templateParams, publicKey);
}

export async function sendResetEmail(userEmail, userToken) {
  const body = `
    <p>We received a request to reset the reset token for your account Your new reset token is below:</p>
    <p><strong> ${userToken}</strong></p>
    <p>This will expire in one hour.</p>
    <p>If you didn't request this reset token, please ignore this email or let us know immediately. Your account remains secure.</p>
  `;
  const templateParams = {
    subject: "Passowrd Reset",
    title: "You have requested a reset token",
    body: body,
    email: userEmail,
  };
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  console.log(templateId);
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  emailjs.send(serviceId, templateId, templateParams, publicKey);
}

// Used for membership perks implementation
export async function sendAddToEventEmail(
  managerEmail,
  userToken,
  tier,
  utorid
) {
  const body = `
    <p>The following user has requested access to a special membership event ... </p>
    <p><strong> ${userToken}</strong></p>
    <p><strong> ${tier}</strong></p>
    <p><strong> ${utorid}</strong></p>
    <p>Closing remoarks</p>
  `;
  const templateParams = {
    subject: "Event Request",
    title: "User Request for Membership Event",
    body: body,
    email: managerEmail,
  };
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  emailjs.send(serviceId, templateId, templateParams, publicKey);

  emailjs.send(serviceId, templateId, templateParams, publicKey);
}
