import { redirect } from "next/navigation";
import { HelperClientProvider } from "@helperai/react";
import { getBaseUrl } from "@/components/constants";
import { PublicLayout } from "@/components/laborario/public-layout";
import { LaborarioProvider } from "@/components/laborario/provider";
import { getMailbox } from "@/lib/data/mailbox";
import { TRPCReactProvider } from "@/trpc/react";
import { HomepageContent } from "./homepageContent";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ embed?: string }>;
}) {
  const mailbox = await getMailbox();

  if (!mailbox) redirect("/login");

  const params = await searchParams;
  const isEmbed = params.embed === "1";

  const content = <HomepageContent mailboxName={mailbox.name} />;

  return (
    <TRPCReactProvider>
      <HelperClientProvider host={getBaseUrl()} session={{}}>
        {isEmbed ? (
          <LaborarioProvider>
            <div className="min-h-screen bg-[#181824]">{content}</div>
          </LaborarioProvider>
        ) : (
          <PublicLayout>{content}</PublicLayout>
        )}
      </HelperClientProvider>
    </TRPCReactProvider>
  );
}
