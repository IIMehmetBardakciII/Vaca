import SignUpForm from "./_components/signupForm";

const SignUp = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <h2 className="scroll-m-20 border-b w-fit pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Hemen Ücretsiz Kayıt Ol!
      </h2>
      <SignUpForm />
    </div>
  );
};

export default SignUp;
