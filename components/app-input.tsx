"use client"

import { useState } from "react"
import type { AppInfo } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Smartphone } from "lucide-react"

interface AppInputProps {
  appInfo: AppInfo
  onUpdate: (appInfo: AppInfo) => void
  onNext: () => void
}

export function AppInput({ appInfo, onUpdate, onNext }: AppInputProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: keyof AppInfo, value: string) => {
    onUpdate({ ...appInfo, [field]: value })
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateAndProceed = () => {
    const newErrors: Record<string, string> = {}

    if (!appInfo.name.trim()) {
      newErrors.name = "App name is required"
    }

    if (!appInfo.description.trim()) {
      newErrors.description = "App description is required"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onNext()
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-primary mb-4">
          <Smartphone className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-balance">Tell us about your app</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
          We'll use this information to create compelling, viral TikTok slides that showcase your app's unique value
          proposition.
        </p>
      </div>

      {/* Form */}
      <Card className="glass-card max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>App Information</CardTitle>
          <CardDescription>Provide details about your app to generate targeted content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="appName" className="text-sm font-medium">
                App Name *
              </Label>
              <Input
                id="appName"
                placeholder="e.g., TaskMaster Pro"
                value={appInfo.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAudience" className="text-sm font-medium">
                Target Audience
              </Label>
              <Input
                id="targetAudience"
                placeholder="e.g., Busy professionals"
                value={appInfo.targetAudience}
                onChange={(e) => handleInputChange("targetAudience", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              App Description *
            </Label>
            <Textarea
              id="description"
              placeholder="Describe what your app does and how it helps users..."
              value={appInfo.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="keyBenefit" className="text-sm font-medium">
              Key Benefit/Feature
            </Label>
            <Input
              id="keyBenefit"
              placeholder="e.g., Save 2 hours daily with smart automation"
              value={appInfo.keyBenefit}
              onChange={(e) => handleInputChange("keyBenefit", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">What's the main benefit users get from your app?</p>
          </div>

          <Button
            onClick={validateAndProceed}
            className="w-full gradient-primary hover:opacity-90 transition-opacity"
            size="lg"
          >
            Continue to Hook Selection
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="glass max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3 text-accent">💡 Pro Tips</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Be specific about your app's unique value proposition</li>
            <li>• Mention concrete benefits (time saved, money earned, etc.)</li>
            <li>• Think about what makes your app different from competitors</li>
            <li>• Consider your target audience's pain points</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
