import React from 'react'
import Link from 'next/link'
import { Package2, Settings } from 'lucide-react'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import {dashboardLinks} from '@/lib/constants'
import { useParams } from 'next/navigation'


const DashSidebar = () => {
  const { id } = useParams()
    const navlinks = dashboardLinks(id)
  return (
    <aside className="inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
          <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
            <TooltipProvider>
              <Link
                href="#"
                className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                prefetch={false}
              >
                <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
                <span className="sr-only">Acme Inc</span>
              </Link>
              { navlinks.map((data, idx) => (
                <Tooltip key={idx}>
                  <TooltipTrigger asChild>
                    <Link
                      href={data.href}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                      prefetch={false}
                    >
                      <data.icon className="h-5 w-5" />
                      <span className="sr-only">{data.title}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{data.title}</TooltipContent>
                </Tooltip>    
              )) }
            </TooltipProvider>
          </nav>
          <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                    prefetch={false}
                  >
                    <Settings className="h-5 w-5" />
                    <span className="sr-only">Settings</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Settings</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </nav>
        </aside>
  )
}

export default DashSidebar