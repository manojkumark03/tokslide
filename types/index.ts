export interface AppInfo {
  name: string
  description: string
  keyBenefit?: string
  targetAudience?: string
}

export interface HookType {
  id: string
  name: string
  pattern: string
  example: string
  description: string
}

export interface GeneratedHook {
  id: string
  text: string
}

export interface SlideCustomization {
  textColor: string
  fontSize: number
  textPosition: "top" | "center" | "bottom"
  overlayOpacity: number
}

export interface SlideContent {
  type: "hook" | "problem" | "solution" | "cta"
  text: string
}

export interface AppState {
  currentStep: number
  appInfo: AppInfo
  selectedHookType: string
  generatedHooks: GeneratedHook[]
  selectedHook: string
  generatedImages: string[]
  selectedImage: string
  customization: SlideCustomization
  slideContent: SlideContent[]
  isLoading: boolean
}
