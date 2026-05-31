import type { Meta, StoryObj } from "@storybook/react";
import Spinner from "./Spinner";

const meta: Meta<typeof Spinner> = {
  title: "Components/Loaders/Spinner",
  component: Spinner,
  argTypes: {
    size: { control: { type: "text" } },
    color: { control: { type: "color" } },
    speed: {
      control: "select",
      options: ["slow", "normal", "fast"],
    },
    variant: {
      control: "select",
      options: ["classic", "ring", "dual", "dashed"],
    },
  },
  args: {
    size: 40,
    color: "#3b82f6",
    speed: "normal",
    variant: "classic",
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Classic: Story = {
  args: {
    variant: "classic",
  },
};

export const Ring: Story = {
  args: {
    variant: "ring",
    color: "#10b981",
  },
};

export const Dual: Story = {
  args: {
    variant: "dual",
    color: "#f59e0b",
  },
};

export const Dashed: Story = {
  args: {
    variant: "dashed",
    color: "#ef4444",
  },
};

export const CustomStyle: Story = {
  args: {
    size: 64,
    color: "#8b5cf6",
    speed: "fast",
  },
};
