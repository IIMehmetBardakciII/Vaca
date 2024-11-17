import { useEffect, useState } from "react";
import { getCookies } from "../actions/Cookies";

type userDataType = {
  email: string;
  username: string;
  profilePicture: string;
  uid: string;
};
//* Bu hook'un amacı client Componentlerde user cookiese kullanmamız ve veriye erişmem gerektiğinde her defasında kod tekrarını önlmek adına yapılmıştır.
const useUser = () => {
  const [userData, setUserData] = useState<userDataType | null>(null);
  const [status, setStatus] = useState<boolean>(false);
  useEffect(() => {
    const getUserSessionToken = async () => {
      const { verifiedToken, success } = await getCookies();
      if (success && verifiedToken) {
        setUserData({
          email: verifiedToken.email,
          username: verifiedToken.username,
          profilePicture: verifiedToken.profilePicture,
          uid: verifiedToken.uid,
        } as userDataType);
        setStatus(true);
      } else {
        setStatus(false);
      }
    };
    getUserSessionToken();
  }, []);
  return { status, userData };
};

export default useUser;
