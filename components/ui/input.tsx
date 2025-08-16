import { cva } from "class-variance-authority";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "contentEditable";
}

const inputStyles = cva("", {
  variants: {
    variant: {
      contentEditable: "bg-transparent outline-none"
    }
  }
});

export default function Input({ className, variant, ...props }: InputProps) {
  return <input className={inputStyles({ className, variant })} {...props} />;
}
