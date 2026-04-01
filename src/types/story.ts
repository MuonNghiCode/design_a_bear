export type StoryMilestoneIcon =
  | "spark"
  | "classroom"
  | "ai"
  | "community";

export interface StoryMetric {
  label: string;
  value: string;
  color: string;
}

export interface StoryMilestone {
  id: string;
  year: string;
  title: string;
  description: string;
  impact: string;
  icon: StoryMilestoneIcon;
}

export interface StoryValue {
  id: string;
  title: string;
  description: string;
  color: string;
}

export interface StoryPromise {
  id: string;
  title: string;
  detail: string;
}
