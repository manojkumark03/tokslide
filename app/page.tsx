"use client"

import { useState } from "react"
import type { AppState } from "@/types"
import { ProgressBar } from "@/components/shared/progress-bar"
import { AppInput } from "@/components/app-input"
import { HookSelector } from "@/components/hook-selector"
import { CopyGenerator } from "@/components/copy-generator"
import { ImageGenerator } from "@/components/image-generator"
import { SlideCustomizer } from "@/components/slide-customizer"

export default function Home() {
  const [appState, setAppState] = useState<AppState>({
    currentStep: 1,
    appInfo: { name: "", description: "", keyBenefit: "", targetAudience: "" },
    selectedHookType: "",
    generatedHooks: [],
    selectedHook: "",
    generatedImages: [],
    selectedImage: "",
    customization: {
      textColor: "#ffffff",
      fontSize: 48,
      textPosition: "center",
      overlayOpacity: 0.4,
    },
    slideContent: [],
    isLoading: false,
  })

  const updateAppState = (updates: Partial<AppState>) => {
    setAppState((prev) => ({ ...prev, ...updates }))
  }

  const nextStep = () => {
    if (appState.currentStep < 5) {
      updateAppState({ currentStep: appState.currentStep + 1 })
    }
  }

  const prevStep = () => {
    if (appState.currentStep > 1) {
      updateAppState({ currentStep: appState.currentStep - 1 })
    }
  }

  const renderCurrentStep = () => {
    switch (appState.currentStep) {
      case 1:
        return (
          <AppInput appInfo={appState.appInfo} onUpdate={(appInfo) => updateAppState({ appInfo })} onNext={nextStep} />
        )
      case 2:
        return (
          <HookSelector
            selectedHookType={appState.selectedHookType}
            onSelect={(hookType) => updateAppState({ selectedHookType: hookType })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )
      case 3:
        return (
          <CopyGenerator
            appInfo={appState.appInfo}
            hookType={appState.selectedHookType}
            generatedHooks={appState.generatedHooks}
            selectedHook={appState.selectedHook}
            isLoading={appState.isLoading}
            onHooksGenerated={(hooks) => updateAppState({ generatedHooks: hooks })}
            onHookSelect={(hook) => updateAppState({ selectedHook: hook })}
            onLoadingChange={(loading) => updateAppState({ isLoading: loading })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )
      case 4:
        return (
          <ImageGenerator
            generatedImages={appState.generatedImages}
            selectedImage={appState.selectedImage}
            isLoading={appState.isLoading}
            onImagesGenerated={(images) => updateAppState({ generatedImages: images })}
            onImageSelect={(image) => updateAppState({ selectedImage: image })}
            onLoadingChange={(loading) => updateAppState({ isLoading: loading })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )
      case 5:
        return (
          <SlideCustomizer
            appInfo={appState.appInfo}
            selectedHook={appState.selectedHook}
            selectedImage={appState.selectedImage}
            customization={appState.customization}
            slideContent={appState.slideContent}
            onCustomizationChange={(customization) => updateAppState({ customization })}
            onSlideContentGenerated={(content) => updateAppState({ slideContent: content })}
            onPrev={prevStep}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold gradient-text mb-2">SlideTok</h1>
            <p className="text-muted-foreground text-lg">
              Create viral TikTok slides for app promotion in 5 easy steps
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <ProgressBar currentStep={appState.currentStep} totalSteps={5} />

        <div className="max-w-4xl mx-auto">{renderCurrentStep()}</div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-muted-foreground text-sm">Made with SlideTok - Better than the original</p>
        </div>
      </footer>
    </div>
  )
}
