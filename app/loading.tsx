import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="mx-auto mb-4 w-12 h-12">
          <Loader2 className="size-12 text-primary animate-spin" />
        </div>
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    </div>
  )
}
