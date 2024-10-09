import { jwtVerify } from "jose";
export const getJwtSecretKey = () => {
  const secretKey = process.env.NEXT_PUBLIC_JWT_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Jwt Secret Key is not found");
  }
  return new TextEncoder().encode(secretKey);
};

export const verifyJwtToken = async (token: string) => {
  try {
    //* JWT token üçe ayrılır headers-> hashleme işlemleri , payload=datamızın olduğu yer obje şeklinde ve , secretKey=datamızı güvenliğini artırmak için.
    const { payload } = await jwtVerify(token, getJwtSecretKey());
    return payload;
  } catch {
    return null;
  }
};
