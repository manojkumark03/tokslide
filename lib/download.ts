import JSZip from "jszip"

export const downloadSlides = async (slideBlobs: Blob[]): Promise<void> => {
  const zip = new JSZip()

  slideBlobs.forEach((blob, index) => {
    const slideNames = ["hook-slide", "problem-slide", "solution-slide", "cta-slide"]
    zip.file(`${slideNames[index]}.png`, blob)
  })

  const zipBlob = await zip.generateAsync({ type: "blob" })

  const url = URL.createObjectURL(zipBlob)
  const link = document.createElement("a")
  link.href = url
  link.download = "viral-tiktok-slides.zip"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
