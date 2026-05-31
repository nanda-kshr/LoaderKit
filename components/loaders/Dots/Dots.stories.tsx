import type { Meta, StoryObj } from "@storybook/react";
import Dots from "./Dots";

const meta: Meta<typeof Dots> = {
  title: "Components/Loaders/Dots",
  component: Dots,
  argTypes: {
    size: { control: { type: "text" } },
    color: { control: { type: "color" } },
    speed: {
      control: "select",
      options: ["slow", "normal", "fast"],
    },
    variant: {
      control: "select",
      options: ["bouncing", "flashing", "chase"],
    },
    count: {
      control: { type: "number", min: 3, max: 5 },
    },
  },
  args: {
    size: 10,
    color: "#3b82f6",
    speed: "normal",
    variant: "bouncing",
    count: 3,
  },
};

export default meta;
type Story = StoryObj<typeof Dots>;

export const Bouncing: Story = {
  args: {
    variant: "bouncing",
  },
};

export const Flashing: Story = {
  args: {
    variant: "flashing",
    color: "#10b981",
  },
};

export const Chase: Story = {
  args: {
    variant: "chase",
    color: "#f59e0b",
    count: 4,
  },
};

export const LargeDotsFast: Story = {
  args: {
    size: 18,
    color: "#8b5cf6",
    speed: "fast",
    count: 5,
  },
};
