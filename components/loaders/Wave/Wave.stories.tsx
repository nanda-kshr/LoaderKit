import type { Meta, StoryObj } from "@storybook/react";
import Wave from "./Wave";

const meta: Meta<typeof Wave> = {
  title: "Components/Loaders/Wave",
  component: Wave,
  argTypes: {
    size: { control: { type: "text" } },
    color: { control: { type: "color" } },
    speed: {
      control: "select",
      options: ["slow", "normal", "fast"],
    },
    variant: {
      control: "select",
      options: ["bars", "fluid", "pulse-wave"],
    },
    count: {
      control: { type: "number", min: 4, max: 8 },
    },
  },
  args: {
    size: 40,
    color: "#3b82f6",
    speed: "normal",
    variant: "bars",
    count: 5,
  },
};

export default meta;
type Story = StoryObj<typeof Wave>;

export const Bars: Story = {
  args: {
    variant: "bars",
  },
};

export const Fluid: Story = {
  args: {
    variant: "fluid",
    color: "#10b981",
    count: 6,
  },
};

export const PulseWave: Story = {
  args: {
    variant: "pulse-wave",
    color: "#f59e0b",
  },
};

export const TallVisualizerFast: Story = {
  args: {
    size: 64,
    color: "#8b5cf6",
    speed: "fast",
    count: 8,
  },
};
