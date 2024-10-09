import ResetPasswordForm from "./_components/resetPasswordForm";

const ResetPassword = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <h2 className="scroll-m-20 border-b w-fit pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Şifreni unuttuysan sana yenilemen için bağlantı göndereceğiz. Lütfen
        mailini gir!
      </h2>
      <ResetPasswordForm />
    </div>
  );
};

export default ResetPassword;
