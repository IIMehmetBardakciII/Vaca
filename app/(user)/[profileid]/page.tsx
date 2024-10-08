import { getUserData } from "@/lib/actions/UserData";

const ProfilePage = async ({ params }: { params: { profileid: string } }) => {
  // URL'den gelen profileid'yi decode ediyoruz
  const decodedProfileId = decodeURIComponent(params.profileid);
  const userData = await getUserData(decodedProfileId);
  return (
    <div>
      <h1>{userData.username}</h1>
      <h1>{userData.email}</h1>
      <h1>{userData.virtualAcademies.length} asd</h1>
    </div>
  );
};

export default ProfilePage;
