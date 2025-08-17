"use client";

import Select, { StylesConfig } from "react-select";
import AsyncSelect from "react-select/async";

function getSelectStyles<T, M extends boolean>(): StylesConfig<T, M> {
  return {
    control: (base) => ({
      ...base,
      backgroundColor: "var(--color-w5)",
      border: "none",
      borderColor: "transparent",
      boxShadow: "none",
      cursor: "pointer"
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
    input: (base) => ({
      ...base,
      color: "var(--color-foreground)"
    }),
    clearIndicator: (base) => ({
      ...base,
      color: "var(--color-w11)",
      "&:hover": {
        color: "var(--color-w11)"
      }
    }),
    option: (base) => ({
      ...base,
      backgroundColor: "transparent",
      color: "var(--color-w11)",
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.05)"
      },
      cursor: "pointer"
    }),
    indicatorSeparator: (base) => ({
      ...base
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "var(--color-w11)",
      "&:hover": {
        color: "var(--color-w11)"
      }
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "var(--color-w2)",
      color: "var(--color-foreground)"
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "var(--color-foreground)",
      fontSize: "1rem"
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "var(--color-w10)",
      "&:hover": {
        backgroundColor: "transparent",
        color: "var(--color-w11)",
        transition: "color 0.2s ease"
      },
      cursor: "pointer"
    })
  };
}

export function CustomSelect<T, M extends boolean>({
  styles,
  ...props
}: React.ComponentProps<typeof Select<T, M>>) {
  return (
    <Select styles={{ ...getSelectStyles<T, M>(), ...styles }} {...props} />
  );
}

export function CustomSelectAsync<T, M extends boolean>({
  styles,
  ...props
}: React.ComponentProps<typeof AsyncSelect<T, M>>) {
  return (
    <AsyncSelect
      styles={{ ...getSelectStyles<T, M>(), ...styles }}
      {...props}
    />
  );
}
