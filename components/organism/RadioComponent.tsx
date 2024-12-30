import { cn } from "@/lib/utils";
import { createContext, ReactNode, useContext } from "react";

// RadioContext türü
type RadioContextType = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};
// RadioComponent props türü
type RadioComponentType = {
  children: React.ReactNode;
  value: string;
  disabled?: boolean; // disabled prop ekliyoruz
};

type RadioGroupType = {
  value: string;
  onChange: (e: any) => void;
  children: ReactNode;
};

const RadioContext = createContext<RadioContextType | undefined>(undefined);

const RadioComponent = ({
  children,
  disabled,
  ...props
}: RadioComponentType) => {
  const context = useContext(RadioContext);
  // Context'in düzgün bir şekilde sağlandığını kontrol edin
  if (!context) {
    throw new Error("RadioComponent must be used within a RadioGroup");
  }
  const { value: contextValue, onChange } = context;

  return (
    <label
      className={cn(
        "px-6 py-4 rounded-lg cursor-pointer transition-all",
        contextValue === props.value
          ? "bg-gradient-to-t from-blue-200 to-blue-100 text-blue-800 shadow-blue-500"
          : "bg-white hover:shadow-md shadow-gray-300",
        disabled ? "opacity-50 cursor-not-allowed" : ""
      )}
    >
      <input
        type="radio"
        className="hidden"
        checked={contextValue === props.value}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />
      {children}
    </label>
  );
};

export default RadioComponent;

export function RadioGroup({ value, onChange, children }: RadioGroupType) {
  return (
    <RadioContext.Provider value={{ value, onChange }}>
      {children}
    </RadioContext.Provider>
  );
}
