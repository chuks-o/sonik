import { OrganizationList } from '@clerk/nextjs'
import React from 'react'

export default function OrgSelectionPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <OrganizationList
        hidePersonal
        afterCreateOrganizationUrl="/dashboard"
        afterSelectOrganizationUrl="/dashboard"
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg"
          },
        }}
      />
    </div>
  )
}
