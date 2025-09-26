import React, { useContext } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ThemeToggle from "../../../components/ToggleButton";
import ThemeProvider, { ThemeContext } from "../../../context/ThemeContext";

const ThemeConsumer = () => {
  const { theme } = useContext(ThemeContext);
  return <span data-testid="theme-value">{theme}</span>;
};

describe("ThemeToggle component", () => {
  test("toggles theme from light to dark", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
        <ThemeConsumer />
      </ThemeProvider>
    );

    const toggleButton = screen.getByRole("button");
    const themeValue = screen.getByTestId("theme-value");

    // Initially light
    expect(toggleButton).toHaveTextContent("Switch to Dark Mode");
    expect(themeValue).toHaveTextContent("light");

    // Toggle
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveTextContent("Switch to Light Mode");
    expect(themeValue).toHaveTextContent("dark");
  });
});