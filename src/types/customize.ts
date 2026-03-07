export interface FurOption {
  id: string;
  label: string;
  color: string; // hex for swatch
  textureLabel: string; // e.g. "Lông mềm mịn"
}

export interface ThemeOption {
  id: string;
  label: string;
  icon: string; // short tag used to pick SVG inside component
  description: string;
  accent: string; // hex
}

export interface SubjectOption {
  id: string;
  label: string;
  icon: string;
  ageMin: number;
  ageMax: number;
  accent: string;
}

export interface VoiceOption {
  id: string;
  label: string;
  description: string;
}

export interface AIRecommendation {
  subjectId: string;
  themeId: string;
  reason: string;
}

export interface CustomizeConfig {
  fur: string;
  theme: string;
  subjects: string[];
  voice: string;
  childAge: number;
  childName: string;
}
