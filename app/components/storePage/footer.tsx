import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t mt-8 py-8 text-center text-sm text-muted-foreground">
      <p>
        © {new Date().getFullYear()}{" "}
        <strong><Link href={'https://www.integrano.com.br'} target="_blank">Integrano</Link></strong>. Todos os
        direitos reservados.
      </p>
    </footer>
  )
}