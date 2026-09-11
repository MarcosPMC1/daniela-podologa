"use client"

import { Separator } from "@/components/ui/separator"
import { useMemo } from "react"
import { WhatsAppButton } from "./cta"

interface OpeningHour {
  id: string
  dayOfWeek: number
  dayOfWeekName: string
  openTime: string
  closeTime: string
}

interface OpeningHoursProps {
  hours: OpeningHour[]
  primaryColor: string
  secondaryColor: string
  mutedTextColor?: string
  timeZone?: string
  /** Número de contato do WhatsApp (com ou sem DDI) */
  ctaContact?: string
  /** @deprecated Use ctaContact instead */
  ctaLink?: string
}

export default function OpeningHours({
  hours,
  primaryColor,
  secondaryColor,
  mutedTextColor = "text-muted-foreground",
  timeZone = "America/Sao_Paulo",
  ctaContact,
  ctaLink,
}: OpeningHoursProps) {
  // Support legacy ctaLink (wa.me URL) or new ctaContact (raw phone number)
  const contact: string | undefined = ctaContact ?? (ctaLink
    ? ctaLink.startsWith("https://wa.me/") ? ctaLink.slice("https://wa.me/".length) : ctaLink
    : undefined)

  const {
    orderedHours,
    currentDay,
    statusText,
    isOpen,
    nextLabel
  } = useMemo(() => {

    if (!hours?.length) {
      return {
        orderedHours: [],
        currentDay: 0,
        statusText: "",
        isOpen: false,
        nextLabel: ""
      }
    }

    const now = new Date(
      new Date().toLocaleString("en-US", { timeZone })
    )

    const currentDay = now.getDay()
    const currentMinutes = now.getHours() * 60 + now.getMinutes()

    const toMinutes = (time: string) => {
      const [h, m] = time.split(":").map(Number)
      return h * 60 + m
    }

    const orderedHours = [...hours].sort(
      (a, b) => a.dayOfWeek - b.dayOfWeek
    )

    const todayHours = orderedHours.filter(
      (h) => h.dayOfWeek === currentDay
    )

    let isOpen = false
    let statusText = ""
    let nextLabel = ""

    for (const period of todayHours) {
      const open = toMinutes(period.openTime)
      const close = toMinutes(period.closeTime)

      if (currentMinutes >= open && currentMinutes <= close) {
        isOpen = true
        statusText = `Aberto agora – Fecha às ${period.closeTime.slice(0, 5)}`
        break
      }
    }

    if (!isOpen) {
      let nextOpen: OpeningHour | null = null

      for (let i = 1; i <= 7; i++) {
        const nextDay = (currentDay + i) % 7
        const nextDayHours = orderedHours.filter(
          (h) => h.dayOfWeek === nextDay
        )

        if (nextDayHours.length > 0) {
          nextOpen = nextDayHours[0]
          break
        }
      }

      if (nextOpen) {
        const isTomorrow =
          nextOpen.dayOfWeek === (currentDay + 1) % 7

        nextLabel = isTomorrow
          ? "amanhã"
          : nextOpen.dayOfWeekName.toLowerCase()

        statusText =
          `Fechado no momento – Vagas limitadas. Agende para ${nextLabel} a partir das ${nextOpen.openTime.slice(0, 5)}`
      }
    }

    return { orderedHours, currentDay, statusText, isOpen, nextLabel }

  }, [hours, timeZone])

  if (!hours?.length) return null

  return (
    <>
      <Separator
        style={{ backgroundColor: secondaryColor, opacity: 0.15 }}
      />

      <section
        className="w-full px-4 sm:px-8 lg:px-16 py-12 md:py-20"
        aria-labelledby="hours-heading"
      >
        <h2
          id="hours-heading"
          className="text-3xl font-bold mb-3"
          style={{ color: primaryColor }}
        >
          Horário de Funcionamento
        </h2>

        {statusText && (
          <>
            <div
              className={`text-base font-semibold flex items-center gap-2 ${isOpen ? "text-green-600" : "text-red-600"
                }`}
            >
              <span className="text-lg" aria-hidden="true">●</span>
              {statusText}
            </div>

            {/* CTA DINÂMICO */}
            {contact && (
              <div className="mt-4 mb-8">
                <WhatsAppButton
                  variant="custom"
                  contact={contact}
                  eventLabel="opening_hours"
                  aria-label={
                    isOpen
                      ? "Clique para abrir WhatsApp e agendar agora"
                      : `Poucas vagas para ${nextLabel} – Garanta pelo WhatsApp`
                  }
                  className={`flex px-6 py-3 rounded-xl text-white font-semibold transition items-center w-fit justify-center gap-2 ${
                    isOpen
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-orange-500 hover:bg-orange-700"
                  }`}
                >
                  {isOpen ? "Agendar agora pelo WhatsApp" : `Poucas vagas para ${nextLabel} – Garanta pelo WhatsApp`}
                  <svg
                    viewBox="0 0 24 24"
                    className="w-8 h-8 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.412.001 12.049a11.82 11.82 0 001.592 5.918L0 24l6.138-1.61a11.8 11.8 0 005.908 1.569h.005c6.635 0 12.05-5.412 12.053-12.05a11.829 11.829 0 00-3.536-8.418z" />
                  </svg>
                </WhatsAppButton>

                {!isOpen && (
                  <p className="text-xs mt-2 text-muted-foreground">
                    Antecipe seu agendamento pelo WhatsApp.
                  </p>
                )}
              </div>
            )}
          </>
        )}

        <p className={`mb-8 text-sm ${mutedTextColor}`}>
          Atendimento com horário agendado. Consulte disponibilidade para encaixes ou urgências.
        </p>

        <div className="rounded-2xl bg-background border border-muted/30">
          <table className="w-full text-left border-collapse">
            <tbody>
              {orderedHours.map((hour) => {
                const isToday = hour.dayOfWeek === currentDay

                return (
                  <tr
                    key={hour.id}
                    className={isToday ? "bg-gray-100" : ""}
                  >
                    <th scope="row" className="px-4 py-4 text-sm font-medium">
                      {hour.dayOfWeekName}
                      {isToday && (
                        <span className="ml-2 text-xs font-semibold text-primary">
                          (Hoje)
                        </span>
                      )}
                    </th>

                    <td className="px-4 py-4 text-base font-semibold text-foreground">
                      {hour.openTime.slice(0, 5)} – {hour.closeTime.slice(0, 5)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}