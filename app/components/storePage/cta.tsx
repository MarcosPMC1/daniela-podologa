"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/app/lib/utils";
import type { VariantProps } from "class-variance-authority"
import { AnimatePresence, motion } from "framer-motion"
import { forwardRef, useEffect, useState } from "react"

// ─── Utility ──────────────────────────────────────────────────────────────────

export function buildWhatsAppUrl(contact: string, message?: string): string {
  const digits = contact.replace(/\D/g, "")
  const number = digits.startsWith("55") ? digits : `55${digits}`
  const base = `https://wa.me/${number}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

function fireGaEvent(label: string, eventName: string = "whatsapp_click") {
  if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
    ; (window as any).gtag("event", eventName, {
      event_category: "CTA",
      event_label: label,
    })
  }
}

// ─── WhatsApp SVG Icon ────────────────────────────────────────────────────────

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.412.001 12.049a11.82 11.82 0 001.592 5.918L0 24l6.138-1.61a11.8 11.8 0 005.908 1.569h.005c6.635 0 12.05-5.412 12.053-12.05a11.829 11.829 0 00-3.536-8.418z" />
    </svg>
  )
}

// ─── Generic Cta Wrapper ───────────────────────────────────────────────────

interface BaseWhatsAppProps {
  contact: string
  message?: string
  /** O nome do evento no GA4 (ex: "whatsapp_click", "cta_wpp_service") */
  eventName?: string
  /** O label para o GA4 ficará fixo por variante ou pode ser sobrescrito */
  eventLabel?: string
  "aria-label"?: string
}

// ─── WhatsAppCta (Raw wrapper / old usage) ─────────────────────────────────
// Kept for backward compatibility if replacing simple anchors.
export function WhatsAppCta({
  contact,
  message,
  eventName = "generic",
  eventLabel = "generic",
  className,
  style,
  children,
  "aria-label": ariaLabel,
}: BaseWhatsAppProps & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const href = buildWhatsAppUrl(contact, message)

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={className}
      style={style}
      onClick={() => fireGaEvent(eventLabel, eventName)}
    >
      {children}
    </a>
  )
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

interface WhatsAppButtonProps extends BaseWhatsAppProps, Omit<ButtonProps, 'onClick' | 'variant'> {
  /** "floating" animado no canto, "button" padrão do shadcn, "custom" sem estilos de Button  */
  variant?: "floating" | "button" | "custom" | ButtonProps['variant']
  /** Se deve mostrar o ícone do WA automaticamente (padrão: true para 'button' e 'floating') */
  showIcon?: boolean
}

export const WhatsAppButton = forwardRef<HTMLAnchorElement, WhatsAppButtonProps>(
  (
    {
      contact,
      message,
      eventName: customEventName,
      eventLabel,
      variant = "floating",
      showIcon = true,
      className,
      children,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const [_hasScrolled, _setHasScrolled] = useState(false)
    const href = buildWhatsAppUrl(contact, message)

    // Label fixo baseado na variante se não for providenciado
    const finalEventLabel = eventLabel || (variant === "floating" ? "floating_button" : "cta_button")
    const eventName = customEventName || (variant === "floating" ? "cta_wpp_floating" : "whatsapp_click")

    const handleClick = () => fireGaEvent(finalEventLabel, eventName)

    // Variante Flutuante (Floating animated button)
    if (variant === "floating") {
      if (!contact) return null

      // Move hook inside component. Hooks are executed on every render unconditionally
      // but the early return should be before the hook. However, the rule of hooks says
      // we can't have early returns before hooks. Let's fix that.
      return <FloatingImplementation
        contact={contact}
        message={message}
        finalEventLabel={finalEventLabel}
        ariaLabel={ariaLabel}
        eventName={eventName}
      />
    }

    // Variante Custom (Renderiza children direto dentro do a href, útil para estilos totalmente controlados externos)
    if (variant === "custom") {
      return (
        <a
          ref={ref}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ariaLabel}
          className={className}
          onClick={handleClick}
          {...(props as any)}
        >
          {children}
        </a>
      )
    }

    // Variante Button (Usa o Shadcn Button)
    return (
      <Button
        variant={variant as ButtonProps['variant']}
        className={cn("gap-2", className)}
        {...props}
      >
        <a
          ref={ref}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ariaLabel}
          onClick={handleClick}
        >
          {showIcon && <WhatsAppIcon className="w-5 h-5 fill-current" />}
          {children || "Agendar pelo WhatsApp"}
        </a>
      </Button>
    )
  }
)
WhatsAppButton.displayName = "WhatsAppButton"

// Separated floating implementation to avoid conditional hook
function FloatingImplementation({
  contact,
  message,
  finalEventLabel,
  ariaLabel,
  eventName,
}: {
  contact: string,
  message?: string,
  finalEventLabel: string,
  ariaLabel?: string,
  eventName: string
}) {
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) setHasScrolled(true)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const href = buildWhatsAppUrl(contact, message)

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="fixed bottom-6 right-6 z-[100] flex flex-col items-end"
    >
      <AnimatePresence>
        {hasScrolled && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            className="bg-white text-black px-4 py-2 rounded-2xl shadow-xl text-sm font-semibold border mb-3 relative dark:bg-zinc-900 dark:text-white dark:border-zinc-800"
          >
            Entre em contato
            <div
              className="absolute top-[calc(100%-6px)] right-5 w-3 h-3 bg-white border-r border-b rotate-45 dark:bg-zinc-900 dark:border-zinc-800"
              aria-hidden="true"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel || "Contatar via WhatsApp"}
        className="relative group"
        onClick={() => fireGaEvent(finalEventLabel, eventName)}
      >
        <motion.div
          animate={
            hasScrolled
              ? { rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.1, 1] }
              : {}
          }
          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
          className="p-4 bg-[#25D366] text-white rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95 shadow-green-500/20"
        >
          <WhatsAppIcon className="w-8 h-8" />
        </motion.div>
      </a>
    </motion.div>
  )
}
