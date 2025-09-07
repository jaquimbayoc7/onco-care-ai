import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const clinicalButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-subtle hover:shadow-card",
        destructive: "bg-danger text-danger-foreground shadow-subtle hover:shadow-card",
        outline: "border border-input bg-background shadow-subtle hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-subtle hover:shadow-card",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-success text-success-foreground shadow-subtle hover:shadow-card",
        warning: "bg-warning text-warning-foreground shadow-subtle hover:shadow-card",
        // Special clinical variants
        hero: "gradient-hero text-primary-foreground shadow-elevated hover:shadow-elevated hover:scale-[1.02] transition-all duration-300",
        ai: "gradient-accent text-accent-foreground shadow-card hover:shadow-elevated ai-enhanced",
        clinical: "bg-card text-card-foreground border border-border shadow-card hover:shadow-elevated hover:bg-card-hover",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-11 rounded-lg px-8",
        xl: "h-12 rounded-lg px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ClinicalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof clinicalButtonVariants> {
  asChild?: boolean
}

const ClinicalButton = React.forwardRef<HTMLButtonElement, ClinicalButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(clinicalButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
ClinicalButton.displayName = "ClinicalButton"

export { ClinicalButton, clinicalButtonVariants }