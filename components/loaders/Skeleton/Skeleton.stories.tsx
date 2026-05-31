import type { Meta, StoryObj } from "@storybook/react";
import Skeleton from "./Skeleton";

const meta: Meta<typeof Skeleton> = {
  title: "Components/Loaders/Skeleton",
  component: Skeleton,
  argTypes: {
    width: { control: { type: "text" } },
    height: { control: { type: "text" } },
    variant: {
      control: "select",
      options: ["text", "rect", "circle", "card"],
    },
    animate: {
      control: "select",
      options: ["shimmer", "pulse", "none"],
    },
  },
  args: {
    variant: "text",
    animate: "shimmer",
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Text: Story = {
  args: {
    variant: "text",
    width: "80%",
  },
};

export const Circle: Story = {
  args: {
    variant: "circle",
    width: 50,
    height: 50,
  },
};

export const Rect: Story = {
  args: {
    variant: "rect",
    width: "100%",
    height: 120,
  },
};

export const Card: Story = {
  args: {
    variant: "card",
    width: 320,
  },
};
