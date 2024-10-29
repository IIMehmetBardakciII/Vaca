import CreateAcademyForm from "../_components/createAcademy";

const CreateAcademy = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <h2 className="scroll-m-20 border-b w-fit pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Sanal Akademini Oluştur.
      </h2>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        Sanal Akademini oluştur ve öğrencilerinle hemen iletişime geç.
      </p>
      <CreateAcademyForm />
    </div>
  );
};

export default CreateAcademy;
