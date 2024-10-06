import SignInForm from "./_components/signinForm";

const SignIn = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <h2 className="scroll-m-20 border-b w-fit pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Hemen Giriş Yap!
      </h2>
      <SignInForm />
    </div>
  );
};

export default SignIn;
