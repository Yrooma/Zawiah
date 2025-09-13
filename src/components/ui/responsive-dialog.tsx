"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { useIsMobile } from "@/hooks/use-mobile"

interface ResponsiveDialogProps {
  children: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ResponsiveDialog = ({ children, open, onOpenChange }: ResponsiveDialogProps) => {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        {children}
      </Sheet>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog>
  )
}

const ResponsiveDialogContent = ({ children, ...props }: React.ComponentProps<typeof DialogContent | typeof SheetContent>) => {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <SheetContent side="bottom" {...props}>
        {children}
      </SheetContent>
    )
  }

  return (
    <DialogContent {...props}>
      {children}
    </DialogContent>
  )
}

const ResponsiveDialogHeader = ({ children, ...props }: React.ComponentProps<typeof DialogHeader | typeof SheetHeader>) => {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <SheetHeader {...props}>
        {children}
      </SheetHeader>
    )
  }

  return (
    <DialogHeader {...props}>
      {children}
    </DialogHeader>
  )
}

const ResponsiveDialogTitle = ({ children, ...props }: React.ComponentProps<typeof DialogTitle | typeof SheetTitle>) => {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <SheetTitle {...props}>
        {children}
      </SheetTitle>
    )
  }

  return (
    <DialogTitle {...props}>
      {children}
    </DialogTitle>
  )
}

const ResponsiveDialogDescription = ({ children, ...props }: React.ComponentProps<typeof DialogDescription | typeof SheetDescription>) => {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <SheetDescription {...props}>
        {children}
      </SheetDescription>
    )
  }

  return (
    <DialogDescription {...props}>
      {children}
    </DialogDescription>
  )
}


export {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogDescription,
}
