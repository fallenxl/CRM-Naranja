import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface PasswordInputProps {
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    className?: string;
}
export const PasswordInput = ({
  name,
  value,
  className,
  onChange,
  placeholder,
  disabled,
  required,
}: PasswordInputProps) => {
    const [seePassword, setSeePassword] = useState(false);
    const toggleSeePassword = () => setSeePassword(!seePassword)
    
  return (
    <div className="relative w-full">
      <input 
        minLength={8}
        type={seePassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-[.7em] border border-gray-300 outline-none rounded-md shadow-sm placeholder-gray-400 sm:text-sm ${className}`}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        />
      {seePassword ? (
        <EyeIcon
          onClick={toggleSeePassword}
          className="w-5 h-5 absolute right-3 top-3 text-blue-gray-400 cursor-pointer"
        />
      ) : (
        <EyeSlashIcon
          onClick={toggleSeePassword}
          className="w-5 h-5 absolute right-3 top-3 text-blue-gray-400 cursor-pointer"
        />
      )}
    </div>
  );
};
