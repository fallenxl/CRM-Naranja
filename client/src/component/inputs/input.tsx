import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { HTMLInputTypeAttribute, useState } from "react";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement>{
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  type?: HTMLInputTypeAttribute;
  label?: string;
  min?: number;
  accept?: string;
  step?: number;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}
export const Input = ({
  name,
  value,
  className,
  onChange,
  placeholder,
  disabled,
  required,
  type,
  step,
  label,
  onKeyDown,
    ...rest
}: PasswordInputProps) => {
  const [seePassword, setSeePassword] = useState(false);
  const toggleSeePassword = () => setSeePassword(!seePassword);

  return (
    <>
      <div className={`relative w-full`}>
      {label && (
        <label className="text-gray-700 text-xs ">{label} {required && <span className={'text-red-500'}>*</span>}</label>
      )}
        <input
          {...(type === "password" && { minLength: 8 })}
          type={type === "password" && seePassword ? "text" : type}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full mt-2 px-3 py-[.7em] border border-gray-300 outline-none rounded-md  placeholder-gray-400 sm:text-sm ${className}`}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          min={type === "number" ? 0 : undefined}
          step={step}
          onKeyDown={onKeyDown}
            {...rest}
        />
        {type === "password" &&
          (seePassword ? (
            <EyeIcon
              onClick={toggleSeePassword}
              className="w-5 h-5 absolute right-3 top-[2.4rem] text-blue-gray-400 cursor-pointer"
            />
          ) : (
            <EyeSlashIcon
              onClick={toggleSeePassword}
              className="w-5 h-5 absolute right-3 top-[2.4rem] text-blue-gray-400 cursor-pointer"
            />
          ))}
      </div>
    </>
  );
};
