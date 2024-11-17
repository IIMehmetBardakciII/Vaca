"use server";
import { StreamClient } from "@stream-io/node-sdk";
import { getCookies } from "./Cookies";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;

export const tokenProviderForStream = async () => {
  const { verifiedToken, success } = await getCookies();
  if (!success) throw new Error("User is not logged in");
  if (!apiKey) throw new Error("Api Stream Key is missing");
  if (!apiSecret) throw new Error("Api Stream Secret Key is missing");

  const streamClient = new StreamClient(apiKey, apiSecret);

  const exp = Math.round(new Date().getTime() / 1000) + 60 * 60; //1 saatlik //get time ve date.now mili saniye dönüyor 1000 e bölme saniye 60 ile çarpmak dakika bir 60 ile çarpmak saati veriyor.
  const issued = Math.floor(Date.now() / 1000) - 60; //Şu anki zamandan 1 dakika öncesinin zaman damgasını temsil eder. Bu, token'ın oluşturulma zamanını temsil edebilir.

  const token = streamClient.generateUserToken({
    user_id: verifiedToken?.id as string,
    exp,
    issued,
  });
  return token;
};
