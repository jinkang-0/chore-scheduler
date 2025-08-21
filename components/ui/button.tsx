"use client";

import { ButtonVariant } from "@/types/types";
import { cva } from "class-variance-authority";
import Link from "next/link";
import { useCallback, useState } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: ButtonVariant;
}

interface AsyncButtonProps extends Omit<ButtonProps, "onClick"> {
  onClick: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void | Promise<void>;
}

interface ButtonLinkProps extends React.ComponentProps<typeof Link> {
  variant: ButtonVariant;
}

interface ButtonAnchorProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant: ButtonVariant;
}

const buttonStyles = cva(
  "rounded-lg flex gap-2 items-center justify-center cursor-pointer outline-none focus-visible:ring-1 text-left",
  {
    variants: {
      variant: {
        glass: "p-4 bg-white/5 hover:bg-white/8 transition-colors",
        primary: "px-4 py-2 bg-primary hover:brightness-105 transition-all",
        ghost:
          "p-2 after:bg-white/5 after:content-[''] after:absolute relative after:top-1/2 after:left-1/2 after:p-4 after:w-full after:h-full after:opacity-0 hover:after:opacity-100 after:transition-opacity after:-translate-1/2 after:rounded-[inherit]",
        secondary: "px-4 py-2 bg-secondary hover:brightness-105 transition-all"
      },
      isLoading: {
        true: "cursor-default! opacity-50",
        false: ""
      }
    }
  }
);

export function ButtonAsync({
  className,
  variant,
  onClick,
  disabled,
  ...props
}: AsyncButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (disabled || isLoading) return;

      setIsLoading(true);
      await onClick?.(e);
      setIsLoading(false);
    },
    [onClick]
  );

  return (
    <button
      className={buttonStyles({ className, variant, isLoading })}
      onClick={handleClick}
      disabled={disabled || isLoading}
      {...props}
    />
  );
}

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
