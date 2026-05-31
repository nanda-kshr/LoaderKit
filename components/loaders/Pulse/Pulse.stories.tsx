import type { Meta, StoryObj } from "@storybook/react";
import Pulse from "./Pulse";

const meta: Meta<typeof Pulse> = {
  title: "Components/Loaders/Pulse",
  component: Pulse,
  argTypes: {
    size: { control: { type: "text" } },
    color: { control: { type: "color" } },
    speed: {
      control: "select",
      options: ["slow", "normal", "fast"],
    },
    variant: {
      control: "select",
      options: ["circle", "ripple", "double"],
    },
  },
  args: {
    size: 40,
    color: "#3b82f6",
    speed: "normal",
    variant: "circle",
  },
};

export default meta;
type Story = StoryObj<typeof Pulse>;

export const Circle: Story = {
  args: {
    variant: "circle",
  },
};

export const Ripple: Story = {
  args: {
    variant: "ripple",
    color: "#10b981",
  },
};

export const Double: Story = {
  args: {
    variant: "double",
    color: "#f59e0b",
  },
};

export const LargeRippleFast: Story = {
  args: {
    size: 80,
    color: "#8b5cf6",
    speed: "fast",
    variant: "ripple",
  },
};
