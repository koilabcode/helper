import { LoginForm } from "@/app/login/loginForm";
import { OnboardingForm } from "@/app/login/onboardingForm";
import { PublicLayout } from "@/components/laborario/public-layout";
import { db } from "@/db/client";
import { TRPCReactProvider } from "@/trpc/react";

export const dynamic = "force-dynamic";

export default async function Page() {
  const mailbox = await db.query.mailboxes.findFirst({
    columns: { id: true },
  });

  return (
    <TRPCReactProvider>
      <PublicLayout headerVariant="minimal" footerVariant="minimal">
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-sm">{mailbox ? <LoginForm /> : <OnboardingForm />}</div>
        </div>
      </PublicLayout>
    </TRPCReactProvider>
  );
}
