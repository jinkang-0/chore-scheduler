import { cva } from "class-variance-authority";

type InputVariant = "contentEditable" | "checkbox" | "textbox";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant: InputVariant;
}

const inputStyles = cva("", {
  variants: {
    variant: {
      contentEditable: "bg-transparent outline-none",
      textbox:
        "px-3 py-2 bg-w5 rounded-lg focus-visible:ring-1 focus-visible:ring-w8 outline-none",
      checkbox: "w-3 h-3 rounded"
    }
  }
});

export default function Input({ className, variant, ...props }: InputProps) {
  return <input className={inputStyles({ className, variant })} {...props} />;
}
