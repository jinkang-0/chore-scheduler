"use client";

import Select from "react-select";

export default function CustomSelect<T>({
  styles,
  ...props
}: React.ComponentProps<typeof Select<T>>) {
  return (
    <Select
      styles={{
        control: (base) => ({
          ...base,
          backgroundColor: "var(--color-w5)",
          border: "none",
          borderColor: "transparent",
          boxShadow: "none"
        }),
        singleValue: (base) => ({
          ...base,
          color: "var(--color-foreground)"
        }),
        menu: (base) => ({
          ...base,
          backgroundColor: "var(--color-w5)",
          transform: "translateY(-4px)"
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: "transparent",
          color: "var(--color-w11)",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.05)"
          }
        }),
        indicatorSeparator: () => ({
          display: "none"
        }),
        dropdownIndicator: (base) => ({
          ...base,
          color: "var(--color-w11)",
          "&:hover": {
            color: "var(--color-w11)"
          }
        }),
        ...styles
      }}
      {...props}
    />
  );
}
