import { CredentialsReveal } from "@/components/speakup/credentials-reveal"

export const metadata = {
  title: "Reporte recibido · MAIA SpeakUp",
}

export default async function ConfirmPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  return <CredentialsReveal trackingCode={code} />
}
