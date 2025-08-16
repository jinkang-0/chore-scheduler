import { cva } from "class-variance-authority";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "glass" | "primary" | "ghost";
}

interface ButtonLinkProps extends React.ComponentProps<typeof Link> {
  variant: "glass" | "primary" | "ghost";
}

interface ButtonAnchorProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant: "glass" | "primary" | "ghost";
}

const buttonStyles = cva(
  "rounded-lg flex items-center justify-center cursor-pointer outline-none focus-visible:ring-1",
  {
    variants: {
      variant: {
        glass: "p-4 bg-white/5 hover:bg-white/8 transition-colors",
        primary: "p-4 bg-blue-400 hover:bg-blue-500 transition-colors",
        ghost:
          "p-2 after:bg-white/5 after:content-[''] after:absolute relative after:top-1/2 after:left-1/2 after:p-4 after:w-full after:h-full after:invisible hover:after:visible after:-translate-1/2 after:rounded-lg"
      }
    }
  }
);

export function Button({ className, variant, ...props }: ButtonProps) {
  return <button className={buttonStyles({ className, variant })} {...props} />;
}

export function ButtonLink({
  className,
  variant,
  href,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={buttonStyles({ className, variant })}
      {...props}
    />
  );
}

export function ButtonAnchor({
  className,
  variant,
  href,
  ...props
}: ButtonAnchorProps) {
  return (
    <a
      href={href}
      className={buttonStyles({ className, variant })}
      {...props}
    />
  );
}
