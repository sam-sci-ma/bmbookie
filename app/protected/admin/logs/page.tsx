import { getAuditLogs } from "@/lib/actions/audit";
import AuditLogView from "@/components/admin/logs/AuditLogView";

export default async function AuditPage() {
  const logs = await getAuditLogs();

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-foreground tracking-tight">
          System <span className="text-[#D7492A]">Audit Logs</span>
        </h1>
        <p className="text-muted-foreground font-medium text-sm">
          A transparent record of all institutional modifications and system events.
        </p>
      </div>

      <AuditLogView initialLogs={logs} />
    </div>
  );
}